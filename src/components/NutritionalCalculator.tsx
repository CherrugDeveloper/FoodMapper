import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import { calculateNutritionalNeeds } from '../utils/nutritionEngine';
import type { UserData, NutritionalResults, HealthCondition, DietGoal, AllergenKey } from '../utils/nutritionEngine';
import { detectMedicationsWithBrands, formatDetectedMedication } from '../utils/medicationWarnings';
import InfoPopup from './InfoPopup';
import MedicationSelector from './MedicationSelector';

const ALL_CONDITIONS: HealthCondition[] = [
  'celiac',
  'diabetes_type1',
  'diabetes_type2',
  'hypertension',
  'pregnancy',
  'hypothyroidism',
  'hyperthyroidism',
  'menopause',
  'pcos'
];

const DIABETES_CONDITIONS: HealthCondition[] = ['diabetes_type1', 'diabetes_type2'];

const ALLERGENS: AllergenKey[] = [
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soy',
  'milk',
  'tree_nuts',
  'celery',
  'mustard',
  'sesame',
  'lupins',
  'sulphites'
];

const FEMALE_ONLY_CONDITIONS: HealthCondition[] = ['pregnancy', 'menopause', 'pcos'];
const THYROID_CONDITIONS: HealthCondition[] = ['hypothyroidism', 'hyperthyroidism'];

interface NutritionalCalculatorProps {
  onCalculate: (results: NutritionalResults, userData: UserData) => void;
  initialResults: NutritionalResults | null;
}

