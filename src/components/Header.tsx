import { useTranslation } from 'react-i18next';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export default function Header() {
  const { i18n } = useTranslation();
  const { installEvent, isStandalone, promptInstall } = useInstallPrompt();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  // Estrae il codice lingua a due lettere (es. 'it', 'en', 'es'...)
  const currentShortLang = i18n.language.slice(0, 2).toLowerCase();
  const supportedLangs = ['it', 'en', 'es', 'fr', 'de'];
  const selectedLang = supportedLangs.includes(currentShortLang) ? currentShortLang : 'en';

  return (
    <header className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-b border-(--border) mb-6">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-shrink">
          <svg viewBox="0 0 64 64" className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex-shrink-0" aria-hidden="true">
            <rect width="64" height="64" rx="14" className="fill-(--accent)" />
            <g fill="none" stroke="#fff" strokeLinecap="round">
              <path d="M19 52 V25 a13 13 0 0 1 13-13 a13 13 0 0 1 13 13 v27" strokeWidth="5" />
              <path d="M26 24 q3 -3.5 6.5 0 t6.5 0" strokeWidth="4" />
              <path d="M26 32 q3 -3.5 6.5 0 t6.5 0" strokeWidth="4" />
              <path d="M26 40 q3 -3.5 6.5 0 t6.5 0" strokeWidth="4" />
              <circle cx="32" cy="48" r="3" fill="#fff" stroke="none" />
            </g>
          </svg>
          <span className="font-bold text-(--text-h) text-xs sm:text-sm md:text-base truncate">FoodMapper</span>
        </div>

        {/* Menu a tendina compatto ed estensibile per infinite lingue */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {installEvent && !isStandalone && (
            <button
              type="button"
              onClick={promptInstall}
              className="px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold bg-(--accent) text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-1 cursor-pointer whitespace-nowrap"
              aria-label="Installa app FoodMapper"
            >
              📲 <span className="hidden xs:inline">Installa</span>
            </button>
          )}

          <span className="text-[10px] sm:text-xs text-(--text) font-medium hidden sm:inline">🌐</span>
          <select
            aria-label="Language selector"
            value={selectedLang}
            onChange={handleLanguageChange}
            className="p-1.5 rounded-lg text-[10px] sm:text-xs font-bold border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) cursor-pointer"
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>
    </header>
  );
}
