export type SupportedLang = 'en' | 'it' | 'de' | 'es' | 'fr';

export interface LocalizedChangelogSection {
  en: string[];
  it: string[];
  de: string[];
  es: string[];
  fr: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  features: LocalizedChangelogSection;
  fixes: LocalizedChangelogSection;
  improvements: LocalizedChangelogSection;
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: '2.2.0',
    date: '2026-09-27',
    features: {
      it: [
        'Riconoscimento farmaci con popup modale configurazione terapia completa (dosaggio, frequenza, orari)',
        'Sistema di notifica promemoria farmaci',
        'Calcolo avanzato dell\'impatto dei farmaci sui fabbisogni di micronutrienti e idratazione',
        'Banner permanente su dieta low-FODMAP e lattosio',
      ],
      en: [
        'Medication recognition with complete therapy configuration modal popup (dosage, frequency, schedule)',
        'Medication reminder notification system',
        'Advanced calculation of medication impact on micronutrient and hydration needs',
        'Permanent banner on low-FODMAP and lactose diet',
      ],
      de: [
        'Medikamentenerkennung mit Modal-Popup für vollständige Therapiekonfiguration (Dosierung, Häufigkeit, Einnahmezeiten)',
        'Erinnerungssystem für Medikamentenbenachrichtigungen',
        'Erweiterte Berechnung des Einflusses von Medikamenten auf Mikronährstoff- und Flüssigkeitsbedarf',
        'Dauerhafter Hinweis zu Low-FODMAP- und Laktose-Ernährung',
      ],
      es: [
        'Reconocimiento de medicamentos con popup modal para configuración de terapia completa (dosis, frecuencia, horarios)',
        'Sistema de notificaciones recordatorias de medicamentos',
        'Cálculo avanzado del impacto de fármacos en los requerimientos de micronutrientes e hidratación',
        'Banner permanente sobre dieta baja en FODMAP y lactosa',
      ],
      fr: [
        'Reconnaissance des médicaments avec popup modale pour configuration de thérapie complète (dosage, fréquence, horaires)',
        'Système de notification de rappel de médicaments',
        'Calcul avancé de l\'impact des médicaments sur les besoins en micronutriments et hydratation',
        'Bannière permanente sur le régime pauvre en FODMAP et le lactose',
      ],
    },
    fixes: {
      it: [
        'Risolto troncamento testi su condizioni di salute e allergeni',
        'Rimosso pulsante info duplicato per latte e derivati',
        'Ripristinata apertura popup info su hover con delay',
        'Riallineata icona info per medicinali assunti',
        'Rimosso box di ricerca farmaci superfluo',
      ],
      en: [
        'Fixed text truncation on health conditions and allergens',
        'Removed duplicated info button for milk and dairy',
        'Restored info popup opening on hover with delay',
        'Realigned info icon for taken medications',
        'Removed superfluous medication search box',
      ],
      de: [
        'Textabschneidung bei Gesundheitszuständen und Allergenen behoben',
        'Doppelte Info-Schaltfläche für Milch und Milchprodukte entfernt',
        'Öffnen von Info-Popups beim Hovern mit Verzögerung wiederhergestellt',
        'Info-Symbol für eingenommene Medikamente neu ausgerichtet',
        'Überflüssiges Medikamenten-Suchfeld entfernt',
      ],
      es: [
        'Corregido el truncamiento de texto en condiciones de salud y alérgenos',
        'Eliminado el botón de información duplicado para leche y derivados',
        'Restaurada la apertura del popup de información al pasar el cursor con retraso',
        'Realineado el icono de información para medicamentos tomados',
        'Eliminado el cuadro de búsqueda de medicamentos superfluo',
      ],
      fr: [
        'Correction de la troncature du texte sur les conditions de santé et allergènes',
        'Suppression du bouton d\'information en double pour le lait et produits laitiers',
        'Rétablissement de l\'ouverture du popup d\'information au survol avec délai',
        'Réalignement de l\'icône d\'information pour les médicaments pris',
        'Suppression de la boîte de recherche de médicaments superflue',
      ],
    },
    improvements: {
      it: [
        'Ottimizzazione layout e larghezza display',
        'Card condizioni/allergeni più spaziose e leggibili',
        'Miglioramento responsività form biometrico',
      ],
      en: [
        'Optimized layout and display width utilization',
        'More spacious and readable health conditions/allergens cards',
        'Improved responsiveness of biometric form',
      ],
      de: [
        'Optimiertes Layout und bessere Nutzung der Displaybreite',
        'Geräumigere und lesbarere Karten für Gesundheitszustände/Allergene',
        'Verbesserte Reaktionsfähigkeit des biometrischen Formulars',
      ],
      es: [
        'Optimización del diseño y aprovechamiento del ancho de pantalla',
        'Tarjetas de condiciones/alérgenos más amplias y legibles',
        'Mejora de la capacidad de respuesta del formulario biométrico',
      ],
      fr: [
        'Optimisation de la mise en page et de l\'utilisation de la largeur d\'affichage',
        'Cartes de conditions/allergènes plus spacieuses et lisibles',
        'Amélioration de la réactivité du formulaire biométrique',
      ],
    },
  },
  {
    version: '1.0.0',
    date: '2026-09-20',
    features: {
      en: [
        'Initial release of IBS Nutrition App',
        'Mifflin-St Jeor basal metabolism calculator with activity multiplier',
        'Low-FODMAP food database with Italian and English support',
        'Educational hub with scientific articles on nutrition and IBS',
      ],
      it: [
        'Rilascio iniziale di IBS Nutrition App',
        'Calcolatore del metabolismo basale con equazione di Mifflin-St Jeor e moltiplicatore attività',
        'Database alimentare low-FODMAP con supporto italiano e inglese',
        'Hub educativo con articoli scientifici su nutrizione e IBS',
      ],
      de: [
        'Erstveröffentlichung der IBS Nutrition App',
        'Grundumsatzrechner nach Mifflin-St Jeor mit Aktivitätsmultiplikator',
        'FODMAP-arme Lebensmitteldatenbank mit Italienisch- und Englisch-Unterstützung',
        'Lernbereich mit wissenschaftlichen Artikeln zu Ernährung und IBS',
      ],
      es: [
        'Lanzamiento inicial de IBS Nutrition App',
        'Calculador de metabolismo basal Mifflin-St Jeor con multiplicador de actividad',
        'Base de datos de alimentos baja en FODMAP con soporte italiano e inglés',
        'Centro educativo con artículos científicos sobre nutrición y SII',
      ],
      fr: [
        'Sortie initiale de l\'application IBS Nutrition',
        'Calculateur du métabolisme de base Mifflin-St Jeor avec multiplicateur d\'activité',
        'Base de données d\'aliments pauvres en FODMAP avec support italien et anglais',
        'Centre éducatif avec articles scientifiques sur la nutrition et le SII',
      ],
    },
    fixes: {
      en: [],
      it: [],
      de: [],
      es: [],
      fr: [],
    },
    improvements: {
      en: [],
      it: [],
      de: [],
      es: [],
      fr: [],
    },
  },
  {
    version: '1.1.0',
    date: '2026-09-21',
    features: {
      en: [
        'Full internationalization (i18n) with external JSON locales',
        'Multi-language calculator and food filter interfaces',
        'Differential diagnosis article and expanded clinical references',
        'Markdown-based educational content for FODMAP articles',
      ],
      it: [
        'Internazionalizzazione completa (i18n) con file JSON esterni',
        'Interfacce multilingua per calcolatore e filtri alimentari',
        'Articolo sulla diagnosi differenziale e riferimenti clinici ampliati',
        'Contenuti educativi in markdown per gli articoli sui FODMAP',
      ],
      de: [
        'Vollständige Internationalisierung (i18n) mit externen JSON-Dateien',
        'Mehrsprachige Benutzeroberflächen für Rechner und Lebensmittelfilter',
        'Artikel zur Differenzialdiagnose und erweiterte klinische Referenzen',
        'Markdown-basierte Lerninhalte für FODMAP-Artikel',
      ],
      es: [
        'Internacionalización completa (i18n) con archivos JSON externos',
        'Interfaces multilingües para calculadora y filtros de alimentos',
        'Artículo de diagnóstico diferencial y referencias clínicas ampliadas',
        'Contenido educativo en markdown para artículos sobre FODMAP',
      ],
      fr: [
        'Internationalisation complète (i18n) avec fichiers JSON externes',
        'Interfaces multilingues pour le calculateur et les filtres alimentaires',
        'Article sur le diagnostic différentiel et références cliniques étendues',
        'Contenu éducatif en markdown pour les articles sur les FODMAP',
      ],
    },
    fixes: {
      en: [
        'Fixed initial zero bug in numerical form fields',
        'Updated PubMed source URLs to stable direct article links',
      ],
      it: [
        'Corretto bug dello zero iniziale nei campi numerici del modulo',
        'Aggiornati gli URL delle fonti PubMed a link diretti stabili',
      ],
      de: [
        'Fehler mit anfänglicher Null in numerischen Formularfeldern behoben',
        'PubMed-Quell-URLs auf stabile direkte Artikel-Links aktualisiert',
      ],
      es: [
        'Corregido bug de cero inicial en campos numéricos del formulario',
        'Actualizadas las URL de fuentes PubMed a enlaces directos estables',
      ],
      fr: [
        'Correction du bug du zéro initial dans les champs numériques du formulaire',
        'Mise à jour des URL sources PubMed vers des liens directs stables',
      ],
    },
    improvements: {
      en: [
        'Refactored educational data into localized article structures',
        'Improved UI layout and language switcher accessibility',
      ],
      it: [
        'Rifattorizzazione dei dati educativi in strutture di articoli localizzati',
        'Miglioramento del layout UI e accessibilità del selettore lingua',
      ],
      de: [
        'Lehrinhalte in lokalisierte Artikelstrukturen umstrukturiert',
        'Verbessertes UI-Layout und Zugänglichkeit des Sprachwechslers',
      ],
      es: [
        'Refactorización de datos educativos en estructuras de artículos localizados',
        'Mejora del diseño de la interfaz y accesibilidad del selector de idioma',
      ],
      fr: [
        'Refonte des données éducatives en structures d\'articles localisés',
        'Amélioration de la mise en page UI et de l\'accessibilité du sélecteur de langue',
      ],
    },
  },
  {
    version: '1.2.0',
    date: '2026-09-22',
    features: {
      en: [
        'Tab navigation across Calculator, Diary, Diet, Workout, Foods and Encyclopedia',
        'Daily diary with meals, symptoms, transit scale and water tracking',
        'Three-phase diet plan with generated meals and portioned macros',
        'Animated workout plan with equipment-aware exercises',
        'Device measurement tracking tab (manual entry)',
        'Seasonal food filtering by month',
        'Expanded food database to 68 low-FODMAP items with micronutrients',
      ],
      it: [
        'Navigazione a schede tra Calcolo, Diario, Dieta, Allenamento, Alimenti ed Enciclopedia',
        'Diario quotidiano con pasti, sintomi, scala del transito e tracciamento acqua',
        'Piano alimentare trifasico con pasti generati e macro porzionati',
        'Piano di allenamento animato con esercizi adattati all\'attrezzatura',
        'Scheda tracciamento misurazioni da dispositivi (inserimento manuale)',
        'Filtro stagionale degli alimenti per mese',
        'Database alimentare ampliato a 68 elementi low-FODMAP con micronutrienti',
      ],
      de: [
        'Tab-Navigation zwischen Rechner, Tagebuch, Ernährungsplan, Training, Lebensmitteln und Enzyklopädie',
        'Tägliches Tagebuch mit Mahlzeiten, Symptomen, Transit-Skala und Wasser-Tracking',
        'Dreiphasiger Ernährungsplan mit generierten Mahlzeiten und portionierten Makros',
        'Animierter Trainingsplan mit geräteabhängigen Übungen',
        'Registerkarte zur manuellen Erfassung von Gerätemessungen',
        'Saisonale Lebensmittelfilterung nach Monat',
        'Lebensmitteldatenbank auf 68 FODMAP-arme Einträge mit Mikronährstoffen erweitert',
      ],
      es: [
        'Navegación por pestañas entre Calculadora, Diario, Dieta, Entrenamiento, Alimentos y Enciclopedia',
        'Diario diario con comidas, síntomas, escala de tránsito y seguimiento de agua',
        'Plan alimentario trifásico con comidas generadas y macros porcionados',
        'Plan de entrenamiento animado con ejercicios adaptados al equipo',
        'Pestaña de seguimiento de mediciones de dispositivos (entrada manual)',
        'Filtrado estacional de alimentos por mes',
        'Base de datos de alimentos ampliada a 68 elementos bajos en FODMAP con micronutrientes',
      ],
      fr: [
        'Navigation par onglets entre Calculateur, Journal, Régime, Entraînement, Aliments et Encyclopédie',
        'Journal quotidien avec repas, symptômes, échelle de transit et suivi de l\'eau',
        'Plan alimentaire triphasé avec repas générés et macros proportionnés',
        'Plan d\'entraînement animé avec exercices adaptés à l\'équipement',
        'Onglet de suivi des mesures des appareils (saisie manuelle)',
        'Filtrage saisonnier des aliments par mois',
        'Base de données alimentaire étendue à 68 éléments pauvres en FODMAP avec micronutriments',
      ],
    },
    fixes: {
      en: [
        'Resolved horizontal scrolling issues on narrow screens',
        'Fixed text overflow in calculation result cards',
      ],
      it: [
        'Risolto lo scrolling orizzontale su schermi stretti',
        'Corretto il traboccamento del testo nelle card dei risultati di calcolo',
      ],
      de: [
        'Horizontales Scrollen auf schmalen Bildschirmen behoben',
        'Textüberlauf in Berechnungsergebnis-Karten korrigiert',
      ],
      es: [
        'Resuelto el desplazamiento horizontal en pantallas estrechas',
        'Corregido el desbordamiento de texto en las tarjetas de resultados de cálculo',
      ],
      fr: [
        'Résolution du défilement horizontal sur les écrans étroits',
        'Correction du débordement de texte dans les cartes de résultats de calcul',
      ],
    },
    improvements: {
      en: [
        'Added micronutrient progress bars and nutritional warnings in diary',
        'Persisted calculator results across sessions',
        'Improved responsive design and translation coverage',
      ],
      it: [
        'Aggiunte barre di avanzamento micronutrienti e avvisi nutrizionali nel diario',
        'Salvaggio permanente dei risultati del calcolatore tra le sessioni',
        'Migliorato il design responsivo e la copertura delle traduzioni',
      ],
      de: [
        'Mikronährstoff-Fortschrittsbalken und Ernährungshinweise im Tagebuch hinzugefügt',
        'Rechnerergebnisse sitzungsübergreifend gespeichert',
        'Responsives Design und Übersetzungsabdeckung verbessert',
      ],
      es: [
        'Añadidas barras de progreso de micronutrientes y advertencias nutricionales en el diario',
        'Resultados del calculador persistentes entre sesiones',
        'Mejorado el diseño responsive y la cobertura de traducciones',
      ],
      fr: [
        'Ajout de barres de progression des micronutriments et avertissements nutritionnels dans le journal',
        'Persistance des résultats du calculateur entre les sessions',
        'Amélioration du design responsive et de la couverture des traductions',
      ],
    },
  },
  {
    version: '1.3.0',
    date: '2026-09-23',
    features: {
      en: [
        'German, Spanish and French locale support',
        'Recent days summary and chronological ordering in diary',
        'Extended hardcoded term translations across all tabs',
      ],
      it: [
        'Supporto per le lingue tedesca, spagnola e francese',
        'Riepilogo giorni recenti e ordinamento cronologico nel diario',
        'Traduzione estesa dei termini precedentemente hardcoded in tutte le schede',
      ],
      de: [
        'Unterstützung für Deutsch, Spanisch und Französisch',
        'Zusammenfassung der letzten Tage und chronologische Sortierung im Tagebuch',
        'Erweiterte Übersetzung zuvor hartcodierter Begriffe in allen Registerkarten',
      ],
      es: [
        'Soporte para idiomas alemán, español y francés',
        'Resumen de días recientes y orden cronológico en el diario',
        'Traducción extendida de términos codificados anteriormente en todas las pestañas',
      ],
      fr: [
        'Support des langues allemand, espagnol et français',
        'Résumé des jours récents et ordre chronologique dans le journal',
        'Traduction étendue des termes précédemment codés en dur dans tous les onglets',
      ],
    },
    fixes: {
      en: [
        'Fixed grid rendering issues with long words in calculation results',
        'Corrected typo in NutritionalCalculator component imports',
        'Reduced report title length for better layout',
      ],
      it: [
        'Corretto il problema di rendering della griglia con parole lunghe nei risultati di calcolo',
        'Corretto un typo negli import del componente NutritionalCalculator',
        'Ridotta la lunghezza del titolo del report per un layout migliore',
      ],
      de: [
        'Raster-Rendering-Probleme mit langen Wörtern in Berechnungsergebnissen behoben',
        'Tippfehler in den Imports der NutritionalCalculator-Komponente korrigiert',
        'Berichtstitel verkürzt für ein besseres Layout',
      ],
      es: [
        'Corregidos problemas de renderizado de cuadrícula con palabras largas en resultados de cálculo',
        'Corregido error tipográfico en las importaciones del componente NutritionalCalculator',
        'Reducida la longitud del título del informe para un mejor diseño',
      ],
      fr: [
        'Correction des problèmes de rendu de grille avec les mots longs dans les résultats de calcul',
        'Correction d\'une faute de frappe dans les imports du composant NutritionalCalculator',
        'Réduction de la longueur du titre du rapport pour une meilleure mise en page',
      ],
    },
    improvements: {
      en: [
        'Improved translation consistency across all 5 languages',
        'Enhanced diary UI with reset buttons and vitamin details',
      ],
      it: [
        'Migliorata la coerenza delle traduzioni in tutte e 5 le lingue',
        'Migliorata l\'interfaccia del diario con pulsanti di reset e dettagli sulle vitamine',
      ],
      de: [
        'Verbesserte Übersetzungskonsistenz in allen 5 Sprachen',
        'Verbesserte Tagebuch-UI mit Reset-Buttons und Vitamindetails',
      ],
      es: [
        'Mejorada la coherencia de las traducciones en los 5 idiomas',
        'Mejorada la interfaz del diario con botones de reinicio y detalles de vitaminas',
      ],
      fr: [
        'Amélioration de la cohérence des traductions dans les 5 langues',
        'Amélioration de l\'interface du journal avec boutons de réinitialisation et détails des vitamines',
      ],
    },
  },
  {
    version: '1.4.0',
    date: '2026-09-24',
    features: {
      en: [
        'Food groups management and exclusion filters for elimination phase',
        'Pregnancy and thyroid condition support in calculator',
        'Calorie goal options: maintenance, deficit and surplus',
        'Recipe management with custom recipe editing',
      ],
      it: [
        'Gestione gruppi alimentari e filtri di esclusione per la fase di eliminazione',
        'Supporto per gravidanza e condizioni tiroidee nel calcolatore',
        'Opzioni obiettivo calorico: mantenimento, deficit e surplus',
        'Gestione ricette con modifica di ricette personalizzate',
      ],
      de: [
        'Lebensmittelgruppenverwaltung und Ausschlussfilter für die Eliminationsphase',
        'Unterstützung von Schwangerschaft und Schilddrüsenbedingungen im Rechner',
        'Kalorienzieloptionen: Erhaltung, Defizit und Überschuss',
        'Rezeptverwaltung mit benutzerdefinierter Rezeptbearbeitung',
      ],
      es: [
        'Gestión de grupos de alimentos y filtros de exclusión para la fase de eliminación',
        'Soporte para embarazo y condiciones tiroideas en la calculadora',
        'Opciones de objetivo calórico: mantenimiento, déficit y superávit',
        'Gestión de recetas con edición de recetas personalizadas',
      ],
      fr: [
        'Gestion des groupes d\'aliments et filtres d\'exclusion pour la phase d\'élimination',
        'Prise en charge de la grossesse et des conditions thyroïdiennes dans le calculateur',
        'Options d\'objectif calorique: maintien, déficit et surplus',
        'Gestion des recettes avec édition de recettes personnalisées',
      ],
    },
    fixes: {
      en: [
        'Fixed disclaimer acceptance handling on startup',
        'Corrected fitness device identifier in measurements tab',
      ],
      it: [
        'Corretta la gestione dell\'accettazione del disclaimer all\'avvio',
        'Corretto l\'identificatore del dispositivo fitness nella scheda misurazioni',
      ],
      de: [
        'Behandlung der Disclaimer-Akzeptanz beim Start korrigiert',
        'Fitnessgeräte-Identifikator in der Messregisterkarte korrigiert',
      ],
      es: [
        'Corregida la gestión de la aceptación del aviso en el inicio',
        'Corregido el identificador del dispositivo de fitness en la pestaña de mediciones',
      ],
      fr: [
        'Correction de la gestion de l\'acceptation de l\'avis de non-responsabilité au démarrage',
        'Correction de l\'identifiant de l\'appareil de fitness dans l\'onglet des mesures',
      ],
    },
    improvements: {
      en: [
        'Refactored food data structure to support allergen and micronutrient details',
        'Improved medication warning localization',
      ],
      it: [
        'Rifattorizzata la struttura dati degli alimenti per supportare allergeni e dettagli micronutrienti',
        'Migliorata la localizzazione degli avvisi sui medicinali',
      ],
      de: [
        'Lebensmitteldatenstruktur für Allergen- und Mikronährstoffdetails umstrukturiert',
        'Lokalisierung der Medikamentenwarnungen verbessert',
      ],
      es: [
        'Reestructuración de los datos de alimentos para admitir alérgenos y detalles de micronutrientes',
        'Mejorada la localización de advertencias sobre medicamentos',
      ],
      fr: [
        'Refonte de la structure des données alimentaires pour prendre en charge les allergènes et les détails des micronutriments',
        'Amélioration de la localisation des avertissements sur les médicaments',
      ],
    },
  },
  {
    version: '1.5.0',
    date: '2026-09-25',
    features: {
      en: [
        'Vitest and Playwright test suites for unit and E2E coverage',
        'GitHub Actions CI/CD pipeline',
        'Bundle analyzer and code splitting with lazy loading',
        'Safe localStorage wrapper and validation utilities',
        'App-wide React context for state management',
      ],
      it: [
        'Suite di test Vitest e Playwright per copertura unitaria ed E2E',
        'Pipeline CI/CD con GitHub Actions',
        'Analizzatore del bundle e code splitting con lazy loading',
        'Wrapper sicuro per localStorage e utility di validazione',
        'Context React a livello app per la gestione dello stato',
      ],
      de: [
        'Vitest- und Playwright-Testsuites für Unit- und E2E-Abdeckung',
        'GitHub Actions CI/CD-Pipeline',
        'Bundle-Analyzer und Code-Splitting mit Lazy Loading',
        'Sicherer localStorage-Wrapper und Validierungsutilities',
        'App-weiter React-Context für das State Management',
      ],
      es: [
        'Conjuntos de pruebas Vitest y Playwright para cobertura unitaria y E2E',
        'Pipeline CI/CD con GitHub Actions',
        'Analizador de bundle y división de código con carga diferida',
        'Wrapper seguro de localStorage y utilidades de validación',
        'Contexto React a nivel de aplicación para gestión de estado',
      ],
      fr: [
        'Suites de tests Vitest et Playwright pour la couverture unitaire et E2E',
        'Pipeline CI/CD avec GitHub Actions',
        'Analyseur de bundle et découpage de code avec chargement différé',
        'Wrapper sécurisé pour localStorage et utilitaires de validation',
        'Contexte React à l\'échelle de l\'application pour la gestion d\'état',
      ],
    },
    fixes: {
      en: [
        'Fixed setState-during-render warning in Diary component',
        'Resolved relative base path configuration for GitHub Pages',
      ],
      it: [
        'Corretto l\'avviso setState-during-render nel componente Diary',
        'Risolta la configurazione del percorso base relativo per GitHub Pages',
      ],
      de: [
        'setState-during-Render-Warnung in der Diary-Komponente behoben',
        'Relative Basispfad-Konfiguration für GitHub Pages gelöst',
      ],
      es: [
        'Corregida la advertencia setState-during-render en el componente Diary',
        'Resuelta la configuración de ruta base relativa para GitHub Pages',
      ],
      fr: [
        'Correction de l\'avertissement setState-during-render dans le composant Diary',
        'Résolution de la configuration du chemin de base relatif pour GitHub Pages',
      ],
    },
    improvements: {
      en: [
        'Memoized Diary and useDietPlan calculations for better performance',
        'Migrated i18n to HTTP backend for dynamic translation loading',
        'Added type-safe micronutrient records across the engine',
      ],
      it: [
        'Memoizzazione dei calcoli di Diary e useDietPlan per migliori prestazioni',
        'Migrazione di i18n a backend HTTP per caricamento dinamico delle traduzioni',
        'Aggiunti record tipizzati per i micronutrienti in tutto il motore',
      ],
      de: [
        'Memoisierte Diary- und useDietPlan-Berechnungen für bessere Leistung',
        'i18n auf HTTP-Backend für dynamisches Laden von Übersetzungen migriert',
        'Typensichere Mikronährstoff-Records in der gesamten Engine hinzugefügt',
      ],
      es: [
        'Cálculos memoizados de Diary y useDietPlan para mejor rendimiento',
        'Migración de i18n a backend HTTP para carga dinámica de traducciones',
        'Añadidos registros tipados de micronutrientes en todo el motor',
      ],
      fr: [
        'Calculs mémoïsés de Diary et useDietPlan pour de meilleures performances',
        'Migration d\'i18n vers un backend HTTP pour le chargement dynamique des traductions',
        'Ajout d\'enregistrements typés de micronutriments dans tout le moteur',
      ],
    },
  },
  {
    version: '1.6.0',
    date: '2026-09-26',
    features: {
      en: [
        'Developer card restored in main navigation',
        'Changelog page with localized version history',
        'Equipment-aware workout filtering',
        'Editable shopping list items',
        'Notification bell for new app versions in header',
        'Dynamic article numbering in EducationalHub',
      ],
      it: [
        'Scheda Sviluppatore ripristinata nella navigazione principale',
        'Pagina Changelog con cronologia versioni localizzata',
        'Filtraggio degli allenamenti in base all\'attrezzatura',
        'Elementi della lista della spesa modificabili',
        'Campanella delle notifiche per nuove versioni nell\'header',
        'Numerazione dinamica degli articoli nell\'EducationalHub',
      ],
      de: [
        'Entwickler-Tab in der Hauptnavigation wiederhergestellt',
        'Änderungsprotokoll-Seite mit lokalisiertem Versionsverlauf',
        'Geräteabhängige Trainingsfilterung',
        'Bearbeitbare Einkaufslisteneinträge',
        'Benachrichtigungsglocke für neue App-Versionen im Header',
        'Dynamische Artikelnummerierung im Lernbereich',
      ],
      es: [
        'Pestaña Desarrollador restaurada en la navegación principal',
        'Página de Registro de cambios con historial de versiones localizado',
        'Filtrado de entrenamientos según equipo',
        'Elementos de la lista de la compra editables',
        'Campana de notificaciones para nuevas versiones de la app en el encabezado',
        'Numeración dinámica de artículos en el Centro educativo',
      ],
      fr: [
        'Onglet Développeur restauré dans la navigation principale',
        'Page du journal des modifications avec historique des versions localisé',
        'Filtrage des entraînements selon l\'équipement',
        'Éléments de la liste de courses modifiables',
        'Cloche de notification pour les nouvelles versions de l\'application dans l\'en-tête',
        'Numérotation dynamique des articles dans le Centre éducatif',
      ],
    },
    fixes: {
      en: [
        'Fixed infinite loading after calculator results in Diet Plan',
        'Fixed calendar navigation disabled before diet plan generation',
        'Fixed "Go to calculator" button in Diet Plan and Workout Plan',
        'Fixed Changelog to display real release version and date',
      ],
      it: [
        'Corretto caricamento infinito dopo i risultati del calcolatore nel Piano Alimentare',
        'Corretta navigazione calendario disabilitata prima della generazione della dieta',
        'Corretto pulsante "Vai al calcolatore" in Dieta e Allenamento',
        'Corretto Changelog per mostrare versione e data di rilascio reali',
      ],
      de: [
        'Endloses Laden nach Rechnerergebnissen im Ernährungsplan behoben',
        'Kalendernavigation vor Ernährungsplangenerierung deaktiviert behoben',
        '"Zum Rechner gehen"-Schaltfläche in Ernährungs- und Trainingsplan behoben',
        'Änderungsprotokoll zeigt nun echte Versionsnummer und Datum an',
      ],
      es: [
        'Corregida carga infinita tras los resultados del calculador en Plan Alimentario',
        'Corregida navegación del calendario desactivada antes de generar la dieta',
        'Corregido botón "Ir al calculador" en Dieta y Entrenamiento',
        'Corregido Registro de cambios para mostrar la versión y fecha de lanzamiento reales',
      ],
      fr: [
        'Correction du chargement infini après les résultats du calculateur dans le Plan alimentaire',
        'Correction de la navigation du calendrier désactivée avant la génération du régime',
        'Correction du bouton "Aller au calculateur" dans Régime et Entraînement',
        'Correction du journal des modifications pour afficher la vraie version et la date de publication',
      ],
    },
    improvements: {
      en: [
        'Improved diet plan state initialization when calculator results are available',
        'Localizations completed for developer links and changelog entries',
        'Real repository data and version pulled from package.json',
      ],
      it: [
        'Migliorata l\'inizializzazione dello stato del piano alimentare quando i risultati del calcolatore sono disponibili',
        'Completata la localizzazione dei link sviluppatore e delle voci del changelog',
        'Dati reali del repository e versione letti da package.json',
      ],
      de: [
        'Verbesserte Initialisierung des Ernährungsplan-Status bei verfügbaren Rechnerergebnissen',
        'Lokalisierung von Entwicklerlinks und Änderungsprotokolleinträgen abgeschlossen',
        'Echte Repository-Daten und Version aus package.json bezogen',
      ],
      es: [
        'Mejorada la inicialización del estado del plan alimentario cuando los resultados del calculador están disponibles',
        'Localizaciones completadas para enlaces de desarrollador y entradas del registro de cambios',
        'Datos reales del repositorio y versión obtenidos de package.json',
      ],
      fr: [
        'Amélioration de l\'initialisation de l\'état du plan alimentaire lorsque les résultats du calculateur sont disponibles',
        'Localisations terminées pour les liens développeur et les entrées du journal des modifications',
        'Données réelles du dépôt et version tirées de package.json',
      ],
    },
  },
  {
    version: '2.0.0',
    date: '2026-09-27',
    features: {
      en: [
        'Complete UI redesign of NutritionalCalculator with responsive layout fixes',
        'Structured medication selector with dosage, frequency, and time scheduling',
        'Medication reminder system with browser notifications',
        'Active conditions banner showing real-time effects in calculator results',
        'Improved button layouts with proper text truncation and InfoPopup positioning',
        'Removed double rounding in calorie calculations for consistency with diet plan',
        'Enhanced eutirox/levothyroxine detection in medication warnings',
      ],
      it: [
        'Ridisegno completo dell\'interfaccia di NutritionalCalculator con fix layout responsive',
        'Selettore farmaci strutturato con dosaggio, frequenza e orari',
        'Sistema reminder farmaci con notifiche browser',
        'Banner condizioni attive che mostra effetti in tempo reale nei risultati',
        'Layout bottoni migliorati con troncamento testo e posizionamento InfoPopup corretto',
        'Rimosso doppio arrotondamento calorie per coerenza con piano alimentare',
        'Migliorato rilevamento eutirox/levotiroxina negli avvisi farmaci',
      ],
      de: [
        'Komplette UI-Überarbeitung des NutritionalCalculator mit responsiven Layout-Fixes',
        'Strukturierter Medikamenten-Selektor mit Dosierung, Frequenz und Zeitplanung',
        'Medikamenten-Erinnerungssystem mit Browser-Benachrichtigungen',
        'Aktive-Bedingungen-Banner zeigt Echtzeit-Effekte in den Rechnerergebnissen',
        'Verbesserte Button-Layouts mit korrektem Text-Truncation und InfoPopup-Positionierung',
        'Doppeltes Runden bei Kalorienberechnungen entfernt für Konsistenz mit Ernährungsplan',
        'Verbesserte Eutirox/Levothyroxin-Erkennung in Medikamentenwarnungen',
      ],
      es: [
        'Rediseño completo de la UI de NutritionalCalculator con correcciones de layout responsive',
        'Selector de medicamentos estructurado con dosificación, frecuencia y horarios',
        'Sistema de recordatorios de medicamentos con notificaciones del navegador',
        'Banner de condiciones activas que muestra efectos en tiempo real en los resultados',
        'Layouts de botones mejorados con truncamiento de texto y posicionamiento InfoPopup correcto',
        'Eliminado el doble redondeo en cálculos de calorías para consistencia con plan de dieta',
        'Mejorada la detección de eutirox/levotiroxina en advertencias de medicamentos',
      ],
      fr: [
        'Refonte complète de l\'interface NutritionalCalculator avec corrections de layout responsive',
        'Sélecteur de médicaments structuré avec dosage, fréquence et planification horaire',
        'Système de rappels de médicaments avec notifications navigateur',
        'Bannière conditions actives affichant les effets en temps réel dans les résultats',
        'Layouts de boutons améliorés avec troncature de texte et positionnement InfoPopup correct',
        'Suppression du double arrondi dans les calculs de calories pour cohérence avec le plan alimentaire',
        'Amélioration de la détection eutirox/lévothyroxine dans les avertissements médicamenteux',
      ],
    },
    fixes: {
      en: [
        'Fixed horizontal scrolling issues on mobile devices',
        'Fixed text overflow in condition/allergen buttons',
        'Fixed duplicate InfoPopups on section titles',
        'Fixed calorie calculation double rounding inconsistency',
        'Fixed eutirox detection in medication warnings',
        'Fixed localStorage key consistency for disclaimer acceptance',
      ],
      it: [
        'Corretto scrolling orizzontale su dispositivi mobili',
        'Corretto traboccamento testo nei bottoni condizioni/allergeni',
        'Corretti InfoPopup duplicati sui titoli sezione',
        'Corretta inconsistenza doppio arrotondamento calorie',
        'Corretto rilevamento eutirox negli avvisi farmaci',
        'Corretta coerenza chiavi localStorage per accettazione disclaimer',
      ],
      de: [
        'Horizontales Scrollen auf Mobilgeräten behoben',
        'Textüberlauf in Bedingungs-/Allergen-Buttons behoben',
        'Doppelte InfoPopups bei Sektionsüberschriften behoben',
        'Inkonsistenz doppeltes Runden bei Kalorienberechnung behoben',
        'Eutirox-Erkennung in Medikamentenwarnungen behoben',
        'LocalStorage-Schlüssel-Konsistenz für Disclaimer-Akzeptanz behoben',
      ],
      es: [
        'Corregido desplazamiento horizontal en dispositivos móviles',
        'Corregido desbordamiento de texto en botones de condiciones/alérgenos',
        'Corregidos InfoPopups duplicados en títulos de sección',
        'Corregida inconsistencia de doble redondeo en cálculo de calorías',
        'Corregida detección de eutirox en advertencias de medicamentos',
        'Corregida consistencia de claves localStorage para aceptación de aviso',
      ],
      fr: [
        'Correction du défilement horizontal sur appareils mobiles',
        'Correction du débordement de texte dans les boutons conditions/allergènes',
        'Correction des InfoPopups dupliqués sur les titres de section',
        'Correction de l\'incohérence du double arrondi dans le calcul des calories',
        'Correction de la détection eutirox dans les avertissements médicamenteux',
        'Correction de la cohérence des clés localStorage pour l\'acceptation de la clause',
      ],
    },
    improvements: {
      en: [
        'Added version tracking in localStorage for future migrations',
        'Moved disclaimer acceptance key under foodmapper_ prefix for consistency',
        'Enhanced responsive design with min-w-0 on grid columns',
        'Improved accessibility with proper ARIA attributes on medication selector',
        'Better TypeScript types for structured medications',
      ],
      it: [
        'Aggiunto tracciamento versione in localStorage per future migrazioni',
        'Spostata chiave accettazione disclaimer sotto prefisso foodmapper_ per coerenza',
        'Design responsive migliorato con min-w-0 su colonne griglia',
        'Accessibilità migliorata con attributi ARIA corretti su selettore farmaci',
        'Migliori tipi TypeScript per farmaci strutturati',
      ],
      de: [
        'Versionsverfolgung in localStorage für zukünftige Migrationen hinzugefügt',
        'Disclaimer-Akzeptanz-Schlüssel unter foodmapper_-Präfix verschoben für Konsistenz',
        'Responsives Design mit min-w-0 auf Grid-Spalten verbessert',
        'Barrierefreiheit mit korrekten ARIA-Attributen im Medikamenten-Selektor verbessert',
        'Bessere TypeScript-Typen für strukturierte Medikamente',
      ],
      es: [
        'Añadido seguimiento de versión en localStorage para futuras migraciones',
        'Clave de aceptación de aviso movida bajo prefijo foodmapper_ para consistencia',
        'Diseño responsive mejorado con min-w-0 en columnas de cuadrícula',
        'Accesibilidad mejorada con atributos ARIA correctos en selector de medicamentos',
        'Mejores tipos TypeScript para medicamentos estructurados',
      ],
      fr: [
        'Ajout du suivi de version dans localStorage pour futures migrations',
        'Clé d\'acceptation de la clause déplacée sous préfixe foodmapper_ pour cohérence',
        'Design responsive amélioré avec min-w-0 sur colonnes de grille',
        'Accessibilité améliorée avec attributs ARIA corrects sur sélecteur médicaments',
        'Meilleurs types TypeScript pour médicaments structurés',
      ],
    },
  },
  {
    version: '2.1.0',
    date: '2026-09-27',
    features: {
      en: [
        'Medication selector with dosage, frequency, and time scheduling (MedicationSelector)',
        'Medication reminder card with browser notifications (MedicationReminder)',
        'Real diet start date (no longer hardcoded 2024-01-01)',
        'Active conditions banner in results column showing real-time effects',
      ],
      it: [
        'Selettore farmaci con dosaggio, frequenza e orari (MedicationSelector)',
        'Scheda reminder farmaci con notifiche browser (MedicationReminder)',
        'Data inizio dieta reale (non più hardcoded 2024-01-01)',
        'Banner condizioni attive nella colonna risultati con effetti in tempo reale',
      ],
      de: [
        'Medikamenten-Selektor mit Dosierung, Frequenz und Zeitplanung (MedicationSelector)',
        'Medikamenten-Erinnerungskarte mit Browser-Benachrichtigungen (MedicationReminder)',
        'Echtes Diät-Startdatum (nicht mehr hardcoded 2024-01-01)',
        'Aktive-Bedingungen-Banner in der Ergebnisspalte zeigt Echtzeit-Effekte',
      ],
      es: [
        'Selector de medicamentos con dosificación, frecuencia y horarios (MedicationSelector)',
        'Tarjeta de recordatorios de medicamentos con notificaciones del navegador (MedicationReminder)',
        'Fecha de inicio de dieta real (ya no hardcoded 2024-01-01)',
        'Banner de condiciones activas en la columna de resultados con efectos en tiempo real',
      ],
      fr: [
        'Sélecteur de médicaments avec dosage, fréquence et planification horaire (MedicationSelector)',
        'Carte de rappels de médicaments avec notifications navigateur (MedicationReminder)',
        'Date de début de régime réelle (plus hardcoded 2024-01-01)',
        'Bannière conditions actives dans la colonne résultats avec effets en temps réel',
      ],
    },
    fixes: {
      en: [
        'CRITICAL: Disclaimer localStorage key mismatch (migration ibs_disclaimer_accepted → foodmapper_disclaimer_accepted)',
        'HIGH: Fragile eutirox/levothyroxine detection (Map keyword→brand instead of parallel arrays)',
        'HIGH: Hardcoded diet start date in mealGenerator',
        'MEDIUM: Double rounding residue on estimatedTotalEnergyKcal (removed Math.round)',
        'UI: Duplicate info removed from condition/allergen section titles',
        'UI: Condition/allergen buttons - improved layout, text, and alignment',
        'UI: Responsive width - max-w-full, xl/2xl grids, biometric form 3 columns',
        'LOW: Double AppContext persistence optimized (useEffect only)',
      ],
      it: [
        'CRITICO: Mismatch chiave localStorage disclaimer (migrazione ibs_disclaimer_accepted → foodmapper_disclaimer_accepted)',
        'ALTO: Rilevamento eutirox/levotiroxina fragile (Map keyword→brand invece di array paralleli)',
        'ALTO: Data inizio dieta hardcoded in mealGenerator',
        'MEDIO: Doppio arrotondamento residuo su estimatedTotalEnergyKcal (rimosso Math.round)',
        'UI: Info duplicati rimossi dai titoli sezione condizioni/allergeni',
        'UI: Bottoni condizioni/allergeni - layout, testo e allineamento migliorati',
        'UI: Larghezza responsive - max-w-full, griglie xl/2xl, form biometrico 3 colonne',
        'BASSO: Doppia persistenza AppContext ottimizzata (solo useEffect)',
      ],
      de: [
        'KRITISCH: Disclaimer localStorage-Schlüssel-Mismatch (Migration ibs_disclaimer_accepted → foodmapper_disclaimer_accepted)',
        'HOCH: Brüchige Eutirox/Levothyroxin-Erkennung (Map Keyword→Marke statt paralleler Arrays)',
        'HOCH: Hardcodiertes Diät-Startdatum in mealGenerator',
        'MITTEL: Doppeltes Runden-Rest bei estimatedTotalEnergyKcal (Math.round entfernt)',
        'UI: Doppelte Infos aus Bedingungs-/Allergen-Sektionstiteln entfernt',
        'UI: Bedingungs-/Allergen-Buttons - verbessertes Layout, Text und Ausrichtung',
        'UI: Responsive Breite - max-w-full, xl/2xl-Gitter, biometrisches Formular 3 Spalten',
        'NIEDRIG: Doppelte AppContext-Persistenz optimiert (nur useEffect)',
      ],
      es: [
        'CRÍTICO: Desajuste de clave localStorage del aviso (migración ibs_disclaimer_accepted → foodmapper_disclaimer_accepted)',
        'ALTO: Detección frágil de eutirox/levotiroxina (Map keyword→brand en lugar de arrays paralelos)',
        'ALTO: Fecha de inicio de dieta hardcoded en mealGenerator',
        'MEDIO: Residuo de doble redondeo en estimatedTotalEnergyKcal (eliminado Math.round)',
        'UI: Info duplicados eliminados de títulos de sección condiciones/alérgenos',
        'UI: Botones condiciones/alérgenos - layout, texto y alineación mejorados',
        'UI: Ancho responsive - max-w-full, cuadrículas xl/2xl, formulario biométrico 3 columnas',
        'BAJO: Doble persistencia AppContext optimizada (solo useEffect)',
      ],
      fr: [
        'CRITIQUE: Incohérence clé localStorage disclaimer (migration ibs_disclaimer_accepted → foodmapper_disclaimer_accepted)',
        'ÉLEVÉ: Détection fragile eutirox/lévothyroxine (Map mot-clé→marque au lieu d\'arrays parallèles)',
        'ÉLEVÉ: Date de début de régime hardcoded dans mealGenerator',
        'MOYEN: Résidu double arrondi sur estimatedTotalEnergyKcal (Math.round supprimé)',
        'UI: Infos dupliquées supprimées des titres de section conditions/allergènes',
        'UI: Boutons conditions/allergènes - layout, texte et alignement améliorés',
        'UI: Largeur responsive - max-w-full, grilles xl/2xl, formulaire biométrique 3 colonnes',
        'FAIBLE: Double persistance AppContext optimisée (useEffect uniquement)',
      ],
    },
    improvements: {
      en: [
        'Calorie consistency calculator ↔ diet (rounding per goal: deficit=floor, surplus=ceil, maintenance=round to 50)',
        'Post-deploy data persistence with storage versioning and automatic migration',
        'Robust medication mapping with 7 keywords for levothyroxine (eutirox, tirosint, synthroid, etc.)',
      ],
      it: [
        'Coerenza calorie calcolatore ↔ dieta (arrotondamento per goal: deficit=floor, surplus=ceil, maintenance=round a 50)',
        'Persistenza dati post-deploy con storage versioning e migrazione automatica',
        'Mapping farmaci robusto con 7 keyword per levotiroxina (eutirox, tirosint, synthroid, etc.)',
      ],
      de: [
        'Kalorienkonsistenz Rechner ↔ Ernährungsplan (Rundung pro Ziel: Defizit=floor, Überschuss=ceil, Erhaltung=round auf 50)',
        'Datenpersistenz nach Deployment mit Storage-Versionierung und automatischer Migration',
        'Robustes Medikamenten-Mapping mit 7 Keywords für Levothyroxin (eutirox, tirosint, synthroid, etc.)',
      ],
      es: [
        'Consistencia de calorías calculador ↔ dieta (redondeo por objetivo: déficit=floor, superávit=ceil, mantenimiento=round a 50)',
        'Persistencia de datos post-despliegue con versionado de storage y migración automática',
        'Mapeo de medicamentos robusto con 7 keywords para levotiroxina (eutirox, tirosint, synthroid, etc.)',
      ],
      fr: [
        'Cohérence calories calculateur ↔ régime (arrondi par objectif: déficit=floor, surplus=ceil, maintien=round à 50)',
        'Persistance des données post-déploiement avec versioning storage et migration automatique',
        'Mapping médicaments robuste avec 7 mots-clés pour lévothyroxine (eutirox, tirosint, synthroid, etc.)',
      ],
    },
  },
];
