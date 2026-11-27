import { useTranslation } from 'react-i18next';
import type { WeeklyWorkoutPlan } from '../../utils/workoutData';

interface WorkoutSummaryProps {
  generatedPlan: WeeklyWorkoutPlan | null;
  settings: {
    intensity: string;
    compensateCalories: boolean;
  };
}

export default function WorkoutSummary({
  generatedPlan,
  settings,
}: WorkoutSummaryProps) {
  const { t } = useTranslation();

  if (!generatedPlan) return null;

  return (
    <div className="mt-8 p-4 rounded-xl border border-(--accent) bg-(--accent)/5">
      <h3 className="font-semibold text-(--text-h) mb-2">{t('workout_generated_plan_summary')}</h3>
      <p className="text-sm text-(--text) mb-2">{t('workout_generated_plan_notes', { defaultValue: generatedPlan.notes })}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
        <div className="p-2 bg-(--bg) rounded">
          <span className="text-(--text)">{t('workout_sessions_per_week')}</span>
          <div className="font-bold text-(--accent)">{generatedPlan.totalSessionsPerWeek}</div>
        </div>
        <div className="p-2 bg-(--bg) rounded">
          <span className="text-(--text)">{t('workout_est_weekly_calories')}</span>
          <div className="font-bold text-(--accent)">{generatedPlan.estimatedWeeklyCaloriesBurned} {t('unit_kcal', { defaultValue: 'kcal' })}</div>
        </div>
        <div className="p-2 bg-(--bg) rounded">
          <span className="text-(--text)">{t('workout_avg_daily_calories')}</span>
          <div className="font-bold text-(--accent)">{Math.round(generatedPlan.estimatedWeeklyCaloriesBurned / generatedPlan.totalSessionsPerWeek)} {t('unit_kcal', { defaultValue: 'kcal' })}</div>
        </div>
        <div className="p-2 bg-(--bg) rounded">
          <span className="text-(--text)">{t('workout_plan_intensity', { defaultValue: 'Intensity' })}</span>
          <div className="font-bold text-(--accent)">{t(`workout_intensity_${settings.intensity}`, { defaultValue: t(`workout_intensity_${settings.intensity}_label`, { defaultValue: settings.intensity }) })}</div>
        </div>
      </div>
    </div>
  );
}
