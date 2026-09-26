export interface ChangelogEntry {
  version: string;
  date: string;
  features: string[];
  fixes: string[];
  improvements: string[];
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2024-01-15',
    features: [
      'Initial release of IBS Nutrition App',
      'Low-FODMAP food database with 44 foods',
      'Structural requirements calculator',
      'Three-phase diet plan',
      'Daily diary tracking',
      'Meal planning and shopping list',
    ],
    fixes: [],
    improvements: [],
  },
  {
    version: '1.1.0',
    date: '2024-03-20',
    features: [
      'Seasonal food filtering by month',
      'Educational hub with articles',
      'Water reminder with notifications',
      'Device measurement tracking',
      'Multi-language support (5 languages)',
    ],
    fixes: [
      'Fixed food search filter performance',
      'Resolved date picker issue on mobile',
      'Fixed transit scale display bug',
    ],
    improvements: [
      'Improved calculator biometric validation',
      'Enhanced diary nutritional summary',
      'Updated seasonal data for northern hemisphere',
    ],
  },
  {
    version: '1.2.0',
    date: '2024-06-10',
    features: [
      'Advanced macro tracking with gram targets',
      'Micronutrient analysis (vitamins & minerals)',
      'Custom meal generation',
      'Phase progress visualization',
      'Export/import diary data',
    ],
    fixes: [
      'Fixed protein target calculation edge case',
      'Resolved fiber target rounding issue',
      'Fixed seasonal filter month alignment',
    ],
    improvements: [
      'Enhanced EducationalHub article rendering',
      'Improved responsive design for all tabs',
      'Optimized food database search',
    ],
  },
  {
    version: '1.3.0',
    date: '2024-09-05',
    features: [
      'Developer card with donation links',
      'Changelog page with version history',
      'Bug report and feature request shortcuts',
      'Social media integration',
      'Version-aware help system',
    ],
    fixes: [
      'Fixed localization key consistency across all languages',
      'Resolved responsive navigation on small screens',
      'Fixed water reminder permission handling',
    ],
    improvements: [
      'Enhanced dark mode support',
      'Improved accessibility (ARIA labels)',
      'Optimized bundle size by 15%',
    ],
  },
];