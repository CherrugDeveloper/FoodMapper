import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPhase, DayPlan } from '../../types/dietPlan';

interface PhaseProgressProps {
  day: DayPlan | null;
  totalDays: number;
}

const PHASE_META: Record<DietPhase, { color: string; badge: string }> = {
  phase0: { color: 'bg-sky-600', badge: 'bg-sky-100 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-200' },
  phase1: { color: 'bg-purple-600', badge: 'bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-200' },
  phase2: { color: 'bg-amber-600', badge: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200' },
  phase3: { color: 'bg-emerald-600', badge: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' },
};

const PHASE_LABELS: Record<DietPhase, string> = {
  phase0: 'diet_phase0',
  phase1: 'diet_phase1',
  phase2: 'diet_phase2',
  phase3: 'diet_phase3',
};

const DEFAULT_DAY: DayPlan = {
  dayIndex: 0,
  phase: 'phase0',
  phaseDay: 0,
  date: '',
  meals: [],
  dailyTotals: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  },
  isCompleted: false,
};

export const PhaseProgress = memo(function PhaseProgress({ day }: PhaseProgressProps) {
  const { t } = useTranslation();

  const activeDay = day || DEFAULT_DAY;
  const dayIndex = activeDay.dayIndex;

  const isPreStart = dayIndex < 0;

  // Compute phase info - handle pre-start specially
  const { currentPhaseDayNumber, totalPhaseDays, phaseLabel, meta, progressPercent, currentPhase, showProgressBar } = useMemo(() => {
    let pk: DietPhase;
    let pd: number;
    let displayDayNum: number;
    let totPhaseDays: number;
    
    if (isPreStart) {
      // Pre-start: show negative day count
      pk = 'phase0';
      displayDayNum = Math.abs(dayIndex);
      totPhaseDays = 0; // no progress bar for pre-start
    } else if (dayIndex < 7) {
      pk = 'phase0';
      pd = dayIndex;
      displayDayNum = pd + 1;
      totPhaseDays = 7;
    } else if (dayIndex < 28) {
      pk = 'phase1';
      pd = dayIndex - 7;
      displayDayNum = pd + 1;
      totPhaseDays = 21;
    } else if (dayIndex < 49) {
      pk = 'phase2';
      pd = dayIndex - 28;
      displayDayNum = pd + 1;
      totPhaseDays = 21;
    } else {
      pk = 'phase3';
      pd = dayIndex - 49;
      displayDayNum = pd + 1;
      totPhaseDays = 42;
    }

    const pLabel = t(PHASE_LABELS[pk] || 'diet_phase0', { defaultValue: pk });
    const m = PHASE_META[pk] || PHASE_META.phase0;
    const progPct = Math.min(100, Math.max(0, (displayDayNum / totPhaseDays) * 100));
    
    // Don't show progress bar for pre-start or phase 3
    const shouldShowProgressBar = !isPreStart && pk !== 'phase3';
    
    return {
      currentPhaseDayNumber: displayDayNum,
      totalPhaseDays: totPhaseDays,
      phaseLabel: pLabel,
      meta: m,
      progressPercent: progPct,
      currentPhase: pk,
      showProgressBar: shouldShowProgressBar,
    };
  }, [dayIndex, t]);

  // Display text based on phase
  const displayPhaseLabel = phaseLabel;
  const displayText = isPreStart
    ? `-${currentPhaseDayNumber} giorni`
    : currentPhase === 'phase3'
      ? `+${currentPhaseDayNumber} giorni`
      : `${t('diet_phase_day', { defaultValue: 'Giorno' })} ${currentPhaseDayNumber} / ${totalPhaseDays}`;

  return (
    <div className="p-4 rounded-3xl bg-(--code-bg) border border-(--border) shadow-md mb-6 space-y-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <span className={`w-3.5 h-3.5 rounded-full ${meta.color} shrink-0`}></span>
          <span className="text-sm font-extrabold text-(--text-h)">{displayPhaseLabel}</span>
        </div>
        <span className={`text-xs font-black px-3 py-1 rounded-xl border shadow-2xs ${meta.badge}`}>
          {displayText}
        </span>
      </div>
      {showProgressBar && (
        <div className="w-full h-2 rounded-full bg-(--border) overflow-hidden">
          <div
            className={`h-full ${meta.color} transition-all duration-150 rounded-full`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
});