import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// Types
// ============================================

export type SleepSoundType = 
  | 'whiteNoise' 
  | 'pinkNoise' 
  | 'brownNoise' 
  | 'rain' 
  | 'ocean' 
  | 'forest' 
  | 'fireplace' 
  | 'asmr';

export interface SleepSound {
  id: SleepSoundType;
  name: string;
  description: string;
  icon: string;
  category: 'noise' | 'nature' | 'ambient' | 'asmr';
  defaultVolume: number; // 0-1
}

export interface SoundMix {
  [key: string]: number; // soundId -> volume (0-1)
}

export interface SleepSoundsSettings {
  masterVolume: number; // 0-1
  autoPlay: boolean;
  timerEnabled: boolean;
  timerDuration: number; // minutes
  fadeOutDuration: number; // seconds
  mix: SoundMix;
  playlist: SleepSoundType[]; // ordered playlist
  crossfadeDuration: number; // seconds
}

export interface TimerState {
  isActive: boolean;
  remainingTime: number; // seconds
  totalTime: number; // seconds
  isFadingOut: boolean;
}

const DEFAULT_SETTINGS: SleepSoundsSettings = {
  masterVolume: 0.5,
  autoPlay: false,
  timerEnabled: false,
  timerDuration: 30,
  fadeOutDuration: 10,
  mix: {},
  playlist: [],
  crossfadeDuration: 3,
};

const SOUND_LIBRARY: SleepSound[] = [
  {
    id: 'whiteNoise',
    name: 'White Noise',
    description: 'Suono uniforme su tutte le frequenze, maschera rumori ambientali',
    icon: '📻',
    category: 'noise',
    defaultVolume: 0.3,
  },
  {
    id: 'pinkNoise',
    name: 'Pink Noise',
    description: 'Più energia nelle basse frequenze, simile a pioggia costante',
    icon: '🌧️',
    category: 'noise',
    defaultVolume: 0.35,
  },
  {
    id: 'brownNoise',
    name: 'Brown Noise',
    description: 'Ancora più profondo, simile a tuoni lontani o cascata',
    icon: '🌊',
    category: 'noise',
    defaultVolume: 0.4,
  },
  {
    id: 'rain',
    name: 'Pioggia',
    description: 'Suono naturale di pioggia leggera su foglie e tetto',
    icon: '☔',
    category: 'nature',
    defaultVolume: 0.4,
  },
  {
    id: 'ocean',
    name: 'Onde del Mare',
    description: 'Ritmico infrangersi delle onde sulla riva',
    icon: '🌊',
    category: 'nature',
    defaultVolume: 0.35,
  },
  {
    id: 'forest',
    name: 'Foresta',
    description: 'Uccelli, vento tra gli alberi, suoni naturali notturni',
    icon: '🌲',
    category: 'nature',
    defaultVolume: 0.3,
  },
  {
    id: 'fireplace',
    name: 'Camino',
    description: 'Crepitio del fuoco, calore e comfort',
    icon: '🔥',
    category: 'ambient',
    defaultVolume: 0.35,
  },
  {
    id: 'asmr',
    name: 'ASMR',
    description: 'Sussurri, tapping, suoni tattili rilassanti',
    icon: '🎧',
    category: 'asmr',
    defaultVolume: 0.25,
  },
];

const STORAGE_KEY = 'foodmapper_sleep_sounds_settings';

// ============================================
// Audio Generation Functions
// ============================================

// Generate noise buffers
function generateWhiteNoiseBuffer(audioContext: AudioContext, duration: number = 2): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * duration;
  const buffer = audioContext.createBuffer(2, length, sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return buffer;
}

function generatePinkNoiseBuffer(audioContext: AudioContext, duration: number = 2): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * duration;
  const buffer = audioContext.createBuffer(2, length, sampleRate);
  
  // Paul Kellet's pink noise algorithm
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; // Normalize
      b6 = white * 0.115926;
    }
  }
  return buffer;
}

