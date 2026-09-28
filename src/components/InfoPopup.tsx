import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getInfoText } from '../utils/infoPopups';

export type InfoPopupKey = string;

interface InfoPopupProps {
  infoKey: InfoPopupKey;
  className?: string;
  ariaLabel?: string;
}

export default function InfoPopup({
  infoKey,
  className = '',
  ariaLabel,
}: InfoPopupProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringRef = useRef(false);

  const text = getInfoText(t, infoKey, i18n.language);

  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      // Check for touch capability using multiple methods
      const hasTouch = 'ontouchstart' in window || 
                       navigator.maxTouchPoints > 0 || 
                       (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      setIsTouchDevice(hasTouch);
    };
    
    checkTouchDevice();
    
    // Re-check on resize (for hybrid devices)
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const openPopup = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(prev => !prev);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(prev => !prev);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  }, [closePopup]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      closePopup();
    }
  }, [isOpen, closePopup]);

  const handleMouseEnter = useCallback(() => {
    // Only handle hover on non-touch devices
    if (isTouchDevice) return;
    
    isHoveringRef.current = true;
    openPopup();
  }, [openPopup, isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    // Only handle hover on non-touch devices
    if (isTouchDevice) return;
    
    isHoveringRef.current = false;
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        closePopup();
      }
    }, 100);
  }, [closePopup, isTouchDevice]);

  const handleModalMouseEnter = useCallback(() => {
    // Only handle hover on non-touch devices
    if (isTouchDevice) return;
    
    isHoveringRef.current = true;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, [isTouchDevice]);

  const handleModalMouseLeave = useCallback(() => {
    // Only handle hover on non-touch devices
    if (isTouchDevice) return;
    
    isHoveringRef.current = false;
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        closePopup();
      }
    }, 100);
  }, [closePopup, isTouchDevice]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!text) return null;

  const hasHtml = /<[^>]+>/.test(text);

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={isOpen}
        aria-label={ariaLabel || t('info_popup_label', { defaultValue: 'Maggiori informazioni' })}
        tabIndex={-1}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-(--accent) hover:bg-(--accent-bg) transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 touch-manipulation active:scale-95 active:bg-purple-100 dark:active:bg-purple-900/30"
      >
        <span aria-hidden="true" className="text-sm">ⓘ</span>
      </button>

      {isOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-popup-title"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          onMouseEnter={handleModalMouseEnter}
          onMouseLeave={handleModalMouseLeave}
        >
          <div
            className="relative max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-left text-(--text-h)"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleModalMouseEnter}
            onMouseLeave={handleModalMouseLeave}
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-4 right-4 min-w-11 min-h-11 text-(--text) hover:text-(--text-h) transition-colors rounded-lg hover:bg-(--code-bg) focus:outline-none focus:ring-2 focus:ring-(--accent) active:scale-95"
              aria-label={t('info_popup_close', { defaultValue: 'Chiudi' })}
            >
              <span aria-hidden="true" className="text-xl">✕</span>
            </button>
            <span id="info-popup-title" className="block text-purple-600 dark:text-purple-400 font-bold text-lg mb-4">
              {t('info_popup_title', { defaultValue: 'Informazione' })}
            </span>
            {hasHtml ? (
              <span
                className="block leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ) : (
              <span className="block leading-relaxed text-sm">{text}</span>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
