import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreloadExerciseGifs, EXERCISE_GIF_URLS, getExerciseGifUrl } from '../utils/exerciseGifHelpers';

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
  // useTranslation moved to top level — before any early returns or conditionals
  const { t } = useTranslation();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // URL di default per le GIF degli esercizi (placeholder - da sostituire con URL reali)
  const DEFAULT_GIF_BASE = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJw/giphy.gif';
  const DEFAULT_FALLBACK_BASE = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5wYzJwYzJwYzJw/giphy.gif';

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
