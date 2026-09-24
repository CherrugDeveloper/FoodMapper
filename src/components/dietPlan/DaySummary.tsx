import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../../types/dietPlan';

interface DaySummaryProps {
  day: DayPlan | null;
}

export function DaySummary({ day }: DaySummaryProps) {
  const { t } = useTranslation();

  if (!day) return null;

  return (
    <div className="p-5 rounded-xl bg-(--code-bg) border border-(--border)">
      <h4 className="text-sm font-bold text-(--text-h) mb-3">{t('diet_day_summary')}</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-(--text) mb-1">{t('diet_total_calories')}</p>
          <p className="font-medium text-(--text-h)">{day.dailyTotals.calories} kcal</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_target_protein')}</p>
          <p className="font-medium text-(--text-h)">{day.dailyTotals.protein}g</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_target_carbs')}</p>
          <p className="font-medium text-(--text-h)">{day.dailyTotals.carbs}g</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_target_fats')}</p>
          <p className="font-medium text-(--text-h)">{day.dailyTotals.fat}g</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_fiber_short')}</p>
          <p className="font-medium text-(--text-h)">{day.dailyTotals.fiber}g</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_water_short')}</p>
          <p className="font-medium text-(--text-h)">{Math.round((day.dailyTotals.calories * 0.001) * 10) / 10}L</p>
        </div>
        {day.dailyTotals.sugar > 0 && (
          <div>
            <p className="text-(--text) mb-1">{t('diet_sugar_short')}</p>
            <p className="font-medium text-(--text-h)">{day.dailyTotals.sugar}g</p>
          </div>
        )}
        {day.dailyTotals.sodium > 0 && (
          <div>
            <p className="text-(--text) mb-1">{t('diet_sodium_short')}</p>
            <p className="font-medium text-(--text-h)">{day.dailyTotals.sodium}mg</p>
          </div>
        )}
      </div>
      
      {day.isCompleted && (
        <div className="mt-4 p-3 rounded bg-green-500/10 border border-green-500/20">
          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
            ✅ {t('diet_day_completed')}
          </p>
        </div>
      )}
    </div>
  );
}