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
        <span className="text-xl">🥑</span>
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
