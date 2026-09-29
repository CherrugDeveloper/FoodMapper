import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

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
      order: ['navigator', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
      transSupportBasicHtmlNodes: true
    },
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: './locales/{{lng}}/translation.json'
    }
  });

export default i18n;
