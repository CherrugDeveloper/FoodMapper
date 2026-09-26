import minimoCaloricoDonneIT from '../content/minimo-calorico-donne.it.md?raw';
import minimoCaloricoDonneEN from '../content/minimo-calorico-donne.en.md?raw';
import minimoCaloricoDonneDE from '../content/minimo-calorico-donne.de.md?raw';
import minimoCaloricoDonneES from '../content/minimo-calorico-donne.es.md?raw';
import minimoCaloricoDonneFR from '../content/minimo-calorico-donne.fr.md?raw';
import bioHackingIT from '../content/bio-hacking.it.md?raw';
import bioHackingEN from '../content/bio-hacking.en.md?raw';
import bioHackingDE from '../content/bio-hacking.de.md?raw';
import bioHackingES from '../content/bio-hacking.es.md?raw';
import bioHackingFR from '../content/bio-hacking.fr.md?raw';
import mifflinStJeorIT from '../content/mifflin-st-jeor.it.md?raw';
import mifflinStJeorEN from '../content/mifflin-st-jeor.en.md?raw';
import mifflinStJeorDE from '../content/mifflin-st-jeor.de.md?raw';
import mifflinStJeorES from '../content/mifflin-st-jeor.es.md?raw';
import mifflinStJeorFR from '../content/mifflin-st-jeor.fr.md?raw';
import decodificaFodmapIT from '../content/decodifica-fodmap.it.md?raw';
import decodificaFodmapEN from '../content/decodifica-fodmap.en.md?raw';
import decodificaFodmapDE from '../content/decodifica-fodmap.de.md?raw';
import decodificaFodmapES from '../content/decodifica-fodmap.es.md?raw';
import decodificaFodmapFR from '../content/decodifica-fodmap.fr.md?raw';
import nutrizioneFondamentiIT from '../content/nutrizione-fondamenti.it.md?raw';
import nutrizioneFondamentiEN from '../content/nutrizione-fondamenti.en.md?raw';
import nutrizioneFondamentiDE from '../content/nutrizione-fondamenti.de.md?raw';
import nutrizioneFondamentiES from '../content/nutrizione-fondamenti.es.md?raw';
import nutrizioneFondamentiFR from '../content/nutrizione-fondamenti.fr.md?raw';
import assorbimentoMeccanismiIT from '../content/assorbimento-meccanismi.it.md?raw';
import assorbimentoMeccanismiEN from '../content/assorbimento-meccanismi.en.md?raw';
import assorbimentoMeccanismiDE from '../content/assorbimento-meccanismi.de.md?raw';
import assorbimentoMeccanismiES from '../content/assorbimento-meccanismi.es.md?raw';
import assorbimentoMeccanismiFR from '../content/assorbimento-meccanismi.fr.md?raw';
import fibreMicrobiotaIT from '../content/fibre-microbiota.it.md?raw';
import fibreMicrobiotaEN from '../content/fibre-microbiota.en.md?raw';
import fibreMicrobiotaDE from '../content/fibre-microbiota.de.md?raw';
import fibreMicrobiotaES from '../content/fibre-microbiota.es.md?raw';
import fibreMicrobiotaFR from '../content/fibre-microbiota.fr.md?raw';
import grassiEssenzialiIT from '../content/grassi-essenziali.it.md?raw';
import grassiEssenzialiEN from '../content/grassi-essenziali.en.md?raw';
import grassiEssenzialiDE from '../content/grassi-essenziali.de.md?raw';
import grassiEssenzialiES from '../content/grassi-essenziali.es.md?raw';
import grassiEssenzialiFR from '../content/grassi-essenziali.fr.md?raw';
import carenzaProteineIT from '../content/carenza-proteine.it.md?raw';
import carenzaProteineEN from '../content/carenza-proteine.en.md?raw';
import carenzaProteineDE from '../content/carenza-proteine.de.md?raw';
import carenzaProteineES from '../content/carenza-proteine.es.md?raw';
import carenzaProteineFR from '../content/carenza-proteine.fr.md?raw';

export type SupportedLang = 'it' | 'en' | 'de' | 'es' | 'fr';

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
  de: LocalizedContent;
  es: LocalizedContent;
  fr: LocalizedContent;
}

const MACRO_BIOCHIMICA_IT = `I macronutrienti non sono semplici calderoni di calorie, ma aggregati molecolari che attivano risposte ormonali ed enzimatiche specifiche lungo tutto il tubo digerente.

1. I CARBOIDRATI (I mattoni della fermentazione):
Dal punto di vista chimico, sono catene saccaridiche. Se i legami non sono scindibili dagli enzimi umani (come le fibre) o se i trasportatori cellulari sono saturi (come nel malassorbimento del fruttosio), queste molecole proseguono intatte verso l'intestino crasso, diventando il substrato energetico per la flora batterica.

2. LE PROTEINE (I componenti strutturali):
Formate da catene di amminoacidi. Non subiscono fermentazione gassosa primaria nel colon. Dal punto di vista clinico, gli amminoacidi sono essenziali per il ripristino della barriera epiteliale intestinale. Il target ottimale suggerito varia tra 1.6g e 2.2g per chilogrammo di peso corporeo.

3. I GRASSI (I regolatori della motilità):
I trigliceridi non contengono zuccheri e non possono fermentare. Tuttavia, richiedono una complessa emulsione da parte dei sali biliari. Un carico lipidico eccessivo attiva in modo violento il riflesso gastrocolico, accelerando o alterando la motilità del colon nei soggetti affetti da ipersensibilità viscerale.`;

