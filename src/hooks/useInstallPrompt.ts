import { useEffect, useState, useCallback } from 'react';

/**
 * Tipo dell'evento beforeinstallprompt fornito da Chromium per le PWA.
 * Non è presente in tutti i browser, quindi lo dichiariamo esplicitamente.
 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface UseInstallPromptResult {
  /** Evento install prompt catturato, se disponibile. */
  installEvent: BeforeInstallPromptEvent | null;
  /** true se l'app è già installata (display-mode standalone). */
  isStandalone: boolean;
  /** Avvia il prompt di installazione nativo. */
  promptInstall: () => Promise<void>;
}

function getInitialStandaloneState(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

export function useInstallPrompt(): UseInstallPromptResult {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const isStandalone = getInitialStandaloneState();

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return;

    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallEvent(null);
      }
    } catch (error) {
      console.warn('[PWA] Install prompt failed:', error);
    }
  }, [installEvent]);

  return {
    installEvent,
    isStandalone,
    promptInstall,
  };
}
