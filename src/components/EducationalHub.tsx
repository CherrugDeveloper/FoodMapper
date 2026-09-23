import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { EDUCATIONAL_ARTICLES } from '../utils/educationalData';
import type { Article } from '../utils/educationalData';

// Stile per gli articoli scritti in markdown (Tailwind azzera i default di titoli e liste)
const markdownComponents: Components = {
  h2: ({ children }) => <h4 className="text-base md:text-lg font-bold text-(--text-h) mt-6 mb-2">{children}</h4>,
  p: ({ children }) => <p className="pb-3">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 pb-3">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1.5 pb-3">{children}</ol>,
  a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-(--accent) hover:underline font-medium break-all">{children}</a>,
  strong: ({ children }) => <strong className="font-semibold text-(--text-h)">{children}</strong>,
  table: ({ children }) => <div className="overflow-x-auto pb-3"><table className="w-full text-left text-xs md:text-sm border-collapse">{children}</table></div>,
  th: ({ children }) => <th className="border-b border-(--border) px-2 py-1.5 font-semibold text-(--text-h)">{children}</th>,
  td: ({ children }) => <td className="border-b border-(--border) px-2 py-1.5">{children}</td>,
};

export default function EducationalHub() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  const currentLang: 'it' | 'en' = i18n.language.startsWith('it') ? 'it' : 'en';
  const currentArticle = EDUCATIONAL_ARTICLES.find(art => art.id === selectedArticleId);

  const categoryTranslations: Record<string, Record<'it' | 'en', string>> = {
    'Biochimica Base': { it: 'Biochimica Base', en: 'Basic Biochemistry' },
    'Fisiopatologia': { it: 'Fisiopatologia', en: 'Pathophysiology' },
    'Protocolli Clinici': { it: 'Protocolli Clinici', en: 'Clinical Protocols' }
  };

  const handleNavigateToArticle = (id: string) => {
    setSelectedArticleId(id);
    document.getElementById('educational-hub-title')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-8 text-left mt-8 border-t border-(--border)">
      <h2 id="educational-hub-title" className="text-2xl font-bold text-(--text-h) mb-8 text-center md:text-left">
        {t('hub_title')}
      </h2>

      {currentArticle ? (
        <div className="p-7 rounded-2xl bg-(--bg) border border-(--border) shadow-sm space-y-7 animate-fade-in">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="text-sm font-semibold text-(--accent) hover:underline cursor-pointer mb-3"
          >
            {t('hub_back')}
          </button>

          <div>
            <span className="px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-purple-500/10 text-(--accent)">
              {categoryTranslations[currentArticle.category]?.[currentLang] || currentArticle.category}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-(--text-h) mt-4 mb-3 leading-tight">
              {currentArticle[currentLang].title}
            </h3>
          </div>

          {currentArticle.markdown ? (
            <div className="text-(--text) text-base md:text-lg leading-relaxed space-y-5">
              <ReactMarkdown components={markdownComponents}>
                {currentArticle[currentLang].content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-(--text) text-base md:text-lg leading-relaxed whitespace-pre-line space-y-5">
              {currentArticle[currentLang].content}
            </div>
          )}

          {currentArticle.pubmedLinks && currentArticle.pubmedLinks.length > 0 && (
            <div className="p-5 rounded-xl bg-(--code-bg) border border-(--border) mt-5">
              <h4 className="text-sm font-bold text-(--text-h) uppercase tracking-wide mb-3">🔬 PubMed Sources:</h4>
              <ul className="list-disc pl-5 space-y-2">
                {currentArticle.pubmedLinks.map((link, idx) => (
                  <li key={idx} className="text-sm">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-(--accent) hover:underline font-medium break-all">
                      {link.text} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-(--border) mt-7">
            <div>
              {currentArticle.prerequisites && currentArticle.prerequisites.length > 0 && (
                <>
                  <span className="block text-sm font-bold text-(--text) uppercase tracking-wider mb-3">🧠 Prerequisites:</span>
                  {currentArticle.prerequisites.map(preId => {
                    const found = EDUCATIONAL_ARTICLES.find(a => a.id === preId);
                    return found ? (
                      <button key={preId} onClick={() => handleNavigateToArticle(preId)} className="w-full text-left p-3 rounded-xl border border-(--border) text-sm font-medium text-(--text-h) bg-(--code-bg) hover:border-(--accent) transition-all cursor-pointer">
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
                  <span className="block text-sm font-bold text-(--text) uppercase tracking-wider mb-3">🚀 Next Steps:</span>
                  {currentArticle.nextSteps.map(nextId => {
                    const found = EDUCATIONAL_ARTICLES.find(a => a.id === nextId);
                    return found ? (
                      <button key={nextId} onClick={() => handleNavigateToArticle(nextId)} className="w-full text-left p-3 rounded-xl border border-(--accent-border) text-sm font-semibold text-(--accent) bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-pointer">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EDUCATIONAL_ARTICLES.map((article: Article) => (
            <div key={article.id} className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm hover:border-(--accent-border) transition-all flex flex-col justify-between">
              <div>
                <span className="text-sm font-bold text-(--accent) uppercase tracking-wider block mb-2">
                  {categoryTranslations[article.category]?.[currentLang] || article.category}
                </span>
                <h3 className="font-bold text-(--text-h) text-lg md:text-xl mb-3 leading-snug">
                  {article[currentLang].title}
                </h3>
                <p className="text-sm md:text-base text-(--text) leading-relaxed mb-5">
                  {article[currentLang].summary}
                </p>
              </div>
              <button onClick={() => setSelectedArticleId(article.id)} className="w-full text-center py-3 px-5 text-sm font-bold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
                {t('hub_read')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
