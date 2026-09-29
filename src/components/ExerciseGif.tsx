import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ExerciseGifProps {
  exerciseId: string;
  gifUrl?: string;
  fallbackImageUrl?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Componente per mostrare GIF animate degli esercizi con lazy loading e fallback.
 * Supporta GIF da URL esterni (GitHub raw, CDN) o asset locali.
 * Fallback a immagine statica se la GIF non è disponibile.
 */
export default function ExerciseGif({
  exerciseId,
  gifUrl,
  fallbackImageUrl,
  alt,
  className = 'max-w-xs sm:max-w-md mx-auto',
  width,
  height,
}: ExerciseGifProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // URL di default per le GIF degli esercizi (placeholder - da sostituire con URL reali)
  const DEFAULT_GIF_BASE = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif';
  const DEFAULT_FALLBACK_BASE = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif';

  useEffect(() => {
    let mounted = true;
    let image: HTMLImageElement | null = null;

    const loadImage = async (src: string, isFallback = false) => {
      if (!mounted) return;
      
      setIsLoading(true);
      image = new Image();
      
      image.onload = () => {
        if (mounted) {
          setImageSrc(src);
          setIsLoading(false);
          setHasError(false);
        }
      };
      
      image.onerror = () => {
        if (mounted) {
          if (!isFallback && fallbackImageUrl) {
            // Prova con l'immagine di fallback personalizzata
            loadImage(fallbackImageUrl, true);
          } else if (!isFallback && !useFallback) {
            // Prova con l'immagine di fallback di default
            const defaultFallback = `${DEFAULT_FALLBACK_BASE}/${exerciseId}.png`;
            setUseFallback(true);
            loadImage(defaultFallback, true);
          } else {
            setHasError(true);
            setIsLoading(false);
          }
        }
      };
      
      image.src = src;
    };

    // Determina quale GIF caricare
    const gifToLoad = gifUrl || `${DEFAULT_GIF_BASE}/${exerciseId}.gif`;
    loadImage(gifToLoad);

    return () => {
      mounted = false;
      if (image) {
        image.onload = null;
        image.onerror = null;
        image.src = '';
      }
    };
  }, [exerciseId, gifUrl, fallbackImageUrl, useFallback]);

  if (isLoading) {
    return (
      <div 
        className={`${className} relative bg-(--code-bg) border border-(--border) rounded-xl overflow-hidden animate-pulse`}
        style={{ width, height: height || 200, minHeight: 150 }}
        aria-label="Caricamento animazione esercizio..."
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-(--text) opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    );
  }

  if (hasError) {
    const { t } = useTranslation();
    return (
      <div
        className={`${className} relative bg-(--code-bg) border border-(--border) rounded-xl overflow-hidden`}
        style={{ width, height: height || 200, minHeight: 150 }}
        aria-label={alt || `Esercizio: ${exerciseId}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <svg className="w-12 h-12 text-(--text) opacity-30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-(--text) opacity-60">{t('exercise.gif_unavailable')}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${className} relative bg-(--code-bg) border border-(--border) rounded-xl overflow-hidden`}
      style={{ width, height: height || 200, minHeight: 150 }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt || `Dimostrazione esercizio ${exerciseId}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
          width={width}
          height={height}
        />
      )}
      {useFallback && imageSrc && (
        <div className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-black/50 text-white rounded">
          Immagine statica
        </div>
      )}
    </div>
  );
}

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
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  run: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  bike: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  swim: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  jump_rope: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Rope' 
  },
  // Forza - Upper Body
  pushup: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  pullup: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  dip: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  bench_press: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Press' 
  },
  shoulder_press: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Press' 
  },
  row: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  biceps_curl: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Curl' 
  },
  triceps_extension: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Extension' 
  },
  lateral_raise: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Raise' 
  },
  // Forza - Lower Body
  squat: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  lunge: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  deadlift: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  hip_thrust: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Thrust' 
  },
  calf_raise: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Raise' 
  },
  leg_press: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Press' 
  },
  bulgarian_split_squat: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Split+Squat' 
  },
  glute_bridge: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Bridge' 
  },
  // Core
  plank: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  side_plank: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Plank' 
  },
  crunch: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  russian_twist: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Twist' 
  },
  leg_raise: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Raise' 
  },
  mountain_climber: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Climber' 
  },
  bird_dog: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Dog' 
  },
  dead_bug: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Bug' 
  },
  // Mobilità / Yoga
  yoga: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  cat_cow: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Cow' 
  },
  child_pose: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Pose' 
  },
  downward_dog: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Dog' 
  },
  cobra: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  pigeon_pose: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Pose' 
  },
  hip_flexor_stretch: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Flexor+Stretch' 
  },
  thoracic_rotation: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Rotation' 
  },
  // HIIT
  burpees: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  jumping_jacks: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Jacks' 
  },
  high_knees: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Knees' 
  },
  butt_kickers: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Kickers' 
  },
  squat_jump: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Jump' 
  },
  // Stretching
  hamstring_stretch: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Stretch' 
  },
  quad_stretch: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Stretch' 
  },
  chest_stretch: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Stretch' 
  },
  shoulder_stretch: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Stretch' 
  },
  triceps_stretch: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Stretch' 
  },
  lower_back_stretch: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif+Back+Stretch' 
  },
  // Rest
  rest: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
  breathe: { 
    gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJwYzJw.gif', 
    fallback: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJwYzJw/giphy.gif' 
  },
};

/**
 * Funzione helper per ottenere l'URL della GIF per un esercizio
 */
export function getExerciseGifUrl(exerciseId: string): { gif: string; fallback: string } | null {
  return EXERCISE_GIF_URLS[exerciseId] || null;
}




