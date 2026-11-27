import { useTranslation } from 'react-i18next';
import { useWorkoutPlan, type EquipmentFilter } from '../hooks/useWorkoutPlan';
import WorkoutSettingsPanel from './workout/WorkoutSettingsPanel';
import WorkoutDayCard from './workout/WorkoutDayCard';
import WorkoutSummary from './workout/WorkoutSummary';
import { FitnessConnectionButton, type FitnessProvider } from '../hooks/useFitnessIntegration';

export default function WorkoutPlan() {
  const { t } = useTranslation();
  const {
    settings,
    filter,
    workoutPlan,
    currentDay,
    showSettings,
    showFitnessApps,
    generatedPlan,
    suggestion,
    filteredExerciseIds,
    weeklyCaloriesBurned,
    equipmentOptions,
    setCurrentDay,
    setShowSettings,
    setShowFitnessApps,
    handleSettingChange,
    setFilter,
    handleExerciseChange,
    handleDurationChange,
    handleNoteChange,
    handleGoToDiet,
    handleGoToCalculator,
    generatePersonalizedPlan,
    generateSuggestedPlan,
    resetPlan,
    fitness,
    calcResults,
    userData,
  } = useWorkoutPlan();

  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-(--text-h)">{t('workout_title')}</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleGoToCalculator}
            className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition text-xs sm:text-sm"
          >
            {t('workout_go_to_calculator')}
          </button>
          <button
            onClick={handleGoToDiet}
            className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) font-medium hover:border-(--accent) hover:text-(--accent) transition text-xs sm:text-sm"
          >
            {t('workout_go_to_diet', { defaultValue: 'Vai alla dieta' })}
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-(--border) bg-(--code-bg) mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <label htmlFor="equipment-filter" className="text-sm font-medium text-(--text)">
            {t('workout_filter_label')}
          </label>
          <select
            id="equipment-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as EquipmentFilter)}
            className="px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          >
            <option value="all">{t('workout_filter_all')}</option>
            <option value="bodyweight">{t('workout_filter_bodyweight')}</option>
            <option value="dumbbells">{t('workout_equip_dumbbells')}</option>
            <option value="bands">{t('workout_equip_bands')}</option>
            <option value="barbell">{t('workout_equip_barbell')}</option>
            <option value="kettlebell">{t('workout_equip_kettlebell')}</option>
            <option value="pullup_bar">{t('workout_equip_pullup_bar')}</option>
            <option value="bench">{t('workout_equip_bench')}</option>
            <option value="machine">{t('workout_equip_machine')}</option>
            <option value="cardio_machine">{t('workout_equip_cardio_machine')}</option>
          </select>
        </div>

        <div className="text-sm text-(--text) space-y-1">
          <p className="font-medium text-(--text-h)">{t('workout_suggestion_title')}</p>
          <p>{t(suggestion.reasonKey)}</p>
          {calcResults && userData && (
            <p className="text-xs opacity-80">
              {t('workout_suggestion_metrics', {
                kcal: calcResults.targetCaloriesKcal,
                activity: t(`calc_act_${{
                  sedentary: 'sed',
                  lightly_active: 'light',
                  moderately_active: 'mod',
                  very_active: 'very'
                }[userData.activityLevel] ?? 'sed'}`)
              })}
            </p>
          )}
          {userData && (
            <p className="text-xs text-(--accent) font-medium">
              {t('workout_weekly_calories_burned', {
                calories: weeklyCaloriesBurned,
                defaultValue: `Calorie stimate settimana: {calories} kcal`
              })}
              {settings.compensateCalories && (
                <span className="ml-2 text-green-600">✓ {t('workout_compensated')}</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="mb-6">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) font-medium hover:border-(--accent) hover:text-(--accent) transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {showSettings ? t('workout_hide_settings') : t('workout_show_settings')}
        </button>
      </div>

      {showSettings && (
        <WorkoutSettingsPanel
          settings={settings}
          equipmentOptions={equipmentOptions}
          onSettingChange={handleSettingChange}
          onGeneratePersonalized={generatePersonalizedPlan}
          onGenerateSuggested={generateSuggestedPlan}
          onReset={resetPlan}
        />
      )}

      {/* Fitness App Integration Panel */}
      <div className="mb-6">
        <button
          onClick={() => setShowFitnessApps(!showFitnessApps)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) font-medium hover:border-(--accent) hover:text-(--accent) transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 002 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          {showFitnessApps ? t('workout_hide_fitness_apps') : t('workout_show_fitness_apps')}
        </button>
      </div>

      {showFitnessApps && (
        <div className="p-4 rounded-xl border border-(--border) bg-(--code-bg) mb-6 animate-slide-down">
          <h3 className="font-semibold text-(--text-h) mb-4">{t('workout_fitness_apps_title')}</h3>
          <p className="text-sm text-(--text) mb-4">{t('workout_fitness_apps_desc')}</p>

          <div className="space-y-3">
            {(Object.keys(fitness.providers) as FitnessProvider[]).map(provider => {
              const status = fitness.getConnectionStatus(provider);
              return (
                <FitnessConnectionButton
                  key={provider}
                  provider={provider}
                  onConnect={async (p) => { await fitness.connect(p); }}
                  onDisconnect={async (p) => { await fitness.disconnect(p); }}
                  isConnected={status.connected}
                  isLoading={fitness.isLoading[provider]}
                  lastSync={status.lastSync}
                />
              );
            })}
          </div>

          {fitness.lastError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {fitness.lastError}
            </div>
          )}

          {fitness.getWeeklyCaloriesBurned() > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
              {t('workout_synced_calories_week', {
                calories: fitness.getWeeklyCaloriesBurned(),
                defaultValue: `Calorie sincronizzate questa settimana: {calories} kcal`
              })}
            </div>
          )}
        </div>
      )}

      {/* Weekly Plan */}
      <div className="space-y-6">
        {DAYS.map(day => (
          <WorkoutDayCard
            key={day}
            day={day}
            plan={workoutPlan[day]}
            filter={filter}
            filteredExerciseIds={filteredExerciseIds}
            userData={userData}
            onExerciseChange={handleExerciseChange}
            onDurationChange={handleDurationChange}
            onNoteChange={handleNoteChange}
          />
        ))}
      </div>

      <WorkoutSummary
        generatedPlan={generatedPlan}
        settings={settings}
      />

      <div className="mt-8 pt-6 border-t border-(--border)">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm text-(--text)">
            {t('workout_current_day', { day: DAYS.indexOf(currentDay) + 1, total: DAYS.length })}
          </span>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                const currentIndex = DAYS.indexOf(currentDay);
                const prevIndex = (currentIndex - 1 + DAYS.length) % DAYS.length;
                setCurrentDay(DAYS[prevIndex]);
              }}
              className="px-3 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
              aria-label={t('workout_prev_day')}
            >
              ‹
            </button>
            <button
              onClick={() => {
                const currentIndex = DAYS.indexOf(currentDay);
                const nextIndex = (currentIndex + 1) % DAYS.length;
                setCurrentDay(DAYS[nextIndex]);
              }}
              className="px-3 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
              aria-label={t('workout_next_day')}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
