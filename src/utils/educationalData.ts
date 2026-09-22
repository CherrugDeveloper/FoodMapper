import decodificaFodmapIT from '../content/decodifica-fodmap.it.md?raw';
import decodificaFodmapEN from '../content/decodifica-fodmap.en.md?raw';
import nutrizioneFondamentiIT from '../content/nutrizione-fondamenti.it.md?raw';
import nutrizioneFondamentiEN from '../content/nutrizione-fondamenti.en.md?raw';
import assorbimentoMeccanismiIT from '../content/assorbimento-meccanismi.it.md?raw';
import assorbimentoMeccanismiEN from '../content/assorbimento-meccanismi.en.md?raw';
import fibreMicrobiotaIT from '../content/fibre-microbiota.it.md?raw';
import fibreMicrobiotaEN from '../content/fibre-microbiota.en.md?raw';
import grassiEssenzialiIT from '../content/grassi-essenziali.it.md?raw';
import grassiEssenzialiEN from '../content/grassi-essenziali.en.md?raw';

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
    id: 'nutrizione-fondamenti',
    markdown: true,
    category: 'Biochimica Base',
    pubmedLinks: [
      { text: 'Hall K.D., Guo J. (2017) - Obesity Energetics: Body Weight Regulation and the Effects of Diet Composition. Gastroenterology 152(7)', url: 'https://doi.org/10.1053/j.gastro.2017.01.052' },
      { text: 'Gardner C.D. et al. (2018) - Effect of Low-Fat vs Low-Carbohydrate Diet on 12-Month Weight Loss (DIETFITS). JAMA 319(7)', url: 'https://doi.org/10.1001/jama.2018.0245' }
    ],
    prerequisites: [],
    nextSteps: ['macro-biochimica'],
    it: {
      title: 'Le Fondamenta della Nutrizione: Energia, Macro e Oligoelementi',
      summary: 'Cosa dicono davvero gli studi sulle diete, il ruolo di proteine/carboidrati/grassi e i micronutrienti che contano per l\'intestino.',
      content: nutrizioneFondamentiIT
    },
    en: {
      title: 'Nutrition Fundamentals: Energy, Macros and Micronutrients',
      summary: 'What studies actually say about diets, the role of protein/carbs/fats and the micronutrients that matter for the gut.',
      content: nutrizioneFondamentiEN
    }
  },
  {
    id: 'macro-biochimica',
    category: 'Biochimica Base',
    pubmedLinks: [
      { text: 'Jäger R. et al. (2017) - International Society of Sports Nutrition Position Stand: protein and exercise. J Int Soc Sports Nutr 14:20', url: 'https://doi.org/10.1186/s12970-017-0177-8' },
      { text: 'Feinle-Bisset C., Azpiroz F. (2013) - Dietary lipids and functional gastrointestinal disorders. Am J Gastroenterol 108(5):737-747', url: 'https://hdl.handle.net/2440/79126' }
    ],
    prerequisites: ['nutrizione-fondamenti'],
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
    nextSteps: ['assorbimento-meccanismi'],
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
    prerequisites: ['grassi-essenziali'],
    nextSteps: [],
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
    id: 'assorbimento-meccanismi',
    markdown: true,
    category: 'Fisiopatologia',
    pubmedLinks: [
      { text: 'Murray K. et al. (2014) - Differential effects of FODMAPs on small and large intestinal contents shown by MRI. Am J Gastroenterol 109(1)', url: 'https://doi.org/10.1038/ajg.2013.386' },
      { text: 'Deiteren A. et al. (2016) - IBS and visceral hypersensitivity: risk factors and pathophysiological mechanisms. Acta Gastroenterol Belg 79(1)', url: 'https://pubmed.ncbi.nlm.nih.gov/26852761/' }
    ],
    prerequisites: ['meccanica-ibs'],
    nextSteps: ['decodifica-fodmap'],
    it: {
      title: 'Effetto Osmotico, Fermentazione Batterica e Distensione Luminale',
      summary: 'I tre meccanismi fisico-chimici che trasformano molecole non assorbite in dolore, gonfiore e alterazioni del transito.',
      content: assorbimentoMeccanismiIT
    },
    en: {
      title: 'Osmotic Effect, Bacterial Fermentation and Luminal Distension',
      summary: 'The three physicochemical mechanisms that convert unabsorbed molecules into pain, bloating and altered transit.',
      content: assorbimentoMeccanismiEN
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
    prerequisites: ['assorbimento-meccanismi'],
    nextSteps: ['fibre-microbiota'],
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
  },
  {
    id: 'fibre-microbiota',
    markdown: true,
    category: 'Fisiopatologia',
    pubmedLinks: [
      { text: 'Bijkerk C.J. et al. (2009) - Soluble or insoluble fibre in IBS: randomised placebo controlled trial. BMJ 339:b3154', url: 'https://doi.org/10.1136/bmj.b3154' },
      { text: 'Makki K. et al. (2018) - The Impact of Dietary Fiber on Gut Microbiota in Host Health and Disease. Cell Host Microbe 23(6)', url: 'https://doi.org/10.1016/j.chom.2018.05.012' }
    ],
    prerequisites: ['decodifica-fodmap'],
    nextSteps: ['grassi-essenziali'],
    it: {
      title: 'Fibre Solubili, Insolubili e il Microbiota',
      summary: 'Perché la solubilità cambia tutto, cosa fanno gli acidi grassi a catena corta e perché lo psillio ha l\'evidenza migliore nell\'IBS.',
      content: fibreMicrobiotaIT
    },
    en: {
      title: 'Soluble Fiber, Insoluble Fiber and the Microbiota',
      summary: 'Why solubility changes everything, what short-chain fatty acids do and why psyllium has the strongest IBS evidence.',
      content: fibreMicrobiotaEN
    }
  },
  {
    id: 'grassi-essenziali',
    markdown: true,
    category: 'Biochimica Base',
    pubmedLinks: [
      { text: 'Feinle-Bisset C., Azpiroz F. (2013) - Dietary lipids and functional gastrointestinal disorders. Am J Gastroenterol 108(5)', url: 'https://hdl.handle.net/2440/79126' },
      { text: 'Calder P.C. (2017) - Omega-3 fatty acids and inflammatory processes. Biochem Soc Trans 45(5)', url: 'https://doi.org/10.1042/BST20160474' }
    ],
    prerequisites: ['fibre-microbiota'],
    nextSteps: ['diagnosi-differenziale'],
    it: {
      title: 'I Grassi Essenziali e il Riflesso Gastrocolico',
      summary: 'Omega-3/omega-6, vitamine liposolubili e perché nell\'IBS il problema non sono i grassi ma i picchi.',
      content: grassiEssenzialiIT
    },
    en: {
      title: 'Essential Fats and the Gastrocolic Reflex',
      summary: 'Omega-3/omega-6, fat-soluble vitamins and why in IBS the problem is not fat itself but spikes.',
      content: grassiEssenzialiEN
    }
  }
];
