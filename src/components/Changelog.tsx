import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changelogEntries } from '../utils/changelogData';
import type { SupportedLang } from '../utils/changelogData';

const SEEN_VERSION_KEY = 'foodmapper_seen_changelog_version';

function getDisplayLang(lang: string): SupportedLang {
  const supported: SupportedLang[] = ['en', 'it', 'de', 'es', 'fr'];
  const normalized = lang.split('-')[0].toLowerCase() as SupportedLang;
  return supported.includes(normalized) ? normalized : 'en';
}

export default function Changelog() {
  const { t, i18n } = useTranslation();
  const displayLang = getDisplayLang(i18n.language);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Mark changelog as viewed when component mounts
  useEffect(() => {
    if (changelogEntries.length > 0) {
      const latestVersion = changelogEntries[0].version;
      try {
        localStorage.setItem(SEEN_VERSION_KEY, latestVersion);
      } catch {
        // Ignore storage errors
      }
    }
  }, []);

  // Sort entries based on current order
  const sortedEntries = useMemo(() => {
    const sorted = [...changelogEntries].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="bg-(--code-bg) border border-(--border) rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10">
        <header className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-(--text-h) mb-3 sm:mb-4 lg:mb-5">
            {t('changelog.title')}
          </h1>
          <p className="text-(--text) text-base sm:text-lg md:text-xl max-w-3xl lg:max-w-4xl mb-4 lg:mb-6">
            {t('changelog.subtitle')}
          </p>
          
          {/* Sort order toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSortOrder}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg) border border-(--border) text-(--text-h) hover:bg-(--accent-bg) hover:border-(--accent) transition-all focus:outline-none focus:ring-2 focus:ring-(--accent)"
              aria-label={sortOrder === 'desc' ? 'Ordina dal più vecchio al più recente' : 'Ordina dal più recente al più vecchio'}
            >
              <span aria-hidden="true">{sortOrder === 'desc' ? '↓' : '↑'}</span>
              <span className="text-sm font-medium">
                {sortOrder === 'desc'
                  ? t('changelog.sort_newest_first', { defaultValue: 'Più recenti prima' })
                  : t('changelog.sort_oldest_first', { defaultValue: 'Più vecchi prima' })
                }
              </span>
            </button>
          </div>
        </header>

        <div className="space-y-5 sm:space-y-6 lg:space-y-8">
          {sortedEntries.map((entry) => (
            <div
              key={entry.version}
              className="bg-(--bg) border border-(--border) rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 transition-all hover:border-(--accent)/30"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4 lg:mb-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold">
                    v{entry.version}
                  </span>
                </div>
                <p className="text-(--text) text-xs sm:text-sm opacity-70">
                  {t('changelog.released_on')}{' '}
                  {new Date(entry.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                {/* Features */}
                {entry.features[displayLang].length > 0 && (
                  <div>
                    <h3 className="text-xs sm:text-sm md:text-base font-medium text-(--accent) mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
                      <span aria-hidden="true">✨</span>
                      {t('changelog.features')}
                    </h3>
                    <ul className="text-(--text) text-xs sm:text-sm md:text-base space-y-1 lg:space-y-2">
                      {entry.features[displayLang].map((feature, idx) => (
                        <li key={`${entry.version}-feature-${idx}`} className="flex items-start gap-2 lg:gap-3">
                          <span aria-hidden="true">•</span>
                          <span dangerouslySetInnerHTML={{ __html: feature }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fixes */}
                {entry.fixes[displayLang].length > 0 && (
                  <div>
                    <h3 className="text-xs sm:text-sm md:text-base font-medium text-(--accent) mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
                      <span aria-hidden="true">🐛</span>
                      {t('changelog.fixes')}
                    </h3>
                    <ul className="text-(--text) text-xs sm:text-sm md:text-base space-y-1 lg:space-y-2">
                      {entry.fixes[displayLang].map((fix, idx) => (
                        <li key={`${entry.version}-fix-${idx}`} className="flex items-start gap-2 lg:gap-3">
                          <span aria-hidden="true">•</span>
                          <span dangerouslySetInnerHTML={{ __html: fix }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {entry.improvements[displayLang].length > 0 && (
                  <div>
                    <h3 className="text-xs sm:text-sm md:text-base font-medium text-(--accent) mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
                      <span aria-hidden="true">💡</span>
                      {t('changelog.improvements')}
                    </h3>
                    <ul className="text-(--text) text-xs sm:text-sm md:text-base space-y-1 lg:space-y-2">
                      {entry.improvements[displayLang].map((imp, idx) => (
                        <li key={`${entry.version}-improvement-${idx}`} className="flex items-start gap-2 lg:gap-3">
                          <span aria-hidden="true">•</span>
                          <span dangerouslySetInnerHTML={{ __html: imp }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
