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
  const [horizontalShift, setHorizontalShift] = useState<number>(0);

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
      if (!buttonRef.current) return;
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current?.offsetHeight || 120;
      const tooltipWidth = tooltipRef.current?.offsetWidth || 280;
      const viewportWidth = window.innerWidth;
      const padding = 8;

      if (buttonRect.top < tooltipHeight + 12) {
        setPlacement('bottom');
      } else {
        setPlacement('top');
      }

      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const expectedLeft = buttonCenter - tooltipWidth / 2;
      const expectedRight = buttonCenter + tooltipWidth / 2;

      let shift = 0;
      if (expectedLeft < padding) {
        shift = padding - expectedLeft;
      } else if (expectedRight > viewportWidth - padding) {
        shift = viewportWidth - padding - expectedRight;
      }
      setHorizontalShift(shift);
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
      className={`relative inline-flex items-center shrink-0 ${className}`}
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
        className="inline-flex items-center justify-center w-5 h-5 min-w-5 min-h-5 shrink-0 aspect-square rounded-full text-(--accent) hover:bg-(--accent-bg) transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 touch-manipulation active:scale-95 active:bg-purple-100 dark:active:bg-purple-900/30 p-0"
      >
        <span aria-hidden="true" className="text-xs leading-none select-none flex items-center justify-center">ⓘ</span>
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`absolute z-50 w-72 max-w-[280px] sm:max-w-[320px] p-3 rounded-xl bg-(--bg) border border-(--border) shadow-xl text-left text-(--text) text-xs sm:text-sm leading-relaxed ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{
            left: '50%',
            transform: `translateX(calc(-50% + ${horizontalShift}px))`,
          }}
        >
          <div
            className={`absolute ${
              placement === 'top'
                ? '-bottom-1 border-r border-b'
                : '-top-1 border-l border-t'
            } w-2 h-2 bg-(--bg) border-(--border)`}
            style={{
              left: `clamp(12px, calc(50% - ${horizontalShift}px), calc(100% - 12px))`,
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
