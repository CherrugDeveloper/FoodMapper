import { useInstallPrompt } from '../hooks/useInstallPrompt';
import React from 'react';
import packageJson from '../../package.json';

const Header: React.FC = () => {
  const { installEvent, isStandalone, promptInstall } = useInstallPrompt();

  return (
    <header className="w-full px-4 sm:px-6 md:px-8">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 min-w-0 shrink">
          <img
            src="/favicon.svg"
            alt=""
            className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
            aria-hidden="true"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-(--text-h) text-xs sm:text-sm md:text-base truncate">FoodMapper</span>
            <span className="text-[10px] text-(--text) opacity-70 truncate">v{packageJson.version}</span>
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
