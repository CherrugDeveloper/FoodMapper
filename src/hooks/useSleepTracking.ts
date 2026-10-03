import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// Types
// ============================================

export type SleepPhase = 'awake' | 'light' | 'deep' | 'rem';

export interface SleepSession {
  id: string;
  startTime: number; // timestamp
  endTime: number | null; // timestamp
  duration: number; // minutes
  sleepLatency: number; // minutes to fall asleep
  efficiency: number; // percentage
  phases: SleepPhaseData[];
  quality: number; // 0-100
  notes?: string;
}

export interface SleepPhaseData {
  phase: SleepPhase;
  startTime: number; // relative to session start in minutes
  duration: number; // minutes
}

export interface SleepAlarm {
  id: string;
  time: string; // HH:MM format
  enabled: boolean;
  label: string;
  sound: AlarmSound;
  smartWake: boolean; // wake during light sleep window
  smartWakeWindow: number; // minutes before target (default 30)
  snoozeCount: number;
  maxSnoozes: number;
  days: number[]; // 0-6 (Sun-Sat), empty = daily
  vibration: boolean;
  createdAt: number;
}

export type AlarmSound = 'gentle' | 'nature' | 'chime' | 'vibration' | 'custom';

export interface SleepStats {
  totalSessions: number;
  avgDuration: number; // minutes
  avgEfficiency: number; // percentage
  avgQuality: number; // 0-100
  totalSleepDebt: number; // minutes
  weeklyTrend: DailySleepData[];
  monthlyTrend: DailySleepData[];
}

export interface DailySleepData {
  date: string; // YYYY-MM-DD
  duration: number;
  efficiency: number;
  quality: number;
  phases: Record<SleepPhase, number>; // minutes per phase
  bedTime: string; // HH:MM
  wakeTime: string; // HH:MM
}

export interface SleepSettings {
  targetDuration: number; // minutes (default 480 = 8h)
  bedtimeReminder: boolean;
  bedtimeReminderTime: string; // HH:MM
  windDownDuration: number; // minutes
  autoStartTracking: boolean;
  wakeLockEnabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
}

export interface MotionData {
  x: number;
  y: number;
  z: number;
  magnitude: number;
  timestamp: number;
}

export interface OrientationData {
  alpha: number; // z-axis rotation
  beta: number;  // x-axis rotation
  gamma: number; // y-axis rotation
  timestamp: number;
}

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'foodmapper_sleep_sessions';
const ALARMS_KEY = 'foodmapper_sleep_alarms';
const SETTINGS_KEY = 'foodmapper_sleep_settings';
const PHASE_ANALYSIS_INTERVAL = 30 * 1000; // Analyze a 30-second actigraphy window
const CYCLE_DURATION = 90 * 60 * 1000; // 90 minutes per sleep cycle

const DEFAULT_SETTINGS: SleepSettings = {
  targetDuration: 480,
  bedtimeReminder: true,
  bedtimeReminderTime: '22:00',
  windDownDuration: 30,
  autoStartTracking: false,
  wakeLockEnabled: true,
  sensitivity: 'medium',
};

const SENSITIVITY_THRESHOLDS = {
  low: { awake: 0.5, light: 0.3, deep: 0.1 },
  medium: { awake: 0.3, light: 0.15, deep: 0.05 },
  high: { awake: 0.15, light: 0.08, deep: 0.02 },
};

// ============================================
// Helper Functions
// ============================================

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatTime = (date: Date) => date.toTimeString().slice(0, 5);

const getTodayKey = () => new Date().toISOString().split('T')[0];

const calculateVariance = (values: number[]): number => {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
};

const calculateMagnitude = (x: number, y: number, z: number): number => {
  return Math.sqrt(x * x + y * y + z * z);
};

// ============================================
// Main Hook
// ============================================