export default function NutritionalCalculator({ onCalculate, initialResults }: NutritionalCalculatorProps) {
  const { t } = useTranslation();
  const { setActiveTab } = useAppContext();

  const [formData, setFormData] = useState<UserData>({
    weightKg: 70,
    heightCm: 175,
    ageYears: 30,
    biologicalSex: 'female',
    activityLevel: 'sedentary',
    ibsType: 'unknown',
    conditions: [],
    allergens: [],
    medications: '',
    bioHacking: false,
    dietGoal: 'maintenance'
  });

  const [results, setResults] = useState<NutritionalResults | null>(initialResults);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (['weightKg', 'heightCm', 'ageYears'].includes(name)) {
      parsedValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const biologicalSex = e.target.value as 'male' | 'female';
    setFormData(prev => ({
      ...prev,
      biologicalSex,
      // Rimuove condizioni femminili-specifiche se si passa a maschio
      conditions: prev.conditions.filter(c => biologicalSex === 'female' || !FEMALE_ONLY_CONDITIONS.includes(c))
    }));
  };

  const toggleCondition = (condition: HealthCondition) => {
    setFormData(prev => {
      const isChecked = prev.conditions.includes(condition);
      let nextConditions = isChecked
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition];

      // Ipotiroidismo e ipertiroidismo sono mutuamente esclusivi
      if (!isChecked && THYROID_CONDITIONS.includes(condition)) {
        const otherThyroid = THYROID_CONDITIONS.find(c => c !== condition);
        if (otherThyroid) {
          nextConditions = nextConditions.filter(c => c !== otherThyroid);
        }
      }

      // Diabete tipo 1 e tipo 2 sono mutuamente esclusivi
      if (!isChecked && DIABETES_CONDITIONS.includes(condition)) {
        const otherDiabetes = DIABETES_CONDITIONS.find(c => c !== condition);
        if (otherDiabetes) {
          nextConditions = nextConditions.filter(c => c !== otherDiabetes);
        }
      }

      return { ...prev, conditions: nextConditions };
    });
  };

  const toggleAllergen = (allergen: AllergenKey) => {
    setFormData(prev => {
      const isChecked = prev.allergens?.includes(allergen) ?? false;
      const nextAllergens = isChecked
        ? (prev.allergens ?? []).filter(a => a !== allergen)
        : [...(prev.allergens ?? []), allergen];
      return { ...prev, allergens: nextAllergens };
    });
  };

  const toggleBioHacking = () => {
    setFormData(prev => ({ ...prev, bioHacking: !prev.bioHacking }));
  };

  const handleDietGoalChange = (goal: DietGoal) => {
    setFormData(prev => ({ ...prev, dietGoal: goal }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Esegue il calcolo logico basato sulle metriche biometriche sottomesse
    const nutritionalNeeds = calculateNutritionalNeeds(formData);
    setResults(nutritionalNeeds);
    onCalculate(nutritionalNeeds, formData);
  };

  const visibleConditions = useMemo(() => {
    return ALL_CONDITIONS.filter(condition => {
      if (FEMALE_ONLY_CONDITIONS.includes(condition)) {
        return formData.biologicalSex === 'female';
      }
      return true;
    });
  }, [formData.biologicalSex]);

  const detectedMedications = useMemo(() => {
    return detectMedicationsWithBrands(formData.medications ?? '');
  }, [formData.medications]);

  const dietGoals: DietGoal[] = ['maintenance', 'deficit', 'surplus'];

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-4 sm:py-6 lg:py-8 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 lg:gap-10 xl:gap-12 min-w-0">

        {/* COLONNA FORM */}
        <div className="min-w-0 p-4 sm:p-6 md:p-7 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-(--text-h) mb-5 md:mb-7">{t('calc_title')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Riga 1: Dati Biometrici Numerici - 3 colonne su sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label className="flex items-center justify-between gap-1 text-sm font-medium text-(--text) min-h-6 mb-1">
                  {t('calc_weight')}
                  <InfoPopup infoKey="calc_weight" className="ml-1.5 shrink-0" />
                </label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleChange}
                  className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base"
                  required
                />
              </div>
              <div>
                <label className="flex items-center justify-between gap-1 text-sm font-medium text-(--text) min-h-6 mb-1">
                  {t('calc_height')}
                  <InfoPopup infoKey="calc_height" className="ml-1.5 shrink-0" />
                </label>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleChange}
                  className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base"
                  required
                />
              </div>
              <div>
                <label className="flex items-center justify-between gap-1 text-sm font-medium text-(--text) min-h-6 mb-1">
                  {t('calc_age')}
                  <InfoPopup infoKey="calc_age" className="ml-1.5 shrink-0" />
                </label>
                <input
                  type="number"
                  name="ageYears"
                  value={formData.ageYears}
                  onChange={handleChange}
                  className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base"
                  required
                />
              </div>
            </div>

            {/* Riga 2: Dati Anagrafici e Stile di Vita - 2 colonne su sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="flex items-center justify-between gap-1 text-sm font-medium text-(--text) min-h-6 mb-1">
                  {t('calc_sex')}
                  <InfoPopup infoKey="calc_sex" className="ml-1.5 shrink-0" />
                </label>
                <select
                  name="biologicalSex"
                  value={formData.biologicalSex}
                  onChange={handleSexChange}
                  className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base appearance-none pr-10"
                >
                  <option value="female">{t('calc_sex_f')}</option>
                  <option value="male">{t('calc_sex_m')}</option>
                </select>
              </div>
              <div>
                <label className="flex items-center justify-between gap-1 text-sm font-medium text-(--text) min-h-6 mb-1">
                  {t('calc_activity')}
                  <InfoPopup infoKey="calc_activity" className="ml-1.5 shrink-0" />
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base appearance-none pr-10"
                >
                  <option value="sedentary">{t('calc_act_sed')}</option>
                  <option value="lightly_active">{t('calc_act_light')}</option>
                  <option value="moderately_active">{t('calc_act_mod')}</option>
                  <option value="very_active">{t('calc_act_very')}</option>
                </select>
              </div>
            </div>

            {/* Riga 3: Parametro Clinico Primario - Sottotipo IBS - tutta larghezza */}
            <div className="w-full">
              <label className="flex items-center justify-between gap-1 text-sm font-medium text-(--text) min-h-6 mb-1">
                {t('calc_ibs')}
                <InfoPopup infoKey="calc_ibs" className="ml-1.5 shrink-0" />
              </label>
              <select
                name="ibsType"
                value={formData.ibsType}
                onChange={handleChange}
                className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--code-bg) focus:outline-none focus:border-(--accent) font-semibold text-(--accent) text-base appearance-none pr-10"
              >
                <option value="unknown">{t('calc_ibs_unknown')}</option>
                <option value="IBS-D">{t('calc_ibs_d')}</option>
                <option value="IBS-C">{t('calc_ibs_c')}</option>
                <option value="IBS-M">{t('calc_ibs_m')}</option>
              </select>
            </div>

            <div>
              <label className="flex items-center justify-between gap-1 text-sm font-medium text-(--text) min-h-6 mb-1">
                {t('calc_diet_goal')}
                <InfoPopup infoKey="diet_goal" className="ml-1.5 shrink-0" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {dietGoals.map(goal => {
                  const isSelected = formData.dietGoal === goal;
                  return (
                    <button
                      type="button"
                      key={goal}
                      onClick={() => handleDietGoalChange(goal)}
                      aria-pressed={isSelected}
                      className={`px-3 py-3 rounded-xl text-sm font-semibold text-center border transition-all cursor-pointer min-h-11 ${
                        isSelected
                          ? 'bg-(--accent-bg) border-(--accent) text-(--accent)'
                          : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
                      }`}
                    >
                      {t(`calc_diet_goal_${goal}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-(--text) min-h-6 mb-2">
                {t('calc_conditions')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-full">
                {visibleConditions.map(condition => {
                  const isChecked = formData.conditions.includes(condition);
                  return (
                    <button
                      type="button"
                      key={condition}
                      onClick={() => toggleCondition(condition)}
                      aria-pressed={isChecked}
                      className={`group px-4 py-3 rounded-xl text-sm font-medium text-left border transition-colors cursor-pointer flex items-center gap-3 min-h-12 min-w-0 ${
                        isChecked
                          ? 'bg-(--accent-bg) border-(--accent) text-(--accent) shadow-sm'
                          : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h) hover:border-(--accent)/50'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded border flex items-center justify-center text-[11px] shrink-0 ${
                        isChecked ? 'bg-(--accent) border-(--accent) text-white' : 'border-(--border)'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className="min-w-0 truncate">{t(`conditions.${condition}`)}</span>
                      <InfoPopup infoKey={`condition_${condition}`} className="ml-auto shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-(--text) min-h-6 mb-2">
                {t('calc_allergens_title')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-full">
                {ALLERGENS.map(allergen => {
                  const isChecked = formData.allergens?.includes(allergen) ?? false;
                  return (
                    <button
                      type="button"
                      key={allergen}
                      onClick={() => toggleAllergen(allergen)}
                      aria-pressed={isChecked}
                      className={`group px-4 py-3 rounded-xl text-sm font-medium text-left border transition-colors cursor-pointer flex items-center gap-3 min-h-12 min-w-0 ${
                        isChecked
                          ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm'
                          : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h) hover:border-amber-400/50'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded border flex items-center justify-center text-[11px] shrink-0 ${
                        isChecked ? 'bg-amber-500 border-amber-500 text-white' : 'border-(--border)'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className="min-w-0 truncate">{t(`allergens.${allergen}`)}</span>
                      <InfoPopup infoKey={`allergen_${allergen}`} className="ml-auto shrink-0" />
                      {allergen === 'milk' && (
                        <InfoPopup infoKey="allergen_milk_fodmap" className="ml-1 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between gap-1 text-sm font-medium text-(--text) min-h-6 mb-2">
                {t('calc_medications_title')}
                <InfoPopup infoKey="medications" className="ml-1.5 shrink-0" />
              </label>
              <MedicationSelector
                formData={formData}
                onChange={(partialData) => setFormData(prev => ({ ...prev, ...partialData }))}
              />
              {detectedMedications.length > 0 && detectedMedications.some(m => m.key !== 'other') && (
                <div className="mt-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">💊 {t('calc_medications_detected')}</h4>
                  <ul className="space-y-1">
                    {detectedMedications.filter(m => m.key !== 'other').map(med => (
                      <li key={med.key} className="text-xs text-(--text)">
                        <strong className="text-(--text-h)">{formatDetectedMedication(med, key => t(key, { defaultValue: undefined }))}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={toggleBioHacking}
                aria-pressed={formData.bioHacking}
                className={`w-full px-3 py-3 rounded-xl text-sm font-semibold text-left border transition-all cursor-pointer flex items-center gap-2 min-h-11 ${
                  formData.bioHacking
                    ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-300'
                    : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
                }`}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                  formData.bioHacking ? 'bg-purple-500 border-purple-500 text-white' : 'border-(--border)'
                }`}>
                  {formData.bioHacking && '✓'}
                </span>
                <span className="truncate min-w-0">{t('calc_bio_hacking')}</span>
                <InfoPopup infoKey="bio_hacking" className="ml-auto shrink-0" />
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 sm:py-3 px-4 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-md text-center text-base min-h-11"
            >
              {t('calc_btn')}
            </button>
          </form>
        </div>

        {/* COLONNA RISULTATI */}
        <div className="min-w-0 p-4 sm:p-6 md:p-7 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">

          {/* Banner condizioni attive */}
          {formData.conditions.length > 0 && (
            <div className="mb-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 shrink-0">
              <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">📋 {t('calc_conditions_active_title')}</h4>
              <ul className="space-y-1.5">
                {formData.conditions.map(condition => (
                  <li key={condition} className="text-sm text-(--text) leading-relaxed">
                    <strong className="text-(--text-h)">{t(`conditions.${condition}`)}:</strong>{' '}
                    {t(`conditions.${condition}_effect`)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Banner FODMAP/Lattosio permanente */}
          <div className="mb-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 shrink-0">
            <h4 className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-2">{t('fodmap_lactose_banner_title')}</h4>
            <p className="text-sm text-(--text) leading-relaxed">{t('fodmap_lactose_banner_text')}</p>
          </div>


          <div>
            <h2 className="text-lg sm:text-xl font-bold text-(--text-h) mb-5 md:mb-7">{t('report_title')}</h2>

            {results ? (
              <div className="space-y-4 sm:space-y-5 animate-fade-in">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center items-stretch">
                  <div className="p-3 sm:p-4 rounded-xl bg-(--code-bg) border border-(--border) min-w-0 flex flex-col justify-center items-center">
                    <span className="block text-[10px] sm:text-xs uppercase text-(--text) max-w-full">{t('report_proteins')}</span>
                    <strong className="text-base sm:text-xl text-(--text-h) wrap-break-word">{results.proteins}g</strong>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-(--code-bg) border border-(--border) min-w-0 flex flex-col justify-center items-center">
                    <span className="block text-[10px] sm:text-xs uppercase text-(--text) max-w-full">{t('report_fats')}</span>
                    <strong className="text-base sm:text-xl text-(--text-h) wrap-break-word">{results.fats}g</strong>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-(--code-bg) border border-(--border) min-w-0 flex flex-col justify-center items-center">
                    <span className="block text-[10px] sm:text-xs uppercase text-(--text) max-w-full">{t('report_carbs_short')}</span>
                    <strong className="text-base sm:text-xl text-(--text-h) wrap-break-word">{results.carbs}g</strong>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-(--code-bg) border border-(--border) space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm sm:text-base font-medium text-(--text)">🎯 {t('report_fiber_target')}</span>
                    <strong className="text-base sm:text-lg text-(--text-h)">{results.fiber} {t('report_g_day')}</strong>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm sm:text-base font-medium text-(--text)">💧 {t('report_water_min')}</span>
                    <strong className="text-base sm:text-lg text-(--text-h)">{results.waterLiters} {t('report_liters')}</strong>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-purple-500/5 border border-(--accent-border)">
                  <h4 className="text-sm font-bold text-(--accent) mb-1">💡 {t('report_microbiota_hint')}</h4>
                  <p className="text-sm text-(--text) leading-relaxed">{t(results.recommendations)}</p>
                </div>

                {results.conditionNotes.length > 0 && (
                  <div className="p-5 rounded-xl bg-(--code-bg) border border-(--border)">
                    <h4 className="text-sm font-bold text-(--text-h) mb-2">⚕️ {t('report_conditions_title')}</h4>
                    <ul className="list-disc pl-5 space-y-1.5">
                      {results.conditionNotes.map(condition => (
                        <li key={condition} className="text-xs md:text-sm text-(--text) leading-relaxed wrap-break-word">
                          <strong className="text-(--text-h)">{t(`conditions.${condition}`)}:</strong>{' '}
                          {t(`conditions.${condition}_note`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.bioHacking && (
                  <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <h4 className="text-sm font-bold text-purple-600 dark:text-purple-300 mb-2">🧬 {t('calc_bio_hacking_active')}</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-(--text)">
                      <li className="wrap-break-word">{t('bio_hacking_effect.protein')}</li>
                      <li className="wrap-break-word">{t('bio_hacking_effect.meal_window')}</li>
                      <li className="wrap-break-word">{t('bio_hacking_effect.micros')}</li>
                    </ul>
                  </div>
                )}

                {detectedMedications.length > 0 && detectedMedications.some(m => m.key !== 'other') && (
                  <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">💊 {t('calc_medications_warnings_title')}</h4>
                    <ul className="list-disc pl-5 space-y-1.5">
                      {detectedMedications.filter(m => m.key !== 'other').map(med => (
                        <li key={med.key} className="text-xs md:text-sm text-(--text) leading-relaxed wrap-break-word">
                          <strong className="text-(--text-h)">{formatDetectedMedication(med, key => t(key, { defaultValue: undefined }))}:</strong>{' '}
                          {t(`medications.${med.key}_warning`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-sm text-(--text) italic mt-3 text-center shrink-0">
                  {t('report_energy_note', { kcal: results.estimatedTotalEnergyKcal })}
                </p>

                {results.targetCaloriesKcal !== results.estimatedTotalEnergyKcal && (
                  <p className="text-sm text-(--accent) font-medium italic text-center shrink-0">
                    {t('report_target_calories_note', { kcal: results.targetCaloriesKcal })}
                  </p>
                )}

                <div className="pt-4 border-t border-(--border) flex flex-col sm:flex-row gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('diet')}
                    className="flex-1 px-4 py-3 rounded-xl bg-(--accent) text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer text-center min-h-11"
                  >
                    {t('calc_go_to_diet')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('workout')}
                    className="flex-1 px-4 py-3 rounded-xl bg-(--code-bg) border border-(--border) text-(--text-h) font-semibold text-sm hover:border-(--accent) hover:text-(--accent) active:scale-[0.99] transition-all cursor-pointer text-center min-h-11"
                  >
                    {t('calc_go_to_workout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="min-h-40 sm:h-45 flex items-center justify-center border border-dashed border-(--border) rounded-xl text-(--text) italic text-center p-4 sm:p-5 text-sm sm:text-base">
                {t('report_placeholder')}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
