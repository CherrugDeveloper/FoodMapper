import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserData } from '../utils/nutritionEngine';
import { MEDICATION_KEYWORDS, MEDICATION_BRANDS, MEDICATION_ORDER, type MedicationKey, type StructuredMedication } from '../utils/medicationWarnings';
import InfoPopup from './InfoPopup';

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

export default function MedicationSelector({ formData, onChange }: MedicationSelectorProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedKey, setSelectedMedKey] = useState<MedicationKey | null>(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [dose, setDose] = useState('');
  const [unit, setUnit] = useState<'mg' | 'mcg' | 'UI'>('mg');
  const [frequency, setFrequency] = useState<'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'as_needed'>('once_daily');
  const [time, setTime] = useState('08:00');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const structuredMeds = formData.structuredMedications ?? [];

  const filteredMeds = useMemo(() => {
    if (!searchQuery.trim()) return MEDICATION_ORDER.filter(k => k !== 'other');
    const query = searchQuery.toLowerCase();
    return MEDICATION_ORDER.filter(k => {
      if (k === 'other') return false;
      const keywords = MEDICATION_KEYWORDS[k];
      return keywords.some(kw => kw.toLowerCase().includes(query)) || k.toLowerCase().includes(query);
    });
  }, [searchQuery]);

  const handleAddMedication = () => {
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
      onChange({ structuredMedications: updated });
      setEditingIndex(null);
    } else {
      onChange({ structuredMedications: [...structuredMeds, newMed] });
    }

    // Reset form
    setSelectedMedKey(null);
    setSelectedBrand('');
    setDose('');
    setUnit('mg');
    setFrequency('once_daily');
    setTime('08:00');
    setSearchQuery('');
  };

  const handleEditMedication = (index: number, med: StructuredMedication) => {
    setEditingIndex(index);
    setSelectedMedKey(med.key);
    setSelectedBrand(med.brand);
    setDose(String(med.dose));
    setUnit(med.unit);
    setFrequency(med.frequency);
    setTime(med.time);
    // Find and set search query to show the medication
    const keywords = MEDICATION_KEYWORDS[med.key as MedicationKey];
    setSearchQuery(keywords[0] || '');
  };

  const handleRemoveMedication = (index: number) => {
    const updated = structuredMeds.filter((_, i) => i !== index);
    onChange({ structuredMedications: updated });
    if (editingIndex === index) {
      setEditingIndex(null);
      setSelectedMedKey(null);
      setSelectedBrand('');
      setDose('');
    }
  };

  const brandsForSelected = useMemo(() => {
    if (!selectedMedKey || selectedMedKey === 'other') return [];
    return MEDICATION_BRANDS[selectedMedKey as Exclude<MedicationKey, 'other'>] || [];
  }, [selectedMedKey]);

  return (
    <div className="space-y-4">
      {/* Search and Add Medication */}
      <div>
        <label className="block text-sm font-medium text-(--text) mb-2">
          {t('calc_medications_search')}
          <InfoPopup infoKey="medications_search" className="ml-1.5 align-middle" />
        </label>
        <div className="space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('calc_medications_search_placeholder')}
            className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-sm"
          />

          {selectedMedKey && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-(--code-bg) rounded-xl border border-(--border)">
              <div>
                <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_key')}</label>
                <select
                  value={selectedMedKey}
                  onChange={(e) => {
                    const key = e.target.value as MedicationKey;
                    setSelectedMedKey(key);
                    setSelectedBrand('');
                  }}
                  className="w-full p-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-sm"
                >
                  {filteredMeds.map(key => (
                    <option key={key} value={key}>{t(`medications.${key}`)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-(--text) mb-1">{t('calc_medication_brand')}</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full p-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-sm"
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
                    className="flex-1 p-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-sm"
                    min="0"
                    step="0.1"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as 'mg' | 'mcg' | 'UI')}
                    className="w-20 p-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-sm"
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
                  className="w-full p-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-sm"
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
                  className="w-full p-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-sm"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="flex-1 px-4 py-2 rounded-xl bg-(--accent) text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
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
                    className="px-4 py-2 rounded-xl bg-(--code-bg) border border-(--border) text-(--text) font-semibold text-sm hover:border-(--accent) hover:text-(--accent) active:scale-[0.99] transition-all cursor-pointer"
                  >
                    {t('calc_medication_cancel')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* List of added medications */}
      {structuredMeds.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-(--text-h) mb-2">{t('calc_medications_added')}</h4>
          <ul className="space-y-2">
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
                    className="px-3 py-1.5 rounded-lg bg-(--accent-bg) border border-(--accent) text-(--accent) text-xs font-medium hover:bg-(--accent) hover:text-white transition-all cursor-pointer"
                  >
                    {t('calc_medication_edit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(index)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    {t('calc_medication_remove')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Legacy free-text field for backward compatibility */}
      <div>
        <label className="block text-sm font-medium text-(--text) mb-2">
          {t('calc_medications_title_legacy')}
          <InfoPopup infoKey="medications" className="ml-1.5 align-middle" />
        </label>
        <textarea
          name="medications"
          value={formData.medications ?? ''}
          onChange={(e) => onChange({ medications: e.target.value })}
          rows={3}
          placeholder={t('calc_medications_placeholder')}
          className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) text-sm resize-y"
        />
      </div>
    </div>
  );
}