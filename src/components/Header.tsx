import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import packageJson from '../../package.json';

const SEEN_VERSION_KEY = 'foodmapper_seen_version';

interface HeaderProps {
  onGoToChangelog?: () => void;
}

export default function Header({ onGoToChangelog }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { installEvent, isStandalone, promptInstall } = useInstallPrompt();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewVersion, setHasNewVersion] = useState(() => {
    try {
      const seenVersion = localStorage.getItem(SEEN_VERSION_KEY);
      return seenVersion !== packageJson.version;
    } catch {
      return false;
    }
  });
  const popoverRef = useRef<HTMLDivElement>(null);
  const currentVersion = packageJson.version;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  // Estrae il codice lingua a due lettere (es. 'it', 'en', 'es'...)
  const currentShortLang = i18n.language.slice(0, 2).toLowerCase();
  const supportedLangs = ['it', 'en', 'es', 'fr', 'de'];
  const selectedLang = supportedLangs.includes(currentShortLang) ? currentShortLang : 'en';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const dismissNotification = useCallback(() => {
    try {
      localStorage.setItem(SEEN_VERSION_KEY, currentVersion);
    } catch {
      // Ignore storage errors
    }
    setHasNewVersion(false);
    setIsOpen(false);
  }, [currentVersion]);

  const handleChangelogClick = () => {
    dismissNotification();
    onGoToChangelog?.();
  };

  return (
    <header className="w-full px-6 md:px-8 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-(--border) mb-6">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 64 64" className="w-6 h-6 rounded-md" aria-hidden="true">
          <rect width="64" height="64" rx="14" className="fill-(--accent)" />
          <g fill="none" stroke="#fff" strokeLinecap="round">
            <path d="M19 52 V25 a13 13 0 0 1 13-13 a13 13 0 0 1 13 13 v27" strokeWidth="5" />
            <path d="M26 24 q3 -3.5 6.5 0 t6.5 0" strokeWidth="4" />
            <path d="M26 32 q3 -3.5 6.5 0 t6.5 0" strokeWidth="4" />
            <path d="M26 40 q3 -3.5 6.5 0 t6.5 0" strokeWidth="4" />
            <circle cx="32" cy="48" r="3" fill="#fff" stroke="none" />
          </g>
        </svg>
        <span className="font-bold text-(--text-h) text-sm md:text-base">FoodMapper</span>
      </div>

      {/* Menu a tendina compatto ed estensibile per infinite lingue */}
      <div className="flex items-center gap-2">
        {installEvent && !isStandalone && (
          <button
            type="button"
            onClick={promptInstall}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-(--accent) text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 cursor-pointer"
            aria-label="Installa app FoodMapper"
          >
            📲 Installa app
          </button>
        )}

        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            className="relative p-2 rounded-lg text-(--text-h) hover:bg-(--code-bg) focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 cursor-pointer"
            aria-label={t('notifications.title')}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {hasNewVersion && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-(--bg)" aria-hidden="true" />
            )}
          </button>

          {isOpen && (
            <div
              role="dialog"
              aria-label={t('notifications.title')}
              className="absolute right-0 mt-2 w-64 sm:w-72 rounded-xl bg-(--bg) border border-(--border) shadow-lg p-4 z-50"
            >
              <h3 className="text-sm font-bold text-(--text-h) mb-2">
                {t('notifications.title')}
              </h3>
              {hasNewVersion ? (
                <>
                  <p className="text-sm text-(--text) mb-3">
                    {t('notifications.new_version', { version: currentVersion })}
                  </p>
                  <button
                    type="button"
                    onClick={handleChangelogClick}
                    className="w-full text-left text-sm font-semibold text-(--accent) hover:underline mb-3"
                  >
                    {t('notifications.view_changelog')}
                  </button>
                  <button
                    type="button"
                    onClick={dismissNotification}
                    className="w-full text-center py-2 px-4 text-sm font-bold rounded-lg bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
                  >
                    {t('notifications.dismiss')}
                  </button>
                </>
              ) : (
                <p className="text-sm text-(--text)">
                  {t('notifications.no_new_version')}
                </p>
              )}
            </div>
          )}
        </div>

        <span className="text-xs text-(--text) font-medium">🌐 Language:</span>
        <select
          aria-label="Language selector"
          value={selectedLang}
          onChange={handleLanguageChange}
          className="p-1.5 rounded-lg text-xs font-bold border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) cursor-pointer"
        >
          <option value="it">Italiano</option>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </header>
  );
}
