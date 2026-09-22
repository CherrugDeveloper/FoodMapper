import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'foodmapper_diary_v1';
const WATER_REMINDER_MS = 75 * 60 * 1000; // 75 minuti tra un promemoria e l'altro
const GLASS_ML = 250;

const MEAL_FIELDS = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
const SYMPTOMS = ['bloating', 'abdominal_pain', 'cramps', 'nausea', 'flatulence', 'reflux', 'urgency', 'fatigue'] as const;
const TRANSIT_SCORES = [1, 2, 3, 4, 5, 6, 7] as const;

type MealField = typeof MEAL_FIELDS[number];
type Symptom = typeof SYMPTOMS[number];

interface DiaryEntry {
  meals: Record<MealField, string>;
  symptoms: Symptom[];
  symptomSeverity: number; // 1-10
  transitScore: number | null; // 1-7: 1 transito molto rallentato, 4 ottimale, 7 molto accelerato
  bowelMovements: number;
  waterGlasses: number;
  notes: string;
}

type DiaryStore = Record<string, DiaryEntry>;

const emptyEntry = (): DiaryEntry => ({
  meals: { breakfast: '', lunch: '', snack: '', dinner: '' },
  symptoms: [],
  symptomSeverity: 5,
  transitScore: null,
  bowelMovements: 0,
  waterGlasses: 0,
  notes: ''
});

const toISODate = (d: Date) => d.toISOString().slice(0, 10);

const loadStore = (): DiaryStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as DiaryStore : {};
  } catch {
    return {};
  }
};

// Scala transito 1-7 → colori: rosso (rallentato) → verde (ottimale=4) → arancio (accelerato)
const transitColor = (score: number): string => {
  if (score === 4) return 'bg-emerald-500/15 border-emerald-500 text-emerald-600';
  if (score <= 1 || score >= 7) return 'bg-red-500/10 border-red-500 text-red-500';
  return 'bg-amber-500/10 border-amber-500 text-amber-600';
};

interface DiaryProps {
  waterTargetLiters: number | null;
}

