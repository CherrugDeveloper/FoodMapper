import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSleepSounds, type SleepSound, type SleepSoundType } from '../hooks/useSleepSounds';

interface SleepSoundsProps {
  className?: string;
  compact?: boolean;
}

export default function SleepSounds({ className = '', compact = false }: SleepSoundsProps) {
  const { t } = useTranslation();
  const {
    settings,
    isPlaying,
    timerState,
    activeSounds,
    soundLibrary,
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
    addToPlaylist,
    removeFromPlaylist,
    reorderPlaylist,
    formattedTime,
    timerProgress,
  } = useSleepSounds();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['noise', 'nature']));
  const [showTimer, setShowTimer] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [masterVolume, setMasterVolumeState] = useState(settings.masterVolume);
  const [dragOverSound, setDragOverSound] = useState<SleepSoundType | null>(null);

  // Sync master volume
  const handleMasterVolumeChange = (value: number) => {
    setMasterVolumeState(value);
    setMasterVolume(value);
  };

  // Group sounds by category
  const soundsByCategory = useMemo(() => {
    const categories: Record<string, SleepSound[]> = {};
    const processSound = (sound: SleepSound) => {
      if (!categories[sound.category]) categories[sound.category] = [];
      categories[sound.category].push(sound);
    };
    soundLibrary.forEach(processSound);
    return categories;
  }, [soundLibrary]);

  const categoryLabels: Record<string, string> = {
    noise: t('sleep.sounds.category.noise'),
    nature: t('sleep.sounds.category.nature'),
    ambient: t('sleep.sounds.category.ambient'),
    asmr: t('sleep.sounds.category.asmr'),
  };

  const categoryIcons: Record<string, string> = {
    noise: '📻',
    nature: '🌿',
    ambient: '🏠',
    asmr: '🎧',
  };

  const handleDragStart = (e: React.DragEvent, soundId: SleepSoundType) => {
    e.dataTransfer.setData('soundId', soundId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, soundId: SleepSoundType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSound(soundId);
  };

  const handleDragLeave = () => {
    setDragOverSound(null);
  };

  const handleDrop = (e: React.DragEvent, targetSoundId: SleepSoundType) => {
    e.preventDefault();
    const sourceSoundId = e.dataTransfer.getData('soundId') as SleepSoundType;
    setDragOverSound(null);
    
    if (sourceSoundId === targetSoundId) return;
    
    const fromIndex = settings.playlist.indexOf(sourceSoundId);
    const toIndex = settings.playlist.indexOf(targetSoundId);
    
    if (fromIndex !== -1 && toIndex !== -1) {
      reorderPlaylist(fromIndex, toIndex);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Master Controls */}
      <div className="bg-(--card-bg) border border-(--border) rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-(--accent)/10 flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-(--text-h)">{t('sleep.sounds.title')}</h2>
              <p className="text-sm text-(--text-muted)">{t('sleep.sounds.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Master Volume */}
            <div className="flex items-center gap-3 min-w-[200px]">
              <label className="text-sm text-(--text-muted) whitespace-nowrap">{t('sleep.sounds.masterVolume')}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={e => handleMasterVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-(--border) rounded-lg appearance-none accent-(--accent) cursor-pointer"
                aria-label={t('sleep.sounds.masterVolume')}
              />
              <span className="text-sm font-mono text-(--text-h) w-10 text-right">{Math.round(masterVolume * 100)}%</span>
            </div>
            
            {/* Play/Stop All */}
            <div className="flex gap-2">
              <button
                onClick={() => stopAllSounds(true)}
                disabled={!isPlaying}
                className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text) hover:bg-(--accent)/10 hover:border-(--accent-border) transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⏹️ {t('sleep.sounds.stopAll')}
              </button>
            </div>
          </div>

          {/* Timer Bar */}
          {(timerState.isActive || timerState.isFadingOut || showTimer) && (
            <div className="mt-4 p-4 rounded-xl bg-(--accent)/10 border border-(--accent)/30 animate-slide-down">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-(--text-h)">{t('sleep.sounds.sleepTimer')}</span>
                <button
                  onClick={() => setShowTimer(false)}
                  className="text-(--text-muted) hover:text-(--text-h) transition-colors"
                  aria-label={t('common.close')}
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-(--border) rounded-full overflow-hidden">
                  <div
                    className="h-full bg-(--accent) transition-all duration-1000"
                    style={{ width: `${timerProgress * 100}%` }}
                  />
                </div>
                <span className="font-mono text-lg text-(--text-h) min-w-[55px] text-right">{formattedTime}</span>
                <div className="flex gap-2">
                  {timerState.isActive ? (
                    <>
                      <button
                        onClick={pauseTimer}
                        className="px-3 py-1.5 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:bg-(--accent)/10 text-sm"
                      >
                        ⏸️ {t('sleep.sounds.pause')}
                      </button>
                      <button
                        onClick={stopTimer}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-sm"
                      >
                        ⏹️ {t('sleep.sounds.stop')}
                      </button>
                    </>
                  ) : timerState.isFadingOut ? (
                    <span className="text-sm text-(--text-muted) animate-pulse">{t('sleep.sounds.fadingOut')}</span>
                  ) : (
                    <button
                      onClick={resumeTimer}
                      className="px-3 py-1.5 rounded-lg bg-(--accent) text-white hover:bg-(--accent-hover) text-sm"
                    >
                      ▶️ {t('sleep.sounds.resume')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Playlist Bar */}
          {(settings.playlist.length > 0 || showPlaylist) && (
            <div className="mt-4 p-4 rounded-xl bg-(--bg) border border-(--border) animate-slide-down">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-(--text-h) flex items-center gap-2">
                  <span>📋</span>
                  {t('sleep.sounds.playlist')}
                </span>
                <button
                  onClick={() => setShowPlaylist(false)}
                  className="text-(--text-muted) hover:text-(--text-h) transition-colors"
                  aria-label={t('common.close')}
                >
                  ✕
                </button>
              </div>
              {settings.playlist.length === 0 ? (
                <p className="text-sm text-(--text-muted) text-center py-2">{t('sleep.sounds.playlistEmpty')}</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {settings.playlist.map(soundId => {
                    const sound = soundLibrary.find(s => s.id === soundId);
                    const isDragging = dragOverSound === soundId;
                    return (
                      <div
                        key={soundId}
                        className={`flex items-center gap-3 p-2 rounded-lg bg-(--card-bg) border transition-colors ${isDragging ? 'border-(--accent) bg-(--accent)/10' : 'border-(--border)'}`}
                        draggable
                        onDragStart={e => handleDragStart(e, soundId)}
                        onDragOver={e => handleDragOver(e, soundId)}
                        onDragLeave={handleDragLeave}
                        onDrop={e => handleDrop(e, soundId)}
                      >
                        <span className="text-(--text-muted) cursor-grab">⋮⋮</span>
                        <span className="text-lg">{sound?.icon}</span>
                        <span className="font-medium text-(--text-h) flex-1 truncate">{sound?.name}</span>
                        <button
                          onClick={() => removeFromPlaylist(soundId)}
                          className="text-(--text-muted) hover:text-red-500 transition-colors p-1"
                          aria-label={t('sleep.sounds.removeFromPlaylist')}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {settings.playlist.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={playPlaylist}
                    disabled={isPlaying}
                    className="flex-1 px-4 py-2 rounded-lg bg-(--accent) text-white hover:bg-(--accent-hover) transition-colors text-sm disabled:opacity-50"
                  >
                    ▶️ {t('sleep.sounds.playPlaylist')}
                  </button>
                  <button
                    onClick={stopPlaylist}
                    className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text) hover:bg-(--accent)/10 text-sm"
                  >
                    ⏹️ {t('sleep.sounds.stopPlaylist')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sound Library */}
        <div className="space-y-6">
          {Object.entries(soundsByCategory).map(([category, sounds]) => (
            <SoundCategory
              key={category}
              label={categoryLabels[category]}
              icon={categoryIcons[category]}
              sounds={sounds}
              activeSounds={activeSounds}
              settings={settings}
              onToggle={toggleSound}
              onVolumeChange={setSoundVolume}
              onAddToPlaylist={addToPlaylist}
              expanded={expandedCategories.has(category)}
              onExpandToggle={() => setExpandedCategories(prev => {
                const next = new Set(prev);
                if (next.has(category)) next.delete(category);
                else next.add(category);
                return next;
              })}
              compact={compact}
              t={t}
            />
          ))}
        </div>

        {/* Quick Timer */}
        <div className="pt-6 border-t border-(--border)">
          <h3 className="font-semibold text-(--text-h) mb-4">{t('sleep.sounds.quickTimer')}</h3>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 45, 60].map(minutes => (
              <button
                key={minutes}
                onClick={() => { setShowTimer(true); startTimer(minutes); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.timerDuration === minutes && timerState.isActive
                    ? 'bg-(--accent) text-white'
                    : 'bg-(--card-bg) border border-(--border) text-(--text) hover:bg-(--accent)/10 hover:border-(--accent-border)'
                }`}
              >
                {minutes} {t('sleep.sounds.minutes')}
              </button>
            ))}
            <button
              onClick={() => setShowTimer(true)}
              className="px-4 py-2 rounded-lg border border-(--border) bg-(--card-bg) text-(--text) hover:bg-(--accent)/10 hover:border-(--accent-border) transition-colors text-sm"
            >
              ⏱️ {t('sleep.sounds.custom')}
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-(--card-bg) border border-(--border) rounded-2xl p-6">
        <h3 className="font-semibold text-(--text-h) mb-4 flex items-center gap-2">
          <span>ℹ️</span>
          {t('sleep.sounds.infoTitle')}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-(--text-muted)">
          <div className="space-y-2">
            <p>• {t('sleep.sounds.info1')}</p>
            <p>• {t('sleep.sounds.info2')}</p>
            <p>• {t('sleep.sounds.info3')}</p>
          </div>
          <div className="space-y-2">
            <p>• {t('sleep.sounds.info4')}</p>
            <p>• {t('sleep.sounds.info5')}</p>
            <p>• {t('sleep.sounds.infoMedical')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Sound Category Component
// ============================================

interface SoundCategoryProps {
  label: string;
  icon: string;
  sounds: SleepSound[];
  activeSounds: Set<SleepSoundType>;
  settings: ReturnType<typeof useSleepSounds>['settings'];
  onToggle: (soundId: SleepSoundType) => void;
  onVolumeChange: (soundId: SleepSoundType, volume: number) => void;
  onAddToPlaylist: (soundId: SleepSoundType) => void;
  expanded: boolean;
  onExpandToggle: () => void;
  compact: boolean;
  t: (key: string) => string;
}

function SoundCategory({
  label,
  icon,
  sounds,
  activeSounds,
  settings,
  onToggle,
  onVolumeChange,
  onAddToPlaylist,
  expanded,
  onExpandToggle,
  compact,
  t,
}: SoundCategoryProps) {
  return (
    <div className="bg-(--bg) border border-(--border) rounded-xl overflow-hidden">
      <button
        onClick={onExpandToggle}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-(--accent)/5 transition-colors"
        aria-expanded={expanded}
      >
        <span className="text-xl">{icon}</span>
        <span className="font-semibold text-(--text-h)">{label}</span>
        <span className="flex-1" />
        <span className="text-(--text-muted)">{sounds.length} {t('sleep.sounds.sounds')}</span>
        <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {expanded && (
        <div className="p-4 border-t border-(--border) space-y-3 animate-slide-down">
          {sounds.map(sound => (
            <SoundCard
              key={sound.id}
              sound={sound}
              isActive={activeSounds.has(sound.id)}
              volume={settings.mix[sound.id] ?? sound.defaultVolume}
              inPlaylist={settings.playlist.includes(sound.id)}
              onToggle={onToggle}
              onVolumeChange={onVolumeChange}
              onAddToPlaylist={onAddToPlaylist}
              compact={compact}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Sound Card Component
// ============================================

interface SoundCardProps {
  sound: SleepSound;
  isActive: boolean;
  volume: number;
  inPlaylist: boolean;
  onToggle: (soundId: SleepSoundType) => void;
  onVolumeChange: (soundId: SleepSoundType, volume: number) => void;
  onAddToPlaylist: (soundId: SleepSoundType) => void;
  compact: boolean;
  t: (key: string) => string;
}

function SoundCard({
  sound,
  isActive,
  volume,
  inPlaylist,
  onToggle,
  onVolumeChange,
  onAddToPlaylist,
  compact,
  t,
}: SoundCardProps) {
  const [showVolume, setShowVolume] = useState(false);
  const [localVolume, setLocalVolume] = useState(volume);

  const handleVolumeChange = (value: number) => {
    setLocalVolume(value);
    onVolumeChange(sound.id, value);
  };

  return (
    <div className={`p-3 rounded-lg transition-colors ${isActive ? 'bg-(--accent)/10 border border-(--accent)/30' : 'bg-(--card-bg) border border-(--border)'}`}>
      <div className="flex items-center gap-3">
        {/* Play Toggle */}
        <button
          onClick={() => onToggle(sound.id)}
          onKeyDown={e => e.key === 'Enter' && onToggle(sound.id)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isActive
              ? 'bg-(--accent) text-white shadow-lg'
              : 'bg-(--bg) border border-(--border) text-(--text) hover:bg-(--accent)/10 hover:border-(--accent-border)'
          }`}
          aria-pressed={isActive}
          aria-label={isActive ? t('sleep.sounds.stop') : t('sleep.sounds.play')}
        >
          {isActive ? '⏸️' : '▶️'}
        </button>
        
        {/* Sound Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{sound.icon}</span>
            <span className="font-medium text-(--text-h) truncate">{sound.name}</span>
            {inPlaylist && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-(--accent)/10 text-(--accent) border border-(--accent)/30">
                📋 {t('sleep.sounds.inPlaylist')}
              </span>
            )}
          </div>
          <p className="text-xs text-(--text-muted) truncate">{sound.description}</p>
        </div>
        
        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVolume(!showVolume)}
            className="p-1.5 rounded-lg text-(--text-muted) hover:text-(--text-h) hover:bg-(--accent)/10 transition-colors"
            aria-label={t('sleep.sounds.volume')}
            aria-expanded={showVolume}
          >
            🔊
          </button>
          
          {showVolume && (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localVolume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="w-32 h-2 bg-(--border) rounded-lg appearance-none accent-(--accent) cursor-pointer"
                aria-label={t('sleep.sounds.volume')}
              />
              <span className="text-xs font-mono text-(--text-h) w-10 text-right">{Math.round(localVolume * 100)}%</span>
            </div>
          )}
          
          {/* Playlist Button */}
          <button
            onClick={() => inPlaylist ? undefined : onAddToPlaylist(sound.id)}
            disabled={inPlaylist}
            className={`p-1.5 rounded-lg transition-colors ${inPlaylist 
              ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
              : 'text-(--text-muted) hover:text-(--text-h) hover:bg-(--accent)/10'
            }`}
            aria-label={inPlaylist ? t('sleep.sounds.inPlaylist') : t('sleep.sounds.addToPlaylist')}
            title={inPlaylist ? t('sleep.sounds.inPlaylist') : t('sleep.sounds.addToPlaylist')}
          >
            {inPlaylist ? '✓' : '+'}
          </button>
        </div>
      </div>
      
      {/* Volume slider expanded (for non-compact) */}
      {!compact && showVolume && (
        <div className="mt-3 pt-3 border-t border-(--border) animate-slide-down">
          <div className="flex items-center gap-3">
            <span className="text-xs text-(--text-muted) w-16">{t('sleep.sounds.volume')}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={localVolume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-(--border) rounded-lg appearance-none accent-(--accent) cursor-pointer"
              aria-label={t('sleep.sounds.volume')}
            />
            <span className="text-xs font-mono text-(--text-h) w-10 text-right">{Math.round(localVolume * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}