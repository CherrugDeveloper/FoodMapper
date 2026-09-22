import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateNutritionalNeeds } from '../utils/nutritionEngine';
import type { UserData, NutritionalResults, HealthCondition } from '../utils/nutritionEngine';

const CONDITIONS: HealthCondition[] = ['celiac', 'diabetes', 'hypertension', 'lactose_intolerance'];

interface NutritionalCalculatorProps {
  onCalculate: (results: NutritionalResults, userData: UserData) => void;
  initialResults: NutritionalResults | null;
}

export default function NutritionalCalculator({ onCalculate, initialResults }: NutritionalCalculatorProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<UserData>({
    weightKg: 70,
    heightCm: 175,
    ageYears: 30,
    biologicalSex: 'female',
    activityLevel: 'sedentary',
    ibsType: 'unknown',
    conditions: []
  });

  const [results, setResults] = useState<NutritionalResults | null>(initialResults);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (['weightKg', 'heightCm', 'ageYears'].includes(name)) {
      parsedValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const toggleCondition = (condition: HealthCondition) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Esegue il calcolo logico basato sulle metriche biometriche sottomesse
    const nutritionalNeeds = calculateNutritionalNeeds(formData);
    setResults(nutritionalNeeds);
    onCalculate(nutritionalNeeds, formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* COLONNA FORM */}
        <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <h2 className="text-xl font-bold text-(--text-h) mb-6">{t('calc_title')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-(--text) mb-1">{t('calc_weight')}</label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text) mb-1">{t('calc_height')}</label>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-(--text) mb-1">{t('calc_age')}</label>
                <input
                  type="number"
                  name="ageYears"
                  value={formData.ageYears}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text) mb-1">{t('calc_sex')}</label>
                <select
                  name="biologicalSex"
                  value={formData.biologicalSex}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
                >
                  <option value="female">{t('calc_sex_f')}</option>
                  <option value="male">{t('calc_sex_m')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('calc_activity')}</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
              >
                <option value="sedentary">{t('calc_act_sed')}</option>
                <option value="lightly_active">{t('calc_act_light')}</option>
                <option value="moderately_active">{t('calc_act_mod')}</option>
                <option value="very_active">{t('calc_act_very')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text) mb-1">{t('calc_ibs')}</label>
              <select
                name="ibsType"
                value={formData.ibsType}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) focus:outline-none focus:border-(--accent) font-semibold text-(--accent)"
              >
                <option value="unknown">{t('calc_ibs_unknown')}</option>
                <option value="IBS-D">{t('calc_ibs_d')}</option>
                <option value="IBS-C">{t('calc_ibs_c')}</option>
                <option value="IBS-M">{t('calc_ibs_m')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text) mb-2">{t('calc_conditions')}</label>
              <div className="grid grid-cols-2 gap-2">
                {CONDITIONS.map(condition => {
                  const isChecked = formData.conditions.includes(condition);
                  return (
                    <button
                      type="button"
                      key={condition}
                      onClick={() => toggleCondition(condition)}
                      aria-pressed={isChecked}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        isChecked
                          ? 'bg-(--accent-bg) border-(--accent) text-(--accent)'
                          : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                        isChecked ? 'bg-(--accent) border-(--accent) text-white' : 'border-(--border)'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      {t(`conditions.${condition}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-md text-center"
            >
              {t('calc_btn')}
            </button>
          </form>
        </div>

        {/* COLONNA RISULTATI */}
        <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-(--text-h) mb-6">{t('report_title')}</h2>

            {results ? (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border)">
                    <span className="block text-xs uppercase tracking-wider text-(--text)">Proteine</span>
                    <strong className="text-lg text-(--text-h)">{results.proteins}g</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border)">
                    <span className="block text-xs uppercase tracking-wider text-(--text)">Grassi</span>
                    <strong className="text-lg text-(--text-h)">{results.fats}g</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border)">
                    <span className="block text-xs uppercase tracking-wider text-(--text)">Carboidrati</span>
                    <strong className="text-lg text-(--text-h)">{results.carbs}g</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border) space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-(--text)">🎯 Target Fibre Critico:</span>
                    <strong className="text-(--text-h)">{results.fiber}g / giorno</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-(--text)">💧 Idratazione Minima:</span>
                    <strong className="text-(--text-h)">{results.waterLiters} Litri</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/5 border border-(--accent-border)">
                  <h4 className="text-sm font-bold text-(--accent) mb-1">💡 Indicazione per il Microbiota:</h4>
                  <p className="text-sm text-(--text) leading-relaxed">{results.recommendations}</p>
                </div>

                {results.conditionNotes.length > 0 && (
                  <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border)">
                    <h4 className="text-sm font-bold text-(--text-h) mb-2">⚕️ {t('report_conditions_title')}</h4>
                    <ul className="list-disc pl-5 space-y-1.5">
                      {results.conditionNotes.map(condition => (
                        <li key={condition} className="text-xs md:text-sm text-(--text) leading-relaxed">
                          <strong className="text-(--text-h)">{t(`conditions.${condition}`)}:</strong>{' '}
                          {t(`conditions.${condition}_note`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-(--text) italic mt-2 text-center">
                  *Stima del consumo energetico teorico di fondo: ~{results.estimatedTotalEnergyKcal} kcal
                </p>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center border border-dashed border-(--border) rounded-xl text-(--text) italic text-center p-4">
                {t('report_placeholder')}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
