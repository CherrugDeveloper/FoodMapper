import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import { DayNavigator } from './DayNavigator';
import { MealCard } from './dietPlan/MealCard';
import { PhaseProgress } from './dietPlan/PhaseProgress';
import { DaySummary } from './dietPlan/DaySummary';

export default function DietPlan() {
  const { t } = useTranslation();
  const { calcResults, dietPlan } = useAppContext();
  
  const {
    state,
    currentDay,
    confirmMeal,
    modifyMeal,
    completeDay,
    navigateDay,
    navigateToDate,
    isLoading,
  } = dietPlan;


  const handleGoToCalculator = () => {
    // Navigate to calculator tab
    // This would need to be handled by the parent App component
    // For now, we'll just log
    console.log('Navigate to calculator');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-(--accent) border-t-transparent" aria-label="Loading..." />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--text-h)">{t('diet_title')}</h2>
        <button
          onClick={handleGoToCalculator}
          className="px-4 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
        >
          {t('diet_go_to_calculator')}
        </button>
      </div>

      <PhaseProgress day={currentDay} totalDays={state.days.length} />

      <DayNavigator
        state={state}
        currentDayIndex={state.currentDayIndex}
        onNavigate={navigateDay}
        onNavigateToDate={navigateToDate}
      />

      {currentDay && (
        <>
          <DaySummary day={currentDay} results={calcResults} />

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-(--text-h) mb-4">{t('diet_meals')}</h3>
            <div className="space-y-4">
              {currentDay.meals.map(meal => (
                <MealCard
                  key={meal.key}
                  meal={meal}
                  onConfirm={() => confirmMeal(state.currentDayIndex, meal.key)}
                  onModify={(modifications) => modifyMeal(state.currentDayIndex, meal.key, modifications)}
                  isConfirming={false}
                  isModifying={false}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
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
        </>
      )}
    </div>
  );
}
