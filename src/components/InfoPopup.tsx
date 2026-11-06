import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getInfoText } from '../utils/infoPopups';

export type InfoPopupKey = string;

interface InfoPopupProps {
  infoKey: InfoPopupKey;
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
}

export default function InfoPopup({
  infoKey,
  className = '',
  buttonClassName = '',
  ariaLabel,
}: InfoPopupProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isTouchActiveRef = useRef(false);

  const text = getInfoText(t, infoKey, i18n.language);

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window ||
                       navigator.maxTouchPoints > 0 ||
                       (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      setIsTouchDevice(hasTouch);
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    isTouchActiveRef.current = false;
  }, []);

  const handleTouchStart = useCallback(() => {
    isTouchActiveRef.current = true;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTouchActiveRef.current) {
      setIsOpen(prev => !prev);
      isTouchActiveRef.current = false;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (isTouchActiveRef.current) {
      isTouchActiveRef.current = false;
      return;
    }
    setIsOpen(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closePopup();
    }
  }, [closePopup]);

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    setIsOpen(true);
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    closePopup();
  }, [isTouchDevice, closePopup]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown, closePopup]);

  // Calculate tooltip position to stay within viewport bounds
  // Uses robust calculation for PWA/portable devices with proper device pixel ratio handling
  const getTooltipPosition = useCallback(() => {
    if (!buttonRef.current || !tooltipRef.current) return { top: 0, left: 0, flipVertically: false };

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get actual tooltip dimensions (accounting for device pixel ratio)
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    // Base position: below the button with small gap
    let top = buttonRect.bottom + 8;
    const centerX = buttonRect.left + buttonRect.width / 2;
    let left = centerX - tooltipWidth / 2;
    let flipVertically = false;

    // Account for device pixel ratio in viewport calculations
    const dpr = window.devicePixelRatio || 1;
    const safeMargin = Math.max(10, 10 * dpr);

    // Check if tooltip would overflow bottom or top of viewport
    if (top + tooltipHeight > viewportHeight - safeMargin) {
      flipVertically = true;
      top = Math.max(safeMargin, buttonRect.top - tooltipHeight - 8);
    }

    // Ensure tooltip stays within viewport horizontally with proper bounds checking
    if (left < safeMargin) {
      left = safeMargin;
    } else if (left + tooltipWidth > viewportWidth - safeMargin) {
      left = viewportWidth - safeMargin - tooltipWidth;
    }

    return {
      top,
      left,
      flipVertically,
    };
  }, []);

  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, flipVertically: false });

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const pos = getTooltipPosition();
      setTooltipPosition(pos);
    };

    // Initial position update
    updatePosition();

    // Use requestAnimationFrame for more stable positioning on PWA/portable devices
    const raf = requestAnimationFrame(() => {
      updatePosition();
    });

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, getTooltipPosition]);

  if (!text) return null;

  const hasHtml = /<[^>]+>/.test(text);

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center self-center shrink-0 ${className}`}
      style={{ display: 'inline-flex' }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={isOpen}
        aria-label={ariaLabel || t('info_popup_label', { defaultValue: 'Maggiori informazioni' })}
        className={`inline-flex items-center justify-center w-5 h-5 min-w-5 min-h-5 shrink-0 aspect-square rounded-full text-(--accent) hover:bg-(--accent-bg) transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 touch-manipulation active:scale-95 active:bg-purple-100 dark:active:bg-purple-900/30 p-0 ${buttonClassName}`}
        style={{ flexShrink: 0, flexGrow: 0, width: '20px', height: '20px' }}
      >
        <span aria-hidden="true" className="text-xs leading-none select-none flex items-center justify-center">ⓘ</span>
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="fixed z-50 w-72 max-w-70 sm:max-w-[320px] p-3 rounded-xl bg-(--bg) border border-(--border) shadow-xl text-left text-(--text) text-xs sm:text-sm leading-relaxed"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <div
          className="absolute pointer-events-none"
          style={{
            top: tooltipPosition.flipVertically ? '100%' : '-6px',
            left: '50%',
            transform: tooltipPosition.flipVertically
              ? 'translateX(-50%) rotate(45deg)'
              : 'translateX(-50%) rotate(45deg)',
            width: '12px',
            height: '12px',
            backgroundColor: 'var(--bg)',
            border: 'var(--border) solid 1px',
            borderRadius: '50%',
          }}
          aria-hidden="true"
        />
          {hasHtml ? (
            <span
              className="block leading-relaxed"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ) : (
            <span className="block leading-relaxed">{text}</span>
          )}
        </div>
      )}
    </span>
  );
}