export function useSleepTracking() {
  // State
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<SleepSession | null>(null);
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [alarms, setAlarms] = useState<SleepAlarm[]>([]);
  const [settings, setSettings] = useState<SleepSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<SleepStats>({
    totalSessions: 0,
    avgDuration: 0,
    avgEfficiency: 0,
    avgQuality: 0,
    totalSleepDebt: 0,
    weeklyTrend: [],
    monthlyTrend: [],
  });
  // Hooks must be called unconditionally and in the same order
  const isTrackingRef = useRef(false);
  const currentSessionRef = useRef<SleepSession | null>(null);
  const alarmsRef = useRef<SleepAlarm[]>([]);
  const motionBufferRef = useRef<MotionData[]>([]);
  const orientationBufferRef = useRef<OrientationData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<{
      motion: PermissionState;
      orientation: PermissionState;
      notification: NotificationPermission;
      wakeLock: boolean;
    }>({
      motion: 'prompt',
      orientation: 'prompt',
      notification: typeof Notification !== 'undefined' ? Notification.permission : 'default',
      wakeLock: false,
    });

  // Refs keep sensor callbacks current after React state updates.
  const isTrackingRef = useRef(false);
  const currentSessionRef = useRef<SleepSession | null>(null);
  const alarmsRef = useRef<SleepAlarm[]>([]);
  const motionBufferRef = useRef<MotionData[]>([]);
  const orientationBufferRef = useRef<OrientationData[]>([]);
  const samplingIntervalRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const sessionStartRef = useRef<number>(0);
  const lastPhaseRef = useRef<SleepPhase>('awake');
  const phaseStartRef = useRef<number>(0);
  const alarmCheckIntervalRef = useRef<number | null>(null);
  const triggeredAlarmKeysRef = useRef<Set<string>>(new Set());
  const playAlarmSoundRef = useRef<(sound: AlarmSound) => Promise<void>>(async () => undefined);
  const audioContextRef = useRef<AudioContext | null>(null);

  isTrackingRef.current = isTracking;
  currentSessionRef.current = currentSession;
  alarmsRef.current = alarms;

  // ============================================
  // Permission Handling
  // ============================================

  const requestPermissions = useCallback(async () => {
    try {
      // Request DeviceMotion permission (iOS 13+)
      if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
        const permission = await (DeviceMotionEvent as { requestPermission: () => Promise<PermissionState> }).requestPermission();
        setPermissionStatus(prev => ({ ...prev, motion: permission }));
      } else {
        setPermissionStatus(prev => ({ ...prev, motion: 'granted' }));
      }

      // Request DeviceOrientation permission (iOS 13+)
      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        const permission = await (DeviceOrientationEvent as { requestPermission: () => Promise<PermissionState> }).requestPermission();
        setPermissionStatus(prev => ({ ...prev, orientation: permission }));
      } else {
        setPermissionStatus(prev => ({ ...prev, orientation: 'granted' }));
      }

      // Request Notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setPermissionStatus(prev => ({ ...prev, notification: permission }));
      }

      // Check Wake Lock support
      if ('wakeLock' in navigator) {
        setPermissionStatus(prev => ({ ...prev, wakeLock: true }));
      }

      return true;
    } catch {
      setError('Failed to request permissions');
      return false;
    }
  }, []);

  // ============================================
  // Wake Lock Management
  // ============================================

  const acquireWakeLock = useCallback(async () => {
    if (!settings.wakeLockEnabled || !('wakeLock' in navigator)) return;
    
    try {
      const sentinel = await (navigator as { wakeLock: { request: (type: 'screen') => Promise<WakeLockSentinel> } }).wakeLock.request('screen');
      wakeLockRef.current = sentinel;
      sentinel.addEventListener('release', () => {
        if (wakeLockRef.current === sentinel) wakeLockRef.current = null;
      });
    } catch {
        // ignore
      }
  }, [settings.wakeLockEnabled]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        console.warn('Wake Lock release failed:', err);
      }
    }
  }, []);

  // ============================================
  // Motion & Orientation Event Handlers
  // ============================================

  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    if (!isTrackingRef.current) return;

    // Prefer linear acceleration; when unavailable remove the gravity baseline
    // from accelerationIncludingGravity so a still phone is not classified awake.
    const linearAcceleration = event.acceleration;
    const acceleration = linearAcceleration || event.accelerationIncludingGravity;
    if (!acceleration) return;

    const rawMagnitude = calculateMagnitude(
      acceleration.x || 0,
      acceleration.y || 0,
      acceleration.z || 0
    );
    const magnitude = linearAcceleration ? rawMagnitude : Math.abs(rawMagnitude - 9.80665);

    motionBufferRef.current.push({
      x: acceleration.x || 0,
      y: acceleration.y || 0,
      z: acceleration.z || 0,
      magnitude,
      timestamp: Date.now(),
    });

    // Keep buffer size manageable (last 10 minutes at 50ms intervals = 12000 samples)
    if (motionBufferRef.current.length > 12000) {
      motionBufferRef.current = motionBufferRef.current.slice(-6000);
    }
  }, [isTracking]);

  const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (!isTrackingRef.current) return;

    orientationBufferRef.current.push({
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0,
      timestamp: Date.now(),
    });

    if (orientationBufferRef.current.length > 12000) {
      orientationBufferRef.current = orientationBufferRef.current.slice(-6000);
    }
  }, [isTracking]);

  // ============================================
  // Sleep Phase Detection Algorithm
  // ============================================

  const detectSleepPhase = useCallback((): SleepPhase => {
    const buffer = motionBufferRef.current;
    if (buffer.length < 10) return 'awake';

    // Get recent data (last 30 seconds)
    const now = Date.now();
    const recentData = buffer.filter(d => now - d.timestamp < 30000);
    if (recentData.length < 5) return 'awake';

    // Calculate variance of acceleration magnitude
    const magnitudes = recentData.map(d => d.magnitude);
    const variance = calculateVariance(magnitudes);
    const meanMagnitude = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;

    // Get sensitivity thresholds
    const thresholds = SENSITIVITY_THRESHOLDS[settings.sensitivity];

    // Determine phase based on movement
    // High variance + high magnitude = awake
    // Low variance + low magnitude = deep sleep
    // Medium variance = light sleep
    // REM: periodic movement patterns (simplified: low variance but occasional spikes)
    
    let phase: SleepPhase;
    
    if (variance > thresholds.awake || meanMagnitude > 1.5) {
      phase = 'awake';
    } else if (variance < thresholds.deep && meanMagnitude < 0.5) {
      phase = 'deep';
    } else if (variance < thresholds.light) {
      // Check for REM pattern: periodic movements every ~90 min
      const sessionDuration = now - sessionStartRef.current;
      const cyclePosition = sessionDuration % CYCLE_DURATION;
      // REM typically occurs in later cycles, last 20-30 min of each cycle
      if (cyclePosition > CYCLE_DURATION * 0.7) {
        phase = 'rem';
      } else {
        phase = 'light';
      }
    } else {
      phase = 'light';
    }

    return phase;
  }, [settings.sensitivity]);

  // ============================================
  // Phase Analysis Loop
  // ============================================

  const analyzePhase = useCallback(() => {
    if (!isTrackingRef.current || !currentSessionRef.current) return;

    const newPhase = detectSleepPhase();
    const now = Date.now();
    const sessionElapsed = (now - sessionStartRef.current) / 60000; // minutes

    if (newPhase !== lastPhaseRef.current) {
      // Phase changed - record previous phase
      const previousPhaseDuration = sessionElapsed - phaseStartRef.current;
      
      setCurrentSession(prev => {
        if (!prev) return prev;
        
        const newPhases = [...prev.phases];
        if (newPhases.length > 0) {
          // Update last phase duration
          newPhases[newPhases.length - 1] = {
            ...newPhases[newPhases.length - 1],
            duration: previousPhaseDuration,
          };
        }
        
        // Add new phase
        newPhases.push({
          phase: newPhase,
          startTime: sessionElapsed,
          duration: 0,
        });

        return {
          ...prev,
          phases: newPhases,
        };
      });

      lastPhaseRef.current = newPhase;
      phaseStartRef.current = sessionElapsed;
    }
  }, [isTracking, currentSession, detectSleepPhase]);

  // ============================================
  // Session Management
  // ============================================

  const startTracking = useCallback(async () => {
    if (isTracking) return;

    try {
      // Request permissions if not granted
      if (
        permissionStatus.motion === 'prompt' ||
        permissionStatus.orientation === 'prompt' ||
        permissionStatus.notification === 'default'
      ) {
        await requestPermissions();
      }

      // Acquire wake lock
      await acquireWakeLock();

      // Initialize session
      const startTime = Date.now();
      sessionStartRef.current = startTime;
      lastPhaseRef.current = 'awake';
      phaseStartRef.current = 0;
      motionBufferRef.current = [];
      orientationBufferRef.current = [];
      triggeredAlarmKeysRef.current.clear();

      const newSession: SleepSession = {
        id: generateId(),
        startTime,
        endTime: null,
        duration: 0,
        sleepLatency: 0,
        efficiency: 0,
        phases: [{
          phase: 'awake',
          startTime: 0,
          duration: 0,
        }],
        quality: 0,
      };

      isTrackingRef.current = true;
      currentSessionRef.current = newSession;
      setCurrentSession(newSession);
      setIsTracking(true);
      setError(null);

      // Add event listeners
      window.addEventListener('devicemotion', handleDeviceMotion);
      window.addEventListener('deviceorientation', handleDeviceOrientation);

      // Start phase analysis interval
      samplingIntervalRef.current = window.setInterval(analyzePhase, PHASE_ANALYSIS_INTERVAL);

      // Start alarm checking
      startAlarmCheck();

    } catch (err) {
      setError('Failed to start sleep tracking');
      console.error(err);
    }
  }, [isTracking, permissionStatus, requestPermissions, acquireWakeLock, handleDeviceMotion, handleDeviceOrientation, analyzePhase]);

  const stopTracking = useCallback(async () => {
    if (!isTracking || !currentSession) return;

    try {
      const endTime = Date.now();
      const totalDuration = (endTime - currentSession.startTime) / 60000; // minutes
      
      // Finalize last phase
      const finalPhaseDuration = totalDuration - phaseStartRef.current;
      
      // Calculate sleep latency (time to first non-awake phase)
      let sleepLatency = 0;
      const firstSleepPhase = currentSession.phases.find(p => p.phase !== 'awake');
      if (firstSleepPhase) {
        sleepLatency = firstSleepPhase.startTime;
      }

      // Calculate phase totals
      const phaseTotals: Record<SleepPhase, number> = {
        awake: 0,
        light: 0,
        deep: 0,
        rem: 0,
      };

      const finalizedPhases = currentSession.phases.map((phase, idx) => {
        let duration = phase.duration;
        if (idx === currentSession.phases.length - 1) {
          duration = finalPhaseDuration;
        }
        phaseTotals[phase.phase] += duration;
        return { ...phase, duration };
      });

      // Calculate efficiency
      const sleepTime = phaseTotals.light + phaseTotals.deep + phaseTotals.rem;
      const efficiency = totalDuration > 0 ? Math.round((sleepTime / totalDuration) * 100) : 0;

      // Calculate quality score (0-100)
      const targetDuration = settings.targetDuration;
      const durationScore = Math.min(100, (totalDuration / targetDuration) * 100);
      const efficiencyScore = efficiency;
      const deepSleepRatio = totalDuration > 0 ? (phaseTotals.deep / totalDuration) * 100 : 0;
      const remSleepRatio = totalDuration > 0 ? (phaseTotals.rem / totalDuration) * 100 : 0;
      const phaseScore = Math.min(100, (deepSleepRatio * 2) + (remSleepRatio * 1.5) + 20);
      
      const quality = Math.round((durationScore * 0.4) + (efficiencyScore * 0.3) + (phaseScore * 0.3));

      const completedSession: SleepSession = {
        ...currentSession,
        endTime,
        duration: Math.round(totalDuration),
        sleepLatency: Math.round(sleepLatency),
        efficiency,
        phases: finalizedPhases,
        quality,
      };

      // Save session
      setSessions(prev => {
        const updated = [...prev, completedSession];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      // Update stats
      updateStats();

      // Cleanup
      currentSessionRef.current = null;
      isTrackingRef.current = false;
      setCurrentSession(null);
      setIsTracking(false);
      
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      
      if (samplingIntervalRef.current) {
        clearInterval(samplingIntervalRef.current);
        samplingIntervalRef.current = null;
      }

      stopAlarmCheck();
      await releaseWakeLock();

    } catch (err) {
      setError('Failed to stop sleep tracking');
      console.error(err);
    }
  }, [isTracking, currentSession, settings.targetDuration, handleDeviceMotion, releaseWakeLock]);

  // ============================================
  // Alarm System
  // ============================================

  const startAlarmCheck = useCallback(() => {
    if (alarmCheckIntervalRef.current) clearInterval(alarmCheckIntervalRef.current);
    alarmCheckIntervalRef.current = window.setInterval(() => {
      checkAlarmsRef.current();
    }, 10000); // Check every 10 seconds
  }, []);

  const stopAlarmCheck = useCallback(() => {
    if (alarmCheckIntervalRef.current) {
      clearInterval(alarmCheckIntervalRef.current);
      alarmCheckIntervalRef.current = null;
    }
  }, []);

  const checkAlarmsRef = useRef<() => void>(() => undefined);

  const checkAlarms = useCallback(() => {
    const now = new Date();
    const currentTime = formatTime(now);
    const currentDay = now.getDay();
    const minuteKey = `${now.toISOString().slice(0, 10)}-${currentTime}`;

    alarmsRef.current.forEach(alarm => {
      if (!alarm.enabled) return;
      if (alarm.days.length > 0 && !alarm.days.includes(currentDay)) return;
      if (alarm.time !== currentTime) return;
      const alarmKey = `${alarm.id}-${minuteKey}`;
      if (triggeredAlarmKeysRef.current.has(alarmKey)) return;
      triggeredAlarmKeysRef.current.add(alarmKey);
      triggerAlarmRef.current(alarm);
    });
  }, []);

  checkAlarmsRef.current = checkAlarms;

  const triggerAlarmRef = useRef<(alarm: SleepAlarm) => void>(() => undefined);

  const triggerAlarm = useCallback(async (alarm: SleepAlarm) => {
    // Play sound
    await playAlarmSoundRef.current(alarm.sound);
    
    // Vibrate if enabled
    if (alarm.vibration && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Show notification
    if (permissionStatus.notification === 'granted') {
      new Notification('Sveglia Sonno', {
        body: alarm.label || 'È ora di svegliarsi!',
        icon: '/icon-192.svg',
        tag: `sleep-alarm-${alarm.id}`,
        requireInteraction: true,
      });
    }

    // Handle smart wake - if in light sleep, don't snooze
    if (alarm.smartWake && currentSessionRef.current) {
      const currentPhase = lastPhaseRef.current;
      if (currentPhase === 'light') {
        // Good time to wake up, don't allow snooze
        return;
      }
    }

    // Allow snooze
    if (alarm.snoozeCount < alarm.maxSnoozes) {
      setAlarms(prev => prev.map(a =>
        a.id === alarm.id
          ? { ...a, snoozeCount: a.snoozeCount + 1 }
          : a
      ));
      
      // Reschedule for 5 minutes later
      setTimeout(() => {
        triggerAlarmRef.current({ ...alarm, snoozeCount: alarm.snoozeCount + 1 });
      }, 5 * 60 * 1000);
    }
  }, [permissionStatus.notification]);

  triggerAlarmRef.current = triggerAlarm;

  const playAlarmSound = useCallback(async (sound: AlarmSound) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      )();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (sound) {
      case 'gentle':
        oscillator.frequency.setValueAtTime(220, ctx.currentTime); // A3
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);
        break;
      case 'nature':
        // Simulate nature sound with filtered noise
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4);
        break;
      case 'chime':
        oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
        break;
      case 'vibration':
        // Handled separately
        return;
      default:
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);
    }

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 5);
  }, []);

  playAlarmSoundRef.current = playAlarmSound;

  // ============================================
  // Alarm Management
  // ============================================

  const addAlarm = useCallback((alarm: Omit<SleepAlarm, 'id' | 'createdAt' | 'snoozeCount'>) => {
    const newAlarm: SleepAlarm = {
      ...alarm,
      id: generateId(),
      createdAt: Date.now(),
      snoozeCount: 0,
    };
    
    setAlarms(prev => {
      const updated = [...prev, newAlarm];
      localStorage.setItem(ALARMS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateAlarm = useCallback((id: string, updates: Partial<SleepAlarm>) => {
    setAlarms(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...updates } : a);
      localStorage.setItem(ALARMS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem(ALARMS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const dismissAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, snoozeCount: 0 } : a
    ));
  }, []);

  // ============================================
  // Settings Management
  // ============================================

  const updateSettings = useCallback((newSettings: Partial<SleepSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ============================================
  // Statistics Calculation
  // ============================================

  const updateStats = useCallback(() => {
    const now = new Date();
    // Last 7 days
    const weeklyData: DailySleepData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
        return sessionDate === key;
      });
      
      if (daySessions.length > 0) {
        const latest = daySessions[daySessions.length - 1];
        const phaseTotals: Record<SleepPhase, number> = {
          awake: 0, light: 0, deep: 0, rem: 0,
        };
        latest.phases.forEach(p => {
          phaseTotals[p.phase] += p.duration;
        });
        
        weeklyData.push({
          date: key,
          duration: latest.duration,
          efficiency: latest.efficiency,
          quality: latest.quality,
          phases: phaseTotals,
          bedTime: formatTime(new Date(latest.startTime)),
          wakeTime: latest.endTime ? formatTime(new Date(latest.endTime)) : '--:--',
        });
      } else {
        weeklyData.push({
          date: key,
          duration: 0,
          efficiency: 0,
          quality: 0,
          phases: { awake: 0, light: 0, deep: 0, rem: 0 },
          bedTime: '--:--',
          wakeTime: '--:--',
        });
      }
    }

    // Last 30 days
    const monthlyData: DailySleepData[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
        return sessionDate === key;
      });
      
      if (daySessions.length > 0) {
        const latest = daySessions[daySessions.length - 1];
        const phaseTotals: Record<SleepPhase, number> = {
          awake: 0, light: 0, deep: 0, rem: 0,
        };
        latest.phases.forEach(p => {
          phaseTotals[p.phase] += p.duration;
        });
        
        monthlyData.push({
          date: key,
          duration: latest.duration,
          efficiency: latest.efficiency,
          quality: latest.quality,
          phases: phaseTotals,
          bedTime: formatTime(new Date(latest.startTime)),
          wakeTime: latest.endTime ? formatTime(new Date(latest.endTime)) : '--:--',
        });
      } else {
        monthlyData.push({
          date: key,
          duration: 0,
          efficiency: 0,
          quality: 0,
          phases: { awake: 0, light: 0, deep: 0, rem: 0 },
          bedTime: '--:--',
          wakeTime: '--:--',
        });
      }
    }

    const completedSessions = sessions.filter(s => s.endTime !== null);
    const totalSessions = completedSessions.length;
    const avgDuration = totalSessions > 0 
      ? Math.round(completedSessions.reduce((a, b) => a + b.duration, 0) / totalSessions)
      : 0;
    const avgEfficiency = totalSessions > 0
      ? Math.round(completedSessions.reduce((a, b) => a + b.efficiency, 0) / totalSessions)
      : 0;
    const avgQuality = totalSessions > 0
      ? Math.round(completedSessions.reduce((a, b) => a + b.quality, 0) / totalSessions)
      : 0;

    // Sleep debt: target - actual for last 7 days
    const last7Days = completedSessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      const diffDays = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    });
    const totalSleepDebt = last7Days.reduce((debt, s) => 
      debt + Math.max(0, settings.targetDuration - s.duration), 0);

    setStats({
      totalSessions,
      avgDuration,
      avgEfficiency,
      avgQuality,
      totalSleepDebt: Math.round(totalSleepDebt),
      weeklyTrend: weeklyData,
      monthlyTrend: monthlyData,
    });
  }, [sessions, settings.targetDuration]);

  // ============================================
  // Data Export
  // ============================================

  const exportData = useCallback((format: 'json' | 'csv' = 'json') => {
    const data = {
      sessions,
      alarms,
      settings,
      stats,
      exportedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sleep-data-${getTodayKey()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV export - sessions only
      const headers = ['ID', 'Data Inizio', 'Data Fine', 'Durata (min)', 'Latenza (min)', 'Efficienza (%)', 'Qualità', 'Fasi'];
      const rows = sessions.map(s => [
        s.id,
        new Date(s.startTime).toISOString(),
        s.endTime ? new Date(s.endTime).toISOString() : '',
        s.duration,
        s.sleepLatency,
        s.efficiency,
        s.quality,
        s.phases.map(p => `${p.phase}:${p.duration}min`).join(';'),
      ]);
      
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sleep-data-${getTodayKey()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [sessions, alarms, settings, stats]);

  const deleteAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ALARMS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    setSessions([]);
    setAlarms([]);
    setSettings(DEFAULT_SETTINGS);
    setStats({
      totalSessions: 0,
      avgDuration: 0,
      avgEfficiency: 0,
      avgQuality: 0,
      totalSleepDebt: 0,
      weeklyTrend: [],
      monthlyTrend: [],
    });
  }, []);

  // ============================================
  // Load Persisted Data
  // ============================================

  useEffect(() => {
    // Load sessions
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
      }
    } catch (err) {
      console.error('Failed to load sleep sessions:', err);
    }

    // Load alarms
    try {
      const stored = localStorage.getItem(ALARMS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAlarms(parsed);
      }
    } catch (err) {
      console.error('Failed to load alarms:', err);
    }

    // Load settings
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }

    // Update stats after loading
    setTimeout(updateStats, 0);
  }, [updateStats]);

  // Update stats when sessions change
  useEffect(() => {
    updateStats();
  }, [sessions, updateStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (samplingIntervalRef.current) {
        clearInterval(samplingIntervalRef.current);
      }
      stopAlarmCheck();
      releaseWakeLock();
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAlarmCheck, releaseWakeLock, handleDeviceMotion]);

  // ============================================
  // Return API
  // ============================================

  return {
    // State
    isTracking,
    currentSession,
    sessions,
    alarms,
    settings,
    stats,
    permissionStatus,
    error,
    
    // Actions
    requestPermissions,
    startTracking,
    stopTracking,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    dismissAlarm,
    updateSettings,
    exportData,
    deleteAllData,
    
    // Computed
    currentPhase: lastPhaseRef.current,
    sessionElapsed: isTracking ? Math.round((Date.now() - sessionStartRef.current) / 60000) : 0,
  };
}

