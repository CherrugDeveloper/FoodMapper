import { useEffect } from 'react';

/**
 * Hook per pre-caricare le GIF degli esercizi
 */
export function usePreloadExerciseGifs(exerciseIds: string[], baseUrl?: string) {
  useEffect(() => {
    const BASE = baseUrl || 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif';
    
    exerciseIds.forEach(id => {
      const img = new Image();
      img.src = `${BASE}/${id}.gif`;
    });
  }, [exerciseIds, baseUrl]);
}

/**
 * Mappa di URL GIF per esercizio (da popolare con URL reali)
 * Formato: { exerciseId: { gif: 'url', fallback: 'url' } }
 */
export const EXERCISE_GIF_URLS: Record<string, { gif: string; fallback: string }> = {
  // Cardio
  walk: { 
    gif: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', 
    fallback: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif' 
  },
  run: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  bike: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  swim: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  jump_rope: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Rope' 
  },
  // Forza - Upper Body
  pushup: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  pullup: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  dip: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  bench_press: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Press' 
  },
  shoulder_press: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Press' 
  },
  row: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  biceps_curl: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Curl' 
  },
  triceps_extension: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Extension' 
  },
  lateral_raise: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Raise' 
  },
  // Forza - Lower Body
  squat: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  lunge: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  deadlift: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  hip_thrust: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Thrust' 
  },
  calf_raise: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Raise' 
  },
  leg_press: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Press' 
  },
  bulgarian_split_squat: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Split+Squat' 
  },
  glute_bridge: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Bridge' 
  },
  // Core
  plank: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  side_plank: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Plank' 
  },
  crunch: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  russian_twist: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Twist' 
  },
  leg_raise: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Raise' 
  },
  mountain_climber: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Climber' 
  },
  bird_dog: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Dog' 
  },
  dead_bug: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Bug' 
  },
  // Mobilità / Yoga
  yoga: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  cat_cow: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Cow' 
  },
  child_pose: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Pose' 
  },
  downward_dog: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Dog' 
  },
  cobra: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  pigeon_pose: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Pose' 
  },
  hip_flexor_stretch: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Flexor+Stretch' 
  },
  thoracic_rotation: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Rotation' 
  },
  // HIIT
  burpees: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  jumping_jacks: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Jacks' 
  },
  high_knees: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Knees' 
  },
  butt_kickers: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Kickers' 
  },
  squat_jump: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Jump' 
  },
  // Stretching
  hamstring_stretch: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Stretch' 
  },
  quad_stretch: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Stretch' 
  },
  chest_stretch: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Stretch' 
  },
  shoulder_stretch: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Stretch' 
  },
  triceps_stretch: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Stretch' 
  },
  lower_back_stretch: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif+Back+Stretch' 
  },
  // Rest
  rest: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
  breathe: { 
    gif: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', 
    fallback: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' 
  },
};

/**
 * Funzione helper per ottenere l'URL della GIF per un esercizio
 */
export function getExerciseGifUrl(exerciseId: string): { gif: string; fallback: string } | null {
  return EXERCISE_GIF_URLS[exerciseId] || null;
}