const MACRO_BIOCHIMICA_EN = `Macronutrients are not just containers of calories, but complex molecular aggregates that trigger specific enzymatic and hormonal responses.

1. CARBOHYDRATES (The fermentation building blocks):
Chemical sugar chains. If links cannot be broken by human enzymes (like fiber) or cellular transporters are saturated (as in fructose malabsorption), these molecules proceed intact into the large intestine, feeding gut bacteria.

2. PROTEINS (The structural components):
Amino acid chains. They do not undergo primary gaseous fermentation in the colon. Clinically, amino acids are critical for repairing intestinal epithelial tight junctions. Optimal target ranges between 1.6g and 2.2g per kilogram of body weight.

3. LIPIDS (The motility regulators):
Triglycerides contain no sugars and cannot ferment. However, they require complex bile salt emulsion. An excessive fat load violently activates the gastrocolic reflex, altering colonic motility in patients with visceral hypersensitivity.`;

const MACRO_BIOCHIMICA_DE = `Makronährstoffe sind nicht einfach nur Kalorienbehälter, sondern komplexe molekulare Aggregate, die spezifische enzymatische und hormonelle Reaktionen auslösen.

1. KOHLENHYDRATE (Die Bausteine der Fermentation):
Chemische Zucker ketten. Wenn Bindungen nicht von menschlichen Enzymen gespalten werden können (wie bei Ballaststoffen) oder zelluläre Transporter gesättigt sind (wie bei Fruktosemalabsorption), gelangen diese Moleküle intakt in den Dickdarm und ernähren Darmbakterien.

2. PROTEINE (Die strukturellen Bausteine):
Aminosäureketten. Sie unterliegen nicht der primären gasförmigen Fermentation im Dickdarm. Klinisch gesehen sind Aminosäuren entscheidend für die Reparatur der intestinalen Tight Junctions. Optimale Zielmenge zwischen 1,6g und 2,2g pro Kilogramm Körpergewicht.

3. LIPIDE (Die Motilitätsregulatoren):
Triglyceride enthalten keine Zucker und können nicht fermentieren. Sie erfordern jedoch eine komplexe Gallensalz-Emulsion. Eine übermäßige Fettlast aktiviert den gastrokolischen Reflex stark und verändert die Kolonmotilität bei Patienten mit viszeraler Hyperästhesie.`;

const MACRO_BIOCHIMICA_ES = `Los macronutrientes no son simples contenedores de calorías, sino agregados moleculares complejos que desencadenan respuestas enzimáticas y hormonales específicas.

1. CARBOHIDRATOS (Los ladrillos de la fermentación):
Cadenas químicas de azúcares. Si los enlaces no pueden romperse por enzimas humanas (como la fibra) o los transportadores celulares están saturados (como en la malabsorción de fructosa), estas moléculas llegan intactas al intestino grueso, alimentando a las bacterias intestinales.

2. PROTEÍNAS (Los componentes estructurales):
Cadenas de aminoácidos. No sufren fermentación gaseosa primaria en el colon. Clínicamente, los aminoácidos son fundamentales para reparar las uniones estrechas del epitelio intestinal. El objetivo óptimo oscila entre 1,6g y 2,2g por kilogramo de peso corporal.

3. LÍPIDOS (Los reguladores de la motilidad):
Los triglicéridos no contienen azúcares y no pueden fermentar. Sin embargo, requieren una emulsión compleja de sales biliares. Una carga lipídica excesiva activa violentamente el reflejo gastrocolónico, alterando la motilidad del colon en pacientes con hipersensibilidad visceral.`;

const MACRO_BIOCHIMICA_FR = `Les macronutriments ne sont pas de simples contenants de calories, mais des agrégats moléculaires complexes qui déclenchent des réponses enzymatiques et hormonales spécifiques.

1. GLUCIDES (Les briques de la fermentation) :
Chaînes chimiques de sucres. Si les liaisons ne peuvent pas être rompues par les enzymes humaines (comme les fibres) ou si les transporteurs cellulaires sont saturés (comme dans la malabsorption du fructose), ces molécules arrivent intactes dans le gros intestin, nourrissant les bactéries intestinales.

2. PROTÉINES (Les composants structurels) :
Chaînes d'acides aminés. Elles ne subissent pas de fermentation gazeuse primaire dans le côlon. Cliniquement, les acides aminés sont essentiels pour réparer les jonctions serrées de l'épithélium intestinal. L'objectif optimal se situe entre 1,6g et 2,2g par kilogramme de poids corporel.

3. LIPIDES (Les régulateurs de la motilité) :
Les triglycérides ne contiennent pas de sucres et ne peuvent pas fermenter. Cependant, ils nécessitent une émulsion complexe de sels biliaires. Une charge lipidique excessive active violemment le réflexe gastro-colique, altérant la motilité colique chez les patients souffrant d'hypersensibilité viscérale.`;

