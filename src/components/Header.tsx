import { useTranslation } from 'react-i18next';

export default function Header() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-4 flex justify-between items-center border-b border-(--border) mb-6">
      <div className="flex items-center gap-2">
        <span className="text-xl">🥑</span>
        <span className="font-bold text-(--text-h) text-sm md:text-base">FoodMapper</span>
      </div>
      
      {/* Selettore Lingua Interattivo */}
      <div className="flex gap-2">
        <button
          onClick={() => changeLanguage('it')}
          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            i18n.language.startsWith('it')
              ? 'bg-(--accent) text-white border-(--accent)'
              : 'bg-(--code-bg) text-(--text) border-(--border) hover:text-(--text-h)'
          }`}
        >
          IT
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            i18n.language.startsWith('en')
              ? 'bg-(--accent) text-white border-(--accent)'
              : 'bg-(--code-bg) text-(--text) border-(--border) hover:text-(--text-h)'
          }`}
        >
          EN
        </button>
      </div>
    </header>
  );
}
