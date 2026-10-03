import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Debug: Log initialization
console.log('Initializing i18n...');

// Initialize i18n with basic configuration
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'it',
    supportedLngs: ['it', 'en', 'de', 'es', 'fr'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
      transSupportBasicHtmlNodes: true,
    },
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
  });

// Debug: Log language state changes
const originalOn = i18n.on;

// Override the on method to add debug logs
const debugOn = (...args: any[]) => {
  const event = args[0];
  const callback = args[1];
  if (event === 'languageChanged') {
    console.log('Language changed to:', i18n.language);
    console.log('LocalStorage i18nextLng:', localStorage.getItem('i18nextLng'));
  }
  if (event === 'initialized') {
    console.log('i18n initialized with language:', i18n.language);
  }
  return originalOn(event as any, callback);
};

// Apply the debug wrapper
i18n.on = debugOn as typeof i18n.on;

console.log('i18n initialized successfully.');

export default i18n;
