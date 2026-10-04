import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  const { t } = useTranslation();
  const { installEvent, isStandalone, promptInstall } = useInstallPrompt();

export default function Header() {
  const { t } = useTranslation();
  const { installEvent, isStandalone, promptInstall } = useInstallPrompt();

  return (
    <header className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 min-w-0 shrink">
          <svg viewBox="0 0 64 64" className="w-5 h-5 sm:w-6 sm:h-6 rounded-md shrink-0" aria-hidden="true">
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

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
        </div>
        <div className="text-sm font-medium">v{process.env.REACT_APP_VERSION}</div>
        <div className="text-sm font-medium">v{process.env.REACT_APP_VERSION}</div>
        <div className="text-sm font-medium">v{process.env.REACT_APP_VERSION}</div>
        <div className="text-sm font-medium">v{process.env.REACT_APP_VERSION}</div>
        <div className="text-sm font-medium">v{process.env.REACT_APP_VERSION}</div>
        <div className="text-sm font-medium">v{process.env.REACT_APP_VERSION}</div>
      </div>

      {/* Status indicators */}
      <div className="flex gap-2">
        <span className="status update-status bg-green-500" aria-label="All updates are applied"></span>
        <span className="status error-status bg-red-500" aria-label="Errors detected"></span>
        <span className="status warning-status bg-yellow-500" aria-label="Warnings present"></span>
      </div>
    </header>
  );
}
