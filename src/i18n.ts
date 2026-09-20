import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Carica i file di traduzione dalla cartella /public/locales
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    backend: {
      // Percorso dove trovare i file JSON (fondamentale per GitHub Pages)
      loadPath: './locales/{{lng}}/translation.json'
    }
  });

export default i18n;
