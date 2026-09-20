export interface Article {
  id: string;
  category: 'Biochimica Base' | 'Fisiopatologia' | 'Protocolli Clinici';
  pubmedLinks?: { text: string; url: string }[];
  prerequisites?: string[];
  nextSteps?: string[];
}

export const EDUCATIONAL_ARTICLES: Article[] = [
  {
    id: 'macro-biochimica',
    category: 'Biochimica Base',
    pubmedLinks: [
      { text: 'ISSN Protein Stand', url: 'https://nih.gov' }
    ],
    prerequisites: [],
    nextSteps: ['meccanica-ibs']
  },
  {
    id: 'meccanica-ibs',
    category: 'Fisiopatologia',
    pubmedLinks: [
      { text: 'Murray et al. - FODMAP Physiology', url: 'https://nih.gov' },
      { text: 'Visceral Hypersensitivity Insights', url: 'https://nih.gov' }
    ],
    prerequisites: ['macro-biochimica'],
    nextSteps: []
  }
];
