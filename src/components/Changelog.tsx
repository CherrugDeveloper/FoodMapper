import { useTranslation } from 'react-i18next';
import { changelogEntries } from '../utils/changelogData';
import type { SupportedLang } from '../utils/changelogData';

function getDisplayLang(lang: string): SupportedLang {
  const supported: SupportedLang[] = ['en', 'it', 'de', 'es', 'fr'];
  const normalized = lang.split('-')[0].toLowerCase() as SupportedLang;
  return supported.includes(normalized) ? normalized : 'en';
}

export default function Changelog() {
  const { t, i18n } = useTranslation();
  const displayLang = getDisplayLang(i18n.language);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
      <div className="bg-(--code-bg) border border-(--border) rounded-2xl p-4 sm:p-6 md:p-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-(--text-h) mb-3 sm:mb-4">
            {t('changelog.title')}
          </h1>
          <p className="text-(--text) text-base sm:text-lg max-w-2xl">
            {t('changelog.subtitle')}
          </p>
        </header>

        <div className="space-y-5 sm:space-y-6">
          {changelogEntries.map((entry) => (
            <div
              key={entry.version}
              className="bg-(--bg) border border-(--border) rounded-xl p-4 sm:p-5 md:p-6 transition-all hover:border-(--accent)/30"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-(--text-h) mb-1">
                    {t('changelog.version', { version: entry.version })}
                  </h2>
                  <p className="text-(--text) text-xs sm:text-sm opacity-70">
                    {t('changelog.released_on')}{' '}
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Features */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-(--accent) mb-2 sm:mb-3 flex items-center gap-2">
                    <span aria-hidden="true">✨</span>
                    {t('changelog.features')}
                  </h3>
                  <ul className="text-(--text) text-xs sm:text-sm space-y-1">
                    {entry.features[displayLang].map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span aria-hidden="true">•</span>
                        <span dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fixes */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-(--accent) mb-2 sm:mb-3 flex items-center gap-2">
                    <span aria-hidden="true">🐛</span>
                    {t('changelog.fixes')}
                  </h3>
                  <ul className="text-(--text) text-xs sm:text-sm space-y-1">
                    {entry.fixes[displayLang].map((fix) => (
                      <li key={fix} className="flex items-start gap-2">
                        <span aria-hidden="true">•</span>
                        <span dangerouslySetInnerHTML={{ __html: fix }} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-(--accent) mb-2 sm:mb-3 flex items-center gap-2">
                    <span aria-hidden="true">💡</span>
                    {t('changelog.improvements')}
                  </h3>
                  <ul className="text-(--text) text-xs sm:text-sm space-y-1">
                    {entry.improvements[displayLang].map((imp) => (
                      <li key={imp} className="flex items-start gap-2">
                        <span aria-hidden="true">•</span>
                        <span dangerouslySetInnerHTML={{ __html: imp }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Last updated */}
        <div className="mt-8 pt-8 border-t border-(--border) text-center text-sm text-(--text) opacity-70">
          <p>
            {t('changelog.last_updated', {
              date: new Date().toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
