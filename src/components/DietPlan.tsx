import { useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import InfoPopup from './InfoPopup';
import DayNavigator from './DayNavigator';
import { MealCard } from './dietPlan/MealCard';
import { PhaseProgress } from './dietPlan/PhaseProgress';
import { DaySummary } from './dietPlan/DaySummary';
import { useFitnessIntegration } from '../hooks/useFitnessIntegration';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';
import { navigateTo } from '../utils/navigation';

export default function DietPlan() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { calcResults, dietPlan } = useAppContext();
  const fitness = useFitnessIntegration();
  const { toasts, showToast, removeToast } = useToast();

  // Destructure dietPlan state FIRST so callbacks can use these values
  const {
    state,
    currentDay,
    confirmMeal,
    unconfirmMeal,
    modifyMeal,
    completeDay,
    navigateDay,
    navigateToDate,
    isLoading,
    updatePreferences,
    updateStartDate,
  } = dietPlan;

  // Listen for app-navigation events to handle navigation via navigateRef fallback
  useEffect(() => {
    const navigationEventListener = (event: Event) => {
      const detail = (event as CustomEvent).detail as string;
      // Only handle date strings in format YYYY-MM-DD
      if (detail && /^\d{4}-\d{2}-\d{2}$/.test(detail) && navigateToDate) {
        navigateToDate(detail as string);
      }
    };
    window.addEventListener('app-navigation', navigationEventListener);
    return () => window.removeEventListener('app-navigation', navigationEventListener);
  }, [navigateToDate]);

  // Refs to avoid stale closure issues in React 19
  const completeDayRef = useRef(completeDay);
  const navigateDayRef = useRef(navigateDay);
  const navigateToDateRef = useRef(navigateToDate);
  const updateStartDateRef = useRef(updateStartDate);
  const updatePreferencesRef = useRef(updatePreferences);
  const stateRef = useRef(state);
  const confirmMealRef = useRef(confirmMeal);
  const unconfirmMealRef = useRef(unconfirmMeal);
  const modifyMealRef = useRef(modifyMeal);

  // Keep refs updated with latest values
  useEffect(() => {
    completeDayRef.current = completeDay;
    navigateDayRef.current = navigateDay;
    navigateToDateRef.current = navigateToDate;
    updateStartDateRef.current = updateStartDate;
    updatePreferencesRef.current = updatePreferences;
    stateRef.current = state;
    confirmMealRef.current = confirmMeal;
    unconfirmMealRef.current = unconfirmMeal;
    modifyMealRef.current = modifyMeal;
  }, [completeDay, navigateDay, navigateToDate, updateStartDate, updatePreferences, state, confirmMeal, unconfirmMeal, modifyMeal]);

  const handleMealCountChange = useCallback((newCount: number) => {
    updatePreferencesRef.current({ mealCount: newCount as 1 | 2 | 3 | 4 | 5 | 6 | 7 });
    showToast(t(`diet_meal_count_${newCount}`), getMealCountToastType(newCount));
  }, [showToast, t]);

  const getMealCountToastType = (count: number): 'success' | 'error' | 'info' => {
    if (count === 1 || count === 2) return 'error';
    if (count === 3) return 'info';
    if (count >= 4 && count <= 5) return 'success';
    return 'info';
  };

  const handleGoToDiary = useCallback(() => {
    navigateTo('/diary', { force: true });
  }, []);

  const handleGoToRecipes = useCallback(() => {
    navigateTo('/recipes', { force: true });
  }, []);

  const handleGoToShopping = useCallback(() => {
    navigateTo('/shopping', { force: true });
  }, []);

  const handleGoToCalculator = useCallback(() => {
    navigateTo('/calc', { force: true });
  }, []);

  const handleCompleteDay = useCallback((dayIndex: number) => {
    completeDayRef.current(dayIndex);
  }, []);

  const handleNavigateDay = useCallback((direction: number) => {
    navigateDayRef.current(direction);
  }, []);

  const handleConfirmMeal = useCallback((dayIndex: number, mealKey: string) => {
    confirmMealRef.current(dayIndex, mealKey);
  }, []);

  const handleUnconfirmMeal = useCallback((dayIndex: number, mealKey: string) => {
    unconfirmMealRef.current(dayIndex, mealKey);
  }, []);

  const handleModifyMeal = useCallback((dayIndex: number, mealKey: string, modifications: Partial<import('../types/dietPlan').MealPortion>[]) => {
    modifyMealRef.current(dayIndex, mealKey, modifications);
  }, []);

  const getWorkoutCaloriesForDay = useCallback((date: string): number => {
    return fitness.getDailyCaloriesBurned(date);
  }, [fitness]);

  const weeklyWorkoutCalories = fitness.getWeeklyCaloriesBurned();
  const compensateCalories = fitness.preferences?.syncWorkouts ?? false;
  const currentDayDate = currentDay?.date;
  const workoutCaloriesToday = currentDayDate ? getWorkoutCaloriesForDay(currentDayDate) : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-(--accent) border-t-transparent" aria-label={t('common.loading', { defaultValue: 'Caricamento...' })} />
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-left">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-(--text-h)">{t('diet_title')}</h2>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto items-center">
          <button
            onClick={handleGoToCalculator}
            className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) font-medium hover:border-(--accent) hover:text-(--accent) transition text-xs sm:text-sm whitespace-nowrap"
          >
            {t('diet_go_to_calculator')}
          </button>
          <button
            onClick={handleGoToDiary}
            className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition text-xs sm:text-sm whitespace-nowrap"
          >
            {t('diet_go_to_diary', { defaultValue: 'Vai al diario' })}
          </button>
          <div className="p-3.5 rounded-2xl bg-(--code-bg) border border-(--border) text-(--text-h) shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-(--text-h)">
                {t('diet_meal_count', { defaultValue: 'Pasti al giorno' })}
              </span>
              <InfoPopup infoKey="diet_meal_count" className="shrink-0" buttonClassName="text-(--accent) hover:text-(--accent-hover) transition-colors" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { count: 1, warning: t('diet_meal_count_1_warning'), severity: 'high' as const },
                { count: 2, warning: t('diet_meal_count_2_warning'), severity: 'yellow' as const },
                { count: 3 },
                { count: 4, recommended: true },
                { count: 5 },
                { count: 6, warning: t('diet_meal_count_6_warning'), severity: 'yellow' as const },
                { count: 7, warning: t('diet_meal_count_7_warning'), severity: 'high' as const },
              ].map(item => {
                const isSelected = state.userPreferences.mealCount === item.count;
                const isRecommended = item.recommended === true;
                return (
                  <button
                    type="button"
                    key={item.count}
                    onClick={() => handleMealCountChange(item.count)}
                    aria-pressed={isSelected}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer flex items-center justify-center text-center min-h-10 relative ${
                      isSelected
                        ? 'bg-(--accent) text-white border-(--accent) shadow-sm'
                        : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
                    }`}>
                    <span className="flex items-center gap-0.5">
                      {item.count}
                      {isRecommended && !isSelected && (
                        <span className="ml-0.5 text-amber-500 dark:text-amber-400">✨</span>
                      )}
                    </span>
                    {item.warning && !isSelected && (
                      <span className={`absolute -top-1 -right-1 text-[10px] ${item.severity === 'high' ? 'text-orange-500 dark:text-orange-400' : 'text-yellow-500 dark:text-yellow-400'}`} title={item.warning}>
                        ⚠️
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <InfoPopup infoKey="diet_phase" />
      <PhaseProgress day={currentDay} totalDays={state.days.length} />

      <DayNavigator
        state={state}
        currentDayIndex={state.currentDayIndex}
        onNavigateToDate={navigateToDate}
        onUpdateStartDate={updateStartDate}
      />

      {currentDay && (
        <>
          <DaySummary
            day={currentDay}
            results={calcResults}
            workoutCaloriesBurned={workoutCaloriesToday}
            compensateCalories={compensateCalories}
          />

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
                  onConfirm={() => handleConfirmMeal(currentDay.dayIndex, meal.key)}
                  onUnconfirm={() => handleUnconfirmMeal(currentDay.dayIndex, meal.key)}
                  onModify={(modifications) => handleModifyMeal(currentDay.dayIndex, meal.key, modifications)}
                  isConfirming={false}
                  isModifying={false}
                  onConfirmed={() => {}}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-6 pt-6 border-t border-(--border) grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => handleCompleteDay(currentDay.dayIndex)}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition text-center cursor-pointer shadow-sm"
        >
          {t('diet_complete_day')}
        </button>
        <button
          onClick={() => handleNavigateDay(1)}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition text-center"
        >
          {t('diet_next_day')}
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
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
          {t('diet_go_to_shopping_list', { defaultValue: 'Vai alla lista della spesa' })}
        </button>
      </div>
    </div>
  );
}
