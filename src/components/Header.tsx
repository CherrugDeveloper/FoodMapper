import { useTranslation } from 'react-i18next';

export default function Header() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  // Estrae la lingua abbreviata pulita (es. 'it' o 'en')
  const currentShortLang = i18n.language.startsWith('it') ? 'it' : 'en';

  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-4 flex justify-between items-center border-b border-(--border) mb-6">
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
        <span className="text-xs text-(--text) font-medium">🌐 Language:</span>
        <select
          value={currentShortLang}
          onChange={handleLanguageChange}
          className="p-1.5 rounded-lg text-xs font-bold border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) cursor-pointer"
        >
          <option value="it">Italiano (IT)</option>
          <option value="en">English (EN)</option>
        </select>
      </div>
    </header>
  );
}
