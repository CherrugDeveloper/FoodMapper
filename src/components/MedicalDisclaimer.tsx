import { useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';

interface MedicalDisclaimerProps {
  onAccept: () => void;
  /** When true, forces the disclaimer to be visible even if accepted in localStorage */
  forceShow?: boolean;
}

export default function MedicalDisclaimer({ onAccept, forceShow = false }: MedicalDisclaimerProps) {
  const { isDisclaimerAccepted, onAcceptDisclaimer } = useAppContext();
  const { t } = useTranslation();
  
  const hasAcceptedRef = useRef<boolean>(isDisclaimerAccepted);

  useEffect(() => {
    hasAcceptedRef.current = isDisclaimerAccepted;
  }, [isDisclaimerAccepted]);

  useEffect(() => {
    // If the disclaimer was already accepted (e.g. from a previous session),
    // notify the parent so the app unlocks immediately. We call onAccept both
    // on mount (when the value comes from localStorage) and on every change,
    // guarded by the current accepted state.
    if (isDisclaimerAccepted && !forceShow) {
      onAccept();
    }
  }, [isDisclaimerAccepted, forceShow, onAccept]);

  const handleAccept = () => {
    onAcceptDisclaimer();
    onAccept();
  };

  const isVisible = !isDisclaimerAccepted || forceShow;

  if (!isVisible) return null;

  // Show the disclaimer with t fallback (t returns the key if no translation found).
  // We don't wait for i18n.isInitialized during language changes because the
  // preloading of all language bundles means translations are usually ready.
  // This also prevents the loading spinner from blocking language switching.

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="medical-disclaimer-title"
      data-testid="medical-disclaimer-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      {/* Layout a flex + gap: la spaziatura non dipende dai margini globali di h2/p */}
      <div className="w-full max-w-3xl p-3 sm:p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-center flex flex-col gap-3 sm:gap-4">

        {/* Titolo */}
        <h2 id="medical-disclaimer-title" className="m-0 text-base sm:text-xl font-semibold text-(--text-h) leading-snug">
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

        {/* Pulsante */}
        <div className="pt-4 border-t border-(--border) flex flex-col sm:flex-row items-center justify-between gap-3">
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