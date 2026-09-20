import { useState } from 'react';

type PhaseType = 'phase1' | 'phase2' | 'phase3';

interface MealStructure {
  colazione: string;
  pranzo: string;
  spuntino: string;
  cena: string;
}

export default function DietPlan() {
  const [activePhase, setActivePhase] = useState<PhaseType>('phase1');

  // Database locale degli schemi guida per le tre fasi cliniche
  const phaseData: Record<PhaseType, { title: string; duration: string; focus: string; meals: MealStructure }> = {
    phase1: {
      title: 'Fase 1: Eliminazione Totale',
      duration: 'Da 2 a 6 settimane',
      focus: 'Sostituzione radicale di tutti i cibi ad alto FODMAP per sfiammare le pareti intestinali e azzerare la fermentazione.',
      meals: {
        colazione: 'Porridge d\'avena cotto in acqua o latte senza lattosio, guarnito con una manciata di mirtilli freschi e semi di chia.',
        pranzo: 'Risotto ai frutti di mare o riso basmati saltato con zucchine e carote, con straccetti di pollo cotti in olio extravergine.',
        spuntino: 'Una banana (non eccessivamente matura) o un vasetto di yogurt senza lattosio con una manciata di gherigli di noce.',
        cena: 'Salmone al forno aromatizzato al timo ed erba cipollina, accompagnato da una porzione controllata di patate lesse e valeriana in insalata.'
      }
    },
    phase2: {
      title: 'Fase 2: Reintroduzione Strategica',
      duration: 'Variabile (1-2 mesi)',
      focus: 'Test mirati (es. 3 giorni consecutivi con dosi crescenti di un solo zucchero) per individuare quali FODMAP tolleri e quali scatenano i sintomi.',
      meals: {
        colazione: 'Gallette di riso con burro d\'arachidi puro e fragole + inizio test (es. 1/4 di mela per testare il Fruttosio).',
        pranzo: 'Pasta di riso o quinoa condita con pesto fatto in casa (senza aglio!) e scaglie di Parmigiano Reggiano stagionato.',
        spuntino: 'Un cubetto di cioccolato fondente (almeno 70%) e un infuso caldo alla menta piperita (rilassante per la muscolatura intestinale).',
        cena: 'Frittata di uova fresche con zucchine e un panino di frumento piccolo (solo se è la giornata di test per il gruppo dei Fruttani).'
      }
    },
    phase3: {
      title: 'Fase 3: Personalizzazione a Lungo Termine',
      duration: 'A vita (Stile Alimentare)',
      focus: 'Reintegrazione di tutti i cibi superati nella Fase 2. Esclusione mirata solo dei tuoi specifici trigger per nutrire al massimo il microbiota.',
      meals: {
        colazione: 'Yogurt greco (se tollerato o senza lattosio) con fiocchi d\'avena integrale, kiwi a fette e mandorle.',
        pranzo: 'Insalata di quinoa o grano saraceno con tonno, uova sode, pomodorini e olive nere condita con olio EVO.',
        spuntino: 'Un frutto tollerato a scelta o un piccolo mix di frutta secca mista non fermentabile.',
        cena: 'Filetto di manzo o tofu sodo alla piastra con contorno di verdure miste (reintroducendo quelle tollerate, es. porzioni moderate di broccoli).'
      }
    }
  };

  const currentPhase = phaseData[activePhase];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left mt-8 border-t border-(--border)">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        🍽️ Schema e Struttura della Dieta Trifasica
      </h2>

      {/* Selettore Fasi della Dieta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {(Object.keys(phaseData) as PhaseType[]).map((phaseKey) => (
          <button
            key={phaseKey}
            onClick={() => setActivePhase(phaseKey)}
            className={`p-4 rounded-xl font-semibold text-sm border transition-all text-center cursor-pointer flex flex-col justify-center items-center gap-1 ${
              activePhase === phaseKey
                ? 'bg-purple-500/10 border-(--accent) text-(--accent)'
                : 'bg-(--bg) border-(--border) text-(--text) hover:text-(--text-h)'
            }`}
          >
            <span>{phaseData[phaseKey].title.split(':')[0]}</span>
            <span className="text-xs font-normal opacity-80">{phaseData[phaseKey].duration}</span>
          </button>
        ))}
      </div>

      {/* PANNELLO DETTAGLIO FASE E PASTI */}
      <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm space-y-6 animate-fade-in">
        
        {/* Intestazione della fase */}
        <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border)">
          <h3 className="text-lg font-bold text-(--text-h) mb-1">{currentPhase.title}</h3>
          <p className="text-sm text-(--text) leading-relaxed">{currentPhase.focus}</p>
        </div>

        {/* Struttura Giornaliera dei Pasti */}
        <div className="space-y-4">
          <h4 className="text-base font-bold text-(--text-h) uppercase tracking-wide border-b border-(--border) pb-2">
            📋 Esempio di Distribuzione Strutturale:
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-(--border) bg-purple-500/5">
              <strong className="block text-sm text-(--accent) uppercase mb-1">🌅 Colazione</strong>
              <p className="text-sm text-(--text) leading-relaxed">{currentPhase.meals.colazione}</p>
            </div>
            <div className="p-4 rounded-xl border border-(--border) bg-purple-500/5">
              <strong className="block text-sm text-(--accent) uppercase mb-1">☀️ Pranzo</strong>
              <p className="text-sm text-(--text) leading-relaxed">{currentPhase.meals.pranzo}</p>
            </div>
            <div className="p-4 rounded-xl border border-(--border) bg-purple-500/5">
              <strong className="block text-sm text-(--accent) uppercase mb-1">🥪 Spuntino</strong>
              <p className="text-sm text-(--text) leading-relaxed">{currentPhase.meals.spuntino}</p>
            </div>
            <div className="p-4 rounded-xl border border-(--border) bg-purple-500/5">
              <strong className="block text-sm text-(--accent) uppercase mb-1">🌙 Cena</strong>
              <p className="text-sm text-(--text) leading-relaxed">{currentPhase.meals.cena}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
