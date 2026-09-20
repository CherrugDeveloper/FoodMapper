import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EDUCATIONAL_ARTICLES } from '../utils/educationalData';
import type { Article } from '../utils/educationalData';

export default function EducationalHub() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const { i18n } = useTranslation();

  // Forza esplicitamente il tipo per fare in modo che TypeScript riconosca 'it' o 'en'
  const currentLang: 'it' | 'en' = i18n.language.startsWith('it') ? 'it' : 'en';

  const currentArticle = EDUCATIONAL_ARTICLES.find(art => art.id === selectedArticleId);

  const handleNavigateToArticle = (id: string) => {
    setSelectedArticleId(id);
    document.getElementById('educational-hub-title')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left mt-8 border-t border-(--border)">
      <h2 id="educational-hub-title" className="text-2xl font-bold text-(--text-h) mb-6 text-center md:text-left">
        {currentLang === 'it' ? '📚 Enciclopedia Scientifica Nutrizionale' : '📚 Scientific Nutritional Encyclopedia'}
      </h2>

      {currentArticle ? (
        <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm space-y-6 animate-fade-in">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="text-xs md:text-sm font-semibold text-(--accent) hover:underline cursor-pointer flex items-center gap-1 mb-2"
          >
            {currentLang === 'it' ? '← Torna all\'indice' : '← Back to index'}
          </button>

          <div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-(--accent)">
              {currentArticle.category}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-(--text-h) mt-3 mb-2 leading-tight">
              {currentArticle[currentLang].title}
            </h3>
          </div>

          <div className="text-(--text) text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4">
            {currentArticle[currentLang].content}
          </div>

          {/* Link PubMed */}
          {currentArticle.pubmedLinks && currentArticle.pubmedLinks.length > 0 && (
            <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border) mt-4">
              <h4 className="text-xs font-bold text-(--text-h) uppercase tracking-wide mb-2">
                🔬 PubMed Sources:
              </h4>
              <ul className="list-disc pl-5 space-y-1.5">
                {currentArticle.pubmedLinks.map((link, idx) => (
                  <li key={idx} className="text-xs md:text-sm">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-(--accent) hover:underline font-medium break-all"
                    >
                      {link.text} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rete Collegamenti */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-(--border) mt-6">
            <div>
              {currentArticle.prerequisites && currentArticle.prerequisites.length > 0 && (
                <>
                  <span className="block text-xs font-bold text-(--text) uppercase tracking-wider mb-2">🧠 Prerequisites:</span>
                  {currentArticle.prerequisites.map(preId => {
                    const found = EDUCATIONAL_ARTICLES.find(a => a.id === preId);
                    return found ? (
                      <button
                        key={preId}
                        onClick={() => handleNavigateToArticle(preId)}
                        className="w-full text-left p-2.5 rounded-xl border border-(--border) text-xs font-medium text-(--text-h) bg-(--code-bg) hover:border-(--accent) transition-all cursor-pointer"
                      >
                        📌 {found[currentLang].title}
                      </button>
                    ) : null;
                  })}
                </>
              )}
            </div>

            <div>
              {currentArticle.nextSteps && currentArticle.nextSteps.length > 0 && (
                <>
                  <span className="block text-xs font-bold text-(--text) uppercase tracking-wider mb-2">🚀 Next Steps:</span>
                  {currentArticle.nextSteps.map(nextId => {
                    const found = EDUCATIONAL_ARTICLES.find(a => a.id === nextId);
                    return found ? (
                      <button
                        key={nextId}
                        onClick={() => handleNavigateToArticle(nextId)}
                        className="w-full text-left p-2.5 rounded-xl border border-(--accent-border) text-xs font-semibold text-(--accent) bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-pointer"
                      >
                        📖 {found[currentLang].title}
                      </button>
                    ) : null;
                  })}
                </>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EDUCATIONAL_ARTICLES.map((article: Article) => (
            <div
              key={article.id}
              className="p-5 rounded-2xl bg-(--bg) border border-(--border) shadow-sm hover:border-(--accent-border) transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-(--accent) uppercase tracking-wider block mb-1">
                  {article.category}
                </span>
                <h3 className="font-bold text-(--text-h) text-base md:text-lg mb-2 leading-snug">
                  {article[currentLang].title}
                </h3>
                <p className="text-xs md:text-sm text-(--text) leading-relaxed mb-4">
                  {article[currentLang].summary}
                </p>
              </div>
              <button
                onClick={() => setSelectedArticleId(article.id)}
                className="w-full text-center py-2 px-4 text-xs font-bold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                {currentLang === 'it' ? 'Leggi Articolo' : 'Read Article'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