export default function Diary({ waterTargetLiters }: DiaryProps) {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entry, setEntry] = useState<DiaryEntry>(() => {
    const store = loadStore();
    return { ...emptyEntry(), ...(store[toISODate(new Date())] ?? {}) };
  });
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<'off' | 'on' | 'denied' | 'unsupported'>('off');
  const reminderTimer = useRef<number | null>(null);

  const dateKey = toISODate(selectedDate);
  const isToday = dateKey === toISODate(new Date());

  // Carica la voce del giorno selezionato (adjust-state-during-render, evita setState in effect)
  const [loadedKey, setLoadedKey] = useState(dateKey);
  if (loadedKey !== dateKey) {
    setLoadedKey(dateKey);
    const store = loadStore();
    setEntry({ ...emptyEntry(), ...(store[dateKey] ?? {}) });
  }

  // Persistenza automatica ad ogni modifica (salta le voci completamente vuote)
  useEffect(() => {
    const store = loadStore();
    const isEmpty = JSON.stringify(entry) === JSON.stringify(emptyEntry());
    if (isEmpty && !(dateKey in store)) return;
    if (isEmpty) {
      delete store[dateKey];
    } else {
      store[dateKey] = entry;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [entry, dateKey]);

  const update = (patch: Partial<DiaryEntry>) => setEntry(prev => ({ ...prev, ...patch }));

  const shiftDay = (delta: number) => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + delta);
      return d;
    });
  };

  const formattedDate = selectedDate.toLocaleDateString(i18n.language, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const toggleSymptom = (symptom: Symptom) => {
    update({
      symptoms: entry.symptoms.includes(symptom)
        ? entry.symptoms.filter(s => s !== symptom)
        : [...entry.symptoms, symptom]
    });
  };

  const waterTargetGlasses = waterTargetLiters ? Math.round((waterTargetLiters * 1000) / GLASS_ML) : null;
  const waterPercent = waterTargetGlasses ? Math.min(100, Math.round((entry.waterGlasses / waterTargetGlasses) * 100)) : null;

  const toggleReminder = async () => {
    if (reminderEnabled) {
      setReminderEnabled(false);
      setReminderStatus('off');
      if (reminderTimer.current) window.clearInterval(reminderTimer.current);
      return;
    }
    if (!('Notification' in window)) {
      setReminderStatus('unsupported');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      setReminderStatus('denied');
      return;
    }
    setReminderEnabled(true);
    setReminderStatus('on');
    reminderTimer.current = window.setInterval(() => {
      new Notification(t('water_reminder_title'), { body: t('water_reminder_body') });
    }, WATER_REMINDER_MS);
  };

  useEffect(() => () => {
    if (reminderTimer.current) window.clearInterval(reminderTimer.current);
  }, []);

  // Riepilogo ultimi 7 giorni
  const recentDays = (() => {
    const store = loadStore();
    const days: { date: string; entry: DiaryEntry }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toISODate(d);
      if (store[key]) days.push({ date: key, entry: store[key] });
    }
    return days;
  })();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('diary_title')}
      </h2>

      {/* Navigazione data */}
      <div className="flex items-center justify-between mb-6 p-3 rounded-2xl bg-(--bg) border border-(--border)">
        <button onClick={() => shiftDay(-1)} className="px-3 py-1.5 rounded-xl text-sm font-bold text-(--accent) hover:bg-(--accent-bg) cursor-pointer">‹</button>
        <div className="text-center">
          <span className="block text-sm font-bold text-(--text-h) capitalize">{formattedDate}</span>
          {!isToday && (
            <button onClick={() => setSelectedDate(new Date())} className="text-xs text-(--accent) hover:underline cursor-pointer">
              {t('diary_back_today')}
            </button>
          )}
        </div>
        <button onClick={() => shiftDay(1)} disabled={isToday} className="px-3 py-1.5 rounded-xl text-sm font-bold text-(--accent) hover:bg-(--accent-bg) cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">›</button>
      </div>

      <div className="space-y-6">
        {/* Pasti */}
        <section className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <h3 className="text-base font-bold text-(--text-h) mb-4">🍽️ {t('diary_meals_title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MEAL_FIELDS.map(field => (
              <div key={field}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-(--text) mb-1">
                  {t(`diary_meal_${field}`)}
                </label>
                <textarea
                  value={entry.meals[field]}
                  onChange={e => update({ meals: { ...entry.meals, [field]: e.target.value } })}
                  rows={2}
                  placeholder={t('diary_meal_placeholder')}
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-sm text-(--text-h) focus:outline-none focus:border-(--accent) resize-y"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Sintomi */}
        <section className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <h3 className="text-base font-bold text-(--text-h) mb-4">🩺 {t('diary_symptoms_title')}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {SYMPTOMS.map(symptom => {
              const isSelected = entry.symptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500 text-red-500'
                      : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
                  }`}
                >
                  {t(`symptoms.${symptom}`)}
                </button>
              );
            })}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-(--text) mb-2">
              {t('diary_severity')}: <strong className="text-(--text-h)">{entry.symptomSeverity}/10</strong>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={entry.symptomSeverity}
              onChange={e => update({ symptomSeverity: Number(e.target.value) })}
              className="w-full accent-(--accent) cursor-pointer"
            />
          </div>
        </section>

        {/* Transito intestinale */}
        <section className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <h3 className="text-base font-bold text-(--text-h) mb-4">🚽 {t('diary_transit_title')}</h3>
          <p className="text-xs text-(--text) mb-3">{t('diary_transit_hint')}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {TRANSIT_SCORES.map(score => (
              <button
                key={score}
                onClick={() => update({ transitScore: entry.transitScore === score ? null : score })}
                title={t(`transit.${score}`)}
                className={`w-10 h-10 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                  entry.transitScore === score
                    ? transitColor(score)
                    : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
                }`}
              >
                {score}
              </button>
            ))}
          </div>
          {entry.transitScore !== null && (
            <p className={`text-sm font-semibold mb-4 ${transitColor(entry.transitScore).split(' ').pop()}`}>
              {t(`transit.${entry.transitScore}`)}
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-(--text)">{t('diary_bowel_count')}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => update({ bowelMovements: Math.max(0, entry.bowelMovements - 1) })}
                className="w-8 h-8 rounded-lg border border-(--border) bg-(--code-bg) text-(--text-h) font-bold cursor-pointer"
              >−</button>
              <strong className="text-(--text-h) w-6 text-center">{entry.bowelMovements}</strong>
              <button
                onClick={() => update({ bowelMovements: entry.bowelMovements + 1 })}
                className="w-8 h-8 rounded-lg border border-(--border) bg-(--code-bg) text-(--text-h) font-bold cursor-pointer"
              >+</button>
            </div>
          </div>
        </section>

        {/* Acqua */}
        <section className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-(--text-h)">💧 {t('diary_water_title')}</h3>
            <button
              onClick={toggleReminder}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                reminderEnabled
                  ? 'bg-sky-500/10 border-sky-500 text-sky-600'
                  : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
              }`}
            >
              {reminderEnabled ? `🔔 ${t('water_reminder_on')}` : `🔕 ${t('water_reminder_off')}`}
            </button>
          </div>
          {reminderStatus === 'denied' && <p className="text-xs text-red-400 mb-3">{t('water_reminder_denied')}</p>}
          {reminderStatus === 'unsupported' && <p className="text-xs text-red-400 mb-3">{t('water_reminder_unsupported')}</p>}
          {reminderEnabled && <p className="text-xs text-(--text) mb-3">{t('water_reminder_hint')}</p>}

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => update({ waterGlasses: Math.max(0, entry.waterGlasses - 1) })}
                className="w-8 h-8 rounded-lg border border-(--border) bg-(--code-bg) text-(--text-h) font-bold cursor-pointer"
              >−</button>
              <strong className="text-(--text-h) text-lg">{entry.waterGlasses}</strong>
              <button
                onClick={() => update({ waterGlasses: entry.waterGlasses + 1 })}
                className="w-8 h-8 rounded-lg border border-(--border) bg-(--code-bg) text-(--text-h) font-bold cursor-pointer"
              >+</button>
            </div>
            <span className="text-sm text-(--text)">
              {t('diary_water_glasses', { count: entry.waterGlasses, ml: GLASS_ML })}
            </span>
          </div>

          {waterTargetGlasses !== null && (
            <div>
              <div className="flex justify-between text-xs text-(--text) mb-1">
                <span>{t('diary_water_target', { target: waterTargetLiters })}</span>
                <span>{waterPercent}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-(--code-bg) border border-(--border) overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Note */}
        <section className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <h3 className="text-base font-bold text-(--text-h) mb-3">📝 {t('diary_notes_title')}</h3>
          <textarea
            value={entry.notes}
            onChange={e => update({ notes: e.target.value })}
            rows={3}
            placeholder={t('diary_notes_placeholder')}
            className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-sm text-(--text-h) focus:outline-none focus:border-(--accent) resize-y"
          />
        </section>

        {/* Riepilogo ultimi giorni */}
        {recentDays.length > 0 && (
          <section className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
            <h3 className="text-base font-bold text-(--text-h) mb-3">🗓️ {t('diary_recent_title')}</h3>
            <div className="flex flex-wrap gap-2">
              {recentDays.map(({ date, entry: dayEntry }) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(new Date(`${date}T12:00:00`))}
                  className="px-3 py-2 rounded-xl border border-(--border) bg-(--code-bg) text-left hover:border-(--accent) transition-all cursor-pointer"
                >
                  <span className="block text-xs font-bold text-(--text-h)">
                    {new Date(`${date}T12:00:00`).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="block text-[11px] text-(--text)">
                    {dayEntry.transitScore !== null ? `🚽 ${dayEntry.transitScore}` : '—'}
                    {dayEntry.symptoms.length > 0 && ` · 🩺 ${dayEntry.symptoms.length}`}
                    {dayEntry.waterGlasses > 0 && ` · 💧 ${dayEntry.waterGlasses}`}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
