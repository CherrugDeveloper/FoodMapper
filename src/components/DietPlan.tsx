import { useTranslation } from 'react-i18next';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import { useDietPlan } from '../hooks/useDietPlan';
import { DayNavigator } from './DayNavigator';
import { MealCard } from './dietPlan/MealCard';
import { PhaseProgress } from './dietPlan/PhaseProgress';
import { DaySummary } from './dietPlan/DaySummary';

interface DietPlanProps {
  results: NutritionalResults | null;
  userData: UserData | null;
  onGoToCalculator: () => void;
}

export default function DietPlan({ results, userData, onGoToCalculator }: DietPlanProps) {
  const { t } = useTranslation();
  const {
    state,
    currentDay,
    confirmMeal,
    modifyMeal,
    completeDay,
    navigateDay,
    navigateToDate,
    isLoading,
  } = useDietPlan(results, userData);

  const conditions = userData?.conditions ?? [];

  // Phase translations using i18n keys
  const phaseTranslations: Record<string, { title: string; duration: string; focus: string }> = {
    phase0: {
      title: t('diet_phase0_title'),
      duration: t('diet_phase0_duration'),
      focus: t('diet_phase0_focus'),
    },
    phase1: {
      title: t('diet_phase1_title'),
      duration: t('diet_phase1_duration'),
      focus: t('diet_phase1_focus'),
    },
    phase2: {
      title: t('diet_phase2_title'),
      duration: t('diet_phase2_duration'),
      focus: t('diet_phase2_focus'),
    },
    phase3: {
      title: t('diet_phase3_title'),
      duration: t('diet_phase3_duration'),
      focus: t('diet_phase3_focus'),
    },
  };

  const currentPhase = currentDay ? phaseTranslations[currentDay.phase] : phaseTranslations.phase1;

  if (!results) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
        <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
          {t('diet_title')}
        </h2>
        <button
          onClick={onGoToCalculator}
          className="w-full mb-6 p-4 rounded-2xl border border-dashed border-(--accent-border) bg-purple-500/5 text-sm text-(--text) hover:border-(--accent) transition-all cursor-pointer text-left"
        >
          ⚙️ {t('diet_link_cta')}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
        <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
          {t('diet_title')}
        </h2>
        <div className="p-8 rounded-2xl bg-(--bg) border border-(--border) text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-(--accent) border-t-transparent mx-auto mb-4"></div>
          <p className="text-(--text)">{t('diet_generating')}</p>
        </div>
      </div>
    );
  }

  if (!currentDay) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
        <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
          {t('diet_title')}
        </h2>
        <p className="text-sm text-(--text) italic text-center py-4">{t('diet_need_results')}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('diet_title')}
      </h2>

      {/* Target nutrizionali calcolati */}
      <div className="mb-8 p-5 rounded-2xl bg-(--accent-bg) border border-(--accent-border) animate-fade-in">
        <h3 className="text-sm font-bold text-(--accent) uppercase tracking-wider mb-4">{t('diet_targets_title')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-(--bg) border border-(--border) flex flex-col justify-center items-center min-h-20">
            <span className="block text-[10px] uppercase text-(--text) mb-1">kcal</span>
            <strong className="text-lg text-(--text-h)">{results.estimatedTotalEnergyKcal}</strong>
          </div>
          <div className="p-3 rounded-xl bg-(--bg) border border-(--border) flex flex-col justify-center items-center min-h-20">
            <span className="block text-[10px] uppercase text-(--text) mb-1">{t('diet_target_protein')}</span>
            <strong className="text-lg text-(--text-h)">{results.proteins}g</strong>
          </div>
          <div className="p-3 rounded-xl bg-(--bg) border border-(--border) flex flex-col justify-center items-center min-h-20">
            <span className="block text-[10px] uppercase text-(--text) mb-1">{t('diet_target_carbs')}</span>
            <strong className="text-lg text-(--text-h)">{results.carbs}g</strong>
          </div>
          <div className="p-3 rounded-xl bg-(--bg) border border-(--border) flex flex-col justify-center items-center min-h-20">
            <span className="block text-[10px] uppercase text-(--text) mb-1">{t('diet_target_fats')}</span>
            <strong className="text-lg text-(--text-h)">{results.fats}g</strong>
          </div>
          <div className="p-3 rounded-xl bg-(--bg) border border-(--border) flex flex-col justify-center items-center min-h-20">
            <span className="block text-[10px] uppercase text-(--text) mb-1">💧</span>
            <strong className="text-lg text-(--text-h)">{results.waterLiters}L</strong>
          </div>
        </div>
      </div>

      {/* Current Date Indicator */}
      {currentDay && (
        <div className="mb-4 p-3 rounded-xl bg-(--accent-bg) border border-(--accent-border) text-center">
          <span className="text-sm font-medium text-(--accent)">{t('diet_current_date')}: </span>
          <span className="text-lg font-bold text-(--text-h)">
            {new Date(currentDay.date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      )}

-------
      {/* Navigazione giorni */}
      <DayNavigator
        state={state}
        currentDayIndex={state.currentDayIndex}
        onNavigate={navigateDay}
        onNavigateToDate={navigateToDate}
      />

      {/* Progresso fase */}
      <PhaseProgress
        day={currentDay}
        totalDays={state.days.length}
      />

      {/* Riepilogo giornaliero */}
      <DaySummary day={currentDay} results={results} />

      {/* Informazioni fase corrente */}
      <div className="p-5 rounded-xl bg-(--code-bg) border border-(--border) mb-6">
        <h3 className="text-lg font-bold text-(--text-h) mb-2">{currentPhase.title}</h3>
        <p className="text-sm text-(--text) leading-relaxed mb-2">{currentPhase.focus}</p>
        <p className="text-xs text-(--text) opacity-80">
          {t('diet_phase_day', { day: currentDay.phaseDay + 1 })} · {currentPhase.duration}
        </p>
      </div>

      {/* Pasti del giorno corrente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {currentDay.meals.map(meal => (
          <MealCard
            key={meal.key}
            meal={meal}
            isConfirming={false}
            isModifying={false}
            onConfirm={() => confirmMeal(state.currentDayIndex, meal.key)}
            onModify={(modifications) => modifyMeal(state.currentDayIndex, meal.key, modifications)}
          />
        ))}
      </div>

      {/* Totale giornaliero */}
      <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border) mb-6">
        <h4 className="text-sm font-bold text-(--text-h) mb-2">📊 {t('diet_day_total')}</h4>
        <p className="text-sm text-(--text)">
          ~{Math.round(currentDay.dailyTotals.calories)} kcal · {t('diet_target_protein')} {Math.round(currentDay.dailyTotals.protein)}g · {t('diet_target_carbs')} {Math.round(currentDay.dailyTotals.carbs)}g · {t('diet_target_fats')} {Math.round(currentDay.dailyTotals.fat)}g · {t('diet_fiber_short')} {Math.round(currentDay.dailyTotals.fiber)}g
        </p>
      </div>

      {/* Completamento giornata */}
      <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border) mb-6">
        <button
          onClick={() => completeDay(state.currentDayIndex)}
          disabled={currentDay.isCompleted}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            currentDay.isCompleted
              ? 'bg-green-500/20 text-green-500 border border-green-500/30 cursor-default'
              : 'bg-(--accent) text-white hover:bg-(--accent-hover) border border-(--accent-border)'
          }`}
        >
          {currentDay.isCompleted
            ? t('diet_day_completed')
            : t('diet_complete_day')}
        </button>
      </div>

      {/* Condizioni mediche */}
      {conditions.length > 0 && (
        <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border)">
          <h4 className="text-sm font-bold text-(--text-h) mb-2">⚕️ {t('diet_conditions_title')}</h4>
          <ul className="list-disc pl-5 space-y-1.5">
            {conditions.map(condition => (
              <li key={condition} className="text-xs md:text-sm text-(--text) leading-relaxed">
                <strong className="text-(--text-h)">{t(`conditions.${condition}`)}:</strong>{' '}
                {t(`conditions.${condition}_diet`)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
