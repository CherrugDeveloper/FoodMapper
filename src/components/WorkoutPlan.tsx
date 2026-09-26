import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import ExerciseFigure from './ExerciseFigure';
import { EXERCISES, EXERCISE_ORDER } from '../utils/workoutData';
import type { EquipmentType } from '../utils/workoutData';

const STORAGE_KEY = 'foodmapper_workout_v2';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
type EquipmentFilter = 'all' | EquipmentType;

interface DayPlan {
  day: DayKey;
  exerciseId: string;
  activity: string;
  duration: string;
  note?: string;
}

interface SavedPlan {
  plan: Record<DayKey, DayPlan>;
  filter?: EquipmentFilter;
}

const DAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function getExerciseName(t: (key: string, options?: Record<string, unknown>) => string, exerciseId: string): string {
  return t(`workout_${exerciseId}`);
}

function getExerciseActivity(t: (key: string, options?: Record<string, unknown>) => string, exerciseId: string): string {
  return t(`workout_${exerciseId}_activity`, { defaultValue: getExerciseName(t, exerciseId) });
}

function getDefaultPlan(): Record<DayKey, DayPlan> {
  return {
    mon: { day: 'mon', exerciseId: 'walk', activity: 'Camminata', duration: '30 min' },
    tue: { day: 'tue', exerciseId: 'squat', activity: 'Squat', duration: '25 min' },
    wed: { day: 'wed', exerciseId: 'yoga', activity: 'Yoga / Mobilità', duration: '30 min' },
    thu: { day: 'thu', exerciseId: 'pushup', activity: 'Piegamenti', duration: '25 min' },
    fri: { day: 'fri', exerciseId: 'plank', activity: 'Plank', duration: '20 min' },
    sat: { day: 'sat', exerciseId: 'swim', activity: 'Nuoto', duration: '40 min' },
    sun: { day: 'sun', exerciseId: 'rest', activity: 'Riposo', duration: '15 min' }
  };
}

