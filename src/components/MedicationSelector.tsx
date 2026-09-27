import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserData } from '../utils/nutritionEngine';
import { MEDICATION_KEYWORDS, MEDICATION_KEYWORD_TO_BRAND, MEDICATION_ORDER, type MedicationKey, type StructuredMedication, detectMedicationsWithBrands } from '../utils/medicationWarnings';

interface MedicationSelectorProps {
  formData: UserData;
  onChange: (data: Partial<UserData>) => void;
}

const FREQUENCY_OPTIONS = [
  { value: 'once_daily', label: 'med_freq_once_daily' },
  { value: 'twice_daily', label: 'med_freq_twice_daily' },
  { value: 'three_times_daily', label: 'med_freq_three_times_daily' },
  { value: 'four_times_daily', label: 'med_freq_four_times_daily' },
  { value: 'as_needed', label: 'med_freq_as_needed' },
] as const;

const UNIT_OPTIONS = [
  { value: 'mg', label: 'mg' },
  { value: 'mcg', label: 'mcg' },
  { value: 'UI', label: 'UI' },
] as const;

interface RecognizedMedication {
  key: MedicationKey;
  brand: string;
  matchedKeyword: string;
}

export default function MedicationSelector({ formData, onChange }: MedicationSelectorProps) {
  const { t } = useTranslation();
  const [therapyText, setTherapyText] = useState(formData.medications ?? '');
  const [structuredMeds, setStructuredMeds] = useState<StructuredMedication[]>(formData.structuredMedications ?? []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showRecognitionModal, setShowRecognitionModal] = useState(false);
  const [recognizedMeds, setRecognizedMeds] = useState<RecognizedMedication[]>([]);
  const [currentRecognitionIndex, setCurrentRecognitionIndex] = useState(0);

  // Form state for adding/editing medication
  const [selectedMedKey, setSelectedMedKey] = useState<MedicationKey | null>(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [dose, setDose] = useState('');
  const [unit, setUnit] = useState<'mg' | 'mcg' | 'UI'>('mg');
  const [frequency, setFrequency] = useState<'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'as_needed'>('once_daily');
  const [time, setTime] = useState('08:00');

  // Detect recognized medications from therapy text
  const detectedMeds = useMemo(() => {
    return detectMedicationsWithBrands(therapyText);
  }, [therapyText]);


  const brandsForSelected = useMemo(() => {
    if (!selectedMedKey || selectedMedKey === 'other') return [];
    const keywords = MEDICATION_KEYWORDS[selectedMedKey as Exclude<MedicationKey, 'other'>];
    const brands = new Set<string>();
    keywords.forEach(kw => {
      const brand = MEDICATION_KEYWORD_TO_BRAND.get(kw.toLowerCase());
      if (brand) brands.add(brand);
    });
    return Array.from(brands);
  }, [selectedMedKey]);

  const handleAddMedication = useCallback(() => {
    if (!selectedMedKey || !selectedBrand || !dose) return;

    const newMed: StructuredMedication = {
      key: selectedMedKey,
      brand: selectedBrand,
      dose: Number(dose),
      unit,
      frequency,
      time,
    };

    if (editingIndex !== null) {
      const updated = [...structuredMeds];
      updated[editingIndex] = newMed;
      setStructuredMeds(updated);
      onChange({ structuredMedications: updated });
      setEditingIndex(null);
    } else {
      const updated = [...structuredMeds, newMed];
      setStructuredMeds(updated);
      onChange({ structuredMedications: updated });
    }

    // Reset form
    setSelectedMedKey(null);
    setSelectedBrand('');
    setDose('');
    setUnit('mg');
    setFrequency('once_daily');
    setTime('08:00');
  }, [selectedMedKey, selectedBrand, dose, unit, frequency, time, editingIndex, structuredMeds, onChange]);

  const handleEditMedication = useCallback((index: number, med: StructuredMedication) => {
    setEditingIndex(index);
    setSelectedMedKey(med.key);
    setSelectedBrand(med.brand);
    setDose(String(med.dose));
    setUnit(med.unit);
    setFrequency(med.frequency);
    setTime(med.time);
  }, []);

  const handleRemoveMedication = useCallback((index: number) => {
    const updated = structuredMeds.filter((_, i) => i !== index);
    setStructuredMeds(updated);
    onChange({ structuredMedications: updated });
    if (editingIndex === index) {
      setEditingIndex(null);
      setSelectedMedKey(null);
      setSelectedBrand('');
      setDose('');
      setUnit('mg');
      setFrequency('once_daily');
      setTime('08:00');
    }
  }, [structuredMeds, editingIndex, onChange]);

  const handleRecognitionSave = useCallback(() => {
    const med = recognizedMeds[currentRecognitionIndex];
    if (!med) return;

    // Pre-fill form with recognized medication
    setSelectedMedKey(med.key);
    setSelectedBrand(med.brand);
    setDose(''); // User needs to enter dose
    setUnit('mg');
    setFrequency('once_daily');
    setTime('08:00');
    setEditingIndex(null);
    setShowRecognitionModal(false);
  }, [recognizedMeds, currentRecognitionIndex]);

  const handleRecognitionSaveAndNotify = useCallback(async () => {
    const med = recognizedMeds[currentRecognitionIndex];
    if (!med) return;

    // Request notification permission
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }

    // Pre-fill form with recognized medication
    setSelectedMedKey(med.key);
    setSelectedBrand(med.brand);
    setDose('');
    setUnit('mg');
    setFrequency('once_daily');
    setTime('08:00');
    setEditingIndex(null);
    setShowRecognitionModal(false);
  }, [recognizedMeds, currentRecognitionIndex]);

  const handleRecognitionSkip = useCallback(() => {
    if (currentRecognitionIndex < recognizedMeds.length - 1) {
      setCurrentRecognitionIndex(prev => prev + 1);
    } else {
      setShowRecognitionModal(false);
    }
  }, [currentRecognitionIndex, recognizedMeds.length]);

  const handleTherapyTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTherapyText(value);
    onChange({ medications: value });

    // Check for newly recognized medications to trigger modal
    const detected = detectMedicationsWithBrands(value);
    const newMeds: RecognizedMedication[] = [];
    detected.forEach(d => {
      if (d.key === 'other') return;
      const alreadyConfigured = structuredMeds.some(m => m.key === d.key);
      if (!alreadyConfigured && d.matchedBrands.length > 0) {
        d.matchedBrands.forEach(brand => {
          const matchedKeyword = Object.entries(MEDICATION_KEYWORDS).find(([key, keywords]) =>
            key === d.key && keywords.some(k => MEDICATION_KEYWORD_TO_BRAND.get(k.toLowerCase()) === brand)
          )?.[1][0] || d.key;
          newMeds.push({ key: d.key, brand, matchedKeyword });
        });
      }
    });

    if (newMeds.length > 0 && !showRecognitionModal) {
      setRecognizedMeds(newMeds);
      setCurrentRecognitionIndex(0);
      setShowRecognitionModal(true);
    }
  }, [onChange, structuredMeds, showRecognitionModal]);

  const currentRecognizedMed = recognizedMeds[currentRecognitionIndex];

  return (
    <div className="space-y-4">
      {/* Therapy text input */}
      <div className="shrink-0">
        <textarea
          name="medications"
          value={therapyText}
          onChange={handleTherapyTextChange}
          rows={4}
          placeholder={t('calc_medications_therapy_placeholder')}
          className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base resize-y"
        />
      </div>

      {/* Recognition Modal */}
      {showRecognitionModal && currentRecognizedMed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => handleRecognitionSkip()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="recognition-modal-title"
        >
          <div
            className="relative max-w-md w-full p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-left text-(--text-h)"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="recognition-modal-title" className="text-lg font-bold text-(--text-h) mb-4">
              {t('calc_medication_recognized_title')}
            </h3>
            <div className="space-y-3 mb-4">
              <p className="text-sm text-(--text)">
                {t('calc_medication_recognized_text', { 
                  medication: t(`medications.${currentRecognizedMed.key}`),
                  brand: currentRecognizedMed.brand
                })}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-(--code-bg) rounded-xl border border-(--border)">
                <div>
                  <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_dose')}</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={dose}
                      onChange={(e) => setDose(e.target.value)}
                      placeholder={t('calc_medication_dose_placeholder')}
                      className="flex-1 min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base"
                      min="0"
                      step="0.1"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as 'mg' | 'mcg' | 'UI')}
                      className="w-24 min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base appearance-none"
                    >
                      {UNIT_OPTIONS.map(u => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_frequency')}</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                    className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base appearance-none"
                  >
                    {FREQUENCY_OPTIONS.map(f => (
                      <option key={f.value} value={f.value}>{t(f.label)}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_time')}</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRecognitionSave}
                className="flex-1 px-4 py-3 rounded-xl bg-(--accent) text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer min-h-11"
              >
                {t('calc_medication_save_therapy')}
              </button>
              <button
                type="button"
                onClick={handleRecognitionSaveAndNotify}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer min-h-11"
              >
                {t('calc_medication_save_notify')}
              </button>
              <button
                type="button"
                onClick={handleRecognitionSkip}
                className="px-4 py-3 rounded-xl bg-(--code-bg) border border-(--border) text-(--text) font-semibold text-sm hover:border-(--accent) hover:text-(--accent) active:scale-[0.99] transition-all cursor-pointer min-h-11"
              >
                {t('calc_medication_skip')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual add medication form (when editing or adding manually) */}
      {(editingIndex !== null || (selectedMedKey && !showRecognitionModal)) && (
        <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-(--code-bg) rounded-xl border border-(--border)">
          <div>
            <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_key')}</label>
            <select
              value={selectedMedKey || ''}
              onChange={(e) => {
                const key = e.target.value as MedicationKey;
                setSelectedMedKey(key || null);
                setSelectedBrand('');
              }}
              className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base appearance-none"
            >
              <option value="">{t('calc_medication_select')}</option>
              {MEDICATION_ORDER.filter(k => k !== 'other').map(key => (
                <option key={key} value={key}>{t(`medications.${key}`)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_brand')}</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base appearance-none"
            >
              <option value="">{t('calc_medication_brand_select')}</option>
              {brandsForSelected.map((brand, i) => (
                <option key={i} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_dose')}</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder={t('calc_medication_dose_placeholder')}
                className="flex-1 min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base"
                min="0"
                step="0.1"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'mg' | 'mcg' | 'UI')}
                className="w-24 min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base appearance-none"
              >
                {UNIT_OPTIONS.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_frequency')}</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as typeof frequency)}
              className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base appearance-none"
            >
              {FREQUENCY_OPTIONS.map(f => (
                <option key={f.value} value={f.value}>{t(f.label)}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_time')}</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full min-h-11 p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-base"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleAddMedication}
              className="flex-1 px-4 py-3 rounded-xl bg-(--accent) text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer min-h-11"
            >
              {editingIndex !== null ? t('calc_medication_update') : t('calc_medication_add')}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setSelectedMedKey(null);
                  setSelectedBrand('');
                  setDose('');
                  setUnit('mg');
                  setFrequency('once_daily');
                  setTime('08:00');
                }}
                className="px-4 py-3 rounded-xl bg-(--code-bg) border border-(--border) text-(--text) font-semibold text-sm hover:border-(--accent) hover:text-(--accent) active:scale-[0.99] transition-all cursor-pointer min-h-11"
              >
                {t('calc_medication_cancel')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* List of configured medications */}
      {structuredMeds.length > 0 && (
        <div className="shrink-0">
          <h4 className="text-sm font-bold text-(--text-h) mb-2">{t('calc_medications_configured')}</h4>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {structuredMeds.map((med, index) => (
              <li key={index} className="p-3 rounded-xl bg-(--code-bg) border border-(--border) flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-(--text-h)">{t(`medications.${med.key}`)}</span>
                    <span className="text-xs text-(--text) bg-(--bg) px-2 py-0.5 rounded">{med.brand}</span>
                    <span className="text-xs text-(--text) bg-(--bg) px-2 py-0.5 rounded">{med.dose} {med.unit}</span>
                    <span className="text-xs text-(--text) bg-(--bg) px-2 py-0.5 rounded">{t(`med_freq_${med.frequency}`)}</span>
                    <span className="text-xs text-(--text) bg-(--bg) px-2 py-0.5 rounded">🕐 {med.time}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditMedication(index, med)}
                    className="px-3 py-2 rounded-lg bg-(--accent-bg) border border-(--accent) text-(--accent) text-xs font-medium hover:bg-(--accent) hover:text-white transition-all cursor-pointer min-h-11"
                  >
                    {t('calc_medication_edit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(index)}
                    className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all cursor-pointer min-h-11"
                  >
                    {t('calc_medication_remove')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detected medications info (read-only) */}
      {detectedMeds.length > 0 && detectedMeds.some(m => m.key !== 'other') && (
        <div className="mt-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">{t('calc_medications_detected')}</h4>
          <ul className="space-y-1">
            {detectedMeds.filter(m => m.key !== 'other').map(med => (
              <li key={med.key} className="text-xs text-(--text)">
                <strong className="text-(--text-h)">{t(`medications.${med.key}`)}</strong>
                {med.matchedBrands.length > 0 && (
                  <span className="ml-1 text-(--text)">({med.matchedBrands.join(', ')})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}