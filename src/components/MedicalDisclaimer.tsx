import { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { disclaimerStorage } from '../utils/storage';

interface MedicalDisclaimerProps {
  onAccept: () => void;
}

export default function MedicalDisclaimer({ onAccept }: MedicalDisclaimerProps) {
  const [hasAccepted, setHasAccepted] = useState<boolean>(() => {
    return disclaimerStorage.get();
  });
  const { t, i18n } = useTranslation();
  const supportedLangs = ['it', 'en', 'de', 'es', 'fr'];
  
  
  // Get current language - use a more robust approach that works during initialization
  const currentShortLang = supportedLangs.includes(i18n.language.slice(0, 2).toLowerCase())
    ? i18n.language.slice(0, 2).toLowerCase()
    : 'it'; // Default to Italian before initialization
  const hasAcceptedRef = useRef<boolean>(hasAccepted);

  useEffect(() => {
    hasAcceptedRef.current = hasAccepted;
  }, [hasAccepted]);

  useEffect(() => {
    // If the disclaimer was already accepted (e.g. from a previous session),
    // notify the parent so the app unlocks immediately. We call onAccept both
    // on mount (when the value comes from localStorage) and on every change,
    // guarded by the current accepted state.
    if (hasAccepted) {
      onAccept();
    }
  }, [hasAccepted, onAccept]);

  const handleAccept = () => {
    setHasAccepted(true);
    disclaimerStorage.set(true);
    onAccept();
  };

  const isVisible = !hasAccepted;

  if (!isVisible) return null;

  // Show loading while i18n is initializing
  if (!i18n.isInitialized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div className="w-full max-w-3xl p-3 sm:p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-center flex flex-col gap-2 sm:gap-3">
          <div className="flex justify-center items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-(--accent) border-t-transparent" aria-label="Loading..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Layout a flex + gap: la spaziatura non dipende dai margini globali di h2/p */}
      <div className="w-full max-w-3xl p-3 sm:p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-center flex flex-col gap-3 sm:gap-4">

        {/* Titolo */}
        <h2 className="m-0 text-base sm:text-xl font-semibold text-(--text-h) leading-snug">
          ⚠️ {t('disclaimer.title')}
        </h2>

        {/* AI-generated text disclosure - card/box prominente */}
        <div className="rounded-lg bg-(--code-bg) border border-(--border) p-3 sm:p-4 text-left">
          <p className="text-[11px] sm:text-sm text-(--text-muted) italic leading-relaxed">
            <Trans i18nKey="disclaimer.ai_text" components={{ b: <strong /> }} />
          </p>
        </div>

        {/* Testo compatto e centrato, pensato per stare senza scorrimento */}
        <div className="flex flex-col gap-2.5 sm:gap-4 text-(--text) text-xs sm:text-sm leading-snug sm:leading-relaxed [@media(max-height:700px)]:text-[11px] [@media(max-height:700px)]:leading-tight text-left">
          <p>
            <Trans i18nKey="disclaimer.p1" components={{ b: <strong /> }} />
          </p>
          <p className="font-semibold text-(--text-h)">
            <Trans i18nKey="disclaimer.p2" components={{ b: <strong /> }} />
          </p>
          <p>
            <Trans i18nKey="disclaimer.p3" components={{ b: <strong /> }} />
          </p>
          <p>
            <Trans i18nKey="disclaimer.p4" components={{ b: <strong /> }} />
          </p>
          <p>
            <Trans i18nKey="disclaimer.p5" components={{ b: <strong /> }} />
          </p>
        </div>

        {/* Linguaggio + Pulsante */}
        <div className="pt-4 border-t border-(--border) flex flex-col sm:flex-row items-center justify-between gap-3">
          <select
            aria-label="Language selector"
            value={currentShortLang}
            onChange={(e) => {
              const lang = e.target.value;
              if (supportedLangs.includes(lang)) {
                i18n.changeLanguage(lang);
              }
            }}
            className="p-2 rounded-lg text-[11px] sm:text-xs font-bold border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) cursor-pointer w-full sm:w-auto"
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-8 py-3 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg text-center text-sm min-w-45"
          >
            {t('disclaimer.accept')}
          </button>
        </div>

      </div>
    </div>
  );
}
