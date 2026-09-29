import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import ExerciseFigure from './ExerciseFigure';
import ExerciseGif from './ExerciseGif';
import { getExerciseGifUrl } from '../utils/exerciseGifHelpers';
import InfoPopup from './InfoPopup';
import { FitnessConnectionButton, useFitnessIntegration, type FitnessProvider } from '../hooks/useFitnessIntegration';
import {
  EXERCISES,
  EXERCISE_ORDER,
  type EquipmentType,
  type ExerciseCategory,
  type DifficultyLevel,
  type WorkoutPlanInput,
  type WeeklyWorkoutPlan,
  type DayWorkout,
  type PlannedExercise,
  calculateExerciseCalories,
  calculateWorkoutCalories,
} from '../utils/workoutData';

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

function getExerciseName(t: (key: string, options?: Record<string, unknown>) => string, exerciseId: string): string {
  return t(`workout_${exerciseId}_name`, { defaultValue: exerciseId });
}

function getExerciseActivity(t: (key: string, options?: Record<string, unknown>) => string, exerciseId: string): string {
  return t(`workout_${exerciseId}_activity`, { defaultValue: getExerciseName(t, exerciseId) });
}

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
  const match = durationStr.match(/(\d+)\s*min/);
  if (match) return parseInt(match[1], 10);
  const setsRepsMatch = durationStr.match(/(\d+)\s*x\s*(\d+)/);
  if (setsRepsMatch) return parseInt(setsRepsMatch[1], 10) * 3; // ~3 min per serie
  const secMatch = durationStr.match(/(\d+)\s*sec/);
  if (secMatch) return parseInt(secMatch[1], 10) / 60;
  return 30;
}

