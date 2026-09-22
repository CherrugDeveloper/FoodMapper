import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import { generateDayPlan } from '../utils/mealGenerator';
import type { MealKey } from '../utils/mealGenerator';

type PhaseType = 'phase1' | 'phase2' | 'phase3';

interface PhaseMeta {
  title: string;
  duration: string;
  focus: string;
}

interface DietPlanProps {
  results: NutritionalResults | null;
  userData: UserData | null;
  onGoToCalculator: () => void;
}

export default function DietPlan({ results, userData, onGoToCalculator }: DietPlanProps) {
  const { t, i18n } = useTranslation();
  const [activePhase, setActivePhase] = useState<PhaseType>('phase1');

  const currentLang: 'it' | 'en' = i18n.language.startsWith('it') ? 'it' : 'en';
  const conditions = userData?.conditions ?? [];

  const phaseTranslations: Record<PhaseType, Record<'it' | 'en', PhaseMeta>> = {
    phase1: {
      it: {
        title: 'Fase 1: Eliminazione Totale',
        duration: 'Da 2 a 6 settimane',
        focus: 'Sostituzione radicale di tutti i cibi ad alto FODMAP per sfiammare le pareti intestinali e azzerare la fermentazione. Il piano sotto usa solo alimenti low-FODMAP, porzionati sul tuo fabbisogno.'
      },
      en: {
        title: 'Phase 1: Total Elimination',
        duration: '2 to 6 weeks',
        focus: 'Radical substitution of all high-FODMAP foods to calm intestinal walls and stop rapid bacterial fermentation. The plan below uses only low-FODMAP foods portioned to your targets.'
      }
    },
    phase2: {
      it: {
        title: 'Fase 2: Reintroduzione Strategica',
        duration: 'Variabile (1-2 mesi)',
        focus: 'Test mirati per tre giorni consecutivi con dosi crescenti di un solo gruppo FODMAP per individuare la tolleranza individuale. La base resta low-FODMAP; il test va annotato nel diario.'
      },
      en: {
        title: 'Phase 2: Strategic Reintroduction',
        duration: 'Variable (1-2 months)',
        focus: 'Targeted three-day challenges with increasing doses of a single FODMAP group to chart personal tolerance. The base stays low-FODMAP; log each challenge in the diary.'
      }
    },
    phase3: {
      it: {
        title: 'Fase 3: Personalizzazione a Lungo Termine',
        duration: 'A vita (Stile Alimentare)',
        focus: 'Reintegrazione dei cibi superati nei test. Gli alimenti segnati con ⚠️ sono reintroduzioni facoltative in porzione moderata: includili solo se tollerati.'
      },
      en: {
        title: 'Phase 3: Long-Term Personalization',
        duration: 'Lifelong Blueprint',
        focus: 'Reintegration of foods that passed testing. Items marked ⚠️ are optional moderate-portion reintroductions: include them only if tolerated.'
      }
    }
  };

  const currentPhase = phaseTranslations[activePhase][currentLang];
  const mealLabelKeys: Record<MealKey, string> = {
    colazione: 'diet_meals_breakfast',
    pranzo: 'diet_meals_lunch',
    spuntino: 'diet_meals_snack',
    cena: 'diet_meals_dinner'
  };

  const dayPlan = results ? generateDayPlan(results, userData, activePhase) : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('diet_title')}
      </h2>

      {/* Collegamento al fabbisogno calcolato */}
      {results ? (
        <div className="mb-6 p-4 rounded-2xl bg-(--accent-bg) border border-(--accent-border) animate-fade-in">
          <h3 className="text-sm font-bold text-(--accent) uppercase tracking-wider mb-3">{t('diet_targets_title')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            <div className="p-2 rounded-xl bg-(--bg) border border-(--border)">
              <span className="block text-[11px] uppercase text-(--text)">kcal</span>
              <strong className="text-(--text-h)">{results.estimatedTotalEnergyKcal}</strong>
            </div>
            <div className="p-2 rounded-xl bg-(--bg) border border-(--border)">
              <span className="block text-[11px] uppercase text-(--text)">{t('diet_target_protein')}</span>
              <strong className="text-(--text-h)">{results.proteins}g</strong>
            </div>
            <div className="p-2 rounded-xl bg-(--bg) border border-(--border)">
              <span className="block text-[11px] uppercase text-(--text)">{t('diet_target_carbs')}</span>
              <strong className="text-(--text-h)">{results.carbs}g</strong>
            </div>
            <div className="p-2 rounded-xl bg-(--bg) border border-(--border)">
              <span className="block text-[11px] uppercase text-(--text)">{t('diet_target_fats')}</span>
              <strong className="text-(--text-h)">{results.fats}g</strong>
            </div>
            <div className="p-2 rounded-xl bg-(--bg) border border-(--border)">
              <span className="block text-[11px] uppercase text-(--text)">💧</span>
              <strong className="text-(--text-h)">{results.waterLiters}L</strong>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={onGoToCalculator}
          className="w-full mb-6 p-4 rounded-2xl border border-dashed border-(--accent-border) bg-purple-500/5 text-sm text-(--text) hover:border-(--accent) transition-all cursor-pointer text-left"
        >
          ⚙️ {t('diet_link_cta')}
        </button>
      )}

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

        {/* Pasti generati sui target calcolati */}
        {dayPlan ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dayPlan.meals.map(meal => (
              <div key={meal.mealKey} className="p-4 rounded-xl border border-(--border) bg-purple-500/5">
                <div className="flex justify-between items-center mb-2">
                  <strong className="block text-sm text-(--accent) uppercase">{t(mealLabelKeys[meal.mealKey])}</strong>
                  <span className="text-[11px] font-semibold text-(--text) bg-(--code-bg) px-2 py-0.5 rounded-full border border-(--border)">
                    ~{meal.totals.kcal} kcal
                  </span>
                </div>
                <ul className="space-y-1.5 mb-3">
                  {meal.portions.map((portion, i) => (
                    <li key={i} className="text-sm text-(--text) flex justify-between items-baseline gap-2">
                      <span>
                        {portion.reintroduced && <span title={t('diet_reintroduced')} className="cursor-help">⚠️ </span>}
                        {t(`foods.${portion.food.id}.name`)}
                      </span>
                      <span className="text-xs text-(--text) whitespace-nowrap">
                        {portion.grams} g · {Math.round(portion.food.nutrition.kcal * portion.grams / 100)} kcal
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-(--border) text-[11px] text-(--text) space-y-1">
                  <p>
                    P {meal.totals.protein}g · C {meal.totals.carbs}g · F {meal.totals.fats}g · {t('diet_fiber_short')} {meal.totals.fiber}g
                  </p>
                  {meal.micros.length > 0 && (
                    <p>⚛️ {meal.micros.map(m => t(`micros.${m}`)).join(' · ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-(--text) italic text-center py-4">{t('diet_need_results')}</p>
        )}

        {/* Totale giornaliero generato */}
        {dayPlan && (
          <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border)">
            <h4 className="text-sm font-bold text-(--text-h) mb-2">📊 {t('diet_day_total')}</h4>
            <p className="text-sm text-(--text)">
              ~{dayPlan.totals.kcal} kcal · P {dayPlan.totals.protein}g · C {dayPlan.totals.carbs}g · F {dayPlan.totals.fats}g · {t('diet_fiber_short')} {dayPlan.totals.fiber}g
            </p>
          </div>
        )}

        {conditions.length > 0 && (
          <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border)">
            <h4 className="text-sm font-bold text-(--text-h) mb-2">⚕️ {t('diet_conditions_title')}</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              {conditions.map(condition => (
                <li key={condition} className="text-xs md:text-sm text-(--text) leading-relaxed">
                  <strong className="text-(--text-h)">{t(`conditions.${condition}`)}:</strong>{' '}
                  {t(`conditions.${condition}_diet`)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
