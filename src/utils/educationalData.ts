import decodificaFodmapIT from '../content/decodifica-fodmap.it.md?raw';
import decodificaFodmapEN from '../content/decodifica-fodmap.en.md?raw';

export interface LocalizedContent {
  title: string;
  summary: string;
  content: string;
}

export interface Article {
  id: string;
  markdown?: boolean;
  category: 'Biochimica Base' | 'Fisiopatologia' | 'Protocolli Clinici';
  pubmedLinks?: { text: string; url: string }[];
  prerequisites?: string[];
  nextSteps?: string[];
  it: LocalizedContent;
  en: LocalizedContent;
}

export const EDUCATIONAL_ARTICLES: Article[] = [
  {
    id: 'macro-biochimica',
    category: 'Biochimica Base',
    pubmedLinks: [
      { text: 'Jäger R. et al. (2017) - International Society of Sports Nutrition Position Stand: protein and exercise. J Int Soc Sports Nutr 14:20', url: 'https://doi.org/10.1186/s12970-017-0177-8' },
      { text: 'Feinle-Bisset C., Azpiroz F. (2013) - Dietary lipids and functional gastrointestinal disorders. Am J Gastroenterol 108(5):737-747', url: 'https://hdl.handle.net/2440/79126' }
    ],
    prerequisites: [],
    nextSteps: ['meccanica-ibs'],
    it: {
      title: 'I Macronutrienti: Struttura Molecolare e Interazione Digestiva',
      summary: 'Analisi scientifica dei mattoni energetici e strutturali (Proteine, Carboidrati, Grassi) e del loro comportamento nel tratto gastrointestinale.',
      content: `I macronutrienti non sono semplici calderoni di calorie, ma aggregati molecolari che attivano risposte ormonali ed enzimatiche specifiche lungo tutto il tubo digerente.

1. I CARBOIDRATI (I mattoni della fermentazione):
Dal punto di vista chimico, sono catene saccaridiche. Se i legami non sono scindibili dagli enzimi umani (come le fibre) o se i trasportatori cellulari sono saturi (come nel malassorbimento del fruttosio), queste molecole proseguono intatte verso l'intestino crasso, diventando il substrato energetico per la flora batterica.

2. LE PROTEINE (I components strutturali):
Formate da catene di amminoacidi. Non subiscono fermentazione gassosa primaria nel colon. Dal punto di vista clinico, gli amminoacidi sono essenziali per il ripristino della barriera epiteliale intestinale. Il target ottimale suggerito varia tra 1.6g e 2.2g per chilogrammo di peso corporeo.

3. I GRASSI (I regolatori della motilità):
I trigliceridi non contengono zuccheri e non possono fermentare. Tuttavia, richiedono una complessa emulsione da parte dei sali biliari. Un carico lipidico eccessivo attiva in modo violento il riflesso gastrocolico, accelerando o alterando la motilità del colon nei soggetti affetti da ipersensibilità viscerale.`
    },
    en: {
      title: 'Macronutrients: Molecular Structure and Digestive Interaction',
      summary: 'Scientific analysis of structural energy blocks (Proteins, Carbohydrates, Fats) and their behavior in the GI tract.',
      content: `Macronutrients are not just containers of calories, but complex molecular aggregates that trigger specific enzymatic and hormonal responses.

1. CARBOHYDRATES (The fermentation building blocks):
Chemical sugar chains. If links cannot be broken by human enzymes (like fiber) or cellular transporters are saturated (as in fructose malabsorption), these molecules proceed intact into the large intestine, feeding gut bacteria.

2. PROTEINS (The structural components):
Amino acid chains. They do not undergo primary gaseous fermentation in the colon. Clinically, amino acids are critical for repairing intestinal epithelial tight junctions. Optimal target ranges between 1.6g and 2.2g per kilogram of body weight.

3. LIPIDS (The motility regulators):
Triglycerides contain no sugars and cannot ferment. However, they require complex bile salt emulsion. An excessive fat load violently activates the gastrocolic reflex, altering colonic motility in patients with visceral hypersensitivity.`
    }
  },
  {
    id: 'meccanica-ibs',
    category: 'Fisiopatologia',
    pubmedLinks: [
      { text: 'Murray K. et al. (2014) - Differential effects of FODMAPs on small and large intestinal contents in healthy subjects shown by MRI. Am J Gastroenterol 109(1):110-119', url: 'https://doi.org/10.1038/ajg.2013.386' },
      { text: 'Deiteren A. et al. (2016) - Irritable bowel syndrome and visceral hypersensitivity: risk factors and pathophysiological mechanisms. Acta Gastroenterol Belg 79(1):29-38', url: 'https://pubmed.ncbi.nlm.nih.gov/26852761/' }
    ],
    prerequisites: ['macro-biochimica'],
    nextSteps: ['diagnosi-differenziale'],
    it: {
      title: 'La Fisiopatologia dell\'IBS: Distensione Luminale ed Effetto Osmotico',
      summary: 'Studio dei meccanismi fisici e neurologici che scatenano i sintomi gastrointestinali nell\'IBS.',
      content: `I sintomi dolorosi dell'IBS derivano da precisi stress meccanici nel lume colonico.

1. L'EFFETTO OSMOTICO (Il richiamo d'acqua):
I Polioli (sorbitolo, xilitolo) e il Lattosio non digerito sono molecole idrofile. Richiamano massicce quantità d'acqua all'interno del lume intestinale, fluidificando improvvisamente il chimo e provocando scariche diarroiche e crampi.

2. LA FERMENTAZIONE BATTERICA RAPIDA (La produzione di gas):
Gli Oligosaccaridi (Fruttani nel frumento, Galattani nei legumi) arrivano intatti nel colon. La flora batterica residente avvia una fermentazione biochimica estremamente rapida, producendo idrogeno (H2) e metano (CH4).

3. LA DISTENSIONE LUMINALE E L'IPERSENSIBILITÀ VISCERALE:
La combinazione del volume d'acqua e dei gas crea una forte pressione sulle pareti del colon (distensione luminale). Nei soggetti affetti da IBS, i meccanocettori intestinali sono ipersensibilizzati e inviano segnali amplificati al cervello, che li interpreta come dolore acuto e gonfiore.`
    },
    en: {
      title: 'IBS Pathophysiology: Luminal Distension and Osmotic Effect',
      summary: 'Study of physical and neurological mechanisms triggering gastrointestinal symptoms in IBS.',
      content: `Pain symptoms in IBS root from specific mechanical stress vectors inside the colonic lumen.

1. THE OSMOTIC EFFECT (Water recruitment):
Polyols and undigested Lactose are highly hydrophilic molecules. They exert osmotic pressure, pulling water into the intestinal lumen, liquefying the chyme, and triggering diarrheal episodes and cramping.

2. RAPID BACTERIAL FERMENTATION (Gas production):
Oligosaccharides (Fructans, Galactans) reach the colon untouched. Resident microbiota rapidly ferments them, yielding massive gaseous byproducts like hydrogen (H2) and methane (CH4).

3. LUMINAL DISTENSION AND VISCERAL HYPERSENSITIVITY:
Water recruitment and gas production trigger a strong mechanical wall stretching (luminal distension). In IBS patients, gut mechanoreceptors are hypersensitized and send amplified distress signals that the brain decodes as sharp pain and debilitating bloating.`
    }
  },
  {
    id: 'diagnosi-differenziale',
    category: 'Protocolli Clinici',
    pubmedLinks: [
      { text: 'Quigley E.M.M. et al. (2016) - World Gastroenterology Organisation Global Guidelines: Irritable bowel syndrome, a global perspective (update September 2015). J Clin Gastroenterol 50(9):704-713', url: 'https://doi.org/10.1097/MCG.0000000000000653' },
      { text: 'Menees S.B. et al. (2015) - A meta-analysis of the utility of C-reactive protein, erythrocyte sedimentation rate, fecal calprotectin, and fecal lactoferrin to exclude inflammatory bowel disease in adults with IBS. Am J Gastroenterol 110(3):444-454', url: 'https://doi.org/10.1038/ajg.2015.6' }
    ],
    prerequisites: ['meccanica-ibs'],
    // AGGIORNATO: Ora collega l'articolo 3 al nuovo articolo 4
    nextSteps: ['decodifica-fodmap'], 
    it: {
      title: 'Diagnosi Differenziale: IBS vs IBD, Celiachia e Neoplasie',
      summary: 'Analisi dei marker clinici e degli esami necessari per escludere patologie organiche speculari prima di intraprendere una dieta di esclusioni.',
      content: `L'IBS è una patologia funzionale. Poiché i suoi sintomi mimano perfettamente patologie organiche gravi, la diagnosi differenziale è il primo step clinico tassativo.

1. CELIACHIA (Patologia Autoimmune):
Provocata dall'ingestione di glutine. Causa l'atrofia dei villi intestinali. È fondamentale eseguire il dosaggio ematico degli anticorpi (Anti-tTG IgA) prima di ridurre il glutine per evitare falsi negativi.

2. IBD - MALATTIE INFIAMMATORIE CRONICHE (Crohn e Rettocolite Ulcerosa):
Patologie organiche caratterizzate da ulcere e lesioni. Il marcatore primario per escluderle è la Calprotectina Fecale. Un valore basso esclude un'IBD infiammatoria attiva.

3. ALLARMI NEOPLASTICI (I 'Red Flags'):
Indicatori che richiedono accertamenti endoscopici immediati (Colonscopia): perdita di peso inspiegabile, sanguinamento rettale, anemia sideropenica o esordio dei sintomi dopo i 50 anni.`
    },
    en: {
      title: 'Differential Diagnosis: IBS vs IBD, Celiac Disease, and Malignancies',
      summary: 'Analysis of clinical markers and diagnostic testing required to rule out structural diseases before starting an exclusion protocol.',
      content: `IBS is classified as a functional disorder. Because its symptoms mirror severe organic conditions, secondary differential screening is an absolute prerequisite.

1. CELIAC DISEASE (An Autoimmune Condition):
Triggered by dietary gluten intake, leading to progressive villous atrophy. Serological antibody testing (Anti-tTG IgA) must be conducted before removing gluten to avoid false-negative results.

2. IBD - INFLAMMATORY BOWEL DISEASES (Crohn's & Ulcerative Colitis):
Organic conditions causing structural ulcerations. The primary non-invasive tool to differentiate them is Fecal Calprotectin. Low levels effectively rule out active mucosal inflammation.

3. NEOPLASTIC ALARMS (The 'Red Flags'):
Clinical warning signs mandating immediate endoscopic evaluation (Colonoscopy): unexplained weight loss, rectal bleeding, iron-deficiency anemia, or sudden onset after age 50.`
    }
  },
  {
    id: 'decodifica-fodmap',
    markdown: true,
    category: 'Biochimica Base',
    pubmedLinks: [
      { text: 'Monash University - The Low FODMAP Diet (sito ufficiale)', url: 'https://www.monashfodmap.com/' },
      { text: 'Gibson P.R., Shepherd S.J. (2010) - Evidence-based dietary management of functional gastrointestinal symptoms: the FODMAP approach. J Gastroenterol Hepatol 25(2):252-258', url: 'https://doi.org/10.1111/j.1440-1746.2009.06149.x' }
    ],
    prerequisites: ['diagnosi-differenziale'],
    nextSteps: [],
    it: {
      title: "Decodificare l'Acronimo FODMAP",
      summary: 'Chimica e fisiologia dei FODMAP.',
      content: decodificaFodmapIT
    },
    en: {
      title: 'Decoding the FODMAP Acronym',
      summary: 'Chemistry and physiology of FODMAPs.',
      content: decodificaFodmapEN
    }
  }
];
