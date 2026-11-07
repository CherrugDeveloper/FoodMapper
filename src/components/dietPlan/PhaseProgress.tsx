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

export function PhaseProgress({ day, totalDays }: PhaseProgressProps) {
  const { t } = useTranslation();

  if (!day) return null;

  const isPreStart = day.dayIndex < 0;
  const totalPhaseDays = PHASE_TOTAL_DAYS[day.phase] || 7;
  const phaseProgress = isPreStart ? 0 : Math.min(100, Math.round(((day.phaseDay + 1) / totalPhaseDays) * 100));
  const displayOverallDay = isPreStart
    ? t('diet_pre_start', { defaultValue: 'Pre-Inizio' })
    : `${day.dayIndex + 1} / ${totalDays}`;

  const phaseKey = isPreStart ? 'phase0' : day.phase;
  const phaseMetaColor = PHASE_META[phaseKey]?.color || PHASE_META.phase0.color;

  return (
    <div className="p-5 rounded-3xl bg-(--code-bg) border border-(--border) shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-extrabold text-(--text-h)">{t('diet_phase_progress')}</h4>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${phaseMetaColor}`}>
          {isPreStart ? t('diet_pre_start', { defaultValue: 'Pre-Inizio' }) : t(`diet_${day.phase}`)}
        </span>
      </div>
      <div className="w-full bg-(--bg) rounded-full h-3 border border-(--border) overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${phaseMetaColor}`}
          style={{ width: `${phaseProgress}%` }}
        />
      </div>
      <p className="text-xs text-(--text) mt-2.5 font-medium">
        {isPreStart
          ? t('diet_pre_start_description', { defaultValue: 'Periodo di preparazione precedente all\'inizio ufficiale della dieta.' })
          : `${t('diet_phase_day')} ${day.phaseDay + 1} / ${totalPhaseDays} · ${t('diet_overall_day')} ${displayOverallDay}`}
      </p>
    </div>
  );
}
