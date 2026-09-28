import { useTranslation } from 'react-i18next';
import type { DayPlan } from '../../types/dietPlan';
import type { NutritionalResults } from '../../utils/nutritionEngine';

interface DaySummaryProps {
  day: DayPlan | null;
  results: NutritionalResults | null;
  /** Calorie bruciate da workout per questo giorno */
  workoutCaloriesBurned?: number;
  /** Se compensare le calorie del workout (aggiungere al target) */
  compensateCalories?: boolean;
}

export function DaySummary({
  day,
  results,
  workoutCaloriesBurned = 0,
  compensateCalories = false
}: DaySummaryProps) {
  const { t } = useTranslation();

  if (!day) return null;

  const formatNum = (n: number, d = 0): string => {
    if (!isFinite(n)) return '0';
    return n.toFixed(d);
  };

  // Use results (calculator output) as primary source for consistency
  // Fall back to day.dailyTotals when results is not available
  const baseCalories = results ? results.targetCaloriesKcal : day.dailyTotals.calories;
  const protein = results ? results.proteins : day.dailyTotals.protein;
  const carbs = results ? results.carbs : day.dailyTotals.carbs;
  const fat = results ? results.fats : day.dailyTotals.fat;
  const fiber = results ? results.fiber : day.dailyTotals.fiber;
  const water = results ? results.waterLiters : 0;

  // Calcolo calorie target aggiustate
  const adjustedCalories = compensateCalories ? baseCalories + workoutCaloriesBurned : baseCalories;
  const caloriesDiff = adjustedCalories - baseCalories;

  return (
    <div className="p-5 rounded-xl bg-(--code-bg) border border-(--border)">
      <h4 className="text-sm font-bold text-(--text-h) mb-3">{t('diet_day_summary')}</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-(--text) mb-1">{t('diet_total_calories')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(baseCalories)} {t('unit_calories')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_target_protein')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(protein)}{t('unit_grams')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_target_carbs')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(carbs)}{t('unit_grams')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_target_fats')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(fat)}{t('unit_grams')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_fiber_short')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(fiber)}{t('unit_grams')}</p>
        </div>
        <div>
          <p className="text-(--text) mb-1">{t('diet_water_short')}</p>
          <p className="font-medium text-(--text-h)">{formatNum(water, 1)}{t('unit_liters')}</p>
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

      {/* Workout Calories Section */}
      {(workoutCaloriesBurned > 0 || compensateCalories) && (
        <div className="mt-4 p-3 rounded-lg bg-(--accent)/5 border border-(--accent)/20">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-(--text) mb-1">{t('workout_calories_burned')}</p>
              <p className="font-medium text-orange-600 flex items-center gap-1">
                🔥 {formatNum(workoutCaloriesBurned)} {t('unit_calories')}
              </p>
            </div>
            <div>
              <p className="text-(--text) mb-1">{t('diet_adjusted_target')}</p>
              <p className="font-medium text-(--text-h) flex items-center gap-1">
                {formatNum(adjustedCalories)} {t('unit_calories')}
                {caloriesDiff !== 0 && (
                  <span className={`text-xs ${caloriesDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({caloriesDiff > 0 ? '+' : ''}{formatNum(caloriesDiff)})
                  </span>
                )}
              </p>
            </div>
            {compensateCalories && (
              <div className="col-span-2">
                <p className="text-xs text-(--text) opacity-70 flex items-center gap-1">
                  ✓ {t('workout_compensated_active')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

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