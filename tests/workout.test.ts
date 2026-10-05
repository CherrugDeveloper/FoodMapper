import { describe, it, expect, vi } from 'vitest';
import {
  EXERCISES,
  EXERCISE_ORDER,
  calculateExerciseCalories,
  calculateWorkoutCalories,
  getExercisesByCategory,
  getExercisesByEquipment,
  getExercisesByDifficulty,
} from '../src/utils/workoutData';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));

describe('Workout Data & Calculations', () => {
  it('should have at least 50 exercises in database', () => {
    const exerciseCount = Object.keys(EXERCISES).length;
    expect(exerciseCount).toBeGreaterThanOrEqual(50);
  });

  it('should have all exercises defined with required properties', () => {
    Object.values(EXERCISES).forEach(exercise => {
      expect(exercise.id).toBeDefined();
      expect(exercise.name).toBeDefined();
      expect(exercise.category).toBeDefined();
      expect(exercise.equipment).toBeDefined();
      expect(Array.isArray(exercise.equipment)).toBe(true);
      expect(exercise.equipment.length).toBeGreaterThan(0);
      expect(exercise.met).toBeGreaterThan(0);
      expect(exercise.caloriesPerMinute).toBeGreaterThan(0);
      expect(exercise.intensity).toBeDefined();
      expect(exercise.difficulty).toBeDefined();
      expect(exercise.targetMuscles).toBeDefined();
      expect(Array.isArray(exercise.targetMuscles)).toBe(true);
      expect(exercise.instructions).toBeDefined();
      expect(exercise.steps).toBeDefined();
      expect(Array.isArray(exercise.steps)).toBe(true);
      expect(exercise.recommendedDurationMin).toBeGreaterThan(0);
      expect(exercise.recommendedSetsReps).toBeDefined();
    });
  });

  it('should calculate exercise calories correctly based on MET', () => {
    // walk: MET 3.5, 70kg, 30 min -> 3.5 * 70 * (30/60) = 122.5 -> 123 kcal
    const walkCalories = calculateExerciseCalories('walk', 70, 30);
    expect(walkCalories).toBe(123);

    // burpees: MET 10.0, 70kg, 10 min -> 10.0 * 70 * (10/60) = 116.67 -> 117 kcal
    const burpeesCalories = calculateExerciseCalories('burpees', 70, 10);
    expect(burpeesCalories).toBe(117);

    // return 0 for unknown exercise
    const unknownCalories = calculateExerciseCalories('unknown_exercise', 70, 30);
    expect(unknownCalories).toBe(0);
  });

  it('should calculate total workout calories correctly', () => {
    const plannedExercises = [
      { exerciseId: 'walk', durationMin: 30, order: 0 },
      { exerciseId: 'pushup', durationMin: 15, order: 1 },
      { exerciseId: 'squat', durationMin: 20, order: 2 },
    ];
    // walk: 3.5 * 70 * 0.5 = 122.5 -> 123
    // pushup: 3.8 * 70 * 0.25 = 66.5 -> 67
    // squat: 5.0 * 70 * (20/60) = 116.67 -> 117
    // Total = 123 + 67 + 117 = 307
    const total = calculateWorkoutCalories(plannedExercises, 70);
    expect(total).toBe(307);
  });

  it('should filter exercises by category', () => {
    const cardioExercises = getExercisesByCategory('cardio');
    expect(cardioExercises.length).toBeGreaterThan(0);
    cardioExercises.forEach(ex => expect(ex.category).toBe('cardio'));

    const strengthUpper = getExercisesByCategory('strength_upper');
    expect(strengthUpper.length).toBeGreaterThan(0);
    strengthUpper.forEach(ex => expect(ex.category).toBe('strength_upper'));

    const mobility = getExercisesByCategory('mobility');
    expect(mobility.length).toBeGreaterThan(0);
    mobility.forEach(ex => expect(ex.category).toBe('mobility'));
  });

  it('should filter exercises by equipment', () => {
    const bodyweight = getExercisesByEquipment('bodyweight');
    expect(bodyweight.length).toBeGreaterThan(0);
    bodyweight.forEach(ex => expect(ex.equipment).toContain('bodyweight'));

    const dumbbells = getExercisesByEquipment('dumbbells');
    expect(dumbbells.length).toBeGreaterThan(0);
    dumbbells.forEach(ex => expect(ex.equipment).toContain('dumbbells'));
  });

  it('should filter exercises by difficulty', () => {
    const beginners = getExercisesByDifficulty('beginner');
    expect(beginners.length).toBeGreaterThan(0);
    beginners.forEach(ex => expect(ex.difficulty).toBe('beginner'));

    const intermediate = getExercisesByDifficulty('intermediate');
    expect(intermediate.length).toBeGreaterThan(0);
    intermediate.forEach(ex => expect(ex.difficulty).toBe('intermediate'));

    const advanced = getExercisesByDifficulty('advanced');
    expect(advanced.length).toBeGreaterThan(0);
    advanced.forEach(ex => expect(ex.difficulty).toBe('advanced'));
  });

  it('should have all exercise IDs in EXERCISE_ORDER', () => {
    EXERCISE_ORDER.forEach(id => {
      expect(EXERCISES[id]).toBeDefined();
    });
  });
});
