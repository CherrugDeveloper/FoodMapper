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
  }, []);

  const [touchTimeout, setTouchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const touchHandledRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    touchHandledRef.current = false;
    
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    
    // Clear any existing timeout
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }
    
    // Set a timeout for long press (500ms)
    const timeout = setTimeout(() => {
      setIsOpen(true);
      touchHandledRef.current = true;
      setTouchTimeout(null);
    }, 500);
    
    setTouchTimeout(timeout);
  }, [touchTimeout]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Clear timeout if user lifts finger before long press
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }
    
    // Check if it was a quick tap (less than 300ms)
    if (touchStartPos && !touchHandledRef.current) {
      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPos.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < 10) { // Very short distance = quick tap
        setIsOpen(prev => !prev);
        touchHandledRef.current = true;
      }
    }
    
    setTouchStartPos(null);
  }, [touchTimeout, touchStartPos]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    // If user moves finger significantly, cancel the long press
    if (touchStartPos) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPos.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > 10) { // User moved finger
        if (touchTimeout) {
          clearTimeout(touchTimeout);
          setTouchTimeout(null);
        }
      }
    }
  }, [touchTimeout, touchStartPos]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent click from firing after touch (which would toggle the popup again)
    if (touchHandledRef.current) {
      e.stopPropagation();
      e.preventDefault();
      touchHandledRef.current = false;
      return;
    }
    e.stopPropagation();
    e.preventDefault();
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
    setIsOpen(false);
  }, [isTouchDevice]);

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
  }, [isOpen]);

  if (!text) return null;

  const hasHtml = /<[^>]+>/.test(text);

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center self-center shrink-0 flex-shrink-0 ${className}`}
      style={{ display: 'inline-flex' }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={isOpen}
        aria-label={ariaLabel || t('info_popup_label', { defaultValue: 'Maggiori informazioni' })}
        className="inline-flex items-center justify-center w-5 h-5 min-w-5 min-h-5 shrink-0 flex-shrink-0 aspect-square rounded-full text-(--accent) hover:bg-(--accent-bg) transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 touch-manipulation active:scale-95 active:bg-purple-100 dark:active:bg-purple-900/30 p-0"
        style={{ flexShrink: 0, flexGrow: 0, width: '20px', height: '20px' }}
      >
        <span aria-hidden="true" className="text-xs leading-none select-none flex items-center justify-center">ⓘ</span>
      </button>

      {isOpen && tooltipPosition && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`fixed z-50 w-72 max-w-[280px] sm:max-w-[320px] p-3 rounded-xl bg-(--bg) border border-(--border) shadow-xl text-left text-(--text) text-xs sm:text-sm leading-relaxed ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateX(-50%)',
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
