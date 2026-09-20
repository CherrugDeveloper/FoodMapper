import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type PhaseType = 'phase1' | 'phase2' | 'phase3';

interface MealStructure {
  colazione: string;
  pranzo: string;
  spuntino: string;
  cena: string;
}

interface PhaseContent {
  title: string;
  duration: string;
  focus: string;
  meals: MealStructure;
}

export default function DietPlan() {
  const { t, i18n } = useTranslation();
  const [activePhase, setActivePhase] = useState<PhaseType>('phase1');
  
  const currentLang: 'it' | 'en' = i18n.language.startsWith('it') ? 'it' : 'en';

  const phaseTranslations: Record<PhaseType, Record<'it' | 'en', PhaseContent>> = {
    phase1: {
      it: {
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
      en: {
        title: 'Phase 1: Total Elimination',
        duration: '2 to 6 weeks',
        focus: 'Radical substitution of all high-FODMAP foods to calm intestinal walls and stop rapid bacterial fermentation.',
        meals: {
          colazione: 'Oatmeal porridge cooked in water or lactose-free milk, topped with a handful of fresh blueberries and chia seeds.',
          pranzo: 'Seafood risotto or basmati rice stir-fried with zucchini and carrots, alongside chicken strips cooked in extra virgin olive oil.',
          spuntino: 'A firm banana (not overly ripe) or a pot of lactose-free yogurt with a small handful of walnuts.',
          cena: 'Baked salmon flavored with thyme and chives, served with a controlled portion of boiled potatoes and lamb\'s lettuce salad.'
        }
      }
    },
    phase2: {
      it: {
        title: 'Fase 2: Reintroduzione Strategica',
        duration: 'Variabile (1-2 mesi)',
        focus: 'Test mirati per tre giorni consecutivi con dosi crescenti di un solo zucchero per individuare la tolleranza individuale.',
        meals: {
          colazione: 'Gallette di riso con burro d\'arachidi puro e fragole + inizio test (es. 1/4 di mela per il Fruttosio).',
          pranzo: 'Pasta di riso condita con pesto fatto in casa (senza aglio) e scaglie di Parmigiano Reggiano stagionato.',
          spuntino: 'Un cubetto di cioccolato fondente (almeno 70%) e un infuso caldo alla menta piperita.',
          cena: 'Frittata di uova fresche con zucchine e un panino di frumento piccolo (solo se è la giornata di test per i Fruttani).'
        }
      },
      en: {
        title: 'Phase 2: Strategic Reintroduction',
        duration: 'Variable (1-2 months)',
        focus: 'Targeted three-day tracking challenges using increasing doses of a single molecular group to chart personal tolerances.',
        meals: {
          colazione: 'Rice cakes topped with pure peanut butter and strawberries + challenge food start (e.g., 1/4 apple for Fructose test).',
          pranzo: 'Rice pasta tossed with homemade garlic-free pesto and shaves of aged Parmigiano Reggiano.',
          spuntino: 'A square of dark chocolate (70% or higher) and a warm peppermint herbal tea.',
          cena: 'Fresh egg omelette with zucchini and a small wheat roll (only if it is a targeted challenge day for the Fructans group).'
        }
      }
    },
    phase3: {
      it: {
        title: 'Fase 3: Personalizzazione a Lungo Termine',
        duration: 'A vita (Stile Alimentare)',
        focus: 'Reintegrazione di tutti i cibi superati. Esclusione mirata solo dei tuoi specifici trigger per nutrire al massimo il microbiota.',
        meals: {
          colazione: 'Yogurt greco senza lattosio con fiocchi d\'avena integrale, kiwi a fette e mandorle.',
          pranzo: 'Insalata di quinoa o grano saraceno con tonno, uova sode, pomodorini e olive nere condita con olio EVO.',
          spuntino: 'Un frutto tollerato a scelta o un piccolo mix di frutta secca mista non fermentabile.',
          cena: 'Filetto di manzo o tofu sodo alla piastra con contorno di verdure miste (reintroducendo porzioni moderate di broccoli).'
        }
      },
      en: {
        title: 'Phase 3: Long-Term Personalization',
        duration: 'Lifelong Blueprint',
        focus: 'Full integration of all passed groups. Restricting exclusively your verified molecular triggers to support maximum microbiota diversity.',
        meals: {
          colazione: 'Lactose-free Greek yogurt with whole-grain rolled oats, sliced kiwi, and almonds.',
          pranzo: 'Quinoa or buckwheat salad tossed with tuna, hard-boiled eggs, cherry tomatoes, and black olives with EVOO.',
          spuntino: 'A safe selected fruit or a small handful of non-fermentable mixed nuts.',
          cena: 'Grilled beef fillet or firm tofu served with a side of mixed vegetables (reintroducing moderate portions of broccoli).'
        }
      }
    }
  };

  const currentPhase = phaseTranslations[activePhase][currentLang];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left mt-8 border-t border-(--border)">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('diet_title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {(Object.keys(phaseTranslations) as PhaseType[]).map((phaseKey) => (
          <button
            key={phaseKey}
            onClick={() => setActivePhase(phaseKey)}
            className={`p-4 rounded-xl font-semibold text-sm border transition-all text-center cursor-pointer flex flex-col justify-center items-center gap-1 ${
              activePhase === phaseKey
                ? 'bg-purple-500/10 border-(--accent) text-(--accent)'
                : 'bg-(--bg) border-(--border) text-(--text) hover:text-(--text-h)'
            }`}
          >
            <span>{phaseTranslations[phaseKey][currentLang].title}</span>
            <span className="text-xs font-normal opacity-80">{phaseTranslations[phaseKey][currentLang].duration}</span>
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm space-y-6 animate-fade-in">
        <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border)">
          <h3 className="text-lg font-bold text-(--text-h) mb-1">{currentPhase.title}</h3>
          <p className="text-sm text-(--text) leading-relaxed">{currentPhase.focus}</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-bold text-(--text-h) uppercase tracking-wide border-b border-(--border) pb-2">
            {t('diet_distribution_label')}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-(--border) bg-purple-500/5">
              <strong className="block text-sm text-(--accent) uppercase mb-1">{t('diet_meals_breakfast')}</strong>
              <p className="text-sm text-(--text) leading-relaxed">{currentPhase.meals.colazione}</p>
            </div>
            <div className="p-4 rounded-xl border border-(--border) bg-purple-500/5">
              <strong className="block text-sm text-(--accent) uppercase mb-1">{t('diet_meals_lunch')}</strong>
              <p className="text-sm text-(--text) leading-relaxed">{currentPhase.meals.pranzo}</p>
            </div>
            <div className="p-4 rounded-xl border border-(--border) bg-purple-500/5">
              <strong className="block text-sm text-(--accent) uppercase mb-1">{t('diet_meals_snack')}</strong>
              <p className="text-sm text-(--text) leading-relaxed">{currentPhase.meals.spuntino}</p>
            </div>
            <div className="p-4 rounded-xl border border-(--border) bg-purple-500/5">
              <strong className="block text-sm text-(--accent) uppercase mb-1">{t('diet_meals_dinner')}</strong>
              <p className="text-sm text-(--text) leading-relaxed">{currentPhase.meals.cena}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
