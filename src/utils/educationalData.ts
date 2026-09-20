export interface Article {
  id: string;
  title: string;
  category: 'Biochimica Base' | 'Fisiopatologia' | 'Protocolli Clinici';
  summary: string;
  content: string;
  pubmedLinks?: { text: string; url: string }[];
  prerequisites?: string[];
  nextSteps?: string[];
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
    prerequisites: [],
    nextSteps: ['meccanica-ibs'] // Collegamento in avanti verso il nuovo articolo
  },
  {
    id: 'meccanica-ibs',
    title: 'La Fisiopatologia dell\'IBS: Distensione Luminale ed Effetto Osmotico',
    category: 'Fisiopatologia',
    summary: 'Studio dei meccanismi fisici e neurologici che scatenano i sintomi gastrointestinali: l\'interazione tra molecole idrofile, gas e ipersensibilità viscerale.',
    content: `La Sindrome dell'Intestino Irritabile (IBS) non è un disturbo immaginario, ma una patologia multifattoriale caratterizzata da una alterazione dell'asse intestino-cervello, disfunzioni della motilità e ipersensibilità viscerale. I sintomi dolorosi non dipendono dal valore calorico dei cibi, ma da precisi fenomeni fisici che avvengono nel lume intestinale.

1. L'EFFETTO OSMOTICO (Il richiamo d'acqua):
Alcuni carboidrati a catena corta, in particolare i Polioli (come xilitolo, sorbitolo) e il Lattosio non digerito, sono molecole altamente idrofile e di piccole dimensioni. Quando transitano nell'intestino tenue e nel colon senza essere assorbite, esercitano una forte pressione osmotica, richiamando massicce quantità d'acqua all'interno del lume intestinale. Questo eccesso di liquidi fluidifica improvvisamente il chimo, accelerando il transito e provocando scariche diarroiche, crampi e borborigmi (i classici rumori intestinali).

2. LA FERMENTAZIONE BATTERICA RAPIDA (La produzione di gas):
Altre molecole, come gli Oligosaccaridi (Fruttani presenti nel frumento, aglio e cipolla, e Galattani nei legumi), non possono essere scisse per mancanza di enzimi specifici nel corpo umano. Al loro arrivo nel colon, la flora batterica residente (il microbiota) se ne serve come substrato energetico primario. I batteri avviano un processo di fermentazione biochimica estremamente rapido, i cui sottoprodotti gassosi includono idrogeno (H2), metano (CH4) e anidride carbonica (CO2).

3. LA DISTENSIONE LUMINALE E L'IPERSENSIBILITÀ VISCERALE:
La combinazione simultanea del volume d'acqua richiamato per osmosi e della massiccia produzione di gas da fermentazione crea una forte pressione sulle pareti del colon, nota come distensione luminale. In un individuo sano, questa dilatazione fisica viene percepita come un lieve e normale stimolo. Nei soggetti affetti da IBS, tuttavia, i meccanocettori intestinali sono ipersensibilizzati (ipersensibilità viscerale) e inviano segnali amplificati al sistema nervoso centrale, che il cervello interpreta come dolore acuto, coliche e gonfiore invalidante.`,
    pubmedLinks: [
      { text: 'Mechanisms of FODMAP-induced symptoms in IBS (PubMed)', url: 'https://nih.gov' },
      { text: 'Visceral hypersensitivity in Irritable Bowel Syndrome (NCBI)', url: 'https://nih.gov' }
    ],
    prerequisites: ['macro-biochimica'], // Richiede di aver capito i macronutrienti
    nextSteps: [] // Pronto per il modulo successivo
  }
];
