import { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface MedicalDisclaimerProps {
  onAccept: () => void;
}

export default function MedicalDisclaimer({ onAccept }: MedicalDisclaimerProps) {
  const [hasAccepted, setHasAccepted] = useState<string | null>(() => {
    return localStorage.getItem('ibs_disclaimer_accepted');
  });
  const { t, i18n } = useTranslation();
  const supportedLangs = ['it', 'en', 'de', 'es', 'fr'];
  
  
  // Get current language - use a more robust approach that works during initialization
  const currentShortLang = supportedLangs.includes(i18n.language.slice(0, 2).toLowerCase())
    ? i18n.language.slice(0, 2).toLowerCase()
    : 'it'; // Default to Italian before initialization
  const hasAcceptedRef = useRef<string | null>(hasAccepted);

  useEffect(() => {
    hasAcceptedRef.current = hasAccepted;
  }, [hasAccepted]);

  useEffect(() => {
    // If the disclaimer was already accepted (e.g. from a previous session),
    // notify the parent so the app unlocks immediately. We call onAccept both
    // on mount (when the value comes from localStorage) and on every change,
    // guarded by the current accepted state.
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

  // Show loading while i18n is initializing
  if (!i18n.isInitialized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="w-full max-w-3xl p-3 sm:p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-center flex flex-col gap-2 sm:gap-3">
          <div className="flex justify-center items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-(--accent) border-t-transparent" aria-label="Loading..." />
          </div>
        </div>
      </div>
    );
  }

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
            <option value="de">Deutsch (DE)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
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
