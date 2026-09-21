import { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface MedicalDisclaimerProps {
  onAccept: () => void;
}

export default function MedicalDisclaimer({ onAccept }: MedicalDisclaimerProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const { t, i18n } = useTranslation();
  const currentShortLang = i18n.language.startsWith('it') ? 'it' : 'en';

  useEffect(() => {
    const hasAccepted = localStorage.getItem('ibs_disclaimer_accepted');
    if (hasAccepted === 'true') {
      onAccept();
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem('ibs_disclaimer_accepted', 'true');
    setIsVisible(false);
    onAccept();
  };

  if (isVisible === null || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl p-6 md:p-8 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-left">

        {/* Selettore lingua: il disclaimer compare prima dell'Header, quindi serve qui */}
        <div className="flex justify-end items-center gap-2 mb-2">
          <label htmlFor="disclaimer-lang" className="text-xs text-(--text) font-medium">
            🌐 {t('disclaimer.language')}:
          </label>
          <select
            id="disclaimer-lang"
            value={currentShortLang}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="p-1.5 rounded-lg text-xs font-bold border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) cursor-pointer"
          >
            <option value="it">Italiano (IT)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>

        {/* Intestazione */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-2xl font-(--heading) text-(--text-h) m-0">
            {t('disclaimer.title')}
          </h2>
        </div>

        <div className="space-y-4 text-(--text) text-sm md:text-base leading-relaxed mb-6">
          <p>
            <Trans i18nKey="disclaimer.p1" components={{ b: <strong /> }} />
          </p>
          <p className="font-semibold text-(--text-h)">{t('disclaimer.p2')}</p>
          <p>{t('disclaimer.p3')}</p>
          <p>{t('disclaimer.p4')}</p>
          <p>{t('disclaimer.p5')}</p>
        </div>

        {/* Pulsante */}
        <div className="pt-4 border-t border-(--border) flex justify-end">
          <button
            onClick={handleAccept}
            className="w-full md:w-auto px-6 py-3 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-md text-center"
          >
            {t('disclaimer.accept')}
          </button>
        </div>

      </div>
    </div>
  );
}
