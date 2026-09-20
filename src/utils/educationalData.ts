export interface Article {
  id: string;
  title: string;
  category: 'Biochimica Base' | 'Fisiopatologia' | 'Protocolli Clinici';
  summary: string;
  content: string; // Testo dettagliato, supporta la formattazione a paragrafi
  pubmedLinks?: { text: string; url: string }[];
  prerequisites?: string[]; // ID degli articoli consigliati prima di questo
  nextSteps?: string[];     // ID degli articoli per approfondire dopo questo
}

export const EDUCATIONAL_ARTICLES: Article[] = [
  {
    id: 'macro-biochimica',
    title: 'I Macronutrienti: Struttura Molecolare e Interazione Digestiva',
    category: 'Biochimica Base',
    summary: 'Analisi scientifica dei mattoni energetici e strutturali (Proteine, Carboidrati, Grassi) e del loro comportamento nel tratto gastrointestinale.',
    content: `I macronutrienti non sono semplici contenitori di calorie, ma complessi aggregati molecolari che attivano risposte ormonali, enzimatiche e meccaniche specifiche lungo tutto il tubo digerente. La visione termodinamica della "caloria" ignora l'aspetto fondamentale della cinetica digestiva: come il corpo scompone e reagisce a queste molecole.

1. I CARBOIDRATI (I mattoni della fermentazione):
Dal punto di vista chimico, sono catene di polidrossialdeidi o polidrossichetoni. Si dividono in monosaccaridi (glucosio, fruttosio), disaccaridi (lattosio, saccarosio), oligosaccaridi e polisaccaridi. La lunghezza e il tipo di legame chimico tra queste unità determinano dove e come il carboidrato verrà digerito. Se i legami non sono scindibili dagli enzimi umani (come le fibre) o se i trasportatori cellulari sono saturi (come nel malassorbimento del fruttosio), queste molecole proseguono intatte verso l'intestino crasso, diventando il substrato energetico per la flora batterica.

2. LE PROTEINE (I componenti strutturali):
Formate da catene di amminoacidi legati da legami peptidici. La loro digestione inizia nello stomaco tramite l'acido cloridrico e l'enzima pepsina, per poi completarsi nel duodeno. A differenza dei carboidrati, le proteine non subiscono fermentazione gassosa primaria nel colon. Dal punto di vista clinico, gli amminoacidi sono essenziali per il ripristino della barriera epiteliale intestinale (le "tight junctions") spesso compromessa in caso di stati infiammatori. Il target ottimale suggerito dalla letteratura scientifica per preservare la massa magra e ottimizzare i processi plastici varia tra 1.6g e 2.2g per chilogrammo di peso corporeo.

3. I GRASSI (I regolatori della motilità):
I trigliceridi (composti da glicerolo e tre acidi grassi) sono la principale fonte di lipidi alimentari. Non contengono zuccheri e non possono fermentare. Tuttavia, i grassi richiedono una complessa emulsione da parte dei sali biliari e l'intervento delle lipasi pancreatiche. Un carico lipidico eccessivo o concentrato in un solo pasto attiva in modo violento il riflesso gastrocolico tramite il rilascio di colecistochinina (CCK) e neurotensina. Questo meccanismo accelera o altera la motilità del colon, scatenando contrazioni dolorose e scariche evacuative nei soggetti affetti da ipersensibilità viscerale.`,
    pubmedLinks: [
      { text: 'ISSN Exercise & Sports Nutrition Review (Proteins)', url: 'https://nih.gov' },
      { text: 'Review on Gastrointestinal Motility and Lipids (NCBI)', url: 'https://nih.gov' }
    ],
    prerequisites: [], // Essendo il primo, non ha prerequisiti
    nextSteps: ['meccanica-ibs'] // Rimanda all'articolo successivo (che creeremo dopo)
  }
];