function generateBrownNoiseBuffer(audioContext: AudioContext, duration: number = 2): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * duration;
  const buffer = audioContext.createBuffer(2, length, sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      data[i] = lastOut * 3.5; // Normalize
    }
  }
  return buffer;
}

// Create oscillators for nature sounds
function createRainSound(audioContext: AudioContext): { source: AudioBufferSourceNode; gain: GainNode } {
  // Use filtered white noise for rain
  const buffer = generateWhiteNoiseBuffer(audioContext, 5);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  
  // Low-pass filter for rain character
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  filter.Q.value = 1;
  
  const gain = audioContext.createGain();
  gain.gain.value = 0;
  
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  
  return { source, gain };
}

function createOceanSound(audioContext: AudioContext): { source: AudioBufferSourceNode; gain: GainNode } {
  // Brown noise with slow modulation for waves
  const buffer = generateBrownNoiseBuffer(audioContext, 10);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  
  // Bandpass filter for ocean character
  const filter = audioContext.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 200;
  filter.Q.value = 0.5;
  
  // LFO for wave modulation
  const lfo = audioContext.createOscillator();
  lfo.frequency.value = 0.1; // Very slow
  const lfoGain = audioContext.createGain();
  lfoGain.gain.value = 0.3;
  
  const gain = audioContext.createGain();
  gain.gain.value = 0;
  
  source.connect(filter);
  filter.connect(gain);
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  gain.connect(audioContext.destination);
  
  lfo.start();
  
  return { source, gain };
}

function createForestSound(audioContext: AudioContext): { source: AudioBufferSourceNode; gain: GainNode } {
  // Pink noise base with occasional bird chirps
  const buffer = generatePinkNoiseBuffer(audioContext, 30);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  
  // High-pass filter for forest ambience
  const filter = audioContext.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 200;
  
  const gain = audioContext.createGain();
  gain.gain.value = 0;
  
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  
  return { source, gain };
}

function createFireplaceSound(audioContext: AudioContext): { source: AudioBufferSourceNode; gain: GainNode } {
  // Brown noise with crackle
  const buffer = generateBrownNoiseBuffer(audioContext, 5);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  
  // Low-pass for fire warmth
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  filter.Q.value = 2;
  
  const gain = audioContext.createGain();
  gain.gain.value = 0;
  
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  
  return { source, gain };
}

function createASMRSound(audioContext: AudioContext): { source: AudioBufferSourceNode; gain: GainNode } {
  // Very quiet pink noise with occasional soft sounds
  const buffer = generatePinkNoiseBuffer(audioContext, 60);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  
  // Very gentle filtering
  const filter = audioContext.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1000;
  filter.Q.value = 0.3;
  
  const gain = audioContext.createGain();
  gain.gain.value = 0;
  
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  
  return { source, gain };
}

// ============================================
// Main Hook
// ============================================

