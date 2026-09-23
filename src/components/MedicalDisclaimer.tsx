import { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface MedicalDisclaimerProps {
  onAccept: () => void;
}

export default function MedicalDisclaimer({ onAccept }: MedicalDisclaimerProps) {
  const [hasAccepted, setHasAccepted] = useState<string | null>(() => {
    return localStorage.getItem('ibs_disclaimer_accepted');
  });
  const { t, i18n } = useTranslation();
  const currentShortLang = i18n.language.startsWith('it') ? 'it' : 'en';

  useEffect(() => {
    if (hasAccepted === 'true') {
      onAccept();
    }
  }, [hasAccepted, onAccept]);

  const handleAccept = () => {
    setHasAccepted('true');
    localStorage.setItem('ibs_disclaimer_accepted', 'true');
    onAccept();
  };

  const isVisible = hasAccepted !== 'true';

  if (isVisible === null || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {/* Layout a flex + gap: la spaziatura non dipende dai margini globali di h2/p */}
      <div className="w-full max-w-3xl p-3 sm:p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-center flex flex-col gap-2 sm:gap-3">

        {/* Selettore lingua: il disclaimer compare prima dell'Header, quindi serve qui */}
        <div className="flex justify-center items-center gap-2">
          <label htmlFor="disclaimer-lang" className="text-xs text-(--text) font-medium">
            🌐 {t('disclaimer.language')}:
          </label>
          <select
            id="disclaimer-lang"
            value={currentShortLang}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="p-1 rounded-lg text-xs font-bold border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) cursor-pointer"
          >
            <option value="it">Italiano (IT)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>

        {/* Titolo */}
        <h2 className="m-0 text-base sm:text-xl font-semibold text-(--text-h) leading-snug">
          <span className="mr-2">⚠️</span>
          {t('disclaimer.title')}
        </h2>

        {/* Testo compatto e centrato, pensato per stare senza scorrimento */}
        <div className="flex flex-col gap-1.5 sm:gap-3 text-(--text) text-xs sm:text-sm leading-snug sm:leading-relaxed [@media(max-height:700px)]:text-[11px] [@media(max-height:700px)]:leading-tight">
          <p>
            <Trans i18nKey="disclaimer.p1" components={{ b: <strong /> }} />
          </p>
          <p className="font-semibold text-(--text-h)">{t('disclaimer.p2')}</p>
          <p>{t('disclaimer.p3')}</p>
          <p>{t('disclaimer.p4')}</p>
          <p>{t('disclaimer.p5')}</p>
        </div>

        {/* Pulsante */}
        <div className="pt-3 border-t border-(--border) flex justify-center">
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-6 py-2.5 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-md text-center text-sm"
          >
            {t('disclaimer.accept')}
          </button>
        </div>

      </div>
    </div>
  );
}
