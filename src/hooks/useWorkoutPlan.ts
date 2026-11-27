import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import {
  EXERCISES,
  EXERCISE_ORDER,
  type EquipmentType,
  type WeeklyWorkoutPlan,
  type PlannedExercise,
  calculateWorkoutCalories,
  buildPersonalizedPlan,
} from '../utils/workoutData';
import { useFitnessIntegration } from '../hooks/useFitnessIntegration';

const STORAGE_KEY = 'foodmapper_workout_v3';
const PLAN_STORAGE_KEY = 'foodmapper_workout_plan_v1';

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

interface WorkoutPlanSettings {
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'health' | 'endurance';
  preferences: ('cardio' | 'strength' | 'yoga' | 'mixed')[];
  equipment: EquipmentType[];
  daysPerWeek: number;
  sessionDurationMin: number;
  intensity: 'low' | 'moderate' | 'high';
  focusAreas: string[];
  compensateCalories: boolean;
}

const DAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const DEFAULT_SETTINGS: WorkoutPlanSettings = {
  activityLevel: 'sedentary',
  goal: 'health',
  preferences: ['mixed'],
  equipment: ['bodyweight'],
  daysPerWeek: 3,
  sessionDurationMin: 30,
  intensity: 'moderate',
  focusAreas: [],
  compensateCalories: false,
};

const DEFAULT_ACTIVITIES: Record<string, string> = {
  walk: 'Camminata',
  run: 'Corsa',
  bike: 'Bicicletta',
  swim: 'Nuoto',
  jump_rope: 'Corda',
  pushup: 'Piegamenti',
  pushup_knee: 'Piegamenti ginocchia',
  pushup_incline: 'Piegamenti inclinati',
  pushup_decline: 'Piegamenti declinati',
  pullup: 'Trazioni',
  chinup: 'Trazioni supine',
  dip: 'Dip',
  bench_press: 'Panca piana',
  dumbbell_bench_press: 'Panca manubri',
  shoulder_press: 'Military press',
  lateral_raise: 'Alzate laterali',
  face_pull: 'Face pull',
  row: 'Rematore',
  biceps_curl: 'Curl bicipiti',
  triceps_extension: 'Estensioni tricipiti',
  squat: 'Squat',
  goblet_squat: 'Goblet squat',
  lunge: 'Affondi',
  reverse_lunge: 'Affondi indietro',
  bulgarian_split_squat: 'Bulgarian split squat',
  deadlift: 'Stacco da terra',
  romanian_deadlift: 'Stacco rumeno',
  hip_thrust: 'Hip thrust',
  glute_bridge: 'Glute bridge',
  calf_raise: 'Calf raise',
  leg_press: 'Leg press',
  plank: 'Plank',
  side_plank: 'Side plank',
  crunch: 'Crunch',
  russian_twist: 'Russian twist',
  leg_raise: 'Leg raise',
  mountain_climber: 'Mountain climber',
  bird_dog: 'Bird dog',
  dead_bug: 'Dead bug',
  hollow_body: 'Hollow body',
  yoga: 'Yoga',
  cat_cow: 'Cat cow',
  child_pose: 'Posizione del bambino',
  downward_dog: 'Cane a testa in giù',
  cobra: 'Cobra',
  pigeon_pose: 'Piccione',
  hip_flexor_stretch: 'Stretching flessori anca',
  thoracic_rotation: 'Rotazione toracica',
  burpees: 'Burpees',
  jumping_jacks: 'Jumping jacks',
  high_knees: 'High knees',
  butt_kickers: 'Butt kickers',
  squat_jump: 'Squat jump',
  hamstring_stretch: 'Stretching femorali',
  quad_stretch: 'Stretching quadricipiti',
  chest_stretch: 'Stretching pettorali',
  shoulder_stretch: 'Stretching spalle',
  triceps_stretch: 'Stretching tricipiti',
  lower_back_stretch: 'Stretching lombari',
  rest: 'Riposo',
  breathe: 'Respirazione',
  free: 'Libero',
};

function getExerciseName(t: (key: string, options?: Record<string, unknown>) => string, exerciseId: string): string {
  return t(`workout_${exerciseId}_name`, { defaultValue: exerciseId });
}