export default function WorkoutPlan() {
  const { t } = useTranslation();
  const { calcResults, userData, setActiveTab } = useAppContext();

  const [filter, setFilter] = useState<EquipmentFilter>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedPlan;
        return parsed.filter ?? 'all';
      }
    } catch {
      // ignore
    }
    return 'all';
  });

  const [workoutPlan, setWorkoutPlan] = useState<Record<DayKey, DayPlan>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedPlan;
        if (parsed.plan && DAYS.every(d => parsed.plan[d])) {
          return parsed.plan;
        }
      }
    } catch {
      // ignore
    }
    return getDefaultPlan();
  });

  const [currentDay, setCurrentDay] = useState<DayKey>('mon');

  const suggestion = useMemo(() => {
    if (!calcResults || !userData) {
      return {
        moreCardio: false,
        moreStrength: false,
        lowImpact: false,
        reasonKey: 'workout_suggestion_no_data'
      };
    }

    const goal = userData.dietGoal ?? 'maintenance';
    const activity = userData.activityLevel ?? 'sedentary';
    const bmi = userData.weightKg / ((userData.heightCm / 100) ** 2);

    if (goal === 'deficit') {
      return {
        moreCardio: true,
        moreStrength: false,
        lowImpact: bmi >= 30 || activity === 'sedentary',
        reasonKey: 'workout_suggestion_deficit'
      };
    }

    if (goal === 'surplus') {
      return {
        moreCardio: false,
        moreStrength: true,
        lowImpact: false,
        reasonKey: 'workout_suggestion_surplus'
      };
    }

    if (activity === 'sedentary') {
      return {
        moreCardio: true,
        moreStrength: false,
        lowImpact: true,
        reasonKey: 'workout_suggestion_sedentary'
      };
    }

    if (activity === 'very_active') {
      return {
        moreCardio: false,
        moreStrength: true,
        lowImpact: false,
        reasonKey: 'workout_suggestion_active'
      };
    }

    return {
      moreCardio: true,
      moreStrength: true,
      lowImpact: false,
      reasonKey: 'workout_suggestion_balanced'
    };
  }, [calcResults, userData]);

  const filteredExerciseIds = useMemo(() => {
    if (filter === 'all') return EXERCISE_ORDER;
    return EXERCISE_ORDER.filter(id => EXERCISES[id]?.equipment === filter);
  }, [filter]);

  const savePlan = (nextPlan: Record<DayKey, DayPlan>, nextFilter: EquipmentFilter = filter) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan: nextPlan, filter: nextFilter }));
    } catch (error) {
      console.error('Failed to save workout plan:', error);
    }
  };

  const updatePlan = (updater: (prev: Record<DayKey, DayPlan>) => Record<DayKey, DayPlan>) => {
    setWorkoutPlan(prev => {
      const next = updater(prev);
      savePlan(next, filter);
      return next;
    });
  };

  const handleFilterChange = (nextFilter: EquipmentFilter) => {
    setFilter(nextFilter);
    savePlan(workoutPlan, nextFilter);
  };

  const handleExerciseChange = (day: DayKey, exerciseId: string) => {
    updatePlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exerciseId,
        activity: getExerciseActivity(t, exerciseId),
        duration: suggestedDuration(exerciseId)
      }
    }));
  };

  const handleDurationChange = (day: DayKey, duration: string) => {
    updatePlan(prev => ({
      ...prev,
      [day]: { ...prev[day], duration }
    }));
  };

  const handleNoteChange = (day: DayKey, note: string) => {
    updatePlan(prev => ({
      ...prev,
      [day]: { ...prev[day], note: note.trim() }
    }));
  };

  const generateSuggestedPlan = () => {
    const plan = buildSuggestedPlan(suggestion);
    updatePlan(() => plan);
  };

  const resetPlan = () => {
    updatePlan(() => getDefaultPlan());
  };

  const handleGoToCalculator = () => {
    setActiveTab('calc');
  };

  const dayLabel = (day: DayKey): string => t(`days.${day}`);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-(--text-h)">{t('workout_title')}</h2>
        <button
          onClick={handleGoToCalculator}
          className="px-4 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
        >
          {t('workout_go_to_calculator')}
        </button>
      </div>

      <div className="p-4 rounded-xl border border-(--border) bg-(--code-bg) mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <label htmlFor="equipment-filter" className="text-sm font-medium text-(--text)">
            {t('workout_filter_label')}
          </label>
          <select
            id="equipment-filter"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as EquipmentFilter)}
            className="px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          >
            <option value="all">{t('workout_filter_all')}</option>
            <option value="bodyweight">{t('workout_filter_bodyweight')}</option>
            <option value="gym">{t('workout_filter_gym')}</option>
          </select>
        </div>

        <div className="text-sm text-(--text) space-y-1">
          <p className="font-medium text-(--text-h)">{t('workout_suggestion_title')}</p>
          <p>{t(suggestion.reasonKey)}</p>
          {calcResults && (
            <p className="text-xs opacity-80">
              {t('workout_suggestion_metrics', {
                kcal: calcResults.targetCaloriesKcal,
                activity: t(`calc_act_${userData?.activityLevel ?? 'sedentary'}` as string)
              })}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={generateSuggestedPlan}
            className="px-4 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
          >
            {t('workout_generate_suggested')}
          </button>
          <button
            onClick={resetPlan}
            className="px-4 py-2 rounded-lg border border-(--border) text-(--text-h) font-medium hover:bg-(--bg) transition"
          >
            {t('workout_reset')}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {DAYS.map(day => {
          const exerciseId = workoutPlan[day].exerciseId;
          const exercise = EXERCISES[exerciseId];
          const isCompatible = filter === 'all' || exercise?.equipment === filter;

          return (
            <div key={day} className="p-5 rounded-xl border border-(--border) bg-(--code-bg)">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-(--text-h)">{dayLabel(day)}</h3>
                  <p className="text-sm text-(--text)">{workoutPlan[day].activity}</p>
                  {!isCompatible && (
                    <p className="text-xs text-(--accent) mt-1">{t('workout_incompatible_filter')}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={exerciseId}
                    onChange={(e) => handleExerciseChange(day, e.target.value)}
                    className="px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                  >
                    {filteredExerciseIds.map(id => (
                      <option key={id} value={id}>
                        {getExerciseName(t, id)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={workoutPlan[day].duration}
                    onChange={(e) => handleDurationChange(day, e.target.value)}
                    className="px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                    placeholder="30 min"
                  />
                </div>
              </div>

              <ExerciseFigure
                anim={exercise?.anim ?? 'free'}
                className="h-48 w-full object-contain"
              />

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-sm text-(--text)">
                  <p className="font-medium text-(--text-h) mb-1">{t('workout_description')}</p>
                  <p>{t(`workout_${exerciseId}_desc`)}</p>
                </div>
                <div className="text-sm text-(--text)">
                  <p className="font-medium text-(--text-h) mb-1">{t('workout_steps')}</p>
                  <ol className="list-decimal list-inside space-y-1">
                    {(t(`workout_${exerciseId}_steps`, { returnObjects: true }) as unknown as string[] | undefined)?.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-(--text) mb-2">
                  {t('workout_note')}
                </label>
                <textarea
                  value={workoutPlan[day].note || ''}
                  onChange={(e) => handleNoteChange(day, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent) h-20 resize-none"
                  placeholder={t('workout_note_placeholder')}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-(--border)">
        <div className="flex justify-between items-center">
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

function suggestedDuration(exerciseId: string): string {
  switch (exerciseId) {
    case 'plank':
      return '3 x 30-60 sec';
    case 'burpees':
      return '4 x 10';
    case 'pushup':
    case 'squat':
    case 'lunge':
      return '3 x 12';
    case 'biceps_curl':
    case 'shoulder_press':
    case 'row':
    case 'calf_raise':
      return '3 x 12-15';
    case 'swim':
      return '30 min';
    case 'rest':
      return '15 min';
    default:
      return '30 min';
  }
}

function buildSuggestedPlan(suggestion: ReturnType<typeof useMemo> & { moreCardio: boolean; moreStrength: boolean; lowImpact: boolean }): Record<DayKey, DayPlan> {
  const base = getDefaultPlan();

  const pick = (candidates: string[], day: DayKey) => {
    const id = candidates.find(ex => EXERCISES[ex]) ?? 'walk';
    return {
      ...base[day],
      exerciseId: id,
      activity: '',
      duration: suggestedDuration(id)
    };
  };

  const setActivity = (plan: Record<DayKey, DayPlan>) => {
    return Object.fromEntries(
      DAYS.map(day => {
        const id = plan[day].exerciseId;
        return [day, { ...plan[day], activity: getExerciseActivityGlobal(id) }];
      })
    ) as Record<DayKey, DayPlan>;
  };

  let plan: Record<DayKey, DayPlan>;

  if (suggestion.lowImpact) {
    plan = {
      mon: pick(['walk', 'swim'], 'mon'),
      tue: pick(['yoga', 'plank'], 'tue'),
      wed: pick(['walk', 'free'], 'wed'),
      thu: pick(['yoga', 'plank'], 'thu'),
      fri: pick(['walk', 'swim'], 'fri'),
      sat: pick(['free', 'swim'], 'sat'),
      sun: pick(['rest', 'breathe'], 'sun')
    };
  } else if (suggestion.moreStrength && !suggestion.moreCardio) {
    plan = {
      mon: pick(['squat', 'lunge'], 'mon'),
      tue: pick(['pushup', 'row'], 'tue'),
      wed: pick(['biceps_curl', 'shoulder_press'], 'wed'),
      thu: pick(['squat', 'calf_raise'], 'thu'),
      fri: pick(['pushup', 'row'], 'fri'),
      sat: pick(['free', 'swim'], 'sat'),
      sun: pick(['rest', 'yoga'], 'sun')
    };
  } else if (suggestion.moreCardio && !suggestion.moreStrength) {
    plan = {
      mon: pick(['walk', 'swim'], 'mon'),
      tue: pick(['burpees', 'free'], 'tue'),
      wed: pick(['walk', 'swim'], 'wed'),
      thu: pick(['free', 'burpees'], 'thu'),
      fri: pick(['walk', 'swim'], 'fri'),
      sat: pick(['free', 'swim'], 'sat'),
      sun: pick(['rest', 'yoga'], 'sun')
    };
  } else {
    plan = {
      mon: pick(['walk', 'swim'], 'mon'),
      tue: pick(['squat', 'lunge'], 'tue'),
      wed: pick(['yoga', 'plank'], 'wed'),
      thu: pick(['pushup', 'row'], 'thu'),
      fri: pick(['biceps_curl', 'shoulder_press'], 'fri'),
      sat: pick(['free', 'swim'], 'sat'),
      sun: pick(['rest', 'yoga'], 'sun')
    };
  }

  return setActivity(plan);
}

// Fallback static labels used during plan building before i18n context is available.
// In the UI the translated value is always used.
function getExerciseActivityGlobal(exerciseId: string): string {
  const labels: Record<string, string> = {
    walk: 'Camminata',
    squat: 'Squat',
    pushup: 'Piegamenti',
    plank: 'Plank',
    lunge: 'Affondi',
    burpees: 'Burpees',
    biceps_curl: 'Curl bicipiti',
    shoulder_press: 'Shoulder press',
    row: 'Rematore',
    calf_raise: 'Calf raise',
    yoga: 'Yoga / Mobilità',
    swim: 'Nuoto',
    free: 'Allenamento libero',
    rest: 'Riposo'
  };
  return labels[exerciseId] ?? exerciseId;
}
