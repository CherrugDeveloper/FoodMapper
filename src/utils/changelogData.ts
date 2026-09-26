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
    version: '1.4.0',
    date: '2026-09-26',
    features: {
      en: [
        'Developer tab restored in main navigation',
        'Tab navigation from Diet and Workout plans to calculator',
      ],
      it: [
        'Scheda Sviluppatore ripristinata nella navigazione principale',
        'Navigazione a schede dalla Dieta e dall\'Allenamento al calcolatore',
      ],
      de: [
        'Entwickler-Tab in der Hauptnavigation wiederhergestellt',
        'Tab-Navigation vom Ernährungs- und Trainingsplan zum Rechner',
      ],
      es: [
        'Pestaña Desarrollador restaurada en la navegación principal',
        'Navegación por pestañas desde Dieta y Entrenamiento al calculador',
      ],
      fr: [
        'Onglet Développeur restauré dans la navigation principale',
        'Navigation par onglets depuis le Régime et l\'Entraînement vers le calculateur',
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
      ],
      it: [
        'Migliorata l\'inizializzazione dello stato del piano alimentare quando i risultati del calcolatore sono disponibili',
      ],
      de: [
        'Verbesserte Initialisierung des Ernährungsplan-Status bei verfügbaren Rechnerergebnissen',
      ],
      es: [
        'Mejorada la inicialización del estado del plan alimentario cuando los resultados del calculador están disponibles',
      ],
      fr: [
        'Amélioration de l\'initialisation de l\'état du plan alimentaire lorsque les résultats du calculateur sont disponibles',
      ],
    },
  },
  {
    version: '1.0.0',
    date: '2024-01-15',
    features: {
      en: [
        'Initial release of IBS Nutrition App',
        'Low-FODMAP food database with 44 foods',
        'Structural requirements calculator',
        'Three-phase diet plan',
        'Daily diary tracking',
        'Meal planning and shopping list',
      ],
      it: [
        'Rilascio iniziale di IBS Nutrition App',
        'Database alimentare low-FODMAP con 44 alimenti',
        'Calcolatore dei fabbisogni strutturali',
        'Piano alimentare trifasico',
        'Tracciamento quotidiano nel diario',
        'Pianificazione dei pasti e lista della spesa',
      ],
      de: [
        'Erstveröffentlichung der IBS Nutrition App',
        'FODMAP-arme Lebensmitteldatenbank mit 44 Einträgen',
        'Rechner für strukturelle Bedürfnisse',
        'Dreiphasiger Ernährungsplan',
        'Tägliches Tagebuch-Tracking',
        'Mahlzeitenplanung und Einkaufsliste',
      ],
      es: [
        'Lanzamiento inicial de IBS Nutrition App',
        'Base de datos de alimentos baja en FODMAP con 44 alimentos',
        'Calculador de requerimientos estructurales',
        'Plan alimentario trifásico',
        'Seguimiento diario en el diario',
        'Planificación de comidas y lista de la compra',
      ],
      fr: [
        'Sortie initiale de l\'application IBS Nutrition',
        'Base de données d\'aliments pauvres en FODMAP avec 44 aliments',
        'Calculateur des besoins structurels',
        'Plan alimentaire triphasé',
        'Suivi quotidien du journal',
        'Planification des repas et liste de courses',
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
    date: '2024-03-20',
    features: {
      en: [
        'Seasonal food filtering by month',
        'Educational hub with articles',
        'Water reminder with notifications',
        'Device measurement tracking',
        'Multi-language support (5 languages)',
      ],
      it: [
        'Filtro stagionale degli alimenti per mese',
        'Hub educativo con articoli',
        'Promemoria acqua con notifiche',
        'Tracciamento misurazioni da dispositivi',
        'Supporto multilingua (5 lingue)',
      ],
      de: [
        'Saisonale Lebensmittelfilterung nach Monat',
        'Lernbereich mit Artikeln',
        'Wassererinnerung mit Benachrichtigungen',
        'Geräte-Messwert-Tracking',
        'Mehrsprachige Unterstützung (5 Sprachen)',
      ],
      es: [
        'Filtrado estacional de alimentos por mes',
        'Centro educativo con artículos',
        'Recordatorio de agua con notificaciones',
        'Seguimiento de mediciones de dispositivos',
        'Soporte multilingüe (5 idiomas)',
      ],
      fr: [
        'Filtrage saisonnier des aliments par mois',
        'Centre éducatif avec articles',
        'Rappel d\'eau avec notifications',
        'Suivi des mesures des appareils',
        'Support multilingue (5 langues)',
      ],
    },
    fixes: {
      en: [
        'Fixed food search filter performance',
        'Resolved date picker issue on mobile',
        'Fixed transit scale display bug',
      ],
      it: [
        'Corrette le prestazioni del filtro di ricerca alimenti',
        'Risolto problema del selettore data su mobile',
        'Corretto bug nella visualizzazione della scala del transito',
      ],
      de: [
        'Leistung des Lebensmittel-Suchfilters verbessert',
        'Problem mit der Datumsauswahl auf Mobilgeräten behoben',
        'Anzeigefehler der Transit-Skala behoben',
      ],
      es: [
        'Corregido el rendimiento del filtro de búsqueda de alimentos',
        'Resuelto problema del selector de fecha en móvil',
        'Corregido error de visualización de la escala de tránsito',
      ],
      fr: [
        'Correction des performances du filtre de recherche d\'aliments',
        'Résolution du problème de sélecteur de date sur mobile',
        'Correction du bug d\'affichage de l\'échelle de transit',
      ],
    },
    improvements: {
      en: [
        'Improved calculator biometric validation',
        'Enhanced diary nutritional summary',
        'Updated seasonal data for northern hemisphere',
      ],
      it: [
        'Migliorata la validazione biometrica del calcolatore',
        'Migliorato il riepilogo nutrizionale del diario',
        'Aggiornati i dati stagionali per l\'emisfero nord',
      ],
      de: [
        'Verbesserte biometrische Validierung des Rechners',
        'Verbesserte nährwertliche Zusammenfassung des Tagebuchs',
        'Saisonale Daten für die Nordhalbkugel aktualisiert',
      ],
      es: [
        'Mejorada la validación biométrica del calculador',
        'Mejorado el resumen nutricional del diario',
        'Actualizados los datos estacionales para el hemisferio norte',
      ],
      fr: [
        'Amélioration de la validation biométrique du calculateur',
        'Amélioration du résumé nutritionnel du journal',
        'Mise à jour des données saisonnières pour l\'hémisphère nord',
      ],
    },
  },
  {
    version: '1.2.0',
    date: '2024-06-10',
    features: {
      en: [
        'Advanced macro tracking with gram targets',
        'Micronutrient analysis (vitamins & minerals)',
        'Custom meal generation',
        'Phase progress visualization',
        'Export/import diary data',
      ],
      it: [
        'Tracciamento avanzato dei macro con target in grammi',
        'Analisi dei micronutrienti (vitamine e minerali)',
        'Generazione personalizzata dei pasti',
        'Visualizzazione del progresso delle fasi',
        'Esportazione/importazione dati del diario',
      ],
      de: [
        'Erweiterte Makro-Tracking mit Grammzielen',
        'Mikronährstoffanalyse (Vitamine & Mineralien)',
        'Benutzerdefinierte Mahlzeitengenerierung',
        'Visualisierung des Phasenfortschritts',
        'Export/Import von Tagebuchdaten',
      ],
      es: [
        'Seguimiento avanzado de macros con objetivos en gramos',
        'Análisis de micronutrientes (vitaminas y minerales)',
        'Generación personalizada de comidas',
        'Visualización del progreso de fases',
        'Exportación/importación de datos del diario',
      ],
      fr: [
        'Suivi avancé des macronutriments avec objectifs en grammes',
        'Analyse des micronutriments (vitamines et minéraux)',
        'Génération personnalisée des repas',
        'Visualisation de la progression des phases',
        'Exportation/importation des données du journal',
      ],
    },
    fixes: {
      en: [
        'Fixed protein target calculation edge case',
        'Resolved fiber target rounding issue',
        'Fixed seasonal filter month alignment',
      ],
      it: [
        'Corretto caso limite del calcolo del target proteico',
        'Risolto problema di arrotondamento del target di fibra',
        'Corretto allineamento del mese nel filtro stagionale',
      ],
      de: [
        'Grenzfall bei der Proteinzielberechnung behoben',
        'Rundungsproblem beim Ballaststoffziel behoben',
        'Ausrichtung des Monats im Saisonfilter korrigiert',
      ],
      es: [
        'Corregido caso límite del cálculo del objetivo proteico',
        'Resuelto problema de redondeo del objetivo de fibra',
        'Corregida alineación del mes en el filtro estacional',
      ],
      fr: [
        'Correction du cas limite du calcul de l\'objectif protéique',
        'Résolution du problème d\'arrondi de l\'objectif fibres',
        'Correction de l\'alignement du mois dans le filtre saisonnier',
      ],
    },
    improvements: {
      en: [
        'Enhanced EducationalHub article rendering',
        'Improved responsive design for all tabs',
        'Optimized food database search',
      ],
      it: [
        'Migliorata la resa degli articoli nell\'Hub educativo',
        'Migliorato il design responsivo per tutte le schede',
        'Ottimizzata la ricerca nel database alimentare',
      ],
      de: [
        'Verbesserte Darstellung von Artikeln im Lernbereich',
        'Verbessertes responsives Design für alle Tabs',
        'Lebensmitteldatenbanksuche optimiert',
      ],
      es: [
        'Mejorada la renderización de artículos en el Centro educativo',
        'Mejorado el diseño responsive para todas las pestañas',
        'Optimizada la búsqueda en la base de datos de alimentos',
      ],
      fr: [
        'Amélioration du rendu des articles du Centre éducatif',
        'Amélioration du design responsive pour tous les onglets',
        'Optimisation de la recherche dans la base de données alimentaire',
      ],
    },
  },
  {
    version: '1.3.0',
    date: '2024-09-05',
    features: {
      en: [
        'Developer card with donation links',
        'Changelog page with version history',
        'Bug report and feature request shortcuts',
        'Social media integration',
        'Version-aware help system',
      ],
      it: [
        'Scheda Sviluppatore con link donazioni',
        'Pagina Changelog con cronologia versioni',
        'Scorciatoie per segnalazione bug e richieste funzionalità',
        'Integrazione social media',
        'Sistema di aiuto consapevole della versione',
      ],
      de: [
        'Entwicklerkarte mit Spendenlinks',
        'Änderungsprotokoll-Seite mit Versionsverlauf',
        'Verknüpfungen für Fehlermeldungen und Funktionswünsche',
        'Social-Media-Integration',
        'Versionsbewusstes Hilfesystem',
      ],
      es: [
        'Tarjeta de Desarrollador con enlaces de donación',
        'Página de Registro de cambios con historial de versiones',
        'Accesos directos para reportar errores y solicitar funciones',
        'Integración con redes sociales',
        'Sistema de ayuda consciente de la versión',
      ],
      fr: [
        'Carte développeur avec liens de don',
        'Page du journal des modifications avec historique des versions',
        'Raccourcis pour signaler des bugs et suggérer des fonctionnalités',
        'Intégration des réseaux sociaux',
        'Système d\'aide conscient de la version',
      ],
    },
    fixes: {
      en: [
        'Fixed localization key consistency across all languages',
        'Resolved responsive navigation on small screens',
        'Fixed water reminder permission handling',
      ],
      it: [
        'Corretta coerenza delle chiavi di localizzazione in tutte le lingue',
        'Risolta navigazione responsive su schermi piccoli',
        'Corretta gestione dei permessi del promemoria acqua',
      ],
      de: [
        'Konsistenz der Lokalisierungsschlüssel in allen Sprachen korrigiert',
        'Responsive Navigation auf kleinen Bildschirmen behoben',
        'Berechtigungshandling der Wassererinnerung korrigiert',
      ],
      es: [
        'Corregida coherencia de claves de localización en todos los idiomas',
        'Resuelta navegación responsive en pantallas pequeñas',
        'Corregida gestión de permisos del recordatorio de agua',
      ],
      fr: [
        'Correction de la cohérence des clés de localisation dans toutes les langues',
        'Résolution de la navigation responsive sur les petits écrans',
        'Correction de la gestion des autorisations du rappel d\'eau',
      ],
    },
    improvements: {
      en: [
        'Enhanced dark mode support',
        'Improved accessibility (ARIA labels)',
        'Optimized bundle size by 15%',
      ],
      it: [
        'Migliorato supporto alla modalità scura',
        'Migliorata l\'accessibilità (etichette ARIA)',
        'Ottimizzata la dimensione del bundle del 15%',
      ],
      de: [
        'Verbesserter Dunkelmodus-Support',
        'Verbesserte Barrierefreiheit (ARIA-Labels)',
        'Bundle-Größe um 15% optimiert',
      ],
      es: [
        'Mejorado soporte del modo oscuro',
        'Mejorada accesibilidad (etiquetas ARIA)',
        'Optimizado el tamaño del bundle en un 15%',
      ],
      fr: [
        'Amélioration du support du mode sombre',
        'Amélioration de l\'accessibilité (labels ARIA)',
        'Optimisation de la taille du bundle de 15%',
      ],
    },
  },
];