// ============================================
// Smart Alarm Calculation Helper
// ============================================

export function calculateOptimalWakeTime(
  bedTime: string,
  targetWakeTime: string,
  cycles: number = 5
): { optimalWakeTime: string; cycles: number; totalMinutes: number } {
  const [bedHours, bedMinutes] = bedTime.split(':').map(Number);
  const [targetHours, targetMinutes] = targetWakeTime.split(':').map(Number);
  
  const bedMinutesTotal = bedHours * 60 + bedMinutes;
  let targetMinutesTotal = targetHours * 60 + targetMinutes;
  if (targetMinutesTotal <= bedMinutesTotal) {
    targetMinutesTotal += 24 * 60; // Next day
  }
  
  const availableMinutes = targetMinutesTotal - bedMinutesTotal;
  const cycleMinutes = 90;
  const fallAsleepMinutes = 15;
  
  // Calculate how many full cycles fit
  const maxCycles = Math.floor((availableMinutes - fallAsleepMinutes) / cycleMinutes);
  const actualCycles = Math.min(cycles, Math.max(1, maxCycles));
  
  const optimalTotalMinutes = fallAsleepMinutes + (actualCycles * cycleMinutes);
  const optimalWakeMinutesTotal = bedMinutesTotal + optimalTotalMinutes;
  
  const optimalHours = Math.floor(optimalWakeMinutesTotal / 60) % 24;
  const optimalMins = optimalWakeMinutesTotal % 60;
  
  return {
    optimalWakeTime: `${optimalHours.toString().padStart(2, '0')}:${optimalMins.toString().padStart(2, '0')}`,
    cycles: actualCycles,
    totalMinutes: optimalTotalMinutes,
  };
}

// ============================================
// Sleep Debt Calculator
// ============================================

export function calculateSleepDebt(
  sessions: SleepSession[],
  targetDuration: number,
  days: number = 7
): number {
  const now = Date.now();
  const cutoff = now - (days * 24 * 60 * 60 * 1000);
  
  const recentSessions = sessions.filter(s => 
    s.endTime && s.startTime >= cutoff
  );
  
  return recentSessions.reduce((debt, session) => 
    debt + Math.max(0, targetDuration - session.duration), 0
  );
}