function getExerciseActivity(t: (key: string, options?: Record<string, unknown>) => string, exerciseId: string): string {
  return t(`workout_${exerciseId}_activity`, { defaultValue: getExerciseName(t, exerciseId) });
}

function getDefaultPlan(t?: (key: string, options?: Record<string, unknown>) => string): Record<DayKey, DayPlan> {
  const getActivity = t
    ? (id: string) => t(`workout_${id}_activity`, { defaultValue: DEFAULT_ACTIVITIES[id] })
    : (id: string) => DEFAULT_ACTIVITIES[id];

  return {
    mon: { day: 'mon', exerciseId: 'walk', activity: getActivity('walk'), duration: '30 min' },
    tue: { day: 'tue', exerciseId: 'squat', activity: getActivity('squat'), duration: '25 min' },
    wed: { day: 'wed', exerciseId: 'yoga', activity: getActivity('yoga'), duration: '30 min' },
    thu: { day: 'thu', exerciseId: 'pushup', activity: getActivity('pushup'), duration: '25 min' },
    fri: { day: 'fri', exerciseId: 'plank', activity: getActivity('plank'), duration: '20 min' },
    sat: { day: 'sat', exerciseId: 'swim', activity: getActivity('swim'), duration: '40 min' },
    sun: { day: 'sun', exerciseId: 'rest', activity: getActivity('rest'), duration: '15 min' }
  };
}

function suggestedDuration(exerciseId: string): string {
  const exercise = EXERCISES[exerciseId];
  if (!exercise) return '30 min';
  return exercise.recommendedSetsReps;
}

function parseDuration(durationStr: string): number {
  if (!durationStr) return 30;

  const minMatch = durationStr.match(/(\d+(?:\.\d+)?)\s*min/i);
  if (minMatch) return parseFloat(minMatch[1]);

  const setsRepsMatch = durationStr.match(/(\d+)\s*[x×]\s*(\d+)/i);
  if (setsRepsMatch) return parseInt(setsRepsMatch[1], 10) * 3;

  const secMatch = durationStr.match(/(\d+(?:\.\d+)?)\s*sec/i);
  if (secMatch) return parseFloat(secMatch[1]) / 60;

  const numMatch = durationStr.match(/^(\d+(?:\.\d+)?)$/);
  if (numMatch) return parseFloat(numMatch[1]);

  return 30;
}

function planToDayPlans(
  plan: WeeklyWorkoutPlan,
  t: (key: string, options?: Record<string, unknown>) => string
): Record<DayKey, DayPlan> {
  const newPlan: Record<DayKey, DayPlan> = {} as Record<DayKey, DayPlan>;
  DAYS.forEach(day => {
    const dayWorkout = plan.days[day];
    if (dayWorkout && dayWorkout.exercises.length > 0) {
      const mainEx = dayWorkout.exercises[0];
      newPlan[day] = {
        day,
        exerciseId: mainEx.exerciseId,
        activity: getExerciseActivity(t, mainEx.exerciseId),
        duration: `${mainEx.durationMin} min`,
      };
    } else {
      newPlan[day] = { day, exerciseId: 'rest', activity: getExerciseActivity(t, 'rest'), duration: '15 min' };
    }
  });
  return newPlan;
}

