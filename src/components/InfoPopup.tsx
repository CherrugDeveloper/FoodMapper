import { useState, useRef, useEffect } from 'react';
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
  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const text = getInfoText(t, infoKey, i18n.language);

  const closePopup = () => {
    setIsOpen(false);
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      closePopup();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
        aria-expanded={isOpen}
        aria-label={ariaLabel || t('info_popup_label', { defaultValue: 'Maggiori informazioni' })}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-(--accent) hover:bg-(--accent-bg) transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 touch-manipulation"
      >
        <span aria-hidden="true">ⓘ</span>
      </button>

      {isOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-popup-title"
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div
            className="relative max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-left text-(--text-h)"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-4 right-4 text-(--text) hover:text-(--text-h) transition-colors p-1 rounded-lg hover:bg-(--code-bg) focus:outline-none focus:ring-2 focus:ring-(--accent)"
              aria-label={t('info_popup_close', { defaultValue: 'Chiudi' })}
            >
              <span aria-hidden="true">✕</span>
            </button>
            <span id="info-popup-title" className="block font-semibold text-(--text-h) mb-4">
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
