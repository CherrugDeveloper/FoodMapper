import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
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
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);

  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  // Track if we're in a touch interaction to prevent double toggle
  const isTouchActiveRef = useRef(false);

  const text = getInfoText(t, infoKey, i18n.language);

  // Detect touch device on mount
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
    // Only toggle if we started this touch interaction
    if (isTouchActiveRef.current) {
      setIsOpen(prev => !prev);
      isTouchActiveRef.current = false;
    }
  }, []);

  const handleClick = useCallback(() => {
    // Only handle click if not in a touch interaction (prevents synthetic click after touch)
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

  // Close on outside pointerdown or Escape
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

  // Calculate position before paint
  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current || !tooltipRef.current) return;
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 8;

      // Determine vertical placement - prefer top, but use bottom if not enough space above
      const spaceAbove = buttonRect.top;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      
      if (spaceAbove < tooltipHeight + padding && spaceBelow >= tooltipHeight + padding) {
        setPlacement('bottom');
      } else if (spaceBelow < tooltipHeight + padding && spaceAbove >= tooltipHeight + padding) {
        setPlacement('top');
      } else {
        // Default to top if both fit, or if neither fits (will clamp)
        setPlacement('top');
      }

      // Calculate horizontal position - center on button, then clamp to viewport
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      let expectedLeft = buttonCenter - tooltipWidth / 2;
      
      // Clamp to viewport with padding
      const minLeft = padding;
      const maxLeft = viewportWidth - tooltipWidth - padding;
      
      // If tooltip is wider than viewport, center it and let it extend equally (last resort)
      if (maxLeft < minLeft) {
        expectedLeft = (viewportWidth - tooltipWidth) / 2;
      } else {
        expectedLeft = Math.max(minLeft, Math.min(expectedLeft, maxLeft));
      }
      
      // Use fixed positioning with pixel coordinates for reliable off-screen prevention
      const top = placement === 'top' ? buttonRect.top - tooltipHeight - padding : buttonRect.bottom + padding;
      const left = expectedLeft;
      setTooltipPosition({ top, left });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, placement]);

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
        className="inline-flex items-center justify-center w-5 h-5 min-w-5 min-h-5 shrink-0 aspect-square rounded-full text-(--accent) hover:bg-(--accent-bg) transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 touch-manipulation active:scale-95 active:bg-purple-100 dark:active:bg-purple-900/30 p-0"
        style={{ flexShrink: 0, flexGrow: 0, width: '20px', height: '20px' }}
      >
        <span aria-hidden="true" className="text-xs leading-none select-none flex items-center justify-center">ⓘ</span>
      </button>

      {isOpen && tooltipPosition && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`fixed z-50 w-72 max-w-70 sm:max-w-[320px] p-3 rounded-xl bg-(--bg) border border-(--border) shadow-xl text-left text-(--text) text-xs sm:text-sm leading-relaxed ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div
            className={`absolute ${
              placement === 'top'
                ? '-bottom-1 border-r border-b'
                : '-top-1 border-l border-t'
            } w-2 h-2 bg-(--bg) border-(--border)`}
            style={{
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
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
