import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { getBasePath } from './utils/navigation';

// Translation version for cache busting on translation updates
// Increment this when translation files are updated to force cache invalidation
// This helps PWA users get updated translations without manual cache clearing
export const TRANSLATION_VERSION = '2';

// Build timestamp for additional cache busting
export const BUILD_TIMESTAMP = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

// Debug: Log initialization
console.log('Initializing i18n...');

// Initialize i18n with basic configuration
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: typeof window !== 'undefined' ? (localStorage.getItem('i18nextLng') || navigator.language?.split('-')[0] || 'it') : 'it',
    fallbackLng: 'it',
    supportedLngs: ['it', 'en', 'de', 'es', 'fr'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      convertDetectedLanguage: (lng: string) => lng.split('-')[0],
    },
    react: {
      useSuspense: false,
      transSupportBasicHtmlNodes: true,
    },
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: (getBasePath() ? getBasePath() : '') + '/locales/{{lng}}/translation.json?v=' + TRANSLATION_VERSION,
    },
  });

// Debug: Log language state changes
const originalOn = i18n.on.bind(i18n);

// Override the on method to add debug logs
const debugOn = (event: string, callback: (...args: unknown[]) => void) => {
  if (event === 'languageChanged') {
    console.log('Language changed to:', i18n.language);
    console.log('LocalStorage i18nextLng:', localStorage.getItem('i18nextLng'));
  }
  if (event === 'initialized') {
    console.log('i18n initialized with language:', i18n.language);
  }
  return originalOn(event, callback);
};

// Apply the debug wrapper
i18n.on = debugOn as typeof i18n.on;

console.log('i18n initialized successfully.');

export default i18n;
