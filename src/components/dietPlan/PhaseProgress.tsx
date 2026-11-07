import { useTranslation } from 'react-i18next';
import type { DietPhase, DayPlan } from '../../types/dietPlan';

interface PhaseProgressProps {
  day: DayPlan | null;
  totalDays: number;
}

const PHASE_META: Record<DietPhase, { color: string }> = {
  phase0: { color: 'bg-blue-500/20 border-blue-500/40 text-blue-600' },
  phase1: { color: 'bg-purple-500/20 border-purple-500/40 text-purple-600' },
  phase2: { color: 'bg-amber-500/20 border-amber-500/40 text-amber-600' },
  phase3: { color: 'bg-green-500/20 border-green-500/40 text-green-600' },
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

export function PhaseProgress({ day, totalDays }: PhaseProgressProps) {
  const { t } = useTranslation();

  const activeDay = day || { phase: 'phase0' as DietPhase, phaseDay: 0, dayIndex: 0, isCompleted: false };
  const phaseKey = activeDay.phase || 'phase0';
  const totalPhaseDays = PHASE_TOTAL_DAYS[phaseKey] || 7;
  const safePhaseDay = Math.max(0, activeDay.phaseDay || 0);
  const phaseProgress = Math.min(100, Math.round(((safePhaseDay + 1) / totalPhaseDays) * 100));
  
  // Calculate overall day display (1-indexed for user display)
  const overallDay = Math.max(0, activeDay.dayIndex || 0) + 1;
  const effectiveTotalDays = Math.max(1, totalDays);

  const phaseLabel = t(PHASE_LABELS[phaseKey] || 'diet_phase0', { defaultValue: phaseKey });
  const phaseMetaColor = PHASE_META[phaseKey]?.color || PHASE_META.phase0.color;

  return (
    <div className="p-5 rounded-3xl bg-(--code-bg) border border-(--border) shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-extrabold text-(--text-h)">{t('diet_phase_progress')}</h4>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${phaseMetaColor}`}>
          {phaseLabel}
        </span>
      </div>
      <div className="w-full bg-(--bg) rounded-full h-3 border border-(--border) overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${phaseMetaColor}`}
          style={{ width: `${phaseProgress}%` }}
        />
      </div>
      <p className="text-xs text-(--text) mt-2.5 font-medium">
        {`${t('diet_phase_day')} ${safePhaseDay + 1} / ${totalPhaseDays} · ${t('diet_overall_day')} ${overallDay} / ${effectiveTotalDays}`}
      </p>
    </div>
  );
}
