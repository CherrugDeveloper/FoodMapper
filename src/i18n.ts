import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importazione diretta e sicura dei file di lingua (Zero bug di percorso su GitHub Pages)
import translationIT from '../public/locales/it/translation.json';
import translationEN from '../public/locales/en/translation.json';

const resources = {
  it: { translation: translationIT },
  en: { translation: translationEN }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