const MECCANICA_IBS_IT = `I sintomi dolorosi dell'IBS derivano da precisi stress meccanici nel lume colonico.

1. L'EFFETTO OSMOTICO (Il richiamo d'acqua):
I Polioli (sorbitolo, xilitolo) e il Lattosio non digerito sono molecole idrofile. Richiamano massicce quantità d'acqua all'interno del lume intestinale, fluidificando improvvisamente il chimo e provocando scariche diarroiche e crampi.

2. LA FERMENTAZIONE BATTERICA RAPIDA (La produzione di gas):
Gli Oligosaccaridi (Fruttani nel frumento, Galattani nei legumi) arrivano intatti nel colon. La flora batterica residente avvia una fermentazione biochimica estremamente rapida, producendo idrogeno (H2) e metano (CH4).

3. LA DISTENSIONE LUMINALE E L'IPERSENSIBILITÀ VISCERALE:
La combinazione del volume d'acqua e dei gas crea una forte pressione sulle pareti del colon (distensione luminale). Nei soggetti affetti da IBS, i meccanocettori intestinali sono ipersensibilizzati e inviano segnali amplificati al cervello, che li interpreta come dolore acuto e gonfiore.`;

const MECCANICA_IBS_EN = `Pain symptoms in IBS root from specific mechanical stress vectors inside the colonic lumen.

1. THE OSMOTIC EFFECT (Water recruitment):
Polyols and undigested Lactose are highly hydrophilic molecules. They exert osmotic pressure, pulling water into the intestinal lumen, liquefying the chyme, and triggering diarrheal episodes and cramping.

2. RAPID BACTERIAL FERMENTATION (Gas production):
Oligosaccharides (Fructans, Galactans) reach the colon untouched. Resident microbiota rapidly ferments them, yielding massive gaseous byproducts like hydrogen (H2) and methane (CH4).

3. LUMINAL DISTENSION AND VISCERAL HYPERSENSITIVITY:
Water recruitment and gas production trigger a strong mechanical wall stretching (luminal distension). In IBS patients, gut mechanoreceptors are hypersensitized and send amplified distress signals that the brain decodes as sharp pain and debilitating bloating.`;

const MECCANICA_IBS_DE = `Schmerzsymptome bei IBS resultieren aus spezifischen mechanischen Stressvektoren im Dickdarmlumen.

1. DER OSMOTISCHE EFFEKT (Wasseranziehung):
Polyole und nicht verdaute Laktose sind hoch hydrophile Moleküle. Sie üben osmotischen Druck aus, ziehen Wasser in das Darmlumen, verflüssigen den Chymus und lösen Durchfallepisoden und Krämpfe aus.

2. SCHNELLE BAKTERIELLE FERMENTATION (Gasproduktion):
Oligosaccharide (Fructane, Galactane) erreichen den Dickdarm unversehrt. Das ansässige Mikrobiom fermentiert sie schnell und produziert massiv gasförmige Nebenprodukte wie Wasserstoff (H2) und Methan (CH4).

3. LUMINALE DISTENSION UND VISZERALE HYPERSENSITIVITÄT:
Wasseranziehung und Gasproduktion führen zu einer starken mechanischen Dehnung der Darmwand (luminal Distension). Bei IBS-Patienten sind die Darm-Mechanorezeptoren hypersensibilisiert und senden verstärkte Stresssignale, die das Gehirn als stechenden Schmerz und invalidierende Blähungen interpretiert.`;

const MECCANICA_IBS_ES = `Los síntomas dolorosos del SII surgen de vectores de estrés mecánico específicos dentro de la luz colónica.

1. EL EFECTO OSMÓTICO (Reclutamiento de agua):
Los polioles y la lactosa no digerida son moléculas altamente hidrófilas. Ejercen presión osmótica, atrayendo agua hacia la luz intestinal, licuando el quimo y desencadenando episodios diarreicos y calambres.

2. FERMENTACIÓN BACTERIANA RÁPIDA (Producción de gas):
Los oligosacáridos (fructanos, galactanos) llegan intactos al colon. La microbiota residente los fermenta rápidamente, produciendo masivamente subproductos gaseosos como hidrógeno (H2) y metano (CH4).

3. DISTENSIÓN LUMINAL E HIPERSENSIBILIDAD VISCERAL:
El reclutamiento de agua y la producción de gas provocan un fuerte estiramiento mecánico de la pared intestinal (distensión luminal). En pacientes con SII, los mecanorreceptores intestinales están hipersensibilizados y envían señales amplificadas que el cerebro interpreta como dolor agudo e hinchazón invalidante.`;

