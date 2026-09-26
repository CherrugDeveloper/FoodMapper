import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../../types/dietPlan';
import type { NutritionalResults } from '../../utils/nutritionEngine';

interface DaySummaryProps {
  day: DayPlan | null;
  results: NutritionalResults | null;
}

export function DaySummary({ day, results }: DaySummaryProps) {
  const { t } = useTranslation();

  if (!day) return null;

  const formatNum = (n: number, d = 0): string => {
    if (!isFinite(n)) return '0';
    return n.toFixed(d);
  };

  return (
    <div className="p-5 rounded-xl bg-(--code-bg) border border-(--border)">
      <h4 className="text-sm font-bold text-(--text-h) mb-3">{t('diet_day_summary')}</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-(--text) mb-1">{t('diet_total_calories')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(day.dailyTotals.calories)} {t('unit_calories')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_target_protein')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(day.dailyTotals.protein)}{t('unit_grams')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_target_carbs')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(day.dailyTotals.carbs)}{t('unit_grams')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_target_fats')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(day.dailyTotals.fat)}{t('unit_grams')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_fiber_short')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(day.dailyTotals.fiber)}{t('unit_grams')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_water_short')}</p>
          <p className="font-medium text-(--text-h)">{results ? formatNum(results.waterLiters, 1) : '—'}{t('unit_liters')}</p>
        </div>
        {day.dailyTotals.sugar > 0 && (
          <div>
            <p className="text-(--text) mb-1">{t('diet_sugar_short')}</p>
            <p className="font-medium text-(--text-h)">{formatNum(day.dailyTotals.sugar)}{t('unit_grams')}</p>
          </div>
        )}
        {day.dailyTotals.sodium > 0 && (
          <div>
            <p className="text-(--text) mb-1">{t('diet_sodium_short')}</p>
            <p className="font-medium text-(--text-h)">{formatNum(day.dailyTotals.sodium)}{t('unit_milligrams')}</p>
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