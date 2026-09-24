import { useTranslation } from 'react-i18next';
import type { DietPhase, DayPlan } from '../../types/dietPlan';

interface PhaseProgressProps {
  day: DayPlan | null;
  totalDays: number;
}

const PHASE_META: Record<DietPhase, { name: string; color: string }> = {
  phase0: { name: 'Fase 0 · Preparazione', color: 'bg-blue-500/20 border-blue-500/40 text-blue-600' },
  phase1: { name: 'Fase 1 · Eliminazione', color: 'bg-purple-500/20 border-purple-500/40 text-purple-600' },
  phase2: { name: 'Fase 2 · Reintroduzione', color: 'bg-amber-500/20 border-amber-500/40 text-amber-600' },
  phase3: { name: 'Fase 3 · Personalizzazione', color: 'bg-green-500/20 border-green-500/40 text-green-600' },
};

export function PhaseProgress({ day, totalDays }: PhaseProgressProps) {
  const { t } = useTranslation();

  if (!day) return null;

  const phaseProgress = Math.min(100, Math.round(((day.phaseDay + 1) / 7) * 100));

  return (
    <div className="p-5 rounded-xl bg-(--code-bg) border border-(--border)">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-(--text-h)">{t('diet_phase_progress')}</h4>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${PHASE_META[day.phase].color}`}>
          {t(`diet_${day.phase}`)}
        </span>
      </div>
      <div className="w-full bg-(--bg) rounded-full h-2.5 border border-(--border)">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${PHASE_META[day.phase].color}`} 
          style={{ width: `${phaseProgress}%` }} 
        />
      </div>
      <p className="text-xs text-(--text) mt-2">
        {t('diet_phase_day')} {day.phaseDay + 1} / 7 · {t('diet_overall_day')} {day.dayIndex + 1} / {totalDays}
      </p>
    </div>
  );
}
