import { useTranslation } from 'react-i18next';
import ExerciseFigure from '../ExerciseFigure';
import ExerciseGif from '../ExerciseGif';
import { getExerciseGifUrl } from '../../utils/exerciseGifHelpers';
import { parseDuration } from '../../hooks/useWorkoutPlan';
import type { DayKey, DayPlan } from '../../hooks/useWorkoutPlan';
import { EXERCISES, calculateExerciseCalories, type EquipmentType } from '../../utils/workoutData';

interface WorkoutDayCardProps {
  day: DayKey;
  plan: DayPlan;
  filter: EquipmentType | 'all';
  filteredExerciseIds: string[];
  userData: { weightKg: number } | null;
  onExerciseChange: (day: DayKey, exerciseId: string) => void;
  onDurationChange: (day: DayKey, duration: string) => void;
  onNoteChange: (day: DayKey, note: string) => void;
}

export default function WorkoutDayCard({
  day,
  plan,
  filter,
  filteredExerciseIds,
  userData,
  onExerciseChange,
  onDurationChange,
  onNoteChange,
}: WorkoutDayCardProps) {
  const { t } = useTranslation();

  const exerciseId = plan.exerciseId;
  const exercise = EXERCISES[exerciseId];
  const isCompatible = filter === 'all' || exercise?.equipment?.includes(filter);
  const gifUrls = getExerciseGifUrl(exerciseId);
  const durationMin = parseDuration(plan.duration);
  const caloriesBurned = userData ? calculateExerciseCalories(exerciseId, userData.weightKg, durationMin) : 0;

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-(--border) bg-(--code-bg)">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-(--text-h)">{t(`days.${day}`)}</h3>
          <p className="text-sm text-(--text)">{t(`workout_activity_${plan.activity}`, { defaultValue: plan.activity })}</p>
          {!isCompatible && (
            <p className="text-xs text-(--accent) mt-1">{t('workout_incompatible_filter')}</p>
          )}
          {userData && (
            <p className="text-xs text-(--accent) font-medium mt-1">
              {t('workout_calories_burned', { defaultValue: '🔥 ~{calories} kcal', calories: caloriesBurned })}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={exerciseId}
              onChange={(e) => onExerciseChange(day, e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent) text-sm"
            >
              {filteredExerciseIds.map(id => (
                <option key={id} value={id}>
                  {t(`workout_${id}`, { defaultValue: id })}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={plan.duration}
            onChange={(e) => onDurationChange(day, e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent) text-sm"
            placeholder={t('workout_duration_placeholder', { defaultValue: '30 min' })}
          />
        </div>
      </div>

      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-(--bg) mb-4">
        {gifUrls ? (
          <ExerciseGif
            exerciseId={exerciseId}
            gifUrl={gifUrls.gif}
            fallbackImageUrl={gifUrls.fallback}
            className="w-full h-full"
            alt={t(`workout_${exerciseId}`, { defaultValue: exerciseId })}
          />
        ) : (
          <ExerciseFigure
            anim={exercise?.anim ?? 'free'}
            className="h-full w-full object-contain"
            useGif={false}
          />
        )}
      </div>

      {plan.exercises && plan.exercises.length > 1 && (
        <div className="mt-2 p-3 rounded-lg border border-(--border)/50 bg-(--bg)/50">
          <p className="text-xs font-medium text-(--text-h) mb-2">{t('workout_exercises_list', { defaultValue: 'Esercizi:' })}</p>
          <ul className="text-sm text-(--text) space-y-1">
            {plan.exercises.map((ex, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{t(`workout_${ex.exerciseId}`, { defaultValue: ex.exerciseId })}</span>
                <span className="text-xs opacity-70">{ex.durationMin} min</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="text-sm text-(--text)">
          <p className="font-medium text-(--text-h) mb-1">{t('workout_description')}</p>
          <p>{t(`workout_${exerciseId}_desc`, { defaultValue: t(`workout_${exerciseId}_instructions`, { defaultValue: t('workout_no_instructions', { defaultValue: 'No instructions available' }) }) })}</p>
          {exercise && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-xs rounded bg-(--accent) text-white">
                {t(`workout_category_${exercise.category}`, { defaultValue: t(`workout_category_${exercise.category}_label`, { defaultValue: exercise.category }) })}
              </span>
              <span className="px-2 py-0.5 text-xs rounded bg-(--code-bg) border border-(--border) text-(--text)">
                {t(`workout_difficulty_${exercise.difficulty}`, { defaultValue: t(`workout_difficulty_${exercise.difficulty}_label`, { defaultValue: exercise.difficulty }) })}
              </span>
              <span className="px-2 py-0.5 text-xs rounded bg-(--code-bg) border border-(--border) text-(--text)">
                {t(`workout_intensity_${exercise.intensity}`, { defaultValue: t(`workout_intensity_${exercise.intensity}_label`, { defaultValue: exercise.intensity }) })}
              </span>
            </div>
          )}
        </div>
        <div className="text-sm text-(--text)">
          <p className="font-medium text-(--text-h) mb-1">{t('workout_steps')}</p>
          <ol className="list-decimal list-inside space-y-1">
            {(() => {
              const steps = t(`workout_${exerciseId}_steps`, { returnObjects: true }) as unknown;
              if (Array.isArray(steps)) {
                return steps.map((step, i) => <li key={i}>{step}</li>);
              }
              return null;
            })()}
          </ol>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-(--text) mb-2">
          {t('workout_note')}
        </label>
        <textarea
          value={plan.note || ''}
          onChange={(e) => onNoteChange(day, e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent) h-20 resize-none"
          placeholder={t('workout_note_placeholder')}
        />
      </div>
    </div>
  );
}