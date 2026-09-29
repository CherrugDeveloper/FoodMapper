import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSleepTracking, type SleepSession, type SleepPhase } from '../hooks/useSleepTracking';
import { useAppContext } from '../context/useAppContext';

const PHASE_COLORS: Record<SleepPhase, string> = {
  awake: 'bg-red-400',
  light: 'bg-blue-400',
  deep: 'bg-indigo-600',
  rem: 'bg-purple-400',
};

const PHASE_LABELS: Record<SleepPhase, string> = {
  awake: 'sleep.phases.awake',
  light: 'sleep.phases.light',
  deep: 'sleep.phases.deep',
  rem: 'sleep.phases.rem',
};

interface SleepDashboardProps {
  className?: string;
}

export default function SleepDashboard({ className = '' }: SleepDashboardProps) {
  const { t } = useTranslation();
  const { calcResults } = useAppContext();
  const {
    sessions,
    stats,
    settings,
    updateSettings,
    exportData,
    deleteAllData,
    currentSession,
  } = useSleepTracking();

  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'correlations' | 'settings'>('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const weeklyChartRef = useRef<HTMLCanvasElement>(null);
  const monthlyChartRef = useRef<HTMLCanvasElement>(null);

  // Calculate sleep score
  const sleepScore = useMemo(() => {
    if (stats.totalSessions === 0) return 0;
    
    // Components: duration (25%), efficiency (25%), regularity (20%), latency (15%), phases (15%)
    const durationScore = Math.min(100, (stats.avgDuration / settings.targetDuration) * 100);
    const efficiencyScore = stats.avgEfficiency;
    
    // Regularity: standard deviation of bed/wake times over last 7 days
    const recentData = stats.weeklyTrend.filter(d => d.duration > 0);
    let regularityScore = 100;
    if (recentData.length >= 3) {
      const bedTimes = recentData.map(d => {
        const [h, m] = d.bedTime.split(':').map(Number);
        return h * 60 + m;
      });
      const wakeTimes = recentData.map(d => {
        const [h, m] = d.wakeTime.split(':').map(Number);
        return h * 60 + m;
      });
      
      const bedStdDev = calculateStdDev(bedTimes);
      const wakeStdDev = calculateStdDev(wakeTimes);
      const avgStdDev = (bedStdDev + wakeStdDev) / 2;
      // 30 min std dev = 100, 60 min = 70, 90 min = 40, 120+ = 0
      regularityScore = Math.max(0, 100 - (avgStdDev / 30) * 30);
    }
    
    // Latency score (lower is better, 0-30 min = 100, 60+ = 0)
    const avgLatency = sessions
      .filter(s => s.endTime)
      .slice(-7)
      .reduce((a, b) => a + b.sleepLatency, 0) / Math.max(1, sessions.filter(s => s.endTime).slice(-7).length);
    const latencyScore = Math.max(0, 100 - (avgLatency / 30) * 100);
    
    // Phase score (deep + REM percentage)
    const lastSession = sessions.filter(s => s.endTime).pop();
    let phaseScore = 50;
    if (lastSession) {
      const totalSleep = lastSession.phases
        .filter(p => p.phase !== 'awake')
        .reduce((a, b) => a + b.duration, 0);
      const deepPct = totalSleep > 0 ? (lastSession.phases.find(p => p.phase === 'deep')?.duration || 0) / totalSleep * 100 : 0;
      const remPct = totalSleep > 0 ? (lastSession.phases.find(p => p.phase === 'rem')?.duration || 0) / totalSleep * 100 : 0;
      phaseScore = Math.min(100, (deepPct * 2) + (remPct * 1.5) + 20);
    }
    
    const score = Math.round(
      durationScore * 0.25 +
      efficiencyScore * 0.25 +
      regularityScore * 0.20 +
      latencyScore * 0.15 +
      phaseScore * 0.15
    );
    
    return Math.max(0, Math.min(100, score));
  }, [stats, settings.targetDuration, sessions]);

  // Correlation data
  const correlations = useMemo(() => {
    if (!calcResults || sessions.length === 0) return null;
    
    const completedSessions = sessions.filter(s => s.endTime);
    if (completedSessions.length < 3) return null;
    
    // Sleep vs IBS symptoms (from diary would need context)
    // Sleep vs Workout (would need workout data)
    // Sleep vs Nutrition (from calcResults)
    
    return {
      sleepVsNutrition: {
        protein: calcResults.proteins,
        carbs: calcResults.carbs,
        fat: calcResults.fats,
        fiber: calcResults.fiber,
        water: calcResults.waterLiters,
      },
      sleepVsIBS: {
        // Would need diary data
        avgSymptomSeverity: 0,
        correlation: 0,
      },
      sleepVsWorkout: {
        // Would need workout data
        avgWorkoutIntensity: 0,
        correlation: 0,
      },
    };
  }, [calcResults, sessions]);

  const drawPhaseChart = useCallback(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    ctx.clearRect(0, 0, width, height);
    
    // Get phase data from current session or last completed
    const session = currentSession || sessions.filter(s => s.endTime).pop();
    if (!session) {
      // Draw empty state
      ctx.font = '14px system-ui';
      ctx.fillStyle = 'var(--text-muted)';
      ctx.textAlign = 'center';
      ctx.fillText(t('sleep.dashboard.noData'), centerX, centerY);
      return;
    }
    
    const phaseTotals: Record<SleepPhase, number> = {
      awake: 0, light: 0, deep: 0, rem: 0,
    };
    session.phases.forEach(p => {
      phaseTotals[p.phase] += p.duration;
    });
    
    const totalSleep = phaseTotals.awake + phaseTotals.light + phaseTotals.deep + phaseTotals.rem;
    if (totalSleep === 0) return;
    
    let startAngle = -Math.PI / 2;
    const phases: SleepPhase[] = ['deep', 'rem', 'light', 'awake'];
    
    phases.forEach(phase => {
      const minutes = phaseTotals[phase];
      const percentage = minutes / totalSleep;
      const endAngle = startAngle + percentage * 2 * Math.PI;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Color based on phase
      const colors: Record<SleepPhase, string> = {
        awake: '#f87171',
        light: '#60a5fa',
        deep: '#4f46e5',
        rem: '#a855f7',
      };
      ctx.fillStyle = colors[phase];
      ctx.fill();
      
      // Draw label if segment is large enough
      if (percentage > 0.05) {
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const labelX = centerX + Math.cos(midAngle) * (radius * 0.6);
        const labelY = centerY + Math.sin(midAngle) * (radius * 0.6);
        
        ctx.font = 'bold 12px system-ui';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(percentage * 100)}%`, labelX, labelY);
      }
      
      startAngle = endAngle;
    });
    
    // Center text
    ctx.font = 'bold 24px system-ui';
    ctx.fillStyle = 'var(--text-h)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(totalSleep)}'`, centerX, centerY - 10);
    
    ctx.font = '12px system-ui';
    ctx.fillStyle = 'var(--text-muted)';
    ctx.fillText(t('sleep.dashboard.totalSleep'), centerX, centerY + 15);
  }, [currentSession, sessions, t]);

  const drawWeeklyChart = useCallback(() => {
    const canvas = weeklyChartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    ctx.clearRect(0, 0, width, height);
    
    const data = stats.weeklyTrend.filter(d => d.duration > 0);
    if (data.length === 0) {
      ctx.font = '12px system-ui';
      ctx.fillStyle = 'var(--text-muted)';
      ctx.textAlign = 'center';
      ctx.fillText(t('sleep.dashboard.noWeeklyData'), width / 2, height / 2);
      return;
    }
    
    const maxDuration = Math.max(...data.map(d => d.duration), settings.targetDuration);
    // Draw grid
    ctx.strokeStyle = 'var(--border)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Y-axis labels
      const value = Math.round(maxDuration - (maxDuration / 4) * i);
      ctx.font = '10px system-ui';
      ctx.fillStyle = 'var(--text-muted)';
      ctx.textAlign = 'right';
      ctx.fillText(`${value}'`, padding - 5, y + 3);
    }
    
    // Draw target line
    const targetY = padding + chartHeight * (1 - settings.targetDuration / maxDuration);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'var(--accent)';
    ctx.beginPath();
    ctx.moveTo(padding, targetY);
    ctx.lineTo(width - padding, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw bars
    const barWidth = chartWidth / data.length * 0.7;
    const barSpacing = chartWidth / data.length;
    
    data.forEach((day, i) => {
      const x = padding + i * barSpacing + (barSpacing - barWidth) / 2;
      const barHeight = (day.duration / maxDuration) * chartHeight;
      const y = padding + chartHeight - barHeight;
      
      // Bar color based on quality
      const quality = day.quality;
      let color = '#ef4444'; // red
      if (quality >= 80) color = '#22c55e'; // green
      else if (quality >= 60) color = '#eab308'; // yellow
      else if (quality >= 40) color = '#f97316'; // orange
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Day label
      ctx.font = '10px system-ui';
      ctx.fillStyle = 'var(--text-muted)';
      ctx.textAlign = 'center';
      const dayName = new Date(day.date).toLocaleDateString('it-IT', { weekday: 'short' });
      ctx.fillText(dayName, x + barWidth / 2, height - padding / 2 + 15);
    });
    
    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '11px system-ui';
    ctx.fillStyle = 'var(--text-muted)';
    ctx.textAlign = 'center';
    ctx.fillText(t('sleep.dashboard.durationMinutes'), 0, 0);
    ctx.restore();
  }, [stats, settings.targetDuration, t]);

  const drawMonthlyChart = useCallback(() => {
    const canvas = monthlyChartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    ctx.clearRect(0, 0, width, height);
    
    const data = stats.monthlyTrend.filter(d => d.duration > 0);
    if (data.length === 0) {
      ctx.font = '12px system-ui';
      ctx.fillStyle = 'var(--text-muted)';
      ctx.textAlign = 'center';
      ctx.fillText(t('sleep.dashboard.noMonthlyData'), width / 2, height / 2);
      return;
    }
    
    // Group by week for monthly view
    const weeklyAvg: { week: string; avgDuration: number; avgQuality: number }[] = [];
    for (let i = 0; i < data.length; i += 7) {
      const weekData = data.slice(i, i + 7);
      if (weekData.length === 0) continue;
      const avgDur = weekData.reduce((a, b) => a + b.duration, 0) / weekData.length;
      const avgQual = weekData.reduce((a, b) => a + b.quality, 0) / weekData.length;
      weeklyAvg.push({
        week: `${weekData[0].date} - ${weekData[weekData.length - 1].date}`,
        avgDuration: avgDur,
        avgQuality: avgQual,
      });
    }
    
    const maxDuration = Math.max(...weeklyAvg.map(d => d.avgDuration), settings.targetDuration);
    
    // Draw grid
    ctx.strokeStyle = 'var(--border)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      const value = Math.round(maxDuration - (maxDuration / 4) * i);
      ctx.font = '10px system-ui';
      ctx.fillStyle = 'var(--text-muted)';
      ctx.textAlign = 'right';
      ctx.fillText(`${value}'`, padding - 5, y + 3);
    }
    
    // Target line
    const targetY = padding + chartHeight * (1 - settings.targetDuration / maxDuration);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'var(--accent)';
    ctx.beginPath();
    ctx.moveTo(padding, targetY);
    ctx.lineTo(width - padding, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw line chart for duration
    ctx.strokeStyle = 'var(--accent)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    weeklyAvg.forEach((week, i) => {
      const x = padding + (i / (weeklyAvg.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight * (1 - week.avgDuration / maxDuration);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw points
    weeklyAvg.forEach((week, i) => {
      const x = padding + (i / (weeklyAvg.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight * (1 - week.avgDuration / maxDuration);
      
      ctx.fillStyle = 'var(--accent)';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Week labels
    ctx.font = '9px system-ui';
    ctx.fillStyle = 'var(--text-muted)';
    ctx.textAlign = 'center';
    weeklyAvg.forEach((_, i) => {
      const x = padding + (i / (weeklyAvg.length - 1 || 1)) * chartWidth;
      const weekNum = Math.floor(i + 1);
      ctx.fillText(`${t('sleep.dashboard.week')} ${weekNum}`, x, height - padding / 2 + 15);
    });
    
    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '11px system-ui';
    ctx.fillStyle = 'var(--text-muted)';
    ctx.textAlign = 'center';
    ctx.fillText(t('sleep.dashboard.avgDuration'), 0, 0);
    ctx.restore();
  }, [stats, settings.targetDuration, t]);

  // Draw charts after all callbacks are initialized.
  useEffect(() => {
    drawPhaseChart();
    drawWeeklyChart();
    drawMonthlyChart();
  }, [drawPhaseChart, drawWeeklyChart, drawMonthlyChart]);

  const calculateStdDev = (values: number[]): number => {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return t('sleep.dashboard.excellent');
    if (score >= 60) return t('sleep.dashboard.good');
    if (score >= 40) return t('sleep.dashboard.fair');
    return t('sleep.dashboard.poor');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Score */}
      <div className="bg-(--card-bg) border border-(--border) rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-(--accent) to-(--accent-hover) flex items-center justify-center">
              <span className="text-3xl">🌙</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-(--text-h)">{t('sleep.dashboard.title')}</h2>
              <p className="text-(--text-muted) text-sm">{t('sleep.dashboard.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="relative w-32 h-32">
              <canvas 
                ref={chartCanvasRef} 
                className="w-full h-full" 
                width={128} 
                height={128}
                aria-label={t('sleep.dashboard.sleepScoreAria', { score: sleepScore })}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(sleepScore)}`}>{sleepScore}</span>
                <span className="text-xs text-(--text-muted)">{getScoreLabel(sleepScore)}</span>
              </div>
            </div>
            <p className="text-xs text-(--text-muted) text-center md:text-right">
              {t('sleep.dashboard.basedOn', { count: stats.totalSessions })}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist">
        {[
          { id: 'overview', label: t('sleep.dashboard.tabOverview'), icon: '📊' },
          { id: 'trends', label: t('sleep.dashboard.tabTrends'), icon: '📈' },
          { id: 'correlations', label: t('sleep.dashboard.tabCorrelations'), icon: '🔗' },
          { id: 'settings', label: t('sleep.dashboard.tabSettings'), icon: '⚙️' },
        ].map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
      <div className="bg-(--card-bg) border border-(--border) rounded-2xl p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label={t('sleep.dashboard.totalSleep')}
                value={formatDuration(stats.avgDuration)}
                icon="⏱️"
                target={formatDuration(settings.targetDuration)}
              />
              <MetricCard
                label={t('sleep.dashboard.efficiency')}
                value={`${stats.avgEfficiency}%`}
                icon="⚡"
                target={`${Math.round((settings.targetDuration * 0.85) / settings.targetDuration * 100)}%`}
              />
              <MetricCard
                label={t('sleep.dashboard.sleepLatency')}
                value={
                  sessions.filter(s => s.endTime).length > 0
                    ? `${Math.round(sessions.filter(s => s.endTime).slice(-7).reduce((a, b) => a + b.sleepLatency, 0) / Math.max(1, sessions.filter(s => s.endTime).slice(-7).length))} min`
                    : '--'
                }
                icon="💤"
                target="< 20 min"
              />
              <MetricCard
                label={t('sleep.dashboard.sleepDebt')}
                value={formatDuration(stats.totalSleepDebt)}
                icon="💳"
                target="0 min"
                isNegative={stats.totalSleepDebt > 0}
              />
            </div>

            {/* Phase Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-(--text-h) mb-4">{t('sleep.dashboard.phaseBreakdown')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['deep', 'rem', 'light', 'awake'] as SleepPhase[]).map(phase => {
                  const lastSession = currentSession || sessions.filter(s => s.endTime).pop();
                  const minutes = lastSession?.phases
                    .filter(p => p.phase === phase)
                    .reduce((a, b) => a + b.duration, 0) || 0;
                  const total = lastSession?.phases
                    .filter(p => p.phase !== 'awake')
                    .reduce((a, b) => a + b.duration, 0) || 1;
                  const percentage = Math.round((minutes / total) * 100);
                  
                  return (
                    <div key={phase} className="p-4 rounded-xl bg-(--bg) border border-(--border)">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded ${PHASE_COLORS[phase]}`} />
                        <span className="font-medium text-(--text-h)">{t(PHASE_LABELS[phase])}</span>
                      </div>
                      <div className="text-2xl font-bold text-(--text-h)">{minutes} min</div>
                      <div className="text-xs text-(--text-muted)">{percentage}% {t('sleep.dashboard.ofSleepTime')}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Last Session Details */}
            {currentSession && (
              <div className="p-4 rounded-xl bg-(--accent)/10 border border-(--accent)/30">
                <h3 className="font-semibold text-(--text-h) mb-2 flex items-center gap-2">
                  <span className="animate-pulse text-(--accent)">●</span>
                  {t('sleep.dashboard.trackingActive')}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-(--text-muted)">{t('sleep.dashboard.elapsed')}</div>
                    <div className="font-bold text-(--text-h)">{Math.round((Date.now() - currentSession.startTime) / 60000)} min</div>
                  </div>
                  <div>
                    <div className="text-(--text-muted)">{t('sleep.dashboard.currentPhase')}</div>
                    <div className="font-bold text-(--text-h) capitalize">{t(PHASE_LABELS[currentSession.phases[currentSession.phases.length - 1]?.phase || 'awake'])}</div>
                  </div>
                  <div>
                    <div className="text-(--text-muted)">{t('sleep.dashboard.bedTime')}</div>
                    <div className="font-bold text-(--text-h)">{new Date(currentSession.startTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Sessions */}
            <div>
              <h3 className="text-lg font-semibold text-(--text-h) mb-4">{t('sleep.dashboard.recentSessions')}</h3>
              {sessions.filter(s => s.endTime).slice(-5).reverse().length === 0 ? (
                <p className="text-(--text-muted) text-center py-8">{t('sleep.dashboard.noSessionsYet')}</p>
              ) : (
                <div className="space-y-2">
                  {sessions.filter(s => s.endTime).slice(-5).reverse().map(session => (
                    <SessionRow key={session.id} session={session} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* Weekly Trend */}
            <div>
              <h3 className="text-lg font-semibold text-(--text-h) mb-4">{t('sleep.dashboard.weeklyTrend')}</h3>
              <div className="h-64">
                <canvas ref={weeklyChartRef} className="w-full h-full" />
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  {t('sleep.dashboard.goodQuality')}
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-yellow-500" />
                  {t('sleep.dashboard.mediumQuality')}
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  {t('sleep.dashboard.poorQuality')}
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded border border-dashed border-(--accent) bg-transparent" />
                  {t('sleep.dashboard.target')}
                </span>
              </div>
            </div>

            {/* Monthly Trend */}
            <div>
              <h3 className="text-lg font-semibold text-(--text-h) mb-4">{t('sleep.dashboard.monthlyTrend')}</h3>
              <div className="h-64">
                <canvas ref={monthlyChartRef} className="w-full h-full" />
              </div>
              <p className="text-sm text-(--text-muted) mt-2 text-center">
                {t('sleep.dashboard.monthlyTrendDesc')}
              </p>
            </div>

            {/* Weekly Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-(--text-muted) border-b border-(--border)">
                    <th className="pb-2 px-2">{t('sleep.dashboard.date')}</th>
                    <th className="pb-2 px-2">{t('sleep.dashboard.bedTime')}</th>
                    <th className="pb-2 px-2">{t('sleep.dashboard.wakeTime')}</th>
                    <th className="pb-2 px-2">{t('sleep.dashboard.duration')}</th>
                    <th className="pb-2 px-2">{t('sleep.dashboard.efficiency')}</th>
                    <th className="pb-2 px-2">{t('sleep.dashboard.quality')}</th>
                    <th className="pb-2 px-2">{t('sleep.dashboard.deepSleep')}</th>
                    <th className="pb-2 px-2">{t('sleep.dashboard.remSleep')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.weeklyTrend.map(day => (
                    <tr key={day.date} className="border-b border-(--border)/50 hover:bg-(--accent)/5">
                      <td className="py-2 px-2 font-mono">{new Date(day.date).toLocaleDateString('it-IT')}</td>
                      <td className="py-2 px-2">{day.bedTime}</td>
                      <td className="py-2 px-2">{day.wakeTime}</td>
                      <td className="py-2 px-2">{day.duration > 0 ? formatDuration(day.duration) : '-'}</td>
                      <td className="py-2 px-2">{day.efficiency > 0 ? `${day.efficiency}%` : '-'}</td>
                      <td className="py-2 px-2">
                        {day.quality > 0 ? (
                          <span className={getScoreColor(day.quality)}>{day.quality}</span>
                        ) : '-'}
                      </td>
                      <td className="py-2 px-2">{day.phases.deep > 0 ? `${day.phases.deep} min` : '-'}</td>
                      <td className="py-2 px-2">{day.phases.rem > 0 ? `${day.phases.rem} min` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'correlations' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-(--accent)/10 border border-(--accent)/30">
              <h3 className="font-semibold text-(--text-h) mb-2 flex items-center gap-2">
                <span>🔬</span>
                {t('sleep.dashboard.correlationsTitle')}
              </h3>
              <p className="text-sm text-(--text-muted)">{t('sleep.dashboard.correlationsDesc')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Sleep vs Nutrition */}
              <div className="p-4 rounded-xl bg-(--card-bg) border border-(--border)">
                <h4 className="font-semibold text-(--text-h) mb-3 flex items-center gap-2">
                  <span>🍽️</span>
                  {t('sleep.dashboard.nutritionCorrelation')}
                </h4>
                {correlations ? (
                  <div className="space-y-2 text-sm">
                    <CorrelationRow label={t('sleep.dashboard.protein')} value={`${correlations.sleepVsNutrition.protein}g`} />
                    <CorrelationRow label={t('sleep.dashboard.carbs')} value={`${correlations.sleepVsNutrition.carbs}g`} />
                    <CorrelationRow label={t('sleep.dashboard.fat')} value={`${correlations.sleepVsNutrition.fat}g`} />
                    <CorrelationRow label={t('sleep.dashboard.fiber')} value={`${correlations.sleepVsNutrition.fiber}g`} />
                    <CorrelationRow label={t('sleep.dashboard.water')} value={`${correlations.sleepVsNutrition.water}L`} />
                  </div>
                ) : (
                  <p className="text-(--text-muted) text-sm">{t('sleep.dashboard.needCalculation')}</p>
                )}
              </div>

              {/* Sleep vs IBS Symptoms */}
              <div className="p-4 rounded-xl bg-(--card-bg) border border-(--border)">
                <h4 className="font-semibold text-(--text-h) mb-3 flex items-center gap-2">
                  <span>🫃</span>
                  {t('sleep.dashboard.ibsCorrelation')}
                </h4>
                <p className="text-sm text-(--text-muted) mb-3">{t('sleep.dashboard.ibsCorrelationDesc')}</p>
                <div className="space-y-2 text-sm">
                  <CorrelationRow label={t('sleep.dashboard.avgSymptoms')} value="—" />
                  <CorrelationRow label={t('sleep.dashboard.correlation')} value="—" />
                </div>
                <button 
                  className="mt-3 text-xs text-(--accent) hover:underline"
                  onClick={() => window.history.pushState(null, '', '/diary')}
                >
                  {t('sleep.dashboard.goToDiary')}
                </button>
              </div>

              {/* Sleep vs Workout */}
              <div className="p-4 rounded-xl bg-(--card-bg) border border-(--border)">
                <h4 className="font-semibold text-(--text-h) mb-3 flex items-center gap-2">
                  <span>💪</span>
                  {t('sleep.dashboard.workoutCorrelation')}
                </h4>
                <p className="text-sm text-(--text-muted) mb-3">{t('sleep.dashboard.workoutCorrelationDesc')}</p>
                <div className="space-y-2 text-sm">
                  <CorrelationRow label={t('sleep.dashboard.avgIntensity')} value="—" />
                  <CorrelationRow label={t('sleep.dashboard.correlation')} value="—" />
                </div>
                <button 
                  className="mt-3 text-xs text-(--accent) hover:underline"
                  onClick={() => window.history.pushState(null, '', '/workout')}
                >
                  {t('sleep.dashboard.goToWorkout')}
                </button>
              </div>
            </div>

            {/* Insights */}
            <div className="p-4 rounded-xl bg-(--bg) border border-(--border)">
              <h4 className="font-semibold text-(--text-h) mb-3 flex items-center gap-2">
                <span>💡</span>
                {t('sleep.dashboard.insights')}
              </h4>
              <div className="space-y-2 text-sm text-(--text)">
                {sleepScore < 60 && (
                  <InsightItem 
                    type="warning" 
                    text={t('sleep.dashboard.insightLowScore')} 
                  />
                )}
                {stats.totalSleepDebt > 120 && (
                  <InsightItem 
                    type="warning" 
                    text={t('sleep.dashboard.insightSleepDebt', { debt: formatDuration(stats.totalSleepDebt) })} 
                  />
                )}
                {stats.avgEfficiency < 80 && (
                  <InsightItem 
                    type="info" 
                    text={t('sleep.dashboard.insightLowEfficiency')} 
                  />
                )}
                {sessions.length === 0 && (
                  <InsightItem 
                    type="info" 
                    text={t('sleep.dashboard.insightNoData')} 
                  />
                )}
                {sleepScore >= 80 && stats.totalSessions > 0 && (
                  <InsightItem 
                    type="success" 
                    text={t('sleep.dashboard.insightGreatJob')} 
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-(--text-h)">{t('sleep.dashboard.settings')}</h3>
              
              <SettingItem>
                <SettingLabel>
                  {t('sleep.dashboard.targetDuration')}
                  <span className="text-sm text-(--text-muted) ml-2">({t('sleep.dashboard.minutes')})</span>
                </SettingLabel>
                <input
                  type="number"
                  min="300"
                  max="600"
                  step="15"
                  value={settings.targetDuration}
                  onChange={e => updateSettings({ targetDuration: parseInt(e.target.value) || 480 })}
                  className="w-24 px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text) text-right"
                />
              </SettingItem>

              <SettingItem>
                <SettingLabel>{t('sleep.dashboard.bedtimeReminder')}</SettingLabel>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.bedtimeReminder}
                    onChange={e => updateSettings({ bedtimeReminder: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-(--border) peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-(--accent)/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--accent)"></div>
                </label>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{t('sleep.dashboard.bedtimeReminderTime')}</SettingLabel>
                <input
                  type="time"
                  value={settings.bedtimeReminderTime}
                  onChange={e => updateSettings({ bedtimeReminderTime: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text) w-32"
                />
              </SettingItem>

              <SettingItem>
                <SettingLabel>{t('sleep.dashboard.windDownDuration')}</SettingLabel>
                <select
                  value={settings.windDownDuration}
                  onChange={e => updateSettings({ windDownDuration: parseInt(e.target.value) })}
                  className="px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text) w-32"
                >
                  <option value={15}>{t('sleep.dashboard.minutes', { count: 15 })}</option>
                  <option value={30}>{t('sleep.dashboard.minutes', { count: 30 })}</option>
                  <option value={45}>{t('sleep.dashboard.minutes', { count: 45 })}</option>
                  <option value={60}>{t('sleep.dashboard.minutes', { count: 60 })}</option>
                </select>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{t('sleep.dashboard.wakeLockEnabled')}</SettingLabel>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.wakeLockEnabled}
                    onChange={e => updateSettings({ wakeLockEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-(--border) peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-(--accent)/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--accent)"></div>
                </label>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{t('sleep.dashboard.sensitivity')}</SettingLabel>
                <select
                  value={settings.sensitivity}
                  onChange={e => updateSettings({ sensitivity: e.target.value as 'low' | 'medium' | 'high' })}
                  className="px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text) w-40"
                >
                  <option value="low">{t('sleep.dashboard.low')}</option>
                  <option value="medium">{t('sleep.dashboard.medium')}</option>
                  <option value="high">{t('sleep.dashboard.high')}</option>
                </select>
              </SettingItem>
            </div>

            {/* Data Management */}
            <div className="pt-6 border-t border-(--border) space-y-4">
              <h3 className="text-lg font-semibold text-(--text-h)">{t('sleep.dashboard.dataManagement')}</h3>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { setExportFormat('json'); setShowExportModal(true); }}
                  className="px-4 py-2 rounded-lg border border-(--border) bg-(--card-bg) text-(--text) hover:bg-(--accent)/10 hover:border-(--accent-border) transition-colors text-sm"
                >
                  📥 {t('sleep.dashboard.exportJSON')}
                </button>
                <button
                  onClick={() => { setExportFormat('csv'); setShowExportModal(true); }}
                  className="px-4 py-2 rounded-lg border border-(--border) bg-(--card-bg) text-(--text) hover:bg-(--accent)/10 hover:border-(--accent-border) transition-colors text-sm"
                >
                  📊 {t('sleep.dashboard.exportCSV')}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm"
                >
                  🗑️ {t('sleep.dashboard.deleteAllData')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-(--card-bg) border border-(--border) rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-(--text-h) mb-4">{t('sleep.dashboard.exportData')}</h3>
            <p className="text-sm text-(--text-muted) mb-4">
              {exportFormat === 'json' 
                ? t('sleep.dashboard.exportJSONDesc') 
                : t('sleep.dashboard.exportCSVDesc')
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-lg border border-(--border) bg-(--card-bg) text-(--text) hover:bg-(--accent)/10 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => { exportData(exportFormat); setShowExportModal(false); }}
                className="px-4 py-2 rounded-lg bg-(--accent) text-white hover:bg-(--accent-hover) transition-colors"
              >
                {t('sleep.dashboard.export')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-(--card-bg) border border-(--border) rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-(--text-h) mb-2">{t('sleep.dashboard.confirmDelete')}</h3>
            <p className="text-sm text-(--text-muted) mb-6">{t('sleep.dashboard.confirmDeleteDesc')}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-(--border) bg-(--card-bg) text-(--text) hover:bg-(--accent)/10 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => { deleteAllData(); setShowDeleteConfirm(false); }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {t('sleep.dashboard.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Helper Components
// ============================================

function MetricCard({ label, value, icon, target, isNegative = false }: {
  label: string;
  value: string;
  icon: string;
  target: string;
  isNegative?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-(--bg) border border-(--border)">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-(--text-muted)">{label}</span>
      </div>
      <div className="text-2xl font-bold text-(--text-h)">{value}</div>
      <div className="text-xs text-(--text-muted) mt-1">
        {isNegative ? '⚠️ ' : '🎯 '}{target}
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: SleepSession }) {
  const date = new Date(session.startTime);
  const bedTime = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const wakeTime = session.endTime
    ? new Date(session.endTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    : '--:--';
  const qualityColor = session.quality >= 80 ? 'text-emerald-500' : 
                       session.quality >= 60 ? 'text-yellow-500' : 
                       session.quality >= 40 ? 'text-orange-500' : 'text-red-500';
  
  return (
    <div className="p-3 rounded-lg bg-(--bg) border border-(--border) flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-(--accent)/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">🌙</span>
        </div>
        <div className="min-w-0">
          <div className="font-medium text-(--text-h) truncate">
            {date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
          <div className="text-xs text-(--text-muted) flex items-center gap-2">
            <span>{bedTime} - {wakeTime}</span>
            <span>•</span>
            <span>{formatDuration(session.duration)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm flex-shrink-0">
        <div className={`font-bold ${qualityColor}`}>{session.quality}</div>
        <div className="text-(--text-muted)">{session.efficiency}%</div>
      </div>
    </div>
  );
}

function CorrelationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-(--text-muted)">{label}</span>
      <span className="font-medium text-(--text-h)">{value}</span>
    </div>
  );
}

function InsightItem({ type, text }: { type: 'success' | 'warning' | 'info'; text: string }) {
  const icons = { success: '✅', warning: '⚠️', info: 'ℹ️' };
  const colors = { 
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600', 
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600', 
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-600' 
  };
  
  return (
    <div className={`p-3 rounded-lg border flex items-start gap-2 ${colors[type]}`}>
      <span className="text-lg mt-0.5">{icons[type]}</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function SettingItem({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between py-2">{children}</div>;
}

function SettingLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-(--text-h) flex items-center gap-2">{children}</label>;
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}