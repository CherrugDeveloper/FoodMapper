import { useState } from 'react';

type TabType = 'fodmap' | 'macros' | 'microbiota';

export default function EducationalHub() {
  const [activeTab, setActiveTab] = useState<TabType>('fodmap');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left mt-8 border-t border-(--border)">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        📚 Hub Formativo Scientifico
      </h2>
      
      {/* Selettore dei Tab */}
      <div className="flex border-b border-(--border) mb-6 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('fodmap')}
          className={`px-4 py-2 font-semibold text-sm md:text-base border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'fodmap'
              ? 'border-(--accent) text-(--accent)'
              : 'border-transparent text-(--text) hover:text-(--text-h)'
          }`}
        >
          Protocollo FODMAP
        </button>
        <button
          onClick={() => setActiveTab('macros')}
          className={`px-4 py-2 font-semibold text-sm md:text-base border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'macros'
              ? 'border-(--accent) text-(--accent)'
              : 'border-transparent text-(--text) hover:text-(--text-h)'
          }`}
        >
          Macronutrienti e Calorie
        </button>
        <button
          onClick={() => setActiveTab('microbiota')}
          className={`px-4 py-2 font-semibold text-sm md:text-base border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'microbiota'
              ? 'border-(--accent) text-(--accent)'
              : 'border-transparent text-(--text) hover:text-(--text-h)'
          }`}
        >
          Salute del Microbiota
        </button>
      </div>

      {/* CONTENUTO DEI TAB */}
      {/* AGGIORNATO: Sostituito min-h-[300px] con la classe nativa canonica min-h-75 */}
      <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm min-h-75">
        
        {/* TAB 1: FODMAP */}
        {activeTab === 'fodmap' && (
          <div className="space-y-4 animate-fade-in text-(--text) text-sm md:text-base leading-relaxed">
            <h3 className="text-lg font-bold text-(--text-h) mb-2">Cos'è l'approccio Low-FODMAP?</h3>
            <p>
              FODMAP è l'acronimo di <strong>Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols</strong> (Oligosaccaridi, Disaccaridi, Monosaccaridi e Polioli Fermentabili). Si tratta di carboidrati a catena corta che l'intestino tenue di alcune persone fatica ad assorbire correttamente.
            </p>
            <p>
              Quando questi zuccheri non vengono assorbiti, proseguono il loro percorso fino al colon, dove i batteri intestinali li fermentano rapidamente. Questo processo genera gas (idrogeno e metano) e richiama acqua nel lume intestinale per osmosi, causando la distensione delle pareti dell'intestino. Nelle persone affette da IBS, che soffrono di <strong>ipersensibilità viscerale</strong>, questa distensione si traduce in dolore acuto, crampi, gonfiore e alterazioni della motilità (diarrea o stipsi).
            </p>
            <div className="p-3 bg-(--code-bg) border border-(--border) rounded-xl italic text-xs">
              🔬 <strong>Evidenza Scientifica (Monash University):</strong> I trial clinici controllati dimostrano che una riduzione guidata dei FODMAP riduce significativamente i sintomi gastrointestinali in circa il 70-75% dei pazienti affetti da IBS.
            </div>
          </div>
        )}

        {/* TAB 2: MACRONUTRIENTI */}
        {activeTab === 'macros' && (
          <div className="space-y-4 animate-fade-in text-(--text) text-sm md:text-base leading-relaxed">
            <h3 className="text-lg font-bold text-(--text-h) mb-2">Oltre il Mito della Caloria</h3>
            <p>
              Nel contesto dell'IBS, l'energia totale di un cibo (le calorie) ha un impatto secondario rispetto alla sua <strong>composizione strutturale e fermentabilità</strong>. Un alimento a bassissimo contenuto calorico (come l'aglio o il dolcificante xilitolo) può scatenare crisi intestinali severe, mentre un alimento calorico ma privo di zuccheri fermentabili (come l'olio d'oliva o una bistecca) risulta perfettamente tollerato.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-(--text-h)">Proteine:</strong> Costituite da amminoacidi, non subiscono fermentazione gassosa nel colon. Sono i mattoni strutturali essenziali per la rigenerazione tissutale.
              </li>
              <li>
                <strong className="text-(--text-h)">Grassi:</strong> Forniscono acidi grassi essenziali e supportano l'assorbimento delle vitamine. Tuttavia, un carico eccessivo di grassi in un solo pasto può iper-stimolare il riflesso gastrocolico, accelerando o rallentando la motilità.
              </li>
              <li>
                <strong className="text-(--text-h)">Carboidrati:</strong> Vanno selezionati in base alla lunghezza della catena molecolare e alla digeribilità, preferendo le fonti a basso contenuto di FODMAP.
              </li>
            </ul>
          </div>
        )}

        {/* TAB 3: MICROBIOTA */}
        {activeTab === 'microbiota' && (
          <div className="space-y-4 animate-fade-in text-(--text) text-sm md:text-base leading-relaxed">
            <h3 className="text-lg font-bold text-(--text-h) mb-2">Proteggere l'Ecosistema Intestinale</h3>
            <p>
              Una dieta rigida priva di FODMAP elimina anche molti <strong>prebiotici naturali</strong> (le fibre che nutrono i batteri sani dell'intestino). Gli studi indicano che mantenere una restrizione totale oltre le 6 settimane riduce drasticamente le popolazioni di batteri benefici come i <i>Bifidobatteri</i>.
            </p>
            <p>
              Per questo motivo, la scienza medica impone un approccio in 3 fasi: 
              <br />
              1. <strong>Eliminazione</strong> (per sfiammare), 2. <strong>Reintroduzione graduale</strong> (per testare la tolleranza individuale ai singoli zuccheri), 3. <strong>Personalizzazione</strong> a lungo termine (per reinserire la massima varietà di cibi e nutrire il microbiota).
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