const MECCANICA_IBS_FR = `Les symptômes douloureux du SII résultent de vecteurs de stress mécanique spécifiques à l'intérieur de la lumière colique.

1. L'EFFET OSMOTIQUE (Appel d'eau) :
Les polyols et le lactose non digéré sont des molécules très hydrophiles. Ils exercent une pression osmotique, attirant l'eau dans la lumière intestinale, liquéfiant le chyme et déclenchant des épisodes diarrhéiques et des crampes.

2. FERMENTATION BACTÉRIENNE RAPIDE (Production de gaz) :
Les oligosaccharides (fructanes, galactanes) atteignent le côlon intacts. Le microbiote résident les fermente rapidement, produisant massivement des sous-produits gazeux comme l'hydrogène (H2) et le méthane (CH4).

3. DISTENSION LUMINALE ET HYPERSENSIBILITÉ VISCÉRALE :
Le recrutement d'eau et la production de gaz provoquent un fort étirement mécanique de la paroi intestinale (distension luminale). Chez les patients atteints de SII, les mécanorécepteurs intestinaux sont hypersensibilisés et envoient des signaux amplifiés que le cerveau interprète comme une douleur aiguë et un ballonnement invalidant.`;

const DIAGNOSI_DIFFERENZIALE_IT = `L'IBS è una patologia funzionale. Poiché i suoi sintomi mimano perfettamente patologie organiche gravi, la diagnosi differenziale è il primo step clinico tassativo.

1. CELIACHIA (Patologia Autoimmune):
Provocata dall'ingestione di glutine. Causa l'atrofia dei villi intestinali. È fondamentale eseguire il dosaggio ematico degli anticorpi (Anti-tTG IgA) prima di ridurre il glutine per evitare falsi negativi.

2. IBD - MALATTIE INFIAMMATORIE CRONICHE (Crohn e Rettocolite Ulcerosa):
Patologie organiche caratterizzate da ulcere e lesioni. Il marcatore primario per escluderle è la Calprotectina Fecale. Un valore basso esclude un'IBD infiammatoria attiva.

3. ALLARMI NEOPLASTICI (I 'Red Flags'):
Indicatori che richiedono accertamenti endoscopici immediati (Colonscopia): perdita di peso inspiegabile, sanguinamento rettale, anemia sideropenica o esordio dei sintomi dopo i 50 anni.`;

const DIAGNOSI_DIFFERENZIALE_EN = `IBS is classified as a functional disorder. Because its symptoms mirror severe organic conditions, secondary differential screening is an absolute prerequisite.

1. CELIAC DISEASE (An Autoimmune Condition):
Triggered by dietary gluten intake, leading to progressive villous atrophy. Serological antibody testing (Anti-tTG IgA) must be conducted before removing gluten to avoid false-negative results.

2. IBD - INFLAMMATORY BOWEL DISEASES (Crohn's & Ulcerative Colitis):
Organic conditions causing structural ulcerations. The primary non-invasive tool to differentiate them is Fecal Calprotectin. Low levels effectively rule out active mucosal inflammation.

3. NEOPLASTIC ALARMS (The 'Red Flags'):
Clinical warning signs mandating immediate endoscopic evaluation (Colonoscopy): unexplained weight loss, rectal bleeding, iron-deficiency anemia, or sudden onset after age 50.`;

const DIAGNOSI_DIFFERENZIALE_DE = `IBS wird als funktionelle Erkrankung eingestuft. Da ihre Symptome schwere organische Erkrankungen spiegeln, ist eine differenzialdiagnostische Abklärung zwingend erforderlich.

1. ZÖLIAKIE (Autoimmunerkrankung):
Ausgelöst durch die Aufnahme von Gluten, was zu einem fortschreitenden Zottenatrophie führt. Serologische Antikörpertests (Anti-tTG IgA) müssen vor einer Glutenreduktion durchgeführt werden, um falsch-negative Ergebnisse zu vermeiden.

2. CED - CHRONISCH-ENTZÜNDLICHE DARMERKRANKUNGEN (Morbus Crohn und Colitis ulcerosa):
Organische Erkrankungen mit strukturellen Ulzerationen. Das primäre nicht-invasive Unterscheidungsmerkmal ist die fäkale Calprotectin. Niedrige Werte schließen eine aktive Mukosainflammation wirksam aus.

3. NEOPLASTISCHE ALARME (Die 'Red Flags'):
Klinische Warnsignale, die eine sofortige endoskopische Abklärung (Koloskopie) erfordern: unerklärlicher Gewichtsverlust, rektale Blutung, Eisenmangelanämie oder plötzliches Symptombeginn nach dem 50. Lebensjahr.`;

