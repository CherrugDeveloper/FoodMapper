import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'foodmapper_measurements_v1';

type MeasurementField = 'weight' | 'waist' | 'hip' | 'bodyFat';

interface MeasurementEntry {
  date: string; // ISO date
  values: Partial<Record<MeasurementField, number>>;
}

const FIELDS: { key: MeasurementField; icon: string; unit: string }[] = [
  { key: 'weight', icon: '⚖️', unit: 'kg' },
  { key: 'waist', icon: '📏', unit: 'cm' },
  { key: 'hip', icon: '📐', unit: 'cm' },
  { key: 'bodyFat', icon: '🧬', unit: '%' }
];

const DEVICES: { id: string; icon: string; nameKey: string; descKey: string }[] = [
  { id: 'scale', icon: '⚖️', nameKey: 'device_scale', descKey: 'device_scale_desc' },
  { id: 'watch', icon: '⌚', nameKey: 'device_watch', descKey: 'device_watch_desc' },
  { id: 'fitness_app', icon: '📱', nameKey: 'device_fitness', descKey: 'device_fitness_desc' },
  { id: 'tape', icon: '📏', nameKey: 'device_tape', descKey: 'device_tape_desc' }
];

const loadMeasurements = (): MeasurementEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as MeasurementEntry[] : [];
  } catch {
    return [];
  }
};

const toISODate = (d: Date) => d.toISOString().slice(0, 10);

export default function Devices() {
  const { t, i18n } = useTranslation();
  const [entries, setEntries] = useState<MeasurementEntry[]>(loadMeasurements);
  const [draft, setDraft] = useState<Record<MeasurementField, string>>({ weight: '', waist: '', hip: '', bodyFat: '' });

  const saveEntry = () => {
    const values: Partial<Record<MeasurementField, number>> = {};
    for (const f of FIELDS) {
      const n = Number(draft[f.key]);
      if (draft[f.key] !== '' && !Number.isNaN(n) && n > 0) values[f.key] = n;
    }
    if (Object.keys(values).length === 0) return;
    const today = toISODate(new Date());
    const next = [...entries.filter(e => e.date !== today), { date: today, values }]
      .sort((a, b) => b.date.localeCompare(a.date));
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setDraft({ weight: '', waist: '', hip: '', bodyFat: '' });
  };

  const last = entries[0];
  const prev = entries[1];

  const trend = (field: MeasurementField): string => {
    if (!last?.values[field] || !prev?.values[field]) return '';
    const diff = last.values[field]! - prev.values[field]!;
    if (Math.abs(diff) < 0.05) return '→';
    return diff > 0 ? `↑ +${diff.toFixed(1)}` : `↓ ${diff.toFixed(1)}`;
  };

  const formatDate = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' });

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('devices_title')}
      </h2>

      {/* Connessioni dispositivi — in arrivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {DEVICES.map(device => (
          <div key={device.id} className="p-4 rounded-2xl bg-(--bg) border border-(--border) shadow-sm flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">{device.icon}</span>
            <div className="flex-1">
              <h4 className="font-bold text-(--text-h) text-sm">{t(device.nameKey)}</h4>
              <p className="text-xs text-(--text) leading-relaxed mb-2">{t(device.descKey)}</p>
              <button
                disabled
                title={t('device_coming_soon')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-dashed border-(--accent-border) text-(--accent) opacity-70 cursor-not-allowed"
              >
                🔗 {t('device_coming_soon')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-(--text) italic mb-6">{t('devices_note')}</p>

      {/* Logger manuale */}
      <section className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm mb-6">
        <h3 className="text-base font-bold text-(--text-h) mb-1">📋 {t('devices_manual_title')}</h3>
        <p className="text-xs text-(--text) mb-4">{t('devices_manual_hint')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-(--text) mb-1">
                {f.icon} {t(`measure_${f.key}`)} ({f.unit})
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={draft[f.key]}
                onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-sm text-(--text-h) focus:outline-none focus:border-(--accent)"
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveEntry}
          className="px-4 py-2 rounded-xl font-semibold text-white bg-(--accent) hover:opacity-90 transition-all cursor-pointer text-sm"
        >
          {t('devices_save')}
        </button>
      </section>

      {/* Storico misurazioni */}
      {entries.length > 0 && (
        <section className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <h3 className="text-base font-bold text-(--text-h) mb-3">🗓️ {t('devices_history')}</h3>
          <div className="space-y-2">
            {entries.slice(0, 10).map((entry, idx) => (
              <div key={entry.date} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-3 rounded-xl bg-(--code-bg) border border-(--border)">
                <span className="text-xs font-bold text-(--text-h) w-16">{formatDate(entry.date)}</span>
                {FIELDS.map(f => entry.values[f.key] !== undefined && (
                  <span key={f.key} className="text-xs text-(--text)">
                    {f.icon} {entry.values[f.key]}{f.unit}
                    {idx === 0 && prev && <span className="ml-1 text-(--accent) font-semibold">{trend(f.key)}</span>}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
