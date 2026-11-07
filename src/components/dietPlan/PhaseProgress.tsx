import { useTranslation } from 'react-i18next';
import type { DietPhase, DayPlan } from '../../types/dietPlan';

interface PhaseProgressProps {
  day: DayPlan | null;
  totalDays: number;
}

const PHASE_META: Record<DietPhase, { color: string; badge: string }> = {
  phase0: { color: 'bg-blue-600', badge: 'bg-blue-100 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200' },
  phase1: { color: 'bg-purple-600', badge: 'bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-200' },
  phase2: { color: 'bg-amber-600', badge: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200' },
  phase3: { color: 'bg-emerald-600', badge: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' },
};

const PHASE_TOTAL_DAYS: Record<DietPhase, number> = {
  phase0: 7,
  phase1: 21,
  phase2: 21,
  phase3: 21,
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

export function PhaseProgress({ day, totalDays }: PhaseProgressProps) {
  const { t } = useTranslation();

  const effectiveTotalDays = Math.max(1, totalDays);
  const activeDay = day || DEFAULT_DAY;
  const isPreStart = activeDay.dayIndex < 0;
  const phaseKey = activeDay.phase || 'phase0';
  const totalPhaseDays = PHASE_TOTAL_DAYS[phaseKey] || 7;

  const safePhaseDay = isPreStart ? 0 : Math.max(0, activeDay.phaseDay || 0);
  const phaseProgress = isPreStart
    ? 0
    : Math.min(100, Math.round(((safePhaseDay + 1) / totalPhaseDays) * 100));

  const phaseLabel = isPreStart
    ? t('diet_phase_pre_start', { defaultValue: 'Pre-inizio' })
    : t(PHASE_LABELS[phaseKey] || 'diet_phase0', { defaultValue: phaseKey });

  const meta = PHASE_META[phaseKey] || PHASE_META.phase0;
  const overallDay = isPreStart ? 0 : Math.max(0, activeDay.dayIndex || 0) + 1;
  const currentPhaseDayNumber = isPreStart ? 0 : safePhaseDay + 1;

  return (
    <div className="p-5 rounded-3xl bg-(--code-bg) border border-(--border) shadow-md mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-extrabold text-(--text-h)">{t('diet_phase_progress', { defaultValue: 'Progresso Fase & Dieta' })}</h4>
        <span className={`text-xs font-black px-3 py-1 rounded-xl border shadow-2xs ${meta.badge}`}>
          {phaseLabel}
        </span>
      </div>
      <div className="w-full bg-(--bg) rounded-full h-3.5 border border-(--border) overflow-hidden p-0.5 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ${meta.color}`}
          style={{ width: `${phaseProgress}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-xs text-(--text) mt-2.5 font-bold">
        <span>
          {isPreStart
            ? t('diet_phase_pre_start_progress', { defaultValue: 'Fase di preparazione pre-dieta' })
            : `${t('diet_phase_day', { defaultValue: 'Giorno fase' })}: ${currentPhaseDayNumber} / ${totalPhaseDays}`}
        </span>
        <span className="text-(--text-h)">
          {t('diet_overall_day', { defaultValue: 'Giorno totale' })}: {overallDay} / {effectiveTotalDays}
        </span>
      </div>
    </div>
  );
}