const DIAGNOSI_DIFFERENZIALE_ES = `El SII se clasifica como un trastorno funcional. Dado que sus síntomas imitan enfermedades orgánicas graves, el cribado diferencial secundario es un prerrequisito absoluto.

1. ENFERMEDAD CELÍACA (Condición autoinmune):
Desencadenada por la ingesta de gluten, lo que provoca atrofia vellositaria progresiva. Se deben realizar pruebas serológicas de anticuerpos (Anti-tTG IgA) antes de eliminar el gluten para evitar resultados falsos negativos.

2. EII - ENFERMEDADES INFLAMATORIAS INTESTINALES (Enfermedad de Crohn y Colitis Ulcerosa):
Enfermedades orgánicas que causan ulceraciones estructurales. La herramienta primaria no invasiva para diferenciarlas es la Calprotectina Fecal. Los niveles bajos descartan eficazmente la inflamación mucosa activa.

3. ALARMAS NEOPLÁSICAS (Las 'Red Flags'):
Signos de alarma clínicos que requieren evaluación endoscópica inmediata (Colonoscopia): pérdida de peso inexplicable, sangrado rectal, anemia ferropénica o inicio súbito de síntomas después de los 50 años.`;

const DIAGNOSI_DIFFERENZIALE_FR = `Le SII est classé comme un trouble fonctionnel. Parce que ses symptômes reflètent des conditions organiques graves, un dépistage différentiel secondaire est un prérequis absolu.

1. MALADIE CŒLIAQUE (Maladie auto-immune) :
Déclenchée par l'ingestion de gluten, entraînant une atrophie villositaire progressive. Le dosage des anticorps sériques (Anti-tTG IgA) doit être effectué avant d'éliminer le gluten pour éviter les faux négatifs.

2. MICI - MALADIES INFLAMMATOIRES CHRONIQUES DE L'INTESTIN (Maladie de Crohn et Rectocolite Hémorragique) :
Maladies organiques causant des ulcérations structurelles. L'outil non invasif principal pour les différencier est la calprotectine fécale. Des niveaux bas éliminent efficacement une inflammation muqueuse active.

3. ALARMES NÉOPLASIQUES (Les 'Red Flags') :
Signes d'alerte cliniques nécessitant une évaluation endoscopique immédiate (coloscopie) : perte de poids inexpliquée, saignement rectal, anémie ferriprive ou début soudain des symptômes après 50 ans.`;

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
    },
    de: {
      title: 'Ernährungsgrundlagen: Energie, Makro- und Mikronährstoffe',
      summary: 'Was Studien wirklich über Diäten sagen, die Rolle von Protein/Kohlenhydraten/Fetten und die Mikronährstoffe, die für den Darm wichtig sind.',
      content: nutrizioneFondamentiDE
    },
    es: {
      title: 'Fundamentos de la Nutrición: Energía, Macros y Micronutrientes',
      summary: 'Lo que los estudios realmente dicen sobre las dietas, el papel de proteínas/carbohidratos/grasas y los micronutrientes que importan para el intestino.',
      content: nutrizioneFondamentiES
    },
    fr: {
      title: 'Fondamentaux de la Nutrition : Énergie, Macronutriments et Micronutriments',
      summary: 'Ce que les études disent vraiment sur les régimes, le rôle des protéines/glucides/lipides et les micronutriments qui comptent pour l\'intestin.',
      content: nutrizioneFondamentiFR
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
      content: MACRO_BIOCHIMICA_IT
    },
    en: {
      title: 'Macronutrients: Molecular Structure and Digestive Interaction',
      summary: 'Scientific analysis of structural energy blocks (Proteins, Carbohydrates, Fats) and their behavior in the GI tract.',
      content: MACRO_BIOCHIMICA_EN
    },
    de: {
      title: 'Makronährstoffe: Molekulare Struktur und Verdauungsinteraktion',
      summary: 'Wissenschaftliche Analyse der strukturellen Energiebausteine (Proteine, Kohlenhydrate, Fette) und ihres Verhaltens im Magen-Darm-Trakt.',
      content: MACRO_BIOCHIMICA_DE
    },
    es: {
      title: 'Macronutrientes: Estructura Molecular e Interacción Digestiva',
      summary: 'Análisis científico de los bloques estructurales de energía (proteínas, carbohidratos, grasas) y su comportamiento en el tracto GI.',
      content: MACRO_BIOCHIMICA_ES
    },
    fr: {
      title: 'Macronutriments : Structure Moléculaire et Interaction Digestive',
      summary: 'Analyse scientifique des blocs d\'énergie structurels (protéines, glucides, lipides) et de leur comportement dans le tractus gastro-intestinal.',
      content: MACRO_BIOCHIMICA_FR
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
      content: MECCANICA_IBS_IT
    },
    en: {
      title: 'IBS Pathophysiology: Luminal Distension and Osmotic Effect',
      summary: 'Study of physical and neurological mechanisms triggering gastrointestinal symptoms in IBS.',
      content: MECCANICA_IBS_EN
    },
    de: {
      title: 'IBS-Pathophysiologie: Luminale Distension und osmotischer Effekt',
      summary: 'Studie der physischen und neurologischen Mechanismen, die gastrointestinale Symptome bei IBS auslösen.',
      content: MECCANICA_IBS_DE
    },
    es: {
      title: 'Fisiopatología del SII: Distensión Luminal y Efecto Osmótico',
      summary: 'Estudio de los mecanismos físicos y neurológicos que desencadenan síntomas gastrointestinales en el SII.',
      content: MECCANICA_IBS_ES
    },
    fr: {
      title: 'Physiopathologie du SII : Distension Luminale et Effet Osmotique',
      summary: 'Étude des mécanismes physiques et neurologiques déclenchant les symptômes gastro-intestinaux dans le SII.',
      content: MECCANICA_IBS_FR
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
      content: DIAGNOSI_DIFFERENZIALE_IT
    },
    en: {
      title: 'Differential Diagnosis: IBS vs IBD, Celiac Disease, and Malignancies',
      summary: 'Analysis of clinical markers and diagnostic testing required to rule out structural diseases before starting an exclusion protocol.',
      content: DIAGNOSI_DIFFERENZIALE_EN
    },
    de: {
      title: 'Differenzialdiagnose: IBS vs CED, Zöliakie und Neoplasien',
      summary: 'Analyse der klinischen Marker und Untersuchungen, die nötig sind, um organische Erkrankungen vor Beginn eines Eliminationsprotokolls auszuschließen.',
      content: DIAGNOSI_DIFFERENZIALE_DE
    },
    es: {
      title: 'Diagnóstico Diferencial: SII vs EII, Enfermedad Celíaca y Neoplasias',
      summary: 'Análisis de marcadores clínicos y pruebas diagnósticas necesarias para descartar enfermedades estructurales antes de iniciar un protocolo de exclusión.',
      content: DIAGNOSI_DIFFERENZIALE_ES
    },
    fr: {
      title: 'Diagnostic Différentiel : SII vs MICI, Maladie Cœliaque et Néoplasies',
      summary: 'Analyse des marqueurs cliniques et des examens nécessaires pour exclure des maladies organiques avant de commencer un protocole d\'exclusion.',
      content: DIAGNOSI_DIFFERENZIALE_FR
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
    },
    de: {
      title: 'Osmotischer Effekt, bakterielle Fermentation und luminale Distension',
      summary: 'Die drei physikochemischen Mechanismen, die nicht absorbierte Moleküle in Schmerz, Blähungen und veränderten Transit verwandeln.',
      content: assorbimentoMeccanismiDE
    },
    es: {
      title: 'Efecto Osmótico, Fermentación Bacteriana y Distensión Luminal',
      summary: 'Los tres mecanismos fisicoquímicos que convierten moléculas no absorbidas en dolor, hinchazón y alteraciones del tránsito.',
      content: assorbimentoMeccanismiES
    },
    fr: {
      title: 'Effet Osmotique, Fermentation Bactérienne et Distension Luminale',
      summary: 'Les trois mécanismes physico-chimiques qui transforment les molécules non absorbées en douleur, ballonnements et transit altéré.',
      content: assorbimentoMeccanismiFR
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
    },
    de: {
      title: 'Das FODMAP-Akronym entschlüsselt',
      summary: 'Chemie und Physiologie der FODMAPs.',
      content: decodificaFodmapDE
    },
    es: {
      title: 'Decodificando el Acrónimo FODMAP',
      summary: 'Química y fisiología de los FODMAP.',
      content: decodificaFodmapES
    },
    fr: {
      title: "Décoder l'Acronyme FODMAP",
      summary: 'Chimie et physiologie des FODMAP.',
      content: decodificaFodmapFR
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
    },
    de: {
      title: 'Lösliche und unlösliche Faser und das Mikrobiom',
      summary: 'Warum Löslichkeit alles verändert, was kurzkettige Fettsäuren bewirken und warum Flohsamen die stärkste IBS-Evidenz hat.',
      content: fibreMicrobiotaDE
    },
    es: {
      title: 'Fibra Soluble, Fibra Insoluble y la Microbiota',
      summary: 'Por qué la solubilidad lo cambia todo, qué hacen los ácidos grasos de cadena corta y por qué el psyllium tiene la mejor evidencia en el SII.',
      content: fibreMicrobiotaES
    },
    fr: {
      title: 'Fibres Solubles, Fibres Insolubles et Microbiote',
      summary: 'Pourquoi la solubilité change tout, ce que font les acides gras à chaîne courte et pourquoi le psyllium a la meilleure evidence dans le SII.',
      content: fibreMicrobiotaFR
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
    },
    de: {
      title: 'Essenzielle Fette und der gastrokolische Reflex',
      summary: 'Omega-3/Omega-6, fettlösliche Vitamine und warum bei IBS nicht das Fett, sondern Spitzen das Problem sind.',
      content: grassiEssenzialiDE
    },
    es: {
      title: 'Grasas Esenciales y el Reflejo Gastrocolónico',
      summary: 'Omega-3/omega-6, vitaminas liposolubles y por qué en el SII el problema no son las grasas sino los picos.',
      content: grassiEssenzialiES
    },
    fr: {
      title: 'Graisses Essentielles et Réflexe Gastro-colique',
      summary: 'Oméga-3/oméga-6, vitamines liposolubles et pourquoi dans le SII le problème n\'est pas les graisses mais les pics.',
      content: grassiEssenzialiFR
    }
  },
  {
    id: 'carenza-proteine',
    markdown: true,
    category: 'Protocolli Clinici',
    pubmedLinks: [
      { text: 'Jäger R. et al. (2017) - International Society of Sports Nutrition Position Stand: protein and exercise. J Int Soc Sports Nutr 14:20', url: 'https://doi.org/10.1186/s12970-017-0177-8' },
      { text: 'Phillips S.M. (2012) - Nutritional supplements and resistance exercise: what is the evidence? Sports Med 42(1):73-79', url: 'https://doi.org/10.2165/11597180-000000000-00000' },
      { text: 'Windle E.M. (2006) - Protein-energy malnutrition in older adults. Br J Community Nurs 11(9):380-384', url: 'https://pubmed.ncbi.nlm.nih.gov/17036797/' }
    ],
    prerequisites: ['macro-biochimica'],
    nextSteps: [],
    it: {
      title: 'Carenza Proteica: Impatti Clinici e Strategie di Integrazione',
      summary: 'Come identificare e trattare le carenze proteiche, con focus particolare sull\'integrità della barriera intestinale e strategie compatibili con la dieta low-FODMAP.',
      content: carenzaProteineIT
    },
    en: {
      title: 'Protein Deficiency: Clinical Impacts and Supplementation Strategies',
      summary: 'How to identify and treat protein deficiencies, with special focus on intestinal barrier integrity and low-FODMAP compatible strategies.',
      content: carenzaProteineEN
    },
    de: {
      title: 'Proteinmangel: Klinische Auswirkungen und Supplementierungsstrategien',
      summary: 'Wie man Proteinmangel erkennt und behandelt, mit besonderem Fokus auf die Darmbarriereintegrität und FODMAP-kompatible Strategien.',
      content: carenzaProteineDE
    },
    es: {
      title: 'Carenza Proteica: Impactos Clínicos y Estrategias de Suplementación',
      summary: 'Cómo identificar y tratar las carencias proteicas, con enfoque especial en la integridad de la barrera intestinal y estrategias compatibles con la dieta baja en FODMAP.',
      content: carenzaProteineES
    },
    fr: {
      title: 'Carence en Protéines : Impacts Cliniques et Stratégies de Supplémentation',
      summary: 'Comment identifier et traiter les carences en protéines, avec un focus particulier sur l\'intégrité de la barrière intestinale et des stratégies compatibles avec un régime pauvre en FODMAP.',
      content: carenzaProteineFR
    }
  },
  {
    id: 'minimo-calorico-donne',
    markdown: true,
    category: 'Protocolli Clinici',
    pubmedLinks: [
      { text: 'Mifflin M.D. et al. (1990) - A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr 51(2)', url: 'https://doi.org/10.1093/ajcn/51.2.241' },
      { text: 'Loucks A.B. et al. (2011) - The Female Athlete Triad: A Consensus Statement. Br J Sports Med 45(2)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3434067/' },
      { text: 'Rosenbaum M., Leibel R.L. (2010) - Adaptive thermogenesis in humans. Int J Obes 34', url: 'https://doi.org/10.1038/ijo.2010.184' }
    ],
    prerequisites: ['nutrizione-fondamenti'],
    nextSteps: ['mifflin-st-jeor'],
    it: {
      title: 'Soglia Calorica Minima nelle Donne: Perché 1200 kcal',
      summary: 'Fondamenti fisiologici del limite minimo calorico femminile, rischi dell\'ipocaloria aggressiva e come l\'app gestisce il floor di sicurezza.',
      content: minimoCaloricoDonneIT
    },
    en: {
      title: 'Minimum Caloric Threshold for Women: Why 1200 kcal',
      summary: 'Physiological foundations of the female minimum caloric limit, risks of aggressive low-calorie diets and how the app handles the safety floor.',
      content: minimoCaloricoDonneEN
    },
    de: {
      title: 'Minimale Kalorienschwelle bei Frauen: Warum 1200 kcal',
      summary: 'Physiologische Grundlagen der weiblichen Mindestkaloriengrenze, Risiken aggressiver kalorienarmer Diäten und wie die App den Sicherheitsboden handhabt.',
      content: minimoCaloricoDonneDE
    },
    es: {
      title: 'Umbral Calórico Mínimo en Mujeres: Por Qué 1200 kcal',
      summary: 'Fundamentos fisiológicos del límite calórico mínimo femenino, riesgos de las dietas hipocalóricas agresivas y cómo la app gestiona el piso de seguridad.',
      content: minimoCaloricoDonneES
    },
    fr: {
      title: 'Seuil Calorique Minimum chez les Femmes : Pourquoi 1200 kcal',
      summary: 'Fondements physiologiques de la limite calorique minimum féminine, risques des régimes hypocaloriques agressifs et gestion du plancher de sécurité par l\'application.',
      content: minimoCaloricoDonneFR
    }
  },
  {
    id: 'bio-hacking',
    markdown: true,
    category: 'Protocolli Clinici',
    pubmedLinks: [
      { text: 'Sutton E.F. et al. (2018) - Early Time-Restricted Feeding Improves Insulin Sensitivity. Cell Metab 27(6)', url: 'https://doi.org/10.1016/j.cmet.2018.04.010' },
      { text: 'Hall K.D. et al. (2018) - A data-based approach for predicting personal glycemic responses to foods. Diabetes Care 41(11)', url: 'https://doi.org/10.2337/dc18-0025' },
      { text: 'Kim T.W. et al. (2015) - The impact of sleep and circadian disturbance on hormones and metabolism. Int J Endocrinol 2015', url: 'https://doi.org/10.1155/2015/591729' }
    ],
    prerequisites: ['nutrizione-fondamenti'],
    nextSteps: ['minimo-calorico-donne'],
    it: {
      title: 'Bio Hacking Nutrizionale: Scienza vs Marketing',
      summary: 'Cosa funziona davvero tra digiuno intermittente, CGM, sonno e integrazione — e cosa è solo moda.',
      content: bioHackingIT
    },
    en: {
      title: 'Nutritional Bio Hacking: Science vs Marketing',
      summary: 'What really works among intermittent fasting, CGM, sleep and supplementation — and what is just hype.',
      content: bioHackingEN
    },
    de: {
      title: 'Nährstoff-Biohacking: Wissenschaft vs Marketing',
      summary: 'Was wirklich funktioniert bei intermittierendem Fasten, CGM, Schlaf und Supplementierung — und was nur Trend ist.',
      content: bioHackingDE
    },
    es: {
      title: 'Biohacking Nutricional: Ciencia vs Marketing',
      summary: 'Qué funciona realmente entre ayuno intermitente, MCG, sueño y suplementación — y qué es solo moda.',
      content: bioHackingES
    },
    fr: {
      title: 'Biohacking Nutritionnel : Science vs Marketing',
      summary: 'Ce qui fonctionne vraiment entre le jeûne intermittent, le CGM, le sommeil et la supplémentation — et ce qui n\'est que mode.',
      content: bioHackingFR
    }
  },
  {
    id: 'mifflin-st-jeor',
    markdown: true,
    category: 'Biochimica Base',
    pubmedLinks: [
      { text: 'Mifflin M.D. et al. (1990) - A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr 51(2)', url: 'https://doi.org/10.1093/ajcn/51.2.241' },
      { text: 'Frankenfield D. et al. (2005) - Comparison of predictive equations for resting metabolic rate. J Am Diet Assoc 105(5)', url: 'https://doi.org/10.1016/j.jada.2005.02.005' }
    ],
    prerequisites: ['nutrizione-fondamenti'],
    nextSteps: ['minimo-calorico-donne'],
    it: {
      title: 'Equazione di Mifflin-St Jeor: Come Stima il Metabolismo Basale',
      summary: 'Formula, limiti e margine di errore dell\'equazione più usata per calcolare il fabbisogno energetico a riposo.',
      content: mifflinStJeorIT
    },
    en: {
      title: 'Mifflin-St Jeor Equation: How It Estimates Basal Metabolism',
      summary: 'Formula, limits and error margin of the most widely used equation for calculating resting energy expenditure.',
      content: mifflinStJeorEN
    },
    de: {
      title: 'Mifflin-St-Jeor-Gleichung: Wie sie den Grundumsatz schätzt',
      summary: 'Formel, Grenzen und Fehlermarge der am häufigsten verwendeten Gleichung zur Berechnung des Ruheenergieverbrauchs.',
      content: mifflinStJeorDE
    },
    es: {
      title: 'Ecuación de Mifflin-St Jeor: Cómo Estima el Metabolismo Basal',
      summary: 'Fórmula, límites y margen de error de la ecuación más utilizada para calcular el gasto energético en reposo.',
      content: mifflinStJeorES
    },
    fr: {
      title: 'Équation de Mifflin-St Jeor : Comment Elle Estime le Métabolisme de Base',
      summary: 'Formule, limites et marge d\'erreur de l\'équation la plus utilisée pour calculer la dépense énergétique au repos.',
      content: mifflinStJeorFR
    }
  }
];
