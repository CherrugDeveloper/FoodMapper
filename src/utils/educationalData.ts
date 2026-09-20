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
    // AGGIORNATO: Ora rimanda all'articolo sulla diagnosi differenziale
    nextSteps: ['diagnosi-differenziale'] 
  },
  {
    id: 'diagnosi-differenziale',
    category: 'Protocolli Clinici',
    pubmedLinks: [
      { text: 'WGO Guidelines - Irritable Bowel Syndrome', url: 'https://nih.gov' },
      { text: 'Fecal Calprotectin in Diagnostic Workup', url: 'https://nih.gov' }
    ],
    // AGGIORNATO: Richiede di aver compreso la meccanica dell'IBS
    prerequisites: ['meccanica-ibs'], 
    nextSteps: []
  }
];
