import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSleepTracking, type SleepSession, type SleepAlarm } from '../hooks/useSleepTracking';
import { useSleepSounds } from '../hooks/useSleepSounds';
import { useSleepAdvice, type SleepAdvice } from '../hooks/useSleepAdvice';
import { useAppContext } from '../context/useAppContext';
import SleepDashboard from './SleepDashboard';
import SleepSounds from './SleepSounds';

type SleepTab = 'tracker' | 'dashboard' | 'sounds' | 'advice';

interface SleepTrackerProps {
  className?: string;
}

export default function SleepTracker({ className = '' }: SleepTrackerProps) {
  const { t } = useTranslation();
  const { userData, calcResults } = useAppContext();
  
  const sleepTracking = useSleepTracking();
  const sleepSounds = useSleepSounds();
  const sleepAdvice = useSleepAdvice(
    sleepTracking.sessions,
    sleepTracking.stats,
    sleepTracking.settings,
    calcResults,
    userData?.ibsType
  );

  const [activeTab, setActiveTab] = useState<SleepTab>('tracker');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [newAlarm, setNewAlarm] = useState<Partial<SleepAlarm>>({
    time: '07:00',
    enabled: true,
    label: '',
    sound: 'gentle',
    smartWake: true,
    smartWakeWindow: 30,
    maxSnoozes: 2,
    days: [],
    vibration: true,
  });
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<SleepAlarm | null>(null);

  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      const motion = sleepTracking.permissionStatus.motion;
      const orientation = sleepTracking.permissionStatus.orientation;
      const notification = sleepTracking.permissionStatus.notification;
      
      if (motion === 'prompt' || orientation === 'prompt' || notification === 'default') {
        setShowPermissionModal(true);
      }
    };
    checkPermissions();
  }, [sleepTracking.permissionStatus]);

  const handlePermissionRequest = useCallback(async () => {
    await sleepTracking.requestPermissions();
    setShowPermissionModal(false);
  }, [sleepTracking.requestPermissions]);

  const handleStartTracking = useCallback(() => {
    sleepTracking.startTracking();
    // Auto-play sleep sounds if enabled
    if (sleepSounds.settings.autoPlay && sleepSounds.soundLibrary.length > 0) {
      sleepSounds.playSound(sleepSounds.soundLibrary[0].id);
    }
  }, [sleepTracking, sleepSounds]);

  const handleStopTracking = useCallback(() => {
    sleepTracking.stopTracking();
    sleepSounds.stopAllSounds(true);
  }, [sleepTracking, sleepSounds]);

  const handleAddAlarm = useCallback(() => {
    if (!newAlarm.time) return;
    
    const alarmData = {
      time: newAlarm.time,
      enabled: newAlarm.enabled ?? true,
      label: newAlarm.label || t('sleep.tracker.alarmDefaultLabel'),
      sound: newAlarm.sound || 'gentle',
      smartWake: newAlarm.smartWake ?? true,
      smartWakeWindow: newAlarm.smartWakeWindow ?? 30,
      maxSnoozes: newAlarm.maxSnoozes ?? 2,
      days: newAlarm.days || [],
      vibration: newAlarm.vibration ?? true,
    };
    
    sleepTracking.addAlarm(alarmData);
    setShowAlarmModal(false);
    setNewAlarm({
      time: '07:00',
      enabled: true,
      label: '',
      sound: 'gentle',
      smartWake: true,
      smartWakeWindow: 30,
      maxSnoozes: 2,
      days: [],
      vibration: true,
    });
  }, [newAlarm, sleepTracking, t]);

  const handleDeleteAlarm = useCallback((id: string) => {
    sleepTracking.deleteAlarm(id);
  }, [sleepTracking]);

  const handleEditAlarm = useCallback((alarm: SleepAlarm) => {
    setEditingAlarm(alarm);
    setNewAlarm({
      time: alarm.time,
      enabled: alarm.enabled,
      label: alarm.label,
      sound: alarm.sound,
      smartWake: alarm.smartWake,
      smartWakeWindow: alarm.smartWakeWindow,
      maxSnoozes: alarm.maxSnoozes,
      days: alarm.days,
      vibration: alarm.vibration,
    });
    setShowAlarmModal(true);
  }, []);

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getPhaseColor = (phase: SleepSession['phases'][0]['phase']) => {
    const colors: Record<string, string> = {
      awake: 'bg-red-400',
      light: 'bg-blue-400',
      deep: 'bg-indigo-600',
      rem: 'bg-purple-400',
    };
    return colors[phase] || 'bg-gray-400';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-(--card-bg) border border-(--border) rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <span className="text-4xl">🌙</span>
              <h3 className="text-xl font-bold text-(--text-h) mt-2">{t('sleep.tracker.permissionsTitle')}</h3>
              <p className="text-(--text-muted) mt-2">{t('sleep.tracker.permissionsDesc')}</p>
            </div>
            <div className="space-y-3 text-sm text-left">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-(--bg) border border-(--border)">
                <span className="text-2xl">📱</span>
                <div>
                  <div className="font-medium text-(--text-h)">{t('sleep.tracker.permissionMotion')}</div>
                  <div className="text-(--text-muted)">{t('sleep.tracker.permissionMotionDesc')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-(--bg) border border-(--border)">
                <span className="text-2xl">🧭</span>
                <div>
                  <div className="font-medium text-(--text-h)">{t('sleep.tracker.permissionOrientation')}</div>
                  <div className="text-(--text-muted)">{t('sleep.tracker.permissionOrientationDesc')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-(--bg) border border-(--border)">
                <span className="text-2xl">🔔</span>
                <div>
                  <div className="font-medium text-(--text-h)">{t('sleep.tracker.permissionNotification')}</div>
                  <div className="text-(--text-muted)">{t('sleep.tracker.permissionNotificationDesc')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-(--bg) border border-(--border)">
                <span className="text-2xl">🔒</span>
                <div>
                  <div className="font-medium text-(--text-h)">{t('sleep.tracker.permissionWakeLock')}</div>
                  <div className="text-(--text-muted)">{t('sleep.tracker.permissionWakeLockDesc')}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-(--border) bg-(--card-bg) text-(--text) hover:bg-(--accent)/10"
              >
                {t('common.later')}
              </button>
              <button
                onClick={handlePermissionRequest}
                className="flex-1 px-4 py-2 rounded-lg bg-(--accent) text-white hover:bg-(--accent-hover)"
              >
                {t('sleep.tracker.allowPermissions')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alarm Modal */}
      {(showAlarmModal || editingAlarm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-(--card-bg) border border-(--border) rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-(--text-h) mb-4 flex items-center justify-between">
              {editingAlarm ? t('sleep.tracker.editAlarm') : t('sleep.tracker.addAlarm')}
              <button
                onClick={() => { setShowAlarmModal(false); setEditingAlarm(null); }}
                className="text-(--text-muted) hover:text-(--text-h)"
              >
                ✕
              </button>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text-h) mb-2">{t('sleep.tracker.alarmTime')}</label>
                <input
                  type="time"
                  value={newAlarm.time}
                  onChange={e => setNewAlarm({ ...newAlarm, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-(--text-h) mb-2">{t('sleep.tracker.alarmLabel')}</label>
                <input
                  type="text"
                  value={newAlarm.label}
                  onChange={e => setNewAlarm({ ...newAlarm, label: e.target.value })}
                  placeholder={t('sleep.tracker.alarmLabelPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-(--text-h) mb-2">{t('sleep.tracker.alarmSound')}</label>
                <select
                  value={newAlarm.sound}
                  onChange={e => setNewAlarm({ ...newAlarm, sound: e.target.value as SleepAlarm['sound'] })}
                  className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text)"
                >
                  <option value="gentle">{t('sleep.tracker.soundGentle')}</option>
                  <option value="nature">{t('sleep.tracker.soundNature')}</option>
                  <option value="chime">{t('sleep.tracker.soundChime')}</option>
                  <option value="vibration">{t('sleep.tracker.soundVibration')}</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="smartWake"
                  checked={newAlarm.smartWake}
                  onChange={e => setNewAlarm({ ...newAlarm, smartWake: e.target.checked })}
                  className="w-4 h-4 accent-(--accent)"
                />
                <label htmlFor="smartWake" className="text-sm text-(--text-h)">
                  {t('sleep.tracker.smartWake')}
                </label>
              </div>
              
              {newAlarm.smartWake && (
                <div>
                  <label className="block text-sm font-medium text-(--text-h) mb-2">
                    {t('sleep.tracker.smartWakeWindow')} ({newAlarm.smartWakeWindow} min)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={newAlarm.smartWakeWindow}
                    onChange={e => setNewAlarm({ ...newAlarm, smartWakeWindow: parseInt(e.target.value) })}
                    className="w-full h-2 bg-(--border) rounded-lg appearance-none accent-(--accent)"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="vibration"
                  checked={newAlarm.vibration}
                  onChange={e => setNewAlarm({ ...newAlarm, vibration: e.target.checked })}
                  className="w-4 h-4 accent-(--accent)"
                />
                <label htmlFor="vibration" className="text-sm text-(--text-h)">
                  {t('sleep.tracker.vibration')}
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-(--text-h) mb-2">{t('sleep.tracker.maxSnoozes')}</label>
                <select
                  value={newAlarm.maxSnoozes}
                  onChange={e => setNewAlarm({ ...newAlarm, maxSnoozes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text)"
                >
                  <option value={0}>{t('sleep.tracker.noSnooze')}</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-(--text-h) mb-2">{t('sleep.tracker.repeatDays')}</label>
                <div className="flex flex-wrap gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setNewAlarm({
                        ...newAlarm,
                        days: newAlarm.days?.includes(idx)
                          ? newAlarm.days.filter(d => d !== idx)
                          : [...(newAlarm.days || []), idx]
                      })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        newAlarm.days?.includes(idx)
                          ? 'bg-(--accent) text-white'
                          : 'bg-(--bg) border border-(--border) text-(--text) hover:bg-(--accent)/10'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-(--text-muted) mt-1">
                  {newAlarm.days?.length === 0 || newAlarm.days?.length === 7
                    ? t('sleep.tracker.daily')
                    : t('sleep.tracker.selectedDays', { days: newAlarm.days?.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ') })}
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setShowAlarmModal(false); setEditingAlarm(null); }}
                  className="flex-1 px-4 py-2 rounded-lg border border-(--border) bg-(--card-bg) text-(--text) hover:bg-(--accent)/10"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleAddAlarm}
                  className="flex-1 px-4 py-2 rounded-lg bg-(--accent) text-white hover:bg-(--accent-hover)"
                >
                  {editingAlarm ? t('common.save') : t('common.add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist">
        {[
          { id: 'tracker', label: t('sleep.tracker.tabTracker'), icon: '🌙' },
          { id: 'dashboard', label: t('sleep.tracker.tabDashboard'), icon: '📊' },
          { id: 'sounds', label: t('sleep.tracker.tabSounds'), icon: '🎵' },
          { id: 'advice', label: t('sleep.tracker.tabAdvice'), icon: '💡' },
        ].map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as SleepTab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-(--accent) text-white'
                : 'bg-(--card-bg) border border-(--border) text-(--text) hover:text-(--text-h) hover:border-(--accent-border)'
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-(--card-bg) border border-(--border) rounded-2xl overflow-hidden">
        {activeTab === 'tracker' && (
          <div className="p-6 space-y-6">
            {/* Current Session / Start Tracking */}
            {sleepTracking.isTracking && sleepTracking.currentSession ? (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-(--accent) flex items-center justify-center animate-pulse">
                        <span className="text-2xl">🌙</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-(--text-h)">{t('sleep.tracker.trackingActive')}</h3>
                        <p className="text-(--text-muted)">{t('sleep.tracker.trackingDesc')}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleStopTracking}
                      className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 font-medium"
                    >
                      ⏹️ {t('sleep.tracker.stopTracking')}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-xl bg-(--bg) border border-(--border)">
                      <div className="text-3xl font-bold text-(--text-h)">
                        {Math.round((Date.now() - sleepTracking.currentSession.startTime) / 60000)} min
                      </div>
                      <div className="text-xs text-(--text-muted)">{t('sleep.tracker.elapsed')}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-(--bg) border border-(--border)">
                      <div className="text-3xl font-bold text-(--text-h) capitalize">
                        {t(`sleep.phases.${sleepTracking.currentSession.phases[sleepTracking.currentSession.phases.length - 1]?.phase || 'awake'}Short`)}
                      </div>
                      <div className="text-xs text-(--text-muted)">{t('sleep.tracker.currentPhase')}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-(--bg) border border-(--border)">
                      <div className="text-3xl font-bold text-(--text-h)">
                        {new Date(sleepTracking.currentSession.startTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-(--text-muted)">{t('sleep.tracker.bedTime')}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-(--bg) border border-(--border)">
                      <div className="text-3xl font-bold text-(--text-h)">
                        {sleepTracking.currentSession.phases.length} fasi
                      </div>
                      <div className="text-xs text-(--text-muted)">{t('sleep.tracker.phasesDetected')}</div>
                    </div>
                  </div>
                  
                  {/* Live Phase Bar */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-(--text-h)">{t('sleep.tracker.livePhases')}</span>
                      <span className="text-xs text-(--text-muted)">{t('sleep.tracker.updatesEvery', { seconds: 30 })}</span>
                    </div>
                    <div className="h-8 rounded-lg bg-(--bg) border border-(--border) overflow-hidden relative">
                      {sleepTracking.currentSession.phases.map((phase, idx) => {
                        const totalDuration = (Date.now() - sleepTracking.currentSession.startTime) / 60000;
                        const phaseStart = phase.startTime;
                        const phaseEnd = idx === sleepTracking.currentSession.phases.length - 1 
                          ? totalDuration 
                          : sleepTracking.currentSession.phases[idx + 1].startTime;
                        const width = totalDuration > 0 ? ((phaseEnd - phaseStart) / totalDuration) * 100 : 0;
                        
                        return (
                          <div
                            key={idx}
                            className="absolute top-0 h-full transition-all duration-500"
                            style={{
                              left: `${phaseStart / totalDuration * 100}%`,
                              width: `${width}%`,
                              backgroundColor: getPhaseColor(phase.phase).replace('bg-', ''),
                            }}
                            title={`${t(`sleep.phases.${phase.phase}`)}: ${Math.round(phase.duration)} min`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      {(['awake', 'light', 'deep', 'rem'] as const).map(phase => (
                        <div key={phase} className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded ${getPhaseColor(phase)}`} />
                          <span className="text-(--text-muted)">{t(`sleep.phases.${phase}Short`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => sleepSounds.toggleSound('whiteNoise')}
                    className={`p-3 rounded-xl text-center transition-colors ${sleepSounds.activeSounds.has('whiteNoise') ? 'bg-(--accent)/10 border border-(--accent)/30' : 'bg-(--bg) border border-(--border)'}`}
                  >
                    <div className="text-2xl mb-1">📻</div>
                    <div className="text-xs font-medium">{t('sleep.sounds.whiteNoise')}</div>
                  </button>
                  <button
                    onClick={() => sleepSounds.startTimer(30)}
                    className={`p-3 rounded-xl text-center transition-colors ${sleepSounds.timerState.isActive ? 'bg-(--accent)/10 border border-(--accent)/30' : 'bg-(--bg) border border-(--border)'}`}
                  >
                    <div className="text-2xl mb-1">⏱️</div>
                    <div className="text-xs font-medium">{t('sleep.tracker.quickTimer30')}</div>
                  </button>
                  <button
                    onClick={() => setShowAlarmModal(true)}
                    className="p-3 rounded-xl text-center bg-(--bg) border border-(--border) hover:bg-(--accent)/10 transition-colors"
                  >
                    <div className="text-2xl mb-1">⏰</div>
                    <div className="text-xs font-medium">{t('sleep.tracker.addAlarm')}</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="p-3 rounded-xl text-center bg-(--bg) border border-(--border) hover:bg-(--accent)/10 transition-colors"
                  >
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-xs font-medium">{t('sleep.tracker.viewDashboard')}</div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-(--accent)/10 flex items-center justify-center">
                  <span className="text-4xl">🌙</span>
                </div>
                <h3 className="text-xl font-bold text-(--text-h) mb-2">{t('sleep.tracker.readyToTrack')}</h3>
                <p className="text-(--text-muted) mb-6 max-w-md mx-auto">{t('sleep.tracker.readyDesc')}</p>
                
                <button
                  onClick={handleStartTracking}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-(--accent) text-white text-lg font-semibold hover:bg-(--accent-hover) transition-colors"
                >
                  <span className="text-2xl">▶️</span>
                  {t('sleep.tracker.startTracking')}
                </button>
                
                <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-xl bg-(--bg) border border-(--border)">
                    <div className="text-2xl font-bold text-(--text-h)">{sleepTracking.stats.totalSessions}</div>
                    <div className="text-(--text-muted)">{t('sleep.tracker.totalNights')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-(--bg) border border-(--border)">
                    <div className="text-2xl font-bold text-(--text-h)">{formatDuration(sleepTracking.stats.avgDuration)}</div>
                    <div className="text-(--text-muted)">{t('sleep.tracker.avgDuration')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-(--bg) border border-(--border)">
                    <div className="text-2xl font-bold text-(--text-h)">{sleepTracking.stats.avgQuality}</div>
                    <div className="text-(--text-muted)">{t('sleep.tracker.avgQuality')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Alarms Section */}
            <div className="pt-6 border-t border-(--border)">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-(--text-h) flex items-center gap-2">
                  <span>⏰</span>
                  {t('sleep.tracker.alarms')}
                </h3>
                <button
                  onClick={() => { setEditingAlarm(null); setShowAlarmModal(true); }}
                  className="px-3 py-1.5 rounded-lg bg-(--accent) text-white text-sm hover:bg-(--accent-hover)"
                >
                  + {t('common.add')}
                </button>
              </div>
              
              {sleepTracking.alarms.length === 0 ? (
                <div className="text-center py-8 text-(--text-muted)">
                  <p className="mb-2">{t('sleep.tracker.noAlarms')}</p>
                  <button
                    onClick={() => setShowAlarmModal(true)}
                    className="text-(--accent) hover:underline text-sm"
                  >
                    {t('sleep.tracker.createFirstAlarm')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {sleepTracking.alarms.map(alarm => (
                    <div
                      key={alarm.id}
                      className="p-3 rounded-xl bg-(--bg) border border-(--border) flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          alarm.enabled ? 'bg-(--accent)/10' : 'bg-(--border)/50'
                        }`}>
                          <span className="text-lg">{alarm.enabled ? '⏰' : '🔕'}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-(--text-h)">{alarm.time}</span>
                            {alarm.smartWake && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500 border border-blue-500/30">
                                🧠 {t('sleep.tracker.smartWakeShort')}
                              </span>
                            )}
                            {alarm.vibration && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-500 border border-purple-500/30">
                                📳
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-(--text-muted) flex items-center gap-2">
                            {alarm.label && <span>{alarm.label}</span>}
                            <span>•</span>
                            <span>{t(`sleep.tracker.sound${alarm.sound.charAt(0).toUpperCase() + alarm.sound.slice(1)}`)}</span>
                            {alarm.days.length > 0 && alarm.days.length < 7 && (
                              <>
                                <span>•</span>
                                <span>{alarm.days.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(' ')}</span>
                              </>
                            )}
                            {alarm.days.length === 0 && (
                              <>
                                <span>•</span>
                                <span>{t('sleep.tracker.daily')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditAlarm(alarm)}
                          className="p-2 rounded-lg text-(--text-muted) hover:text-(--text-h) hover:bg-(--accent)/10 transition-colors"
                          aria-label={t('common.edit')}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => sleepTracking.updateAlarm(alarm.id, { enabled: !alarm.enabled })}
                          className={`p-2 rounded-lg transition-colors ${
                            alarm.enabled
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-(--border)/50 text-(--text-muted)'
                          }`}
                          aria-label={alarm.enabled ? t('common.disable') : t('common.enable')}
                        >
                          {alarm.enabled ? '⏸️' : '▶️'}
                        </button>
                        <button
                          onClick={() => handleDeleteAlarm(alarm.id)}
                          className="p-2 rounded-lg text-(--text-muted) hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          aria-label={t('common.delete')}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="pt-6 border-t border-(--border)">
              <h3 className="text-lg font-semibold text-(--text-h) mb-4">{t('sleep.tracker.quickStats')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label={t('sleep.tracker.sleepScore')}
                  value={sleepTracking.stats.avgQuality > 0 ? sleepTracking.stats.avgQuality : '—'}
                  icon="🏆"
                  subtitle={t('sleep.tracker.outOf100')}
                />
                <StatCard
                  label={t('sleep.tracker.weeklyAvg')}
                  value={formatDuration(sleepTracking.stats.weeklyTrend.reduce((a, b) => a + b.duration, 0) / Math.max(1, sleepTracking.stats.weeklyTrend.filter(d => d.duration > 0).length))}
                  icon="📅"
                  subtitle={t('sleep.tracker.last7Days')}
                />
                <StatCard
                  label={t('sleep.tracker.sleepDebt')}
                  value={formatDuration(sleepTracking.stats.totalSleepDebt)}
                  icon="💳"
                  subtitle={t('sleep.tracker.accumulated')}
                  isWarning={sleepTracking.stats.totalSleepDebt > 60}
                />
                <StatCard
                  label={t('sleep.tracker.efficiency')}
                  value={`${sleepTracking.stats.avgEfficiency}%`}
                  icon="⚡"
                  subtitle={t('sleep.tracker.avg')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <SleepDashboard />
        )}

        {activeTab === 'sounds' && (
          <SleepSounds />
        )}

        {activeTab === 'advice' && (
          <SleepAdvicePanel advice={sleepAdvice} t={t} />
        )}
      </div>
    </div>
  );
}

// ============================================
// Helper Components
// ============================================

function StatCard({ label, value, icon, subtitle, isWarning = false }: {
  label: string;
  value: string | number;
  icon: string;
  subtitle: string;
  isWarning?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-(--bg) border border-(--border)">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-(--text-muted)">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${isWarning ? 'text-orange-500' : 'text-(--text-h)'}`}>{value}</div>
      <div className="text-xs text-(--text-muted)">{subtitle}</div>
    </div>
  );
}

function SleepAdvicePanel({ advice, t }: { advice: ReturnType<typeof useSleepAdvice>; t: (key: string) => string }) {
  const categories = [
    { key: 'schedule', label: t('sleep.advice.category.schedule'), icon: '📅' },
    { key: 'environment', label: t('sleep.advice.category.environment'), icon: '🏠' },
    { key: 'nutrition', label: t('sleep.advice.category.nutrition'), icon: '🍽️' },
    { key: 'routine', label: t('sleep.advice.category.routine'), icon: '🛁' },
    { key: 'supplements', label: t('sleep.advice.category.supplements'), icon: '💊' },
    { key: 'ibs', label: t('sleep.advice.category.ibs'), icon: '🫃' },
    { key: 'general', label: t('sleep.advice.category.general'), icon: '💡' },
  ] as const;

  return (
    <div className="p-6 space-y-6">
      {/* Pattern Analysis Summary */}
      <div className="bg-(--bg) border border-(--border) rounded-xl p-6">
        <h3 className="text-lg font-semibold text-(--text-h) mb-4 flex items-center gap-2">
          <span>📈</span>
          {t('sleep.advice.patternAnalysis')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdviceMetric
            label={t('sleep.advice.chronotype')}
            value={t(`sleep.advice.chronotype.${advice.patternAnalysis.chronotype}`)}
            icon="⏰"
          />
          <AdviceMetric
            label={t('sleep.advice.consistency')}
            value={`${advice.patternAnalysis.consistencyScore}/100`}
            icon="📊"
          />
          <AdviceMetric
            label={t('sleep.advice.avgBedTime')}
            value={advice.patternAnalysis.avgBedTime}
            icon="🌙"
          />
          <AdviceMetric
            label={t('sleep.advice.avgWakeTime')}
            value={advice.patternAnalysis.avgWakeTime}
            icon="🌅"
          />
        </div>
        <div className="mt-4 p-3 rounded-lg bg-(--accent)/10 border border-(--accent)/30">
          <p className="text-sm text-(--text-h)">
            <strong>{t('sleep.advice.recommendedSchedule')}: </strong>
            {t('sleep.advice.bedtimeAt').replace('{{time}}', advice.patternAnalysis.recommendedBedTime)} -
            {t('sleep.advice.wakeAt').replace('{{time}}', advice.patternAnalysis.recommendedWakeTime)}
          </p>
        </div>
      </div>

      {/* Recommendations by Category */}
      <div className="space-y-6">
        {categories.map(({ key, label, icon }) => {
          const items = advice[key as keyof typeof advice] as SleepAdvice[];
          if (items.length === 0) return null;
          
          return (
            <div key={key} className="space-y-3">
              <h4 className="font-semibold text-(--text-h) flex items-center gap-2">
                <span>{icon}</span>
                {label}
                <span className="text-xs px-2 py-0.5 rounded-full bg-(--accent)/10 text-(--accent)">
                  {items.length}
                </span>
              </h4>
              <div className="space-y-2 ml-6 border-l-2 border-(--border) pl-4">
                {items.map(item => (
                  <AdviceItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Medical Disclaimer */}
      <div className="pt-6 border-t border-(--border) p-4 rounded-xl bg-amber-500/10 border-amber-500/30">
        <p className="text-sm text-amber-600">
          <strong>⚠️ {t('sleep.advice.medicalDisclaimer')}</strong>
        </p>
        <p className="text-sm text-amber-600 mt-1">
          {t('sleep.advice.medicalDisclaimerDesc')}
        </p>
      </div>
    </div>
  );
}

function AdviceMetric({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-(--card-bg) border border-(--border)">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-lg font-bold text-(--text-h)">{value}</div>
      <div className="text-xs text-(--text-muted)">{label}</div>
    </div>
  );
}

function AdviceItem({ item }: { item: SleepAdvice }) {
  const priorityColors = {
    high: 'border-red-500/50 bg-red-500/10 text-red-600',
    medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-600',
    low: 'border-blue-500/50 bg-blue-500/10 text-blue-600',
  };
  
  const priorityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '🔵',
  };

  return (
    <div className={`p-3 rounded-r-lg border-l-4 ${priorityColors[item.priority]}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg mt-0.5">{priorityIcons[item.priority]}</span>
        <div className="flex-1">
          <div className="font-medium text-(--text-h)">{item.title}</div>
          <div className="text-sm text-(--text-muted) mt-1">{item.description}</div>
          {item.actionable && item.actionText && (
            <button
              className="mt-2 text-xs font-medium text-(--accent) hover:underline"
              onClick={item.actionCallback}
            >
              → {item.actionText}
            </button>
          )}
          <div className="text-xs text-(--text-muted) mt-1">{item.evidence}</div>
        </div>
      </div>
    </div>
  );
}