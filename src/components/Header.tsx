import { useInstallPrompt } from '../hooks/useInstallPrompt';
import React from 'react';
import packageJson from '../../package.json';

const Header: React.FC = () => {
  const { installEvent, isStandalone, promptInstall } = useInstallPrompt();

  return (
    <header className="w-full px-4 sm:px-6 md:px-8">
      <div className="flex items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 min-w-0">
          <img
            src="./favicon.svg"
            alt=""
            className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
            aria-hidden="true"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-(--text-h) text-sm sm:text-base md:text-xl truncate">FoodMapper</span>
            <span className="text-[11px] sm:text-[12px] text-(--text) opacity-70 truncate">v{packageJson.version}</span>
          </div>
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
        </div>
      </div>
    </header>
  );
}

export default Header;
