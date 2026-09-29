import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// ============================================
// TIPI PER INTEGRAZIONE FITNESS APP
// ============================================

export type FitnessProvider = 'google_fit' | 'apple_health' | 'strava' | 'garmin_connect';

export interface FitnessProviderConfig {
  id: FitnessProvider;
  name: string;
  icon: string;
  color: string;
  description: string;
  requiresBackend: boolean;
  scopes: string[];
}

export interface ConnectionStatus {
  provider: FitnessProvider;
  connected: boolean;
  lastSync?: string;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface WorkoutData {
  id: string;
  provider: FitnessProvider;
  providerWorkoutId: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  caloriesBurned?: number;
  distanceMeters?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  steps?: number;
  elevationGainMeters?: number;
  source: 'manual' | 'auto_detected' | 'imported';
  rawData?: Record<string, unknown>;
}

export interface ActivitySummary {
  date: string;
  totalCaloriesBurned: number;
  totalActiveMinutes: number;
  totalSteps: number;
  totalDistanceMeters: number;
  workouts: WorkoutData[];
  providers: FitnessProvider[];
}

export interface SleepData {
  date: string;
  provider: FitnessProvider;
  totalSleepMinutes: number;
  deepSleepMinutes: number;
  lightSleepMinutes: number;
  remSleepMinutes: number;
  awakeMinutes: number;
  sleepScore?: number;
  bedtime: string;
  wakeTime: string;
  rawData?: Record<string, unknown>;
}

export interface HeartRateData {
  timestamp: string;
  bpm: number;
  provider: FitnessProvider;
}

export interface FitnessUserProfile {
  provider: FitnessProvider;
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  heightCm?: number;
  weightKg?: number;
  restingHeartRate?: number;
  maxHeartRate?: number;
}

// ============================================
// CONFIGURAZIONE PROVIDER
// ============================================

export const FITNESS_PROVIDERS: Record<FitnessProvider, FitnessProviderConfig> = {
  google_fit: {
    id: 'google_fit',
    name: 'Google Fit',
    icon: 'google_fit',
    color: '#4285F4',
    description: 'Sincronizza attività, passi, frequenza cardiaca e sonno da Google Fit',
    requiresBackend: true,
    scopes: [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/fitness.heart_rate.read',
      'https://www.googleapis.com/auth/fitness.sleep.read',
      'https://www.googleapis.com/auth/fitness.location.read',
    ],
  },
  apple_health: {
    id: 'apple_health',
    name: 'Apple Health',
    icon: 'apple_health',
    color: '#FF2D55',
    description: 'Importa dati da Salute su iOS (richiede app nativa o HealthKit)',
    requiresBackend: true,
    scopes: [
      'workout',
      'step_count',
      'heart_rate',
      'sleep_analysis',
      'body_mass',
      'height',
      'active_energy',
    ],
  },
  strava: {
    id: 'strava',
    name: 'Strava',
    icon: 'strava',
    color: '#FC4C02',
    description: 'Connetti account Strava per attività corsa, bici, nuoto e altro',
    requiresBackend: true,
    scopes: ['read', 'activity:read', 'profile:read'],
  },
  garmin_connect: {
    id: 'garmin_connect',
    name: 'Garmin Connect',
    icon: 'garmin',
    color: '#007CC3',
    description: 'Sincronizza da dispositivi Garmin (richiede API partner)',
    requiresBackend: true,
    scopes: ['daily', 'activities', 'sleep', 'heart_rate', 'user_profile'],
  },
};

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_PREFIX = 'foodmapper_fitness_';
const CONNECTIONS_KEY = `${STORAGE_PREFIX}connections`;
const CACHED_WORKOUTS_KEY = `${STORAGE_PREFIX}workouts`;
const CACHED_SLEEP_KEY = `${STORAGE_PREFIX}sleep`;
const USER_PREFERENCES_KEY = `${STORAGE_PREFIX}preferences`;

interface FitnessPreferences {
  autoSync: boolean;
  syncFrequency: 'manual' | 'hourly' | 'daily' | 'weekly';
  preferredProvider?: FitnessProvider;
  syncWorkouts: boolean;
  syncSleep: boolean;
  syncHeartRate: boolean;
  syncSteps: boolean;
}

const DEFAULT_PREFERENCES: FitnessPreferences = {
  autoSync: false,
  syncFrequency: 'manual',
  syncWorkouts: true,
  syncSleep: true,
  syncHeartRate: true,
  syncSteps: true,
};

// ============================================
// HOOK PRINCIPALE
// ============================================

export function useFitnessIntegration() {
  const { t } = useTranslation();
  const [connections, setConnections] = useState<Record<FitnessProvider, ConnectionStatus>>(() => {
    try {
      const saved = localStorage.getItem(CONNECTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const defaults: Record<FitnessProvider, ConnectionStatus> = {
          google_fit: { provider: 'google_fit', connected: false },
          apple_health: { provider: 'apple_health', connected: false },
          strava: { provider: 'strava', connected: false },
          garmin_connect: { provider: 'garmin_connect', connected: false },
        };
        return { ...defaults, ...parsed };
      }
    } catch {
      // ignore
    }
    return {
      google_fit: { provider: 'google_fit', connected: false },
      apple_health: { provider: 'apple_health', connected: false },
      strava: { provider: 'strava', connected: false },
      garmin_connect: { provider: 'garmin_connect', connected: false },
    };
  });

  const [preferences, setPreferences] = useState<FitnessPreferences>(() => {
    try {
      const saved = localStorage.getItem(USER_PREFERENCES_KEY);
      if (saved) return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_PREFERENCES;
  });

  const [isLoading, setIsLoading] = useState<Record<FitnessProvider, boolean>>({
    google_fit: false,
    apple_health: false,
    strava: false,
    garmin_connect: false,
  });

  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
    } catch (error) {
      console.error('Failed to save fitness connections:', error);
    }
  }, [connections]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save fitness preferences:', error);
    }
  }, [preferences]);

  // ============================================
  // FUNZIONI PLACEHOLDER PER OAUTH / CONNESSIONE
  // ============================================

  const syncWorkouts = useCallback(async (
    provider: FitnessProvider,
    options?: { startDate?: string; endDate?: string }
  ): Promise<WorkoutData[]> => {
    const connection = connections[provider];
    if (!connection.connected) {
      throw new Error(t('fitness_not_connected', { defaultValue: 'Provider non connesso' }));
    }

    setIsLoading(prev => ({ ...prev, [provider]: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockWorkouts = generateMockWorkouts(provider, options?.startDate, options?.endDate);
      cacheWorkouts(mockWorkouts);

      setConnections(prev => ({
        ...prev,
        [provider]: { ...prev[provider], lastSync: new Date().toISOString() },
      }));

      return mockWorkouts;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('fitness_sync_error', { defaultValue: 'Errore durante la sincronizzazione' });
      setLastError(errorMessage);
      setConnections(prev => ({
        ...prev,
        [provider]: { ...prev[provider], error: errorMessage },
      }));
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  }, [connections, t]);

  const connect = useCallback(async (provider: FitnessProvider): Promise<boolean> => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    setLastError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setConnections(prev => ({
        ...prev,
        [provider]: {
          provider,
          connected: true,
          lastSync: new Date().toISOString(),
          accessToken: `mock_token_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
          expiresAt: Date.now() + 3600 * 1000,
        },
      }));

      await syncWorkouts(provider);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('fitness_connection_error', { defaultValue: 'Errore durante la connessione' });
      setLastError(errorMessage);
      setConnections(prev => ({
        ...prev,
        [provider]: { ...prev[provider], connected: false, error: errorMessage },
      }));
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  }, [t, syncWorkouts]);

  const disconnect = useCallback(async (provider: FitnessProvider): Promise<void> => {
    setConnections(prev => ({
      ...prev,
      [provider]: { provider, connected: false },
    }));
  }, []);

  const getActivityData = useCallback(async (
    provider: FitnessProvider,
    startDate: string,
    endDate: string
  ): Promise<ActivitySummary[]> => {
    const connection = connections[provider];
    if (!connection.connected) {
      throw new Error(t('fitness_not_connected', { defaultValue: 'Provider non connesso' }));
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateMockActivitySummary(provider, startDate, endDate);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('fitness_sync_error', { defaultValue: 'Errore durante il recupero dati' });
      setLastError(errorMessage);
      throw error;
    }
  }, [connections, t]);

  const getSleepData = useCallback(async (
    provider: FitnessProvider,
    startDate: string,
    endDate: string
  ): Promise<SleepData[]> => {
    const connection = connections[provider];
    if (!connection.connected) {
      throw new Error(t('fitness_not_connected', { defaultValue: 'Provider non connesso' }));
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateMockSleepData(provider, startDate, endDate);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('fitness_sync_error', { defaultValue: 'Errore durante il recupero dati sonno' });
      setLastError(errorMessage);
      throw error;
    }
  }, [connections, t]);

  const getUserProfile = useCallback(async (provider: FitnessProvider): Promise<FitnessUserProfile | null> => {
    const connection = connections[provider];
    if (!connection.connected) return null;

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        provider,
        userId: `user_${provider}_${Date.now()}`,
        displayName: 'Utente Demo',
        age: 30,
        gender: 'male',
        heightCm: 175,
        weightKg: 70,
        restingHeartRate: 60,
        maxHeartRate: 190,
      };
    } catch {
      return null;
    }
  }, [connections]);

  const syncAll = useCallback(async (): Promise<Record<FitnessProvider, WorkoutData[]>> => {
    const results: Record<FitnessProvider, WorkoutData[]> = {
      google_fit: [],
      apple_health: [],
      strava: [],
      garmin_connect: [],
    };

    const connectedProviders = Object.entries(connections)
      .filter(([, status]) => status.connected)
      .map(([provider]) => provider as FitnessProvider);

    for (const provider of connectedProviders) {
      try {
        results[provider] = await syncWorkouts(provider);
      } catch (error) {
        console.error(`Sync failed for ${provider}:`, error);
      }
    }

    return results;
  }, [connections, syncWorkouts]);

  const updatePreferences = useCallback((newPrefs: Partial<FitnessPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  }, []);

  const getCachedWorkouts = useCallback((): WorkoutData[] => {
    try {
      const saved = localStorage.getItem(CACHED_WORKOUTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  }, []);

  const getCachedSleep = useCallback((): SleepData[] => {
    try {
      const saved = localStorage.getItem(CACHED_SLEEP_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  }, []);

  const getDailyCaloriesBurned = useCallback((date: string): number => {
    const workouts = getCachedWorkouts();
    const dayWorkouts = workouts.filter(w => w.startTime.startsWith(date));
    return dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  }, [getCachedWorkouts]);

  const getWeeklyCaloriesBurned = useCallback((): number => {
    const workouts = getCachedWorkouts();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    return workouts
      .filter(w => w.startTime >= weekAgoStr)
      .reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  }, [getCachedWorkouts]);

  return {
    connections,
    preferences,
    isLoading,
    lastError,
    providers: FITNESS_PROVIDERS,
    connect,
    disconnect,
    syncWorkouts,
    syncAll,
    getActivityData,
    getSleepData,
    getUserProfile,
    updatePreferences,
    getCachedWorkouts,
    getCachedSleep,
    getDailyCaloriesBurned,
    getWeeklyCaloriesBurned,
    isConnected: (provider: FitnessProvider) => connections[provider]?.connected ?? false,
    getConnectionStatus: (provider: FitnessProvider) => connections[provider],
  };
}

// ============================================
// FUNZIONI HELPER PER MOCK DATA
// ============================================

function cacheWorkouts(workouts: WorkoutData[]): void {
  try {
    const existing = JSON.parse(localStorage.getItem(CACHED_WORKOUTS_KEY) || '[]');
    const merged = [...existing, ...workouts];
    const unique = Array.from(new Map(merged.map(w => [w.id, w])).values());
    const trimmed = unique.slice(-500);
    localStorage.setItem(CACHED_WORKOUTS_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

function generateMockWorkouts(
  provider: FitnessProvider,
  startDate?: string,
  endDate?: string
): WorkoutData[] {
  const types = ['running', 'cycling', 'swimming', 'weight_training', 'yoga', 'walking', 'hiit'];
  const count = Math.floor(Math.random() * 5) + 3;
  const workouts: WorkoutData[] = [];
  
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  
  for (let i = 0; i < count; i++) {
    const randomTime = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const duration = Math.floor(Math.random() * 60) + 20;
    const type = types[Math.floor(Math.random() * types.length)];
    
    workouts.push({
      id: `${provider}_${Date.now()}_${i}`,
      provider,
      providerWorkoutId: `${provider}_${randomTime.getTime()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Workout`,
      type,
      startTime: randomTime.toISOString(),
      endTime: new Date(randomTime.getTime() + duration * 60 * 1000).toISOString(),
      durationMinutes: duration,
      caloriesBurned: Math.floor(Math.random() * 400) + 150,
      distanceMeters: type === 'running' || type === 'cycling' ? Math.floor(Math.random() * 10000) + 2000 : undefined,
      averageHeartRate: Math.floor(Math.random() * 40) + 120,
      maxHeartRate: Math.floor(Math.random() * 30) + 150,
      steps: type === 'walking' || type === 'running' ? Math.floor(Math.random() * 8000) + 2000 : undefined,
      elevationGainMeters: Math.floor(Math.random() * 200),
      source: 'imported',
    });
  }
  
  return workouts;
}

function generateMockActivitySummary(
  provider: FitnessProvider,
  startDate: string,
  endDate: string
): ActivitySummary[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const summaries: ActivitySummary[] = [];
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const hasWorkout = Math.random() > 0.4;
    
    summaries.push({
      date: dateStr,
      totalCaloriesBurned: hasWorkout ? Math.floor(Math.random() * 500) + 200 : Math.floor(Math.random() * 100),
      totalActiveMinutes: hasWorkout ? Math.floor(Math.random() * 60) + 20 : Math.floor(Math.random() * 15),
      totalSteps: Math.floor(Math.random() * 8000) + 3000,
      totalDistanceMeters: hasWorkout ? Math.floor(Math.random() * 8000) + 1000 : Math.floor(Math.random() * 500),
      workouts: hasWorkout ? generateMockWorkouts(provider, dateStr, dateStr) : [],
      providers: [provider],
    });
  }
  
  return summaries;
}

function generateMockSleepData(
  provider: FitnessProvider,
  startDate: string,
  endDate: string
): SleepData[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sleepData: SleepData[] = [];
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const totalMinutes = Math.floor(Math.random() * 120) + 360;
    const deep = Math.floor(totalMinutes * (0.15 + Math.random() * 0.1));
    const rem = Math.floor(totalMinutes * (0.2 + Math.random() * 0.05));
    const light = totalMinutes - deep - rem - Math.floor(Math.random() * 30);
    
    sleepData.push({
      date: dateStr,
      provider,
      totalSleepMinutes: totalMinutes,
      deepSleepMinutes: deep,
      lightSleepMinutes: light,
      remSleepMinutes: rem,
      awakeMinutes: Math.floor(Math.random() * 30),
      sleepScore: Math.floor(Math.random() * 30) + 70,
      bedtime: '23:00',
      wakeTime: '07:00',
    });
  }
  
  return sleepData;
}

// ============================================
// COMPONENTE UI PER CONNESSIONE PROVIDER
// ============================================

export interface FitnessConnectionButtonProps {
  provider: FitnessProvider;
  onConnect: (provider: FitnessProvider) => Promise<void>;
  onDisconnect: (provider: FitnessProvider) => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  lastSync?: string;
  className?: string;
}

export function FitnessConnectionButton({
  provider,
  onConnect,
  onDisconnect,
  isConnected,
  isLoading,
  lastSync,
  className = '',
}: FitnessConnectionButtonProps) {
  const config = FITNESS_PROVIDERS[provider];
  const { t } = useTranslation();
  
  const handleClick = async () => {
    if (isConnected) {
      await onDisconnect(provider);
    } else {
      await onConnect(provider);
    }
  };

  const renderIcon = () => {
    switch (config.icon) {
      case 'google_fit':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.432,0-6.338-2.783-6.924-6.331h-2.916v2.301C6.531,20.083,10.386,22,14.5,22c5.523,0,10-4.477,10-10S20.023,2,14.5,2C10.757,2,7.498,4.097,5.921,7.211l2.916,2.11C9.572,6.574,11.309,5.5,13.5,5.5c2.209,0,4,1.791,4,4C17.5,10.034,16.722,10.673,15.714,11.101L15.714,10.239H12.545z"/>
          </svg>
        );
      case 'apple_health':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
            <path d="M12.09 22.75c1.79 0 3.49-.48 5.01-1.33 1.5-.85 2.77-2.02 3.79-3.5.99-1.48 1.73-3.17 2.22-5.06.49-1.89.73-3.86.73-5.92 0-2.06-.24-4.03-.73-5.92-.49-1.89-1.23-3.58-2.22-5.06-1.02-1.48-2.29-2.65-3.79-3.5-1.52-.85-3.22-1.33-5.01-1.33-1.79 0-3.49.48-5.01 1.33-1.5.85-2.77 2.02-3.79 3.5-.99 1.48-1.73 3.17-2.22 5.06-.49 1.89-.73 3.86-.73 5.92 0 2.06.24 4.03.73 5.92.49 1.89 1.23 3.58 2.22 5.06 1.02 1.48 2.29 2.65 3.79 3.5 1.52.85 3.22 1.33 5.01 1.33zm0-2.5c-1.3 0-2.52-.35-3.65-1.02-1.13-.67-2.1-1.58-2.9-2.73-.8-1.15-1.35-2.47-1.65-3.95-.3-1.48-.45-3.05-.45-4.7 0-1.65.15-3.22.45-4.7.3-1.48.85-2.8 1.65-3.95.8 1.15 1.77-2.06 2.9 2.73 1.13.67 2.35-1.02 3.65-1.02 1.3 0 2.52.35 3.65 1.02 1.13.67 2.1 1.58 2.9 2.73.8 1.15 1.35 2.47 1.65 3.95.3 1.48.45 3.05.45 4.7 0 1.65-.15 3.22-.45 4.7-.3 1.48-.85 2.8-1.65 3.95-.8 1.15-1.77 2.06-2.9 2.73-1.13.67-2.35 1.02-3.65 1.02z"/>
          </svg>
        );
      case 'strava':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
            <path d="M6.5 3.5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-11c0-1.1-.9-2-2-2H6.5zm0 1.5h11c.3 0 .5.2.5.5v11c0 .3-.2.5-.5.5H6.5c-.3 0-.5-.2-.5-.5V5.5c0-.3.2-.5.5-.5z"/>
            <path d="M17.5 10.5c0 1.1-.9 2-2 2H8.5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v3.5z"/>
          </svg>
        );
      case 'garmin':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
        isConnected
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
          : 'bg-(--code-bg) border-(--border) hover:border-(--accent) hover:bg-(--bg)'
      } ${className}`}
      aria-pressed={isConnected}
    >
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: config.color }}
        aria-hidden="true"
      >
        {renderIcon()}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-medium text-(--text-h) truncate">{config.name}</p>
        <p className="text-sm text-(--text) truncate">{config.description}</p>
        {isConnected && lastSync && (
          <p className="text-xs text-(--text) opacity-60 mt-1">
            {t('fitness_last_sync', { defaultValue: 'Ultima sincronizzazione: ' })}{new Date(lastSync).toLocaleDateString('it-IT')}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isLoading && (
          <div className="w-5 h-5 border-2 border-(--accent) border-t-transparent rounded-full animate-spin" aria-label="Caricamento..." />
        )}
        {isConnected && !isLoading && (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {!isConnected && !isLoading && (
          <svg className="w-5 h-5 text-(--text) opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      </div>
    </button>
  );
}

export default useFitnessIntegration;