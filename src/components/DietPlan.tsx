import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import InfoPopup from './InfoPopup';
import { DayNavigator } from './DayNavigator';
import { MealCard } from './dietPlan/MealCard';
import { PhaseProgress } from './dietPlan/PhaseProgress';
import { DaySummary } from './dietPlan/DaySummary';

export default function DietPlan() {
  const { t } = useTranslation();
  const { calcResults, dietPlan, setActiveTab } = useAppContext();

  const handleGoToDiary = () => setActiveTab('diary');
  const handleGoToRecipes = () => setActiveTab('recipes');
  const handleGoToShopping = () => setActiveTab('shopping');

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
    setActiveTab('calc');
  };

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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-(--text-h)">{t('diet_title')}</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <InfoPopup infoKey="diet_phase" />
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
