import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dizionario delle traduzioni per l'interfaccia fissa dell'applicazione
const resources = {
  it: {
    translation: {
      app_title: 'IBS Nutrition Guide',
      app_subtitle: 'Strumento scientifico basato sul protocollo FODMAP e sui fabbisogni cellulari strutturali.',
      calc_title: '⚙️ Parametri Biometrici e Intestinali',
      calc_weight: 'Peso (kg)',
      calc_height: 'Altezza (cm)',
      calc_age: 'Età (anni)',
      calc_sex: 'Sesso Biologico',
      calc_sex_f: 'Femmina',
      calc_sex_m: 'Maschio',
      calc_activity: 'Livello di Attività',
      calc_act_sed: 'Sedentario (Lavoro d\'ufficio)',
      calc_act_light: 'Attività Leggera (1-3 gg/sett)',
      calc_act_mod: 'Attività Moderata (3-5 gg/sett)',
      calc_act_very: 'Attività Intensa (Tutti i giorni)',
      calc_ibs: 'Sottotipo IBS Dominante',
      calc_btn: 'Calcola Fabbisogno Strutturale',
      report_title: '📊 Report Fabbisogno Basato su Evidenze'
    }
  },
  en: {
    translation: {
      app_title: 'IBS Nutrition Guide',
      app_subtitle: 'Science-based tool focused on the FODMAP protocol and structural cellular needs.',
      calc_title: '⚙️ Biometric & Gut Parameters',
      calc_weight: 'Weight (kg)',
      calc_height: 'Height (cm)',
      calc_age: 'Age (years)',
      calc_sex: 'Biological Sex',
      calc_sex_f: 'Female',
      calc_sex_m: 'Male',
      calc_activity: 'Activity Level',
      calc_act_sed: 'Sedentary (Desk job)',
      calc_act_light: 'Lightly Active (1-3 days/week)',
      calc_act_mod: 'Moderately Active (3-5 days/week)',
      calc_act_very: 'Very Active (Every day)',
      calc_ibs: 'Dominant IBS Subtype',
      calc_btn: 'Calculate Structural Requirements',
      report_title: '📊 Evidence-Based Requirements Report'
    }
  }
};

i18n
  .use(LanguageDetector) // Rileva la lingua del browser
  .use(initReactI18next)   // Inietta il sistema in React
  .init({
    resources,
    fallbackLng: 'en',     // Lingua di riserva se quella dell'utente non è disponibile
    interpolation: {
      escapeValue: false   // React gestisce già la sicurezza XSS
    }
  });

export default i18n;
