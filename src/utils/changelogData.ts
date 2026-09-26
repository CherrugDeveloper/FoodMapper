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
];
