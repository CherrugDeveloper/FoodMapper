export interface ArticleContent {
  title: string;
  summary: string;
  content: string;
}

export interface Article {
  id: string;
  category: 'Biochimica Base' | 'Fisiopatologia' | 'Protocolli Clinici';
  it: ArticleContent;
  en: ArticleContent;
  pubmedLinks?: { text: string; url: string }[];
  prerequisites?: string[];
  nextSteps?: string[];
}

export const EDUCATIONAL_ARTICLES: Article[] = [
  {
    id: 'macro-biochimica',
    category: 'Biochimica Base',
    it: {
      title: 'I Macronutrienti: Struttura Molecolare e Interazione Digestiva',
      summary: 'Analisi scientifica dei mattoni energetici e strutturali (Proteine, Carboidrati, Grassi) e del loro comportamento nel tratto gastrointestinale.',
      content: `I macronutrienti non sono semplici calderoni di calorie, ma aggregati molecolari che attivano risposte ormonali ed enzimatiche specifiche.

1. I CARBOIDRATI: Catene saccaridiche che determinano la fermentazione intestinale a seconda della lunghezza del legame.
2. LE PROTEINE: Essenziali per il mantenimento strutturale delle membrane epiteliali. Target suggerito: 1.6-2.2 g/kg.
3. I GRASSI: Regolatori della motilità, un eccesso può iper-stimolare il riflesso gastrocolico.`
    },
    en: {
      title: 'Macronutrients: Molecular Structure and Digestive Interaction',
      summary: 'Scientific analysis of structural energy blocks (Proteins, Carbohydrates, Fats) and their behavior in the GI tract.',
      content: `Macronutrients are not just containers of calories, but complex molecular aggregates that trigger specific enzymatic and hormonal responses.

1. CARBOHYDRATES: Saccharide chains that dictate intestinal fermentation based on link accessibility.
2. PROTEINS: Fundamental for structural maintenance of epithelial tight junctions. Target: 1.6-2.2 g/kg.
3. LIPIDS: Regulators of gastrointestinal motility; excessive loads can trigger visceral hypersensitivity.`
    },
    pubmedLinks: [
      { text: 'ISSN Protein Stand', url: 'https://nih.gov' }
    ],
    prerequisites: [],
    nextSteps: ['meccanica-ibs']
  },
  {
    id: 'meccanica-ibs',
    category: 'Fisiopatologia',
    it: {
      title: 'La Fisiopatologia dell\'IBS: Distensione Luminale ed Effetto Osmotico',
      summary: 'Studio dei meccanismi fisici e neurologici che scatenano i sintomi gastrointestinali nell\'IBS.',
      content: `I sintomi dolorosi dell'IBS derivano da precisi stress meccanici nel lume colonico.

1. EFFETTO OSMOTICO: Il richiamo d'acqua causato da molecole idrofile (come Lattosio e Polioli).
2. FERMENTAZIONE BATTERICA: La produzione rapida di gas (H2, CH4) da parte del microbiota che aggredisce i Fruttani.
3. DISTENSIONE LUMINALE: La dilatazione fisica che attiva i meccanocettori in un contesto di ipersensibilità viscerale.`
    },
    en: {
      title: 'IBS Pathophysiology: Luminal Distension and Osmotic Effect',
      summary: 'Study of physical and neurological mechanisms triggering gastrointestinal symptoms in IBS.',
      content: `Pain symptoms in IBS root from specific mechanical stress vectors inside the colonic lumen.

1. OSMOTIC EFFECT: Sudden fluid accumulation caused by unabsorbed hydrophilic molecules (Lactose, Polyols).
2. BACTERIAL FERMENTATION: Accelerated gas production (H2, CH4) by microbiota consuming Fructans.
3. LUMINAL DISTENSION: Physical tissue stretching that triggers hypersensitized visceral mechanoreceptors.`
    },
    pubmedLinks: [
      { text: 'Murray et al. - FODMAP Physiology', url: 'https://pubmed.ncbi.nlm.nih.gov/24859313/' },
      { text: 'Visceral Hypersensitivity Insights', url: 'https://pubmed.ncbi.nlm.nih.gov/30740615/' }
    ],
    prerequisites: ['macro-biochimica'],
    nextSteps: []
  }
];
