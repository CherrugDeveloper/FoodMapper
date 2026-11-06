import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import InfoPopup from './InfoPopup';
import { DayNavigator } from './DayNavigator';
import { MealCard } from './dietPlan/MealCard';
import { PhaseProgress } from './dietPlan/PhaseProgress';
import { DaySummary } from './dietPlan/DaySummary';
import { useFitnessIntegration } from '../hooks/useFitnessIntegration';
import { WarningAlert } from './WarningAlert';

export default function DietPlan() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { calcResults, dietPlan } = useAppContext();
  const fitness = useFitnessIntegration();

  const handleGoToDiary = () => navigate('/diary');
  const handleGoToRecipes = () => navigate('/recipes');
  const handleGoToShopping = () => navigate('/shopping');
  const handleGoToCalculator = () => navigate('/calc');

  const {
    state,
    currentDay,
    confirmMeal,
    modifyMeal,
    completeDay,
    navigateDay,
    navigateToDate,
    isLoading,
    updatePreferences,
  } = dietPlan;

  // Get workout calories for current day from localStorage
  const getWorkoutCaloriesForDay = (date: string): number => {
    return fitness.getDailyCaloriesBurned(date);
  };

  // Get weekly workout calories
  const weeklyWorkoutCalories = fitness.getWeeklyCaloriesBurned();

  // Check if user wants to compensate workout calories
  const compensateCalories = fitness.preferences?.syncWorkouts ?? false;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-(--accent) border-t-transparent" aria-label="Loading..." />
        <p className="text-(--text) text-sm">{t('diet_generating')}</p>
      </div>
    );
  }

  if (!calcResults) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-(--text-h)">{t('diet_title')}</h2>
        </div>
        <div className="p-4 sm:p-6 rounded-2xl bg-(--code-bg) border border-(--border) text-center">
          <p className="text-(--text) mb-4 text-sm sm:text-base">{t('diet_need_results')}</p>
          <button
            onClick={handleGoToCalculator}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
          >
            {t('diet_go_to_calculator')}
          </button>
        </div>
      </div>
    );
  }

  // Get workout calories for current day
  const currentDayDate = currentDay?.date;
  const workoutCaloriesToday = currentDayDate ? getWorkoutCaloriesForDay(currentDayDate) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-(--text-h)">{t('diet_title')}</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
          <button
            onClick={handleGoToCalculator}
            className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) font-medium hover:border-(--accent) hover:text-(--accent) transition text-xs sm:text-sm"
          >
            {t('diet_go_to_calculator')}
          </button>
          <button
            onClick={handleGoToDiary}
            className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition text-xs sm:text-sm"
          >
            {t('diet_go_to_diary', { defaultValue: 'Vai al diario' })}
          </button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) font-medium text-xs sm:text-sm">
            <span className="hidden sm:inline">{t('diet_meal_count', { defaultValue: 'Pasti/giorno:' })}</span>
            <select
              value={state.userPreferences.mealCount}
              onChange={(e) => updatePreferences({ mealCount: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 | 7 })}
              className="w-20 px-2 py-1 rounded border-(--border) bg-(--bg) text-(--text) text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
              aria-label={t('diet_meal_count', { defaultValue: 'Numero pasti al giorno' })}
            >
              <option value={1}>{t('diet_1_meal', { defaultValue: '1 pasto' })}</option>
              <option value={2}>{t('diet_2_meals', { defaultValue: '2 pasti' })}</option>
              <option value={3}>{t('diet_3_meals', { defaultValue: '3 pasti' })}</option>
              <option value={4}>{t('diet_4_meals', { defaultValue: '4 pasti' })}</option>
              <option value={5}>{t('diet_5_meals', { defaultValue: '5 pasti' })}</option>
              <option value={6}>{t('diet_6_meals', { defaultValue: '6 pasti' })}</option>
              <option value={7}>{t('diet_7_meals', { defaultValue: '7 pasti' })}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Warning alerts for risky meal counts */}
      <div className="flex items-center gap-2 mt-2">
        {state.userPreferences.mealCount === 1 && (
          <WarningAlert message={t('diet_risky_meal_1')} />
        )}
        {state.userPreferences.mealCount === 2 && (
          <WarningAlert message={t('diet_risky_meal_2')} />
        )}
        {state.userPreferences.mealCount === 3 && (
          <WarningAlert message={t('diet_risky_meal_3')} />
        )}
        {state.userPreferences.mealCount === 4 && (
          <WarningAlert message={t('diet_risky_meal_4')} />
        )}
        {state.userPreferences.mealCount === 5 && (
          <WarningAlert message={t('diet_risky_meal_5')} />
        )}
        {state.userPreferences.mealCount === 6 && (
          <WarningAlert message={t('diet_risky_meal_6')} />
        )}
        {state.userPreferences.mealCount === 7 && (
          <WarningAlert message={t('diet_risky_meal_7')} />
        )}
      </div>

      <InfoPopup infoKey="diet_phase" />
      <PhaseProgress day={currentDay} totalDays={state.days.length} />

      <DayNavigator
        state={state}
        currentDayIndex={state.currentDayIndex}
        onNavigateToDate={navigateToDate}
      />

      {currentDay && (
        <>
          <DaySummary
            day={currentDay}
            results={calcResults}
            workoutCaloriesBurned={workoutCaloriesToday}
            compensateCalories={compensateCalories}
          />

          {/* Weekly Workout Calories Summary */}
          {(weeklyWorkoutCalories > 0 || workoutCaloriesToday > 0) && (
            <div className="mt-4 p-4 rounded-xl bg-(--code-bg) border border-(--border)">
              <h4 className="text-sm font-bold text-(--text-h) mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-(--accent)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('workout_weekly_summary')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-(--bg) rounded-lg">
                  <p className="text-(--text) opacity-70">{t('workout_calories_today')}</p>
                  <p className="font-bold text-orange-600">{workoutCaloriesToday} {t('unit_calories')}</p>
                </div>
                <div className="p-3 bg-(--bg) rounded-lg">
                  <p className="text-(--text) opacity-70">{t('workout_calories_week')}</p>
                  <p className="font-bold text-(--accent)">{weeklyWorkoutCalories} {t('unit_calories')}</p>
                </div>
                <div className="p-3 bg-(--bg) rounded-lg">
                  <p className="text-(--text) opacity-70">{t('diet_base_target')}</p>
                  <p className="font-bold text-(--text-h)">{calcResults.targetCaloriesKcal} {t('unit_calories')}</p>
                </div>
                <div className="p-3 bg-(--bg) rounded-lg">
                  <p className="text-(--text) opacity-70">{t('diet_adjusted_target')}</p>
                  <p className="font-bold text-(--text-h)">
                    {compensateCalories ? calcResults.targetCaloriesKcal + workoutCaloriesToday : calcResults.targetCaloriesKcal} {t('unit_calories')}
                  </p>
                </div>
              </div>
              {compensateCalories && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  ✓ {t('workout_compensated_active')}
                </p>
              )}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-(--text-h) mb-4">
              {t('diet_meals')}
              <InfoPopup infoKey="diet_reintroduced" className="ml-1.5 align-middle" />
            </h3>
            <div className="space-y-4">
              {currentDay.meals.map(meal => (
                <MealCard
                  key={meal.key}
                  meal={meal}
                  onConfirm={() => confirmMeal(state.currentDayIndex, meal.key)}
                  onModify={(modifications) => modifyMeal(state.currentDayIndex, meal.key, modifications)}
                  isConfirming={false}
                  isModifying={false}
                  onConfirmed={() => {}}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => completeDay(state.currentDayIndex)}
              className="px-6 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition"
            >
              {t('diet_complete_day')}
            </button>
            <button
              onClick={() => navigateDay(1)}
              className="px-6 py-3 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
            >
              {t('diet_next_day')}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-(--border) grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleGoToRecipes}
              className="px-4 py-3 rounded-xl bg-(--code-bg) border border-(--border) text-(--text-h) font-semibold text-sm hover:border-(--accent) hover:text-(--accent) transition-all cursor-pointer text-center"
            >
              {t('diet_go_to_recipes', { defaultValue: 'Vai alle ricette' })}
            </button>
            <button
              onClick={handleGoToShopping}
              className="px-4 py-3 rounded-xl bg-(--code-bg) border border-(--border) text-(--text-h) font-semibold text-sm hover:border-(--accent) hover:text-(--accent) transition-all cursor-pointer text-center"
            >
              {t('diet_go_to_shopping', { defaultValue: 'Vai alla lista della spesa' })}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