export function useSleepSounds() {
  const [settings, setSettings] = useState<SleepSoundsSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>({
    isActive: false,
    remainingTime: 0,
    totalTime: 0,
    isFadingOut: false,
  });
  const [activeSounds, setActiveSounds] = useState<Set<SleepSoundType>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<Map<SleepSoundType, { source: AudioBufferSourceNode; gain: GainNode }>>(new Map());
  const masterGainRef = useRef<GainNode | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const fadeOutIntervalRef = useRef<number | null>(null);
  const playlistIndexRef = useRef(0);
  const crossfadeTimeoutRef = useRef<number | null>(null);

  // Initialize AudioContext
  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = settings.masterVolume;
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    return audioContextRef.current;
  }, [settings.masterVolume]);

  // Create sound node for a specific sound type
  const createSoundNode = useCallback((soundId: SleepSoundType) => {
    const ctx = audioContextRef.current;
    if (!ctx) return null;
    
    let node: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
    
    switch (soundId) {
      case 'whiteNoise': {
        const buffer = generateWhiteNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const gain = ctx.createGain();
        gain.gain.value = 0;
        source.connect(gain);
        gain.connect(masterGainRef.current!);
        node = { source, gain };
        break;
      }
      case 'pinkNoise': {
        const buffer = generatePinkNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const gain = ctx.createGain();
        gain.gain.value = 0;
        source.connect(gain);
        gain.connect(masterGainRef.current!);
        node = { source, gain };
        break;
      }
      case 'brownNoise': {
        const buffer = generateBrownNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const gain = ctx.createGain();
        gain.gain.value = 0;
        source.connect(gain);
        gain.connect(masterGainRef.current!);
        node = { source, gain };
        break;
      }
      case 'rain':
        node = createRainSound(ctx);
        break;
      case 'ocean':
        node = createOceanSound(ctx);
        break;
      case 'forest':
        node = createForestSound(ctx);
        break;
      case 'fireplace':
        node = createFireplaceSound(ctx);
        break;
      case 'asmr':
        node = createASMRSound(ctx);
        break;
    }
    
    return node;
  }, []);

  // Play a sound
  const playSound = useCallback(async (soundId: SleepSoundType, volume?: number) => {
    try {
      await initAudioContext();
      
      // Stop existing if playing
      if (soundNodesRef.current.has(soundId)) {
        stopSound(soundId);
      }
      
      const node = createSoundNode(soundId);
      if (!node) return;
      
      const targetVolume = volume ?? settings.mix[soundId] ?? SOUND_LIBRARY.find(s => s.id === soundId)?.defaultVolume ?? 0.3;
      node.gain.gain.value = targetVolume * settings.masterVolume;
      node.source.start();
      
      soundNodesRef.current.set(soundId, node);
      setActiveSounds(prev => new Set(prev).add(soundId));
      setIsPlaying(true);
    } catch (err) {
      setError('Failed to play sound');
      console.error(err);
    }
  }, [initAudioContext, createSoundNode, settings.mix, settings.masterVolume]);

  // Stop a sound
  const stopSound = useCallback((soundId: SleepSoundType, fadeOut: boolean = false) => {
    const node = soundNodesRef.current.get(soundId);
    if (!node) return;
    
    if (fadeOut && settings.fadeOutDuration > 0) {
      const startVolume = node.gain.gain.value;
      const duration = settings.fadeOutDuration;
      const startTime = audioContextRef.current?.currentTime || 0;
      
      node.gain.gain.cancelScheduledValues(startTime);
      node.gain.gain.setValueAtTime(startVolume, startTime);
      node.gain.gain.linearRampToValueAtTime(0, startTime + duration);
      
      setTimeout(() => {
        try {
          node.source.stop();
          node.source.disconnect();
          node.gain.disconnect();
        } catch {}
        soundNodesRef.current.delete(soundId);
        setActiveSounds(prev => {
          const next = new Set(prev);
          next.delete(soundId);
          return next;
        });
        if (soundNodesRef.current.size === 0) {
          setIsPlaying(false);
        }
      }, duration * 1000);
    } else {
      try {
        node.source.stop();
        node.source.disconnect();
        node.gain.disconnect();
      } catch {}
      soundNodesRef.current.delete(soundId);
      setActiveSounds(prev => {
        const next = new Set(prev);
        next.delete(soundId);
        return next;
      });
      if (soundNodesRef.current.size === 0) {
        setIsPlaying(false);
      }
    }
  }, [settings.fadeOutDuration]);

  // Stop all sounds
  const stopAllSounds = useCallback((fadeOut: boolean = true) => {
    soundNodesRef.current.forEach((_, soundId) => {
      stopSound(soundId, fadeOut);
    });
  }, [stopSound]);

  // Set volume for a specific sound
  const setSoundVolume = useCallback((soundId: SleepSoundType, volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    const node = soundNodesRef.current.get(soundId);
    if (node) {
      node.gain.gain.value = clampedVolume * settings.masterVolume;
    }
    setSettings(prev => ({
      ...prev,
      mix: { ...prev.mix, [soundId]: clampedVolume },
    }));
  }, [settings.masterVolume]);

  // Set master volume
  const setMasterVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = clampedVolume;
    }
    setSettings(prev => ({ ...prev, masterVolume: clampedVolume }));
  }, []);

  // Toggle sound
  const toggleSound = useCallback((soundId: SleepSoundType) => {
    if (activeSounds.has(soundId)) {
      stopSound(soundId, true);
    } else {
      playSound(soundId);
    }
  }, [activeSounds, stopSound, playSound]);

  // Timer functions
  const startTimer = useCallback((minutes?: number) => {
    const duration = minutes ?? settings.timerDuration;
    const totalSeconds = duration * 60;
    
    setTimerState({
      isActive: true,
      remainingTime: totalSeconds,
      totalTime: totalSeconds,
      isFadingOut: false,
    });
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    timerIntervalRef.current = window.setInterval(() => {
      setTimerState(prev => {
        if (prev.remainingTime <= 1) {
          // Timer finished - start fade out
          if (fadeOutIntervalRef.current) clearInterval(fadeOutIntervalRef.current);
          stopAllSounds(true);
          return { ...prev, isActive: false, remainingTime: 0, isFadingOut: true };
        }
        return { ...prev, remainingTime: prev.remainingTime - 1 };
      });
    }, 1000);
  }, [settings.timerDuration, stopAllSounds]);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (fadeOutIntervalRef.current) {
      clearInterval(fadeOutIntervalRef.current);
      fadeOutIntervalRef.current = null;
    }
    setTimerState({
      isActive: false,
      remainingTime: 0,
      totalTime: 0,
      isFadingOut: false,
    });
  }, []);

  const pauseTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerState(prev => ({ ...prev, isActive: false }));
  }, []);

  const resumeTimer = useCallback(() => {
    if (timerState.remainingTime > 0 && !timerState.isActive) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerState(prev => {
          if (prev.remainingTime <= 1) {
            stopAllSounds(true);
            return { ...prev, isActive: false, remainingTime: 0, isFadingOut: true };
          }
          return { ...prev, remainingTime: prev.remainingTime - 1 };
        });
      }, 1000);
      setTimerState(prev => ({ ...prev, isActive: true }));
    }
  }, [timerState.remainingTime, timerState.isActive, stopAllSounds]);

  // Playlist functions
  const playPlaylist = useCallback(async () => {
    if (settings.playlist.length === 0) return;
    
    await initAudioContext();
    playlistIndexRef.current = 0;
    await playNextInPlaylist();
  }, [settings.playlist, initAudioContext]);

  const playNextInPlaylist = useCallback(async () => {
    const playlist = settings.playlist;
    if (playlist.length === 0) return;
    
    const soundId = playlist[playlistIndexRef.current];
    await playSound(soundId);
    
    // Schedule next
    const soundDuration = 30 * 60 * 1000; // 30 min per track
    crossfadeTimeoutRef.current = window.setTimeout(() => {
      playlistIndexRef.current = (playlistIndexRef.current + 1) % playlist.length;
      crossfadeToNext(soundId, playlist[playlistIndexRef.current]);
    }, soundDuration - settings.crossfadeDuration * 1000);
  }, [settings.playlist, settings.crossfadeDuration, playSound]);

  const crossfadeToNext = useCallback(async (currentId: SleepSoundType, nextId: SleepSoundType) => {
    const currentNode = soundNodesRef.current.get(currentId);
    if (!currentNode) return;
    
    // Fade out current
    const startTime = audioContextRef.current?.currentTime || 0;
    const duration = settings.crossfadeDuration;
    currentNode.gain.gain.cancelScheduledValues(startTime);
    currentNode.gain.gain.setValueAtTime(currentNode.gain.gain.value, startTime);
    currentNode.gain.gain.linearRampToValueAtTime(0, startTime + duration);
    
    // Fade in next
    await playSound(nextId, 0);
    const nextNode = soundNodesRef.current.get(nextId);
    if (nextNode) {
      const targetVolume = settings.mix[nextId] ?? SOUND_LIBRARY.find(s => s.id === nextId)?.defaultVolume ?? 0.3;
      nextNode.gain.gain.cancelScheduledValues(startTime);
      nextNode.gain.gain.setValueAtTime(0, startTime);
      nextNode.gain.gain.linearRampToValueAtTime(targetVolume * settings.masterVolume, startTime + duration);
    }
    
    // Clean up current after crossfade
    setTimeout(() => {
      try {
        currentNode.source.stop();
        currentNode.source.disconnect();
        currentNode.gain.disconnect();
      } catch {}
      soundNodesRef.current.delete(currentId);
      setActiveSounds(prev => {
        const next = new Set(prev);
        next.delete(currentId);
        return next;
      });
    }, duration * 1000);
    
    // Schedule next after this one
    crossfadeTimeoutRef.current = window.setTimeout(() => {
      playlistIndexRef.current = (playlistIndexRef.current + 1) % settings.playlist.length;
      crossfadeToNext(nextId, settings.playlist[playlistIndexRef.current]);
    }, 30 * 60 * 1000 - settings.crossfadeDuration * 1000);
  }, [settings.crossfadeDuration, settings.masterVolume, settings.mix, settings.playlist, playSound]);

  const stopPlaylist = useCallback(() => {
    if (crossfadeTimeoutRef.current) {
      clearTimeout(crossfadeTimeoutRef.current);
      crossfadeTimeoutRef.current = null;
    }
    stopAllSounds(true);
  }, [stopAllSounds]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<SleepSoundsSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Add/remove from playlist
  const addToPlaylist = useCallback((soundId: SleepSoundType) => {
    setSettings(prev => {
      if (prev.playlist.includes(soundId)) return prev;
      const updated = { ...prev, playlist: [...prev.playlist, soundId] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromPlaylist = useCallback((soundId: SleepSoundType) => {
    setSettings(prev => {
      const updated = { ...prev, playlist: prev.playlist.filter(id => id !== soundId) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const reorderPlaylist = useCallback((fromIndex: number, toIndex: number) => {
    setSettings(prev => {
      const playlist = [...prev.playlist];
      const [removed] = playlist.splice(fromIndex, 1);
      playlist.splice(toIndex, 0, removed);
      const updated = { ...prev, playlist };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds(false);
      stopTimer();
      stopPlaylist();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (fadeOutIntervalRef.current) clearInterval(fadeOutIntervalRef.current);
      if (crossfadeTimeoutRef.current) clearTimeout(crossfadeTimeoutRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAllSounds, stopTimer, stopPlaylist]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return {
    // State
    settings,
    isPlaying,
    timerState,
    activeSounds,
    error,
    soundLibrary: SOUND_LIBRARY,
    
    // Actions
    playSound,
    stopSound,
    stopAllSounds,
    toggleSound,
    setSoundVolume,
    setMasterVolume,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    playPlaylist,
    stopPlaylist,
    updateSettings,
    addToPlaylist,
    removeFromPlaylist,
    reorderPlaylist,
    
    // Computed
    formattedTime: timerState.remainingTime > 0 
      ? `${Math.floor(timerState.remainingTime / 60)}:${(timerState.remainingTime % 60).toString().padStart(2, '0')}`
      : `${settings.timerDuration}:00`,
    timerProgress: timerState.totalTime > 0 
      ? 1 - timerState.remainingTime / timerState.totalTime 
      : 0,
  };
}

// ============================================
// Helper: Get sound by ID
// ============================================

export function getSoundById(id: SleepSoundType): SleepSound | undefined {
  return SOUND_LIBRARY.find(s => s.id === id);
}

export function getSoundsByCategory(category: SleepSound['category']): SleepSound[] {
  return SOUND_LIBRARY.filter(s => s.category === category);
}