function buildSuggestedPlan(
  suggestion: { moreCardio: boolean; moreStrength: boolean; lowImpact: boolean },
  t: (key: string, options?: Record<string, unknown>) => string
): Record<DayKey, DayPlan> {
  const base = getDefaultPlan(t);

  const pick = (candidates: string[], day: DayKey) => {
    const id = candidates.find(ex => EXERCISES[ex]) ?? 'walk';
    return {
      ...base[day],
      exerciseId: id,
      activity: t(`workout_${id}_activity`, { defaultValue: DEFAULT_ACTIVITIES[id] }),
      duration: suggestedDuration(id)
    };
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

  return plan;
}

interface UseWorkoutPlanOptions {
  onNavigateToDiet?: () => void;
  onNavigateToCalculator?: () => void;
}

interface UseWorkoutPlanReturn {
  // State
  settings: WorkoutPlanSettings;
  filter: EquipmentFilter;
  workoutPlan: Record<DayKey, DayPlan>;
  currentDay: DayKey;
  showSettings: boolean;
  showFitnessApps: boolean;
  generatedPlan: WeeklyWorkoutPlan | null;
  suggestion: {
    moreCardio: boolean;
    moreStrength: boolean;
    lowImpact: boolean;
    reasonKey: string;
  };
  filteredExerciseIds: string[];
  weeklyCaloriesBurned: number;
  // Derived
  dayLabel: (day: DayKey) => string;
  equipmentOptions: { value: EquipmentType; label: string }[];
  // Actions
  setSettings: React.Dispatch<React.SetStateAction<WorkoutPlanSettings>>;
  setFilter: React.Dispatch<React.SetStateAction<EquipmentFilter>>;
  setWorkoutPlan: React.Dispatch<React.SetStateAction<Record<DayKey, DayPlan>>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<DayKey>>;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFitnessApps: React.Dispatch<React.SetStateAction<boolean>>;
  setGeneratedPlan: React.Dispatch<React.SetStateAction<WeeklyWorkoutPlan | null>>;
  handleSettingChange: <K extends keyof WorkoutPlanSettings>(key: K, value: WorkoutPlanSettings[K]) => void;
  handleFilterChange: (nextFilter: EquipmentFilter) => void;
  handleExerciseChange: (day: DayKey, exerciseId: string) => void;
  handleDurationChange: (day: DayKey, duration: string) => void;
  handleNoteChange: (day: DayKey, note: string) => void;
  handleGoToDiet: () => void;
  handleGoToCalculator: () => void;
  generatePersonalizedPlan: () => void;
  generateSuggestedPlan: () => void;
  resetPlan: () => void;
  // Fitness integration
  fitness: ReturnType<typeof useFitnessIntegration>;
  calcResults: NutritionalResults | null;
  userData: UserData | null;
}

export function useWorkoutPlan(options: UseWorkoutPlanOptions = {}): UseWorkoutPlanReturn {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { calcResults, userData } = useAppContext();
  const fitness = useFitnessIntegration();

  const handleGoToDiet = options.onNavigateToDiet ?? (() => navigate('/diet'));
  const handleGoToCalculator = options.onNavigateToCalculator ?? (() => navigate('/calc'));

  // Load settings from localStorage
  const [settings, setSettings] = useState<WorkoutPlanSettings>(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    if (userData) {
      return {
        ...DEFAULT_SETTINGS,
        activityLevel: userData.activityLevel ?? 'sedentary',
        equipment: userData.activityLevel === 'sedentary' ? ['bodyweight'] : ['bodyweight', 'dumbbells'],
      };
    }
    return DEFAULT_SETTINGS;
  });

  // Sync settings with userData
  useEffect(() => {
    if (userData) {
      let mappedGoal: WorkoutPlanSettings['goal'] = 'health';
      if (userData.dietGoal === 'deficit') mappedGoal = 'weight_loss';
      else if (userData.dietGoal === 'surplus') mappedGoal = 'muscle_gain';
      else if (userData.dietGoal === 'maintenance') mappedGoal = 'maintenance';

      setSettings(prev => ({
        ...prev,
        activityLevel: userData.activityLevel ?? prev.activityLevel,
        goal: mappedGoal,
      }));
    }
  }, [userData]);

  // Auto-regenerate workout plan when calcResults or userData update
  const isWorkoutInitialMountRef = useRef(true);
  const [generatedPlan, setGeneratedPlan] = useState<WeeklyWorkoutPlan | null>(null);
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
    return getDefaultPlan(t);
  });

  useEffect(() => {
    if (isWorkoutInitialMountRef.current) {
      isWorkoutInitialMountRef.current = false;
      return;
    }
    if (calcResults && userData) {
      const options = {
        activityLevel: userData.activityLevel ?? settings.activityLevel,
        goal: userData.dietGoal === 'deficit' ? 'weight_loss' : userData.dietGoal === 'surplus' ? 'muscle_gain' : settings.goal,
        preferences: settings.preferences,
        equipment: settings.equipment,
        daysPerWeek: settings.daysPerWeek,
        sessionDurationMin: settings.sessionDurationMin,
        intensity: settings.intensity,
        focusAreas: settings.focusAreas,
      };
      const plan = buildPersonalizedPlan(options, t, userData?.weightKg);
      setGeneratedPlan(plan);
      setWorkoutPlan(() => planToDayPlans(plan, t));
    }
  }, [calcResults, userData, t, settings]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save workout settings:', error);
    }
  }, [settings]);

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

  const [currentDay, setCurrentDay] = useState<DayKey>('mon');
  const [showSettings, setShowSettings] = useState(false);
  const [showFitnessApps, setShowFitnessApps] = useState(false);

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
    return EXERCISE_ORDER.filter(id => EXERCISES[id]?.equipment.includes(filter as EquipmentType));
  }, [filter]);

  // Calculate calories burned for current plan
  const weeklyCaloriesBurned = useMemo(() => {
    if (!userData) return 0;
    const exercises: PlannedExercise[] = DAYS.map(day => ({
      exerciseId: workoutPlan[day].exerciseId,
      durationMin: parseDuration(workoutPlan[day].duration),
      order: DAYS.indexOf(day),
    }));
    return calculateWorkoutCalories(exercises, userData.weightKg);
  }, [workoutPlan, userData]);

  const filterRef = useRef(filter);
  filterRef.current = filter;

  const savePlan = useCallback((nextPlan: Record<DayKey, DayPlan>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan: nextPlan, filter: filterRef.current }));
    } catch (error) {
      console.error('Failed to save workout plan:', error);
    }
  }, []);

  const updatePlan = useCallback((updater: (prev: Record<DayKey, DayPlan>) => Record<DayKey, DayPlan>) => {
    setWorkoutPlan(prev => updater(prev));
  }, []);

  useEffect(() => {
    savePlan(workoutPlan);
  }, [workoutPlan, savePlan]);

  const handleFilterChange = (nextFilter: EquipmentFilter) => {
    setFilter(nextFilter);
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

  const handleSettingChange = <K extends keyof WorkoutPlanSettings>(key: K, value: WorkoutPlanSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const generatePersonalizedPlan = () => {
    const options = {
      activityLevel: settings.activityLevel,
      goal: settings.goal,
      preferences: settings.preferences,
      equipment: settings.equipment,
      daysPerWeek: settings.daysPerWeek,
      sessionDurationMin: settings.sessionDurationMin,
      intensity: settings.intensity,
      focusAreas: settings.focusAreas,
    };

    const plan = buildPersonalizedPlan(options, t, userData?.weightKg);
    setGeneratedPlan(plan);
    updatePlan(() => planToDayPlans(plan, t));
  };

  const generateSuggestedPlan = () => {
    const plan = buildSuggestedPlan(suggestion, t);
    updatePlan(() => plan);
  };

  const resetPlan = () => {
    updatePlan(() => getDefaultPlan(t));
    setGeneratedPlan(null);
  };

  const dayLabel = (day: DayKey): string => t(`days.${day}`);

  const equipmentOptions: { value: EquipmentType; label: string }[] = [
    { value: 'bodyweight', label: t('workout_equip_bodyweight') },
    { value: 'dumbbells', label: t('workout_equip_dumbbells') },
    { value: 'bands', label: t('workout_equip_bands') },
    { value: 'barbell', label: t('workout_equip_barbell') },
    { value: 'kettlebell', label: t('workout_equip_kettlebell') },
    { value: 'pullup_bar', label: t('workout_equip_pullup_bar') },
    { value: 'bench', label: t('workout_equip_bench') },
    { value: 'machine', label: t('workout_equip_machine') },
    { value: 'cardio_machine', label: t('workout_equip_cardio_machine') },
  ];

  return {
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
    dayLabel,
    equipmentOptions,
    setSettings,
    setFilter,
    setWorkoutPlan,
    setCurrentDay,
    setShowSettings,
    setShowFitnessApps,
    setGeneratedPlan,
    handleSettingChange,
    handleFilterChange,
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
  };
}

export type { DayKey, DayPlan, WorkoutPlanSettings, EquipmentFilter };
export { DEFAULT_SETTINGS, DAYS, getDefaultPlan, suggestedDuration, parseDuration, planToDayPlans, buildSuggestedPlan };