export default function WorkoutPlan() {
  const { t } = useTranslation();
  const { calcResults, userData, setActiveTab } = useAppContext();
  const fitness = useFitnessIntegration();

  const handleGoToDiet = () => setActiveTab('diet');
  const handleGoToCalculator = () => setActiveTab('calc');

  // Load settings from localStorage
  const [settings, setSettings] = useState<WorkoutPlanSettings>(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    // Initialize from userData if available
    if (userData) {
      return {
        ...DEFAULT_SETTINGS,
        activityLevel: userData.activityLevel ?? 'sedentary',
        equipment: userData.activityLevel === 'sedentary' ? ['bodyweight'] : ['bodyweight', 'dumbbells'],
      };
    }
    return DEFAULT_SETTINGS;
  });

  // Sync settings with userData when it changes
  useEffect(() => {
    if (userData) {
      setSettings(prev => ({
        ...prev,
        activityLevel: userData.activityLevel ?? prev.activityLevel,
      }));
    }
  }, [userData]);

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

  const [currentDay, setCurrentDay] = useState<DayKey>('mon');
  const [showSettings, setShowSettings] = useState(false);
  const [showFitnessApps, setShowFitnessApps] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<WeeklyWorkoutPlan | null>(null);

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


  const savePlan = useCallback((nextPlan: Record<DayKey, DayPlan>, nextFilter: EquipmentFilter = filter) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan: nextPlan, filter: nextFilter }));
    } catch (error) {
      console.error('Failed to save workout plan:', error);
    }
  }, [filter]);

  const updatePlan = useCallback((updater: (prev: Record<DayKey, DayPlan>) => Record<DayKey, DayPlan>) => {
    setWorkoutPlan(prev => {
      const next = updater(prev);
      savePlan(next, filter);
      return next;
    });
  }, [filter, savePlan]);

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

  const handleSettingChange = <K extends keyof WorkoutPlanSettings>(key: K, value: WorkoutPlanSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // ============================================
  // GENERAZIONE PIANO PERSONALIZZATO AVANZATA
  // ============================================
  const buildPersonalizedPlan = useCallback((
    input: WorkoutPlanInput,
    tFn: (key: string, options?: Record<string, unknown>) => string
  ): WeeklyWorkoutPlan => {
    const { activityLevel, goal, equipment, daysPerWeek, sessionDurationMin, focusAreas = [] } = input;
    
    // Filtra esercizi per attrezzatura disponibile
    const availableExercises = Object.values(EXERCISES).filter(ex => 
      ex.equipment.some(eq => equipment.includes(eq))
    );
    
    // Filtra per difficoltà in base al livello attività
    let maxDifficulty: DifficultyLevel = 'beginner';
    if (activityLevel === 'moderately_active' || activityLevel === 'very_active') maxDifficulty = 'intermediate';
    if (activityLevel === 'extremely_active') maxDifficulty = 'advanced';
    
    const difficultyOrder: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
    const allowedDifficulties = difficultyOrder.slice(0, difficultyOrder.indexOf(maxDifficulty) + 1);
    
    const suitableExercises = availableExercises.filter(ex => allowedDifficulties.includes(ex.difficulty));
    
    // Raggruppa per categoria
    const byCategory: Record<ExerciseCategory, typeof suitableExercises> = {
      cardio: [],
      strength_upper: [],
      strength_lower: [],
      strength_core: [],
      mobility: [],
      yoga: [],
      hiit: [],
      stretching: [],
      rest: [],
    };
    
    suitableExercises.forEach(ex => {
      byCategory[ex.category].push(ex);
    });
    
    // Seleziona esercizi per giorno
    const planDays: DayWorkout[] = [];
    let totalWeeklyCalories = 0;
    
    const dayNames: DayKey[] = DAYS.slice(0, daysPerWeek);
    const restDays = DAYS.slice(daysPerWeek);
    
    dayNames.forEach((day, dayIndex) => {
      let dayExercises: PlannedExercise[];
      let dayFocus: string;
      let dayCalories = 0;
      
      // Logica distribuzione settimanale basata su livello attività
      if (activityLevel === 'sedentary') {
        // Sedentario: 3 giorni - mobilità + cardio leggero + core
        if (dayIndex === 0) { // Cardio leggero
          const ex = byCategory.cardio.find(e => e.intensity === 'low') || byCategory.cardio[0] || EXERCISES.walk;
          dayExercises = [{ exerciseId: ex.id, durationMin: sessionDurationMin, order: 0 }];
          dayFocus = tFn('workout_focus_cardio_light');
        } else if (dayIndex === 1) { // Mobilità/Yoga
          const ex = byCategory.mobility[0] || byCategory.yoga[0] || EXERCISES.yoga;
          dayExercises = [{ exerciseId: ex.id, durationMin: sessionDurationMin, order: 0 }];
          dayFocus = tFn('workout_focus_mobility');
        } else { // Core + stretching
          const ex = byCategory.strength_core[0] || EXERCISES.plank;
          dayExercises = [{ exerciseId: ex.id, durationMin: Math.min(sessionDurationMin, 20), order: 0 }];
          const stretchEx = byCategory.stretching[0] || EXERCISES.hamstring_stretch;
          dayExercises.push({ exerciseId: stretchEx.id, durationMin: 10, order: 1 });
          dayFocus = tFn('workout_focus_core_stretch');
        }
      } else if (activityLevel === 'lightly_active') {
        // Leggero: 3-4 giorni - mix cardio/forza
        if (dayIndex % 2 === 0) { // Cardio
          const ex = byCategory.cardio.find(e => e.intensity !== 'very_high') || byCategory.cardio[0] || EXERCISES.walk;
          dayExercises = [{ exerciseId: ex.id, durationMin: sessionDurationMin, order: 0 }];
          dayFocus = tFn('workout_focus_cardio');
        } else { // Forza full body
          const upper = byCategory.strength_upper[0] || EXERCISES.pushup;
          const lower = byCategory.strength_lower[0] || EXERCISES.squat;
          dayExercises = [
            { exerciseId: upper.id, durationMin: Math.floor(sessionDurationMin / 2), order: 0 },
            { exerciseId: lower.id, durationMin: Math.floor(sessionDurationMin / 2), order: 1 },
          ];
          dayFocus = tFn('workout_focus_strength_fullbody');
        }
      } else if (activityLevel === 'moderately_active') {
        // Moderato: 4 giorni - split upper/lower
        const isUpper = dayIndex % 2 === 0;
        if (isUpper) {
          const push = byCategory.strength_upper.find(e => e.targetMuscles.some(m => m.includes('chest') || m.includes('push'))) || byCategory.strength_upper[0] || EXERCISES.pushup;
          const pull = byCategory.strength_upper.find(e => e.targetMuscles.some(m => m.includes('back') || m.includes('pull'))) || byCategory.strength_upper[1] || EXERCISES.row;
          const shoulder = byCategory.strength_upper.find(e => e.targetMuscles.some(m => m.includes('shoulder'))) || EXERCISES.shoulder_press;
          dayExercises = [
            { exerciseId: push.id, durationMin: Math.floor(sessionDurationMin / 3), order: 0 },
            { exerciseId: pull.id, durationMin: Math.floor(sessionDurationMin / 3), order: 1 },
            { exerciseId: shoulder.id, durationMin: Math.floor(sessionDurationMin / 3), order: 2 },
          ];
          dayFocus = tFn('workout_focus_upper_body');
        } else {
          const squat = byCategory.strength_lower.find(e => e.targetMuscles.some(m => m.includes('quads'))) || byCategory.strength_lower[0] || EXERCISES.squat;
          const hinge = byCategory.strength_lower.find(e => e.targetMuscles.some(m => m.includes('hamstrings') || m.includes('glutes'))) || EXERCISES.romanian_deadlift;
          const core = byCategory.strength_core[0] || EXERCISES.plank;
          dayExercises = [
            { exerciseId: squat.id, durationMin: Math.floor(sessionDurationMin / 3), order: 0 },
            { exerciseId: hinge.id, durationMin: Math.floor(sessionDurationMin / 3), order: 1 },
            { exerciseId: core.id, durationMin: Math.floor(sessionDurationMin / 3), order: 2 },
          ];
          dayFocus = tFn('workout_focus_lower_body');
        }
      } else if (activityLevel === 'very_active') {
        // Attivo: 5 giorni - split specifico + HIIT
        const splitType = dayIndex % 3;
        if (splitType === 0) { // Push
          const exercises = byCategory.strength_upper.filter(e => 
            e.targetMuscles.some(m => m.includes('chest') || m.includes('shoulder') || m.includes('triceps'))
          ).slice(0, 3);
          dayExercises = exercises.map((ex, i) => ({ exerciseId: ex.id, durationMin: Math.floor(sessionDurationMin / exercises.length), order: i }));
          dayFocus = tFn('workout_focus_push');
        } else if (splitType === 1) { // Pull
          const exercises = byCategory.strength_upper.filter(e => 
            e.targetMuscles.some(m => m.includes('back') || m.includes('biceps') || m.includes('rear_delts'))
          ).slice(0, 3);
          dayExercises = exercises.map((ex, i) => ({ exerciseId: ex.id, durationMin: Math.floor(sessionDurationMin / exercises.length), order: i }));
          dayFocus = tFn('workout_focus_pull');
        } else { // Legs + HIIT
          const legEx = byCategory.strength_lower.slice(0, 2);
          const hiitEx = byCategory.hiit[0] || EXERCISES.burpees;
          dayExercises = [
            ...legEx.map((ex, i) => ({ exerciseId: ex.id, durationMin: Math.floor(sessionDurationMin * 0.6 / legEx.length), order: i })),
            { exerciseId: hiitEx.id, durationMin: Math.floor(sessionDurationMin * 0.4), order: legEx.length },
          ];
          dayFocus = tFn('workout_focus_legs_hiit');
        }
      } else { // extremely_active
        // Molto attivo: 5-6 giorni - periodizzazione
        const phases = ['strength', 'hypertrophy', 'power', 'endurance', 'recovery'];
        const phase = phases[dayIndex % phases.length];
        
        if (phase === 'recovery') {
          const ex = byCategory.mobility[0] || byCategory.yoga[0] || EXERCISES.yoga;
          dayExercises = [{ exerciseId: ex.id, durationMin: sessionDurationMin, order: 0 }];
          dayFocus = tFn('workout_focus_recovery');
        } else if (phase === 'endurance') {
          const ex = byCategory.cardio.find(e => e.intensity === 'high') || byCategory.hiit[0] || EXERCISES.run;
          dayExercises = [{ exerciseId: ex.id, durationMin: sessionDurationMin, order: 0 }];
          dayFocus = tFn('workout_focus_endurance');
        } else {
          // Strength/Hypertrophy/Power - full body compound
          const compound = [
            byCategory.strength_lower.find(e => e.id === 'squat' || e.id === 'deadlift') || EXERCISES.squat,
            byCategory.strength_upper.find(e => e.id === 'bench_press' || e.id === 'pullup') || EXERCISES.pushup,
            byCategory.strength_core[0] || EXERCISES.plank,
          ];
          dayExercises = compound.map((ex, i) => ({ exerciseId: ex.id, durationMin: Math.floor(sessionDurationMin / compound.length), order: i }));
          dayFocus = tFn(`workout_focus_${phase}`);
        }
      }
      
      // Applica focus areas se specificati
      if (focusAreas.length > 0 && dayExercises.length > 0) {
        const focusExercises = suitableExercises.filter(ex => 
          focusAreas.some(fa => 
            ex.targetMuscles.some(m => m.toLowerCase().includes(fa.toLowerCase())) ||
            ex.secondaryMuscles?.some(m => m.toLowerCase().includes(fa.toLowerCase()))
          )
        );
        if (focusExercises.length > 0) {
          // Sostituisci primo esercizio con uno focalizzato
          dayExercises[0] = { ...dayExercises[0], exerciseId: focusExercises[0].id };
        }
      }
      
      // Calcola calorie per questo giorno
      if (userData) {
        dayCalories = calculateWorkoutCalories(dayExercises, userData.weightKg);
        totalWeeklyCalories += dayCalories;
      }
      
      const totalDuration = dayExercises.reduce((sum, ex) => sum + (ex.durationMin || 0), 0);
      
      planDays.push({
        day,
        exercises: dayExercises,
        totalDurationMin: totalDuration,
        estimatedCaloriesBurned: dayCalories,
        focus: dayFocus,
      });
    });
    
    // Aggiungi giorni di riposo
    restDays.forEach(day => {
      planDays.push({
        day,
        exercises: [{ exerciseId: 'rest', durationMin: 15, order: 0 }],
        totalDurationMin: 15,
        estimatedCaloriesBurned: userData ? calculateExerciseCalories('rest', userData.weightKg, 15) : 0,
        focus: tFn('workout_focus_rest'),
      });
    });
    
    return {
      days: Object.fromEntries(planDays.map(d => [d.day, d])),
      totalSessionsPerWeek: daysPerWeek,
      estimatedWeeklyCaloriesBurned: totalWeeklyCalories,
      notes: tFn('workout_plan_generated_note', { 
        defaultValue: `Piano generato per ${activityLevel}, obiettivo ${goal}, ${daysPerWeek} giorni/settimana` 
      }),
    };
  }, [userData]);

  const generatePersonalizedPlan = () => {
    const input: WorkoutPlanInput = {
      activityLevel: settings.activityLevel,
      goal: settings.goal,
      preferences: settings.preferences,
      equipment: settings.equipment,
      daysPerWeek: settings.daysPerWeek,
      sessionDurationMin: settings.sessionDurationMin,
      intensity: settings.intensity,
      focusAreas: settings.focusAreas,
    };
    
    const plan = buildPersonalizedPlan(input, t);
    setGeneratedPlan(plan);
    
    // Converti in formato DayPlan per il state corrente
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
    
    updatePlan(() => newPlan);
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

  // Equipment options per select
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
        <div className="p-4 rounded-xl border border-(--border) bg-(--code-bg) mb-6 space-y-4 animate-slide-down">
          <h3 className="font-semibold text-(--text-h)">{t('workout_plan_settings')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_activity_level')}</label>
              <select
                value={settings.activityLevel}
                onChange={(e) => handleSettingChange('activityLevel', e.target.value as WorkoutPlanSettings['activityLevel'])}
                className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
              >
                <option value="sedentary">{t('workout_activity_sedentary')}</option>
                <option value="lightly_active">{t('workout_activity_light')}</option>
                <option value="moderately_active">{t('workout_activity_moderate')}</option>
                <option value="very_active">{t('workout_activity_very')}</option>
                <option value="extremely_active">{t('workout_activity_extreme')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_goal')}</label>
              <select
                value={settings.goal}
                onChange={(e) => handleSettingChange('goal', e.target.value as WorkoutPlanSettings['goal'])}
                className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
              >
                <option value="weight_loss">{t('workout_goal_weight_loss')}</option>
                <option value="muscle_gain">{t('workout_goal_muscle_gain')}</option>
                <option value="maintenance">{t('workout_goal_maintenance')}</option>
                <option value="health">{t('workout_goal_health')}</option>
                <option value="endurance">{t('workout_goal_endurance')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_days_per_week')}</label>
              <select
                value={settings.daysPerWeek}
                onChange={(e) => handleSettingChange('daysPerWeek', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
              >
                {[3,4,5,6].map(d => <option key={d} value={d}>{d} {t('workout_days')}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_session_duration')}</label>
              <select
                value={settings.sessionDurationMin}
                onChange={(e) => handleSettingChange('sessionDurationMin', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
              >
                {[20,30,40,45,60].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_intensity')}</label>
              <select
                value={settings.intensity}
                onChange={(e) => handleSettingChange('intensity', e.target.value as WorkoutPlanSettings['intensity'])}
                className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
              >
                <option value="low">{t('workout_intensity_low')}</option>
                <option value="moderate">{t('workout_intensity_moderate')}</option>
                <option value="high">{t('workout_intensity_high')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_preferences')}</label>
              <div className="flex flex-wrap gap-2">
                {['cardio', 'strength', 'yoga', 'mixed'].map(pref => (
                  <label key={pref} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.preferences.includes(pref as WorkoutPlanSettings['preferences'][0])}
                      onChange={(e) => handleSettingChange('preferences',
                        e.target.checked
                          ? [...settings.preferences, pref as 'cardio' | 'strength' | 'yoga' | 'mixed']
                          : settings.preferences.filter(p => p !== pref)
                      )}
                      className="rounded border-(--border) text-(--accent) focus:ring-(--accent)"
                    />
                    <span className="text-sm text-(--text)">{t(`workout_pref_${pref}`)}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_equipment_available')}</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {equipmentOptions.map(opt => (
                  <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.equipment.includes(opt.value)}
                      onChange={(e) => handleSettingChange('equipment',
                        e.target.checked
                          ? [...settings.equipment, opt.value]
                          : settings.equipment.filter(e => e !== opt.value)
                      )}
                      className="rounded border-(--border) text-(--accent) focus:ring-(--accent)"
                    />
                    <span className="text-sm text-(--text)">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_focus_areas')}</label>
              <div className="flex flex-wrap gap-2">
                {['core', 'glutes', 'upper_body', 'legs', 'cardio', 'mobility'].map(area => (
                  <label key={area} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.focusAreas.includes(area)}
                      onChange={(e) => handleSettingChange('focusAreas',
                        e.target.checked
                          ? [...settings.focusAreas, area]
                          : settings.focusAreas.filter(f => f !== area)
                      )}
                      className="rounded border-(--border) text-(--accent) focus:ring-(--accent)"
                    />
                    <span className="text-sm text-(--text)">{t(`workout_focus_${area}`)}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.compensateCalories}
                  onChange={(e) => handleSettingChange('compensateCalories', e.target.checked)}
                  className="rounded border-(--border) text-(--accent) focus:ring-(--accent)"
                />
                <span className="text-sm text-(--text)">{t('workout_compensate_calories')}</span>
                <InfoPopup infoKey="workout_compensate_calories" className="ml-1" />
              </label>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-(--border)">
            <button
              onClick={generatePersonalizedPlan}
              className="px-4 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
            >
              {t('workout_generate_personalized')}
            </button>
            <button
              onClick={generateSuggestedPlan}
              className="px-4 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) font-medium hover:border-(--accent) hover:text-(--accent) transition"
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
      )}

      {/* Fitness App Integration Panel */}
      <div className="mb-6">
        <button
          onClick={() => setShowFitnessApps(!showFitnessApps)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) font-medium hover:border-(--accent) hover:text-(--accent) transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
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

      {/* Current Plan Display */}
      <div className="p-4 rounded-xl border border-(--border) bg-(--code-bg) mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <label htmlFor="equipment-filter" className="text-sm font-medium text-(--text)">
            {t('workout_filter_label')}
            <InfoPopup infoKey="workout_equipment_filter" className="ml-1.5 align-middle" />
          </label>
          <select
            id="equipment-filter"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as EquipmentFilter)}
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

      {/* Weekly Plan */}
      <div className="space-y-6">
        {DAYS.map(day => {
          const exerciseId = workoutPlan[day].exerciseId;
          const exercise = EXERCISES[exerciseId];
          const isCompatible = filter === 'all' || exercise?.equipment.includes(filter);
          const gifUrls = getExerciseGifUrl(exerciseId);
          const durationMin = parseDuration(workoutPlan[day].duration);
          const caloriesBurned = userData ? calculateExerciseCalories(exerciseId, userData.weightKg, durationMin) : 0;

          return (
            <div key={day} className="p-4 sm:p-5 rounded-xl border border-(--border) bg-(--code-bg)">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-(--text-h)">{dayLabel(day)}</h3>
                  <p className="text-sm text-(--text)">{workoutPlan[day].activity}</p>
                  {!isCompatible && (
                    <p className="text-xs text-(--accent) mt-1">{t('workout_incompatible_filter')}</p>
                  )}
                  {userData && (
                    <p className="text-xs text-(--accent) font-medium mt-1">
                      🔥 ~{caloriesBurned} kcal
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={exerciseId}
                      onChange={(e) => handleExerciseChange(day, e.target.value)}
                      className="w-full sm:w-auto px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent) text-sm"
                    >
                    {filteredExerciseIds.map(id => (
                      <option key={id} value={id}>
                        {getExerciseName(t, id)}
                      </option>
                    ))}
                    </select>
                    <InfoPopup infoKey="workout_exercise_selector" />
                  </div>
                  <input
                    type="text"
                    value={workoutPlan[day].duration}
                    onChange={(e) => handleDurationChange(day, e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent) text-sm"
                    placeholder="30 min"
                  />
                </div>
              </div>

              {/* Exercise GIF / Figure */}
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-(--bg) mb-4">
                {gifUrls ? (
                  <ExerciseGif
                    exerciseId={exerciseId}
                    gifUrl={gifUrls.gif}
                    fallbackImageUrl={gifUrls.fallback}
                    className="w-full h-full"
                    alt={getExerciseName(t, exerciseId)}
                  />
                ) : (
                  <ExerciseFigure
                    anim={exercise?.anim ?? 'free'}
                    className="h-full w-full object-contain"
                    useGif={false}
                  />
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-sm text-(--text)">
                  <p className="font-medium text-(--text-h) mb-1">{t('workout_description')}</p>
                  <p>{t(`workout_${exerciseId}_desc`, { defaultValue: t(`workout_${exerciseId}_instructions`) })}</p>
                  {exercise && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 text-xs rounded bg-(--accent) text-white">
                        {t(`workout_category_${exercise.category}`)}
                      </span>
                      <span className="px-2 py-0.5 text-xs rounded bg-(--code-bg) border border-(--border) text-(--text)">
                        {t(`workout_difficulty_${exercise.difficulty}`)}
                      </span>
                      <span className="px-2 py-0.5 text-xs rounded bg-(--code-bg) border border-(--border) text-(--text)">
                        {t(`workout_intensity_${exercise.intensity}`)}
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

      {/* Generated Plan Summary */}
      {generatedPlan && (
        <div className="mt-8 p-4 rounded-xl border border-(--accent) bg-(--accent)/5">
          <h3 className="font-semibold text-(--text-h) mb-2">{t('workout_generated_plan_summary')}</h3>
          <p className="text-sm text-(--text) mb-2">{generatedPlan.notes}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="p-2 bg-(--bg) rounded">
              <span className="text-(--text)">{t('workout_sessions_per_week')}</span>
              <div className="font-bold text-(--accent)">{generatedPlan.totalSessionsPerWeek}</div>
            </div>
            <div className="p-2 bg-(--bg) rounded">
              <span className="text-(--text)">{t('workout_est_weekly_calories')}</span>
              <div className="font-bold text-(--accent)">{generatedPlan.estimatedWeeklyCaloriesBurned} kcal</div>
            </div>
            <div className="p-2 bg-(--bg) rounded">
              <span className="text-(--text)">{t('workout_avg_daily_calories')}</span>
              <div className="font-bold text-(--accent)">{Math.round(generatedPlan.estimatedWeeklyCaloriesBurned / 7)} kcal</div>
            </div>
            <div className="p-2 bg-(--bg) rounded">
              <span className="text-(--text)">{t('workout_plan_intensity')}</span>
              <div className="font-bold text-(--accent)">{t(`workout_intensity_${settings.intensity}`)}</div>
            </div>
          </div>
        </div>
      )}

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

// ============================================
// LEGACY buildSuggestedPlan (per compatibilità)
// ============================================
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
