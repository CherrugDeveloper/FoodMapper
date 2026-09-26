import type { ExerciseAnim } from '../components/ExerciseFigure';

export type EquipmentType = 'bodyweight' | 'gym';

export interface ExerciseInfo {
  id: string;
  anim: ExerciseAnim;
  equipment: EquipmentType;
  /** calories per minute for a 70 kg adult (rough estimate) */
  caloriesPerMinute: number;
  intensity: 'low' | 'moderate' | 'high';
}

export interface WorkoutSuggestionProfile {
  moreCardio: boolean;
  moreStrength: boolean;
  lowImpact: boolean;
  reasonKey: string;
}

export const EXERCISES: Record<string, ExerciseInfo> = {
  walk: {
    id: 'walk',
    anim: 'walk',
    equipment: 'bodyweight',
    caloriesPerMinute: 4.5,
    intensity: 'low'
  },
  squat: {
    id: 'squat',
    anim: 'squat',
    equipment: 'bodyweight',
    caloriesPerMinute: 6,
    intensity: 'moderate'
  },
  pushup: {
    id: 'pushup',
    anim: 'pushup',
    equipment: 'bodyweight',
    caloriesPerMinute: 6.5,
    intensity: 'moderate'
  },
  plank: {
    id: 'plank',
    anim: 'plank',
    equipment: 'bodyweight',
    caloriesPerMinute: 3.5,
    intensity: 'low'
  },
  lunge: {
    id: 'lunge',
    anim: 'lunge',
    equipment: 'bodyweight',
    caloriesPerMinute: 6,
    intensity: 'moderate'
  },
  burpees: {
    id: 'burpees',
    anim: 'jump',
    equipment: 'bodyweight',
    caloriesPerMinute: 10,
    intensity: 'high'
  },
  biceps_curl: {
    id: 'biceps_curl',
    anim: 'curl',
    equipment: 'gym',
    caloriesPerMinute: 4,
    intensity: 'low'
  },
  shoulder_press: {
    id: 'shoulder_press',
    anim: 'press',
    equipment: 'gym',
    caloriesPerMinute: 5,
    intensity: 'moderate'
  },
  row: {
    id: 'row',
    anim: 'row',
    equipment: 'gym',
    caloriesPerMinute: 5.5,
    intensity: 'moderate'
  },
  calf_raise: {
    id: 'calf_raise',
    anim: 'calf',
    equipment: 'gym',
    caloriesPerMinute: 4,
    intensity: 'low'
  },
  yoga: {
    id: 'yoga',
    anim: 'twist',
    equipment: 'bodyweight',
    caloriesPerMinute: 3,
    intensity: 'low'
  },
  swim: {
    id: 'swim',
    anim: 'swim',
    equipment: 'gym',
    caloriesPerMinute: 7,
    intensity: 'moderate'
  },
  free: {
    id: 'free',
    anim: 'free',
    equipment: 'bodyweight',
    caloriesPerMinute: 5,
    intensity: 'moderate'
  },
  rest: {
    id: 'rest',
    anim: 'breathe',
    equipment: 'bodyweight',
    caloriesPerMinute: 1,
    intensity: 'low'
  }
};

export const EXERCISE_ORDER: string[] = [
  'walk',
  'squat',
  'pushup',
  'plank',
  'lunge',
  'burpees',
  'biceps_curl',
  'shoulder_press',
  'row',
  'calf_raise',
  'yoga',
  'swim',
  'free',
  'rest'
];
