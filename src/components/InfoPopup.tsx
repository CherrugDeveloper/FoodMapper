import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getInfoText } from '../utils/infoPopups';
import { useViewportPosition } from '../hooks/useViewportPosition';

export type InfoPopupKey = string;

interface InfoPopupProps {
  infoKey: InfoPopupKey;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  ariaLabel?: string;
}

export default function InfoPopup({
  infoKey,
  placement = 'top',
  className = '',
  ariaLabel,
}: InfoPopupProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLSpanElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const text = getInfoText(t, infoKey, i18n.language);

  const openPopup = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const closePopup = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 50);
  };

  const handleMouseEnter = () => {
    openPopup();
  };

  const handleMouseLeave = () => {
    closePopup();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(prev => !prev);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(prev => !prev);
  };

  // Use viewport-aware positioning
  const viewportPosition = useViewportPosition({
    triggerRef: buttonRef,
    popupRef,
    preferredPlacement: placement,
    offset: 8,
    boundaryPadding: 8,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isOpen]);

  if (!text) return null;

  const hasHtml = /<[^>]+>/.test(text);

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-(--accent) hover:bg-(--accent-bg) transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 touch-manipulation"
      >
        <span aria-hidden="true">ⓘ</span>
      </button>

      {isOpen && (
        <span
          ref={popupRef}
          role="tooltip"
          style={{
            position: 'fixed',
            top: viewportPosition.top,
            left: viewportPosition.left,
            zIndex: 200,
            maxWidth: '85vw',
            maxHeight: '80vh',
            minHeight: 'auto',
            minWidth: '280px',
            overflowY: 'auto',
            overflowX: 'hidden',
          } as React.CSSProperties}
          className="p-3 rounded-xl bg-(--bg) border border-(--accent) shadow-lg text-xs text-(--text)"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="block font-semibold text-(--text-h) mb-1">
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
        </span>
      )}
    </span>
  );
}
