import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { FoodItem, Micro } from '../utils/foodsData';
import type { NutritionalResults } from '../utils/nutritionEngine';
import { calculateTotalNutrition, analyzeNutritionStatus } from '../utils/nutritionCalculator';
import { FOODS_DATABASE } from '../utils/foodsData';

const STORAGE_KEY = 'foodmapper_diary_v1';
const WATER_REMINDER_MS = 75 * 60 * 1000; // 75 minuti tra un promemoria e l'altro
const GLASS_ML = 250;

const MEAL_FIELDS = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
const SYMPTOMS = ['bloating', 'abdominal_pain', 'cramps', 'nausea', 'flatulence', 'reflux', 'urgency', 'fatigue'] as const;
const TRANSIT_SCORES = [1, 2, 3, 4, 5, 6, 7] as const;
// I micronutrienti mostrati per primi nel riepilogo, prima del "mostra tutti"
const HEADLINE_MICROS: Micro[] = ['iron', 'calcium', 'vitamin_d'];

type MealField = typeof MEAL_FIELDS[number];
type Symptom = typeof SYMPTOMS[number];
type WellnessTab = 'symptoms' | 'transit' | 'water';

interface FoodEntry {
  foodId: string;
  food: FoodItem;
  grams: number;
}

interface DiaryEntry {
  meals: Record<MealField, string>;
  foodEntries: Record<MealField, FoodEntry[]>; // Nuovo: alimenti specifici con quantità
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
  foodEntries: { breakfast: [], lunch: [], snack: [], dinner: [] },
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

// Colore barra progresso in base allo stato nutrizionale
const nutritionBarColor = (status: 'deficient' | 'adequate' | 'excess'): string => {
  if (status === 'deficient') return 'bg-amber-500';
  if (status === 'excess') return 'bg-red-500';
  return 'bg-emerald-500';
};

interface NutritionBarProps {
  label: string;
  current: number;
  target: number;
  percentage: number;
  status: 'deficient' | 'adequate' | 'excess';
  unit: string;
  isMicro?: boolean; // Per formattare numeri piccoli
  compact?: boolean; // Font/spazi ridotti per griglie dense
}

function NutritionBar({ label, current, target, percentage, status, unit, isMicro = false, compact = false }: NutritionBarProps) {
  const displayPercentage = Math.min(percentage, 150); // Limita visualmente a 150%
  const formatValue = (val: number) => isMicro ? val.toFixed(1) : Math.round(val);

  return (
    <div>
      <div className={`flex justify-between items-center ${compact ? 'mb-0.5' : 'mb-1'}`}>
        <span className={`font-medium text-(--text) ${compact ? 'text-[11px]' : 'text-xs'}`}>{label}</span>
        <span className={`font-bold text-(--text-h) ${compact ? 'text-[11px]' : 'text-xs'}`}>
          {formatValue(current)}{unit}/{formatValue(target)}{unit} ({percentage}%)
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-(--code-bg) border border-(--border) overflow-hidden">
        <div
          className={`h-full ${nutritionBarColor(status)} rounded-full transition-all`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
    </div>
  );
}

interface DiaryProps {
  waterTargetLiters: number | null;
  nutritionalResults?: NutritionalResults | null;
  onGoToCalculator?: () => void;
}

export default function Diary({ waterTargetLiters, nutritionalResults, onGoToCalculator }: DiaryProps) {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entry, setEntry] = useState<DiaryEntry>(() => {
    const store = loadStore();
    return { ...emptyEntry(), ...(store[toISODate(new Date())] ?? {}) };
  });
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<'off' | 'on' | 'denied' | 'unsupported'>('off');
  const reminderTimer = useRef<number | null>(null);
  const [expandedFoodDetails, setExpandedFoodDetails] = useState<Set<string>>(new Set());
  const [confirmResetMeal, setConfirmResetMeal] = useState<MealField | null>(null);
  const [confirmResetDay, setConfirmResetDay] = useState(false);
  const [activeMealSection, setActiveMealSection] = useState<MealField | null>(null);
  const [wellnessTab, setWellnessTab] = useState<WellnessTab>('water');
  const [showAllMicros, setShowAllMicros] = useState(false);
  const [showNutritionDetail, setShowNutritionDetail] = useState(false);

  const dateKey = toISODate(selectedDate);
  const isToday = dateKey === toISODate(new Date());

  // Carica la voce del giorno selezionato quando cambia dateKey
  const [loadedKey, setLoadedKey] = useState(dateKey);
  useEffect(() => {
    if (loadedKey !== dateKey) {
      setLoadedKey(dateKey);
      const store = loadStore();
      setEntry({ ...emptyEntry(), ...(store[dateKey] ?? {}) });
    }
  }, [dateKey, loadedKey]);

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

  const toggleFoodDetails = (uniqueId: string) => {
    setExpandedFoodDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(uniqueId)) {
        newSet.delete(uniqueId);
      } else {
        newSet.add(uniqueId);
      }
      return newSet;
    });
  };

  const resetMeal = (field: MealField) => {
    update({
      meals: { ...entry.meals, [field]: '' },
      foodEntries: { ...entry.foodEntries, [field]: [] }
    });
    setConfirmResetMeal(null);
  };

  const resetDay = () => {
    setEntry(emptyEntry());
    setConfirmResetDay(false);
  };

  // Calcolo nutrizionale giornaliero
  const allFoodEntries = Object.values(entry.foodEntries).flat();
  const dailyNutrition = calculateTotalNutrition(allFoodEntries);
  const nutritionAnalysis = nutritionalResults
    ? analyzeNutritionStatus(dailyNutrition, nutritionalResults)
    : null;

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

  // Riepilogo ultimi 7 giorni - ordine cronologico ascendente (dal più vecchio al più recente)
  const recentDays = (() => {
    const store = loadStore();
    const days: { date: string; entry: DiaryEntry }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toISODate(d);
      if (store[key]) days.push({ date: key, entry: store[key] });
    }
    // Ordine cronologico ascendente: dal giorno più vecchio al più recente
    days.sort((a, b) => a.date.localeCompare(b.date));
    return days;
  })();

  const kcalPercent = nutritionAnalysis ? Math.min(100, nutritionAnalysis.macros.kcal.percentage) : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('diary_title')}
      </h2>

      {/* Navigazione data */}
      <div className="flex items-center justify-between mb-3 p-3 rounded-2xl bg-(--bg) border border-(--border)">
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

      {/* Striscia di riepilogo rapido: colpo d'occhio sulla giornata senza scorrere */}
      <section className="p-4 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-(--text-h)">⚡ {t('diary_quick_summary')}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Calorie */}
          <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border) text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="block text-[10px] text-(--text)">{t('diary_quick_kcal')}</span>
              <div className="flex items-baseline gap-1">
                <strong className="text-(--text-h) text-[18px]">{Math.round(dailyNutrition.totalKcal)}</strong>
                {kcalPercent !== null && (
                  <span className="text-[10px] text-(--text)">/{Math.round(nutritionAnalysis!.macros.kcal.target)} {t('diary_quick_of')}</span>
                )}
              </div>
              {kcalPercent !== null && (
                <div className="w-full h-1 rounded-full bg-(--code-bg) overflow-hidden">
                  <div
                    className={`h-full ${nutritionBarColor(
                      kcalPercent < 80 ? 'deficient' : kcalPercent > 110 ? 'excess' : 'adequate'
                    )} rounded-full transition-all`}
                    style={{ width: `${Math.min(kcalPercent, 150)}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Acqua */}
          <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border) text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="block text-[10px] text-(--text)">{t('diary_quick_water')}</span>
              <div className="flex items-baseline gap-1">
                <strong className="text-(--text-h) text-[18px]">{entry.waterGlasses}</strong>
                {waterTargetGlasses !== null && (
                  <span className="text-[10px] text-(--text)">/{waterTargetGlasses} {t('diary_quick_of')}</span>
                )}
              </div>
              {waterTargetGlasses !== null && (
                <div className="w-full h-1 rounded-full bg-(--code-bg) overflow-hidden">
                  <div
                    className={`h-full bg-sky-500 rounded-full transition-all`}
                    style={{ width: `${Math.min(waterPercent ?? 0, 150)}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sintomi */}
          <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border) text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="block text-[10px] text-(--text)">{t('diary_quick_symptoms')}</span>
              <strong className="text-(--text-h) text-[18px]">{entry.symptoms.length}</strong>
            </div>
          </div>

          {/* Transito */}
          <div className="p-3 rounded-xl bg-(--code-bg) border border-(--border) text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="block text-[10px] text-(--text)">{t('diary_quick_transit')}</span>
              <span className={`text-[18px] font-bold px-2 py-0.5 rounded-lg ${entry.transitScore !== null ? transitColor(entry.transitScore) : 'bg-(--code-bg) text-(--text)'}`}>
                {entry.transitScore ?? '—'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {/* Pasti */}
        <section className="p-4 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-(--text-h)">🍽️ {t('diary_meals_title')}</h3>
            <button
              onClick={() => setConfirmResetDay(true)}
              className="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer"
            >
              {t('diary_reset_day')}
            </button>
          </div>

          {/* Tabs per i pasti */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveMealSection(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                activeMealSection === null
                  ? 'bg-(--accent) text-white border-(--accent)'
                  : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
              }`}
            >
              {t('diary_show_all')}
            </button>
            {MEAL_FIELDS.map(field => (
              <button
                key={field}
                onClick={() => setActiveMealSection(activeMealSection === field ? null : field)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                  activeMealSection === field
                    ? 'bg-(--accent) text-white border-(--accent)'
                    : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
                }`}
              >
                {t(`diary_meal_${field}`)}
              </button>
            ))}
          </div>

          {/* Quando è selezionato un solo pasto, mostra solo quello: niente card vuote sotto */}
          <div className={activeMealSection === null ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}>
            {MEAL_FIELDS.filter(field => activeMealSection === null || activeMealSection === field).map(field => {
              const mealKcal = entry.foodEntries[field].reduce(
                (sum, fe) => sum + fe.food.nutrition.kcal * (fe.grams / 100), 0
              );
              return (
                <div key={field}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-(--text)">
                      {t(`diary_meal_${field}`)}
                      {mealKcal > 0 && <span className="ml-1.5 font-normal normal-case text-(--text)">· {Math.round(mealKcal)} kcal</span>}
                    </label>
                    <button
                      onClick={() => setConfirmResetMeal(field)}
                      className="text-[10px] text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      {t('diary_reset_meal')}
                    </button>
                  </div>
                  <textarea
                    value={entry.meals[field]}
                    onChange={e => update({ meals: { ...entry.meals, [field]: e.target.value } })}
                    rows={2}
                    placeholder={t('diary_meal_placeholder')}
                    className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-sm text-(--text-h) focus:outline-none focus:border-(--accent) resize-y"
                  />

                  {/* Food selector per questo pasto */}
                  <div className="mt-2 pt-2 border-t border-(--border)">
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const food = FOODS_DATABASE.find(f => f.id === e.target.value);
                          if (food) {
                            const newEntry: FoodEntry = {
                              foodId: food.id,
                              food,
                              grams: 100
                            };
                            update({
                              foodEntries: {
                                ...entry.foodEntries,
                                [field]: [...entry.foodEntries[field], newEntry]
                              }
                            });
                          }
                        }
                      }}
                      className="w-full p-2 rounded-lg border border-(--border) bg-(--code-bg) text-xs text-(--text-h) focus:outline-none focus:border-(--accent) mb-2"
                    >
                      <option value="">+ Aggiungi alimento</option>
                      {FOODS_DATABASE.map(food => (
                        <option key={food.id} value={food.id}>{food.name}</option>
                      ))}
                    </select>

                    {/* Lista alimenti aggiunti: una riga compatta, dettagli dietro "+" */}
                    {entry.foodEntries[field].map((foodEntry, idx) => {
                      const multiplier = foodEntry.grams / 100;
                      const kcal = Math.round(foodEntry.food.nutrition.kcal * multiplier);
                      const protein = (foodEntry.food.nutrition.protein * multiplier).toFixed(1);
                      const carbs = (foodEntry.food.nutrition.carbs * multiplier).toFixed(1);
                      const fats = (foodEntry.food.nutrition.fats * multiplier).toFixed(1);
                      const fiber = (foodEntry.food.nutrition.fiber * multiplier).toFixed(1);
                      const uniqueId = `${field}-${idx}`;
                      const isDetailOpen = expandedFoodDetails.has(uniqueId);

                      // Calcolo microelementi
                      const microValues: Record<string, string> = {};
                      if (foodEntry.food.nutrition.micronutrients) {
                        const micros = foodEntry.food.nutrition.micronutrients;
                        if (micros.potassium) microValues['potassium'] = `${(micros.potassium * multiplier).toFixed(0)}mg`;
                        if (micros.magnesium) microValues['magnesium'] = `${(micros.magnesium * multiplier).toFixed(0)}mg`;
                        if (micros.calcium) microValues['calcium'] = `${(micros.calcium * multiplier).toFixed(0)}mg`;
                        if (micros.iron) microValues['iron'] = `${(micros.iron * multiplier).toFixed(1)}mg`;
                        if (micros.zinc) microValues['zinc'] = `${(micros.zinc * multiplier).toFixed(1)}mg`;
                        if (micros.folate) microValues['folate'] = `${(micros.folate * multiplier).toFixed(0)}µg`;
                        if (micros.vitamin_a) microValues['vitamin_a'] = `${(micros.vitamin_a * multiplier).toFixed(0)}µg`;
                        if (micros.vitamin_c) microValues['vitamin_c'] = `${(micros.vitamin_c * multiplier).toFixed(0)}mg`;
                        if (micros.vitamin_d) microValues['vitamin_d'] = `${(micros.vitamin_d * multiplier).toFixed(1)}µg`;
                        if (micros.vitamin_e) microValues['vitamin_e'] = `${(micros.vitamin_e * multiplier).toFixed(1)}mg`;
                        if (micros.b12) microValues['b12'] = `${(micros.b12 * multiplier).toFixed(1)}µg`;
                        if (micros.omega3) microValues['omega3'] = `${(micros.omega3 * multiplier).toFixed(0)}mg`;
                        if (micros.selenium) microValues['selenium'] = `${(micros.selenium * multiplier).toFixed(0)}µg`;
                        if (micros.iodine) microValues['iodine'] = `${(micros.iodine * multiplier).toFixed(0)}µg`;
                      }

                      return (
                        <div key={idx} className="mb-1.5 rounded-lg bg-(--code-bg) border border-(--border)">
                          {/* Riga compatta sempre visibile */}
                          <div className="flex items-center gap-2 p-2">
                            <button
                              onClick={() => toggleFoodDetails(uniqueId)}
                              className="text-xs text-(--accent) font-bold cursor-pointer w-4 shrink-0"
                            >
                              {isDetailOpen ? '−' : '+'}
                            </button>
                            <span className="text-xs font-semibold text-(--text-h) flex-1 truncate">{foodEntry.food.name}</span>
                            <input
                              type="number"
                              value={foodEntry.grams}
                              onChange={(e) => {
                                const newGrams = Number(e.target.value) || 0;
                                const updatedEntries = [...entry.foodEntries[field]];
                                updatedEntries[idx] = { ...foodEntry, grams: newGrams };
                                update({
                                  foodEntries: {
                                    ...entry.foodEntries,
                                    [field]: updatedEntries
                                  }
                                });
                              }}
                              className="w-14 p-1 rounded border border-(--border) bg-(--bg) text-xs text-(--text-h) text-center shrink-0"
                              min="1"
                            />
                            <span className="text-[10px] text-(--text) shrink-0">g</span>
                            <span className="text-xs font-bold text-(--text-h) shrink-0 w-12 text-right">{kcal} kcal</span>
                            <button
                              onClick={() => {
                                const updatedEntries = entry.foodEntries[field].filter((_, i) => i !== idx);
                                update({
                                  foodEntries: {
                                    ...entry.foodEntries,
                                    [field]: updatedEntries
                                  }
                                });
                              }}
                              className="text-xs text-red-500 hover:text-red-600 font-bold cursor-pointer shrink-0"
                            >
                              ×
                            </button>
                          </div>

                          {/* Dettagli: macro complete + micronutrienti, solo se aperto */}
                          {isDetailOpen && (
                            <div className="px-2 pb-2">
                              <div className="grid grid-cols-3 gap-1 text-xs mb-1.5">
                                <div className="text-center p-1 rounded bg-(--bg)">
                                  <span className="block text-[10px] text-(--text)">{t('macro_p')}</span>
                                  <span className="font-bold text-(--text-h)">{protein}g</span>
                                </div>
                                <div className="text-center p-1 rounded bg-(--bg)">
                                  <span className="block text-[10px] text-(--text)">{t('macro_c')}</span>
                                  <span className="font-bold text-(--text-h)">{carbs}g</span>
                                </div>
                                <div className="text-center p-1 rounded bg-(--bg)">
                                  <span className="block text-[10px] text-(--text)">{t('macro_f')}</span>
                                  <span className="font-bold text-(--text-h)">{fats}g</span>
                                </div>
                                <div className="text-center p-1 rounded bg-(--bg)">
                                  <span className="block text-[10px] text-(--text)">{t('macro_fib')}</span>
                                  <span className="font-bold text-(--text-h)">{fiber}g</span>
                                </div>
                                <div className="text-center p-1 rounded bg-(--bg)">
                                  <span className="block text-[10px] text-(--text)">{t('micros.sodium')}</span>
                                  <span className="font-bold text-(--text-h)">{((foodEntry.food.nutrition.micronutrients?.sodium || 0) * multiplier).toFixed(0)}mg</span>
                                </div>
                              </div>
                              {Object.keys(microValues).length > 0 && (
                                <div className="grid grid-cols-2 gap-1 text-[10px]">
                                  {Object.entries(microValues).map(([key, value]) => (
                                    <div key={key} className="flex justify-between p-1 rounded bg-(--bg)">
                                      <span className="text-(--text)">{t(`micros.${key}`)}</span>
                                      <span className="font-bold text-(--text-h)">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {confirmResetMeal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-(--bg) border border-(--border) rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
              <h3 className="text-base font-bold text-(--text-h) mb-2">{t('diary_reset_meal_confirm_title')}</h3>
              <p className="text-sm text-(--text) mb-4">{t('diary_reset_meal_confirm_message', { meal: t(`diary_meal_${confirmResetMeal}`) })}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmResetMeal(null)}
                  className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg border border-(--border) text-(--text) hover:bg-(--code-bg) cursor-pointer"
                >
                  {t('diary_cancel')}
                </button>
                <button
                  onClick={() => resetMeal(confirmResetMeal)}
                  className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                  {t('diary_confirm')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conferma reset giornata */}
        {confirmResetDay && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-(--bg) border border-(--border) rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
              <h3 className="text-base font-bold text-(--text-h) mb-2">{t('diary_reset_day_confirm_title')}</h3>
              <p className="text-sm text-(--text) mb-4">{t('diary_reset_day_confirm_message')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmResetDay(false)}
                  className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg border border-(--border) text-(--text) hover:bg-(--code-bg) cursor-pointer"
                >
                  {t('diary_cancel')}
                </button>
                <button
                  onClick={resetDay}
                  className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                  {t('diary_confirm')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Riepilogo Nutrizionale */}
        {allFoodEntries.length > 0 && !nutritionalResults && (
          <section className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-base font-bold text-amber-600 mb-2">{t('diary_needs_calc_title')}</h3>
                <p className="text-sm text-amber-700">{t('diary_needs_calc_message')}</p>
                <button
                  onClick={onGoToCalculator}
                  className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer"
                >
                  {t('diary_needs_calc_btn')}
                </button>
              </div>
            </div>
          </section>
        )}

        {nutritionAnalysis && (
          <section className="p-4 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
            <button
              onClick={() => setShowNutritionDetail(v => !v)}
              className="w-full flex items-center justify-between cursor-pointer"
            >
              <h3 className="text-base font-bold text-(--text-h)">📊 {t('diary_nutrition_title')}</h3>
              <span className="text-xs text-(--accent) font-semibold">
                {showNutritionDetail ? t('diary_hide_details') : t('diary_show_details')}
              </span>
            </button>

            {/* Vista chiusa: solo le kcal, già visibili nella striscia in alto */}
            {showNutritionDetail && (
              <>
                {/* Macros in griglia compatta 2 colonne */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4">
                  <NutritionBar
                    label={t('diary_protein')}
                    current={nutritionAnalysis.macros.protein.current}
                    target={nutritionAnalysis.macros.protein.target}
                    percentage={nutritionAnalysis.macros.protein.percentage}
                    status={nutritionAnalysis.macros.protein.status}
                    unit="g"
                    isMicro={true}
                    compact
                  />
                  <NutritionBar
                    label={t('diary_carbs')}
                    current={nutritionAnalysis.macros.carbs.current}
                    target={nutritionAnalysis.macros.carbs.target}
                    percentage={nutritionAnalysis.macros.carbs.percentage}
                    status={nutritionAnalysis.macros.carbs.status}
                    unit="g"
                    isMicro={true}
                    compact
                  />
                  <NutritionBar
                    label={t('diary_fats')}
                    current={nutritionAnalysis.macros.fats.current}
                    target={nutritionAnalysis.macros.fats.target}
                    percentage={nutritionAnalysis.macros.fats.percentage}
                    status={nutritionAnalysis.macros.fats.status}
                    unit="g"
                    isMicro={true}
                    compact
                  />
                  <NutritionBar
                    label={t('diary_fiber')}
                    current={nutritionAnalysis.macros.fiber.current}
                    target={nutritionAnalysis.macros.fiber.target}
                    percentage={nutritionAnalysis.macros.fiber.percentage}
                    status={nutritionAnalysis.macros.fiber.status}
                    unit="g"
                    isMicro={true}
                    compact
                  />
                </div>

                {/* Microelementi: solo 3 principali, il resto dietro "mostra tutti" */}
                <div className="mt-4 pt-3 border-t border-(--border)">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-(--text)">🧬 {t('diary_micros_title')}</h4>
                    <button
                      onClick={() => setShowAllMicros(v => !v)}
                      className="text-[11px] text-(--accent) font-semibold cursor-pointer"
                    >
                      {showAllMicros ? t('diary_show_fewer_micros') : t('diary_show_all_micros')}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {(showAllMicros
                      ? (Object.keys(nutritionAnalysis.micros) as Micro[])
                      : HEADLINE_MICROS
                    ).map(micro => (
                      <NutritionBar
                        key={micro}
                        label={t(`micros.${micro}`)}
                        current={nutritionAnalysis.micros[micro].current}
                        target={nutritionAnalysis.micros[micro].target}
                        percentage={nutritionAnalysis.micros[micro].percentage}
                        status={nutritionAnalysis.micros[micro].status}
                        unit={micro === 'vitamin_d' || micro === 'b12' || micro === 'folate' || micro === 'vitamin_a' || micro === 'selenium' || micro === 'iodine' ? 'µg' : 'mg'}
                        isMicro={true}
                        compact
                      />
                    ))}
                  </div>
                </div>

                {/* Avvisi */}
                {nutritionAnalysis.warnings.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <h4 className="text-xs font-bold text-amber-600 mb-1.5">⚠️ {t('diary_warnings_title')}</h4>
                    <ul className="space-y-1">
                      {nutritionAnalysis.warnings.map(warning => (
                        <li key={warning} className="text-xs text-amber-700">
                          {t(`warnings.${warning}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Benessere: sintomi, transito e acqua in un'unica card a schede */}
        <section className="p-4 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => setWellnessTab('symptoms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                wellnessTab === 'symptoms'
                  ? 'bg-(--accent) text-white border-(--accent)'
                  : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
              }`}
            >
              🩺 {t('diary_symptoms_title')}{entry.symptoms.length > 0 && ` (${entry.symptoms.length})`}
            </button>
            <button
              onClick={() => setWellnessTab('transit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                wellnessTab === 'transit'
                  ? 'bg-(--accent) text-white border-(--accent)'
                  : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
              }`}
            >
              🚽 {t('diary_transit_title')}
            </button>
            <button
              onClick={() => setWellnessTab('water')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                wellnessTab === 'water'
                  ? 'bg-(--accent) text-white border-(--accent)'
                  : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
              }`}
            >
              💧 {t('diary_water_title')}
            </button>
          </div>

          {wellnessTab === 'symptoms' && (
            <div>
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
            </div>
          )}

          {wellnessTab === 'transit' && (
            <div>
              <p className="text-xs text-(--text) mb-3">{t('diary_transit_hint')}</p>
              <div className="flex flex-wrap gap-2 mb-3">
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
            </div>
          )}

          {wellnessTab === 'water' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
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
                  <span className="text-xs text-(--text)">
                    {t('diary_water_glasses', { count: entry.waterGlasses, ml: GLASS_ML })}
                  </span>
                </div>
                <button
                  onClick={toggleReminder}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
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
            </div>
          )}
        </section>

        {/* Note */}
        <section className="p-4 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
          <h3 className="text-base font-bold text-(--text-h) mb-2">📝 {t('diary_notes_title')}</h3>
          <textarea
            value={entry.notes}
            onChange={e => update({ notes: e.target.value })}
            rows={2}
            placeholder={t('diary_notes_placeholder')}
            className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-sm text-(--text-h) focus:outline-none focus:border-(--accent) resize-y"
          />
        </section>

        {/* Riepilogo ultimi giorni */}
        {recentDays.length > 0 && (
          <section className="p-5 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-(--text-h)">🗓️ {t('diary_recent_title')}</h3>
              <span className="text-xs text-(--text)">{recentDays.length} {t('diary_recent_count')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDays.map(({ date, entry }) => {
                const nutrition = calculateTotalNutrition(Object.values(entry.foodEntries).flat());
                const isToday = date === toISODate(new Date());

                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(new Date(`${date}T12:00:00`))}
                    className={`text-left rounded-xl border border-(--border) bg-(--code-bg) p-4 hover:border-(--accent) transition-all cursor-pointer ${isToday ? 'border-(--accent) ring-2 ring-(--accent-bg)' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="block text-xs font-bold text-(--text-h)">{new Date(`${date}T12:00:00`).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })}</span>
                        {isToday && <span className="text-[10px] font-semibold text-(--accent) uppercase tracking-wider">{t('diary_today')}</span>}
                      </div>
                      <span className={`text-lg font-bold px-2 py-1 rounded-lg ${entry.transitScore !== null ? transitColor(entry.transitScore) : 'bg-(--code-bg) text-(--text)'}`}>{entry.transitScore ?? '—'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 rounded-lg bg-(--bg) border border-(--border)">
                        <span className="block text-[10px] text-(--text)">{t('diary_symptoms_count')}</span>
                        <span className="font-bold text-(--text-h)">{entry.symptoms.length}</span>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-(--bg) border border-(--border)">
                        <span className="block text-[10px] text-(--text)">{t('diary_water_count')}</span>
                        <span className="font-bold text-(--text-h)">{entry.waterGlasses}</span>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-(--bg) border border-(--border)">
                        <span className="block text-[10px] text-(--text)">🔥</span>
                        <span className="font-bold text-(--text-h)">{Math.round(nutrition.totalKcal)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-(--text) space-y-1">
                      <p>{t('macro_p')}: <strong className="text-(--text-h)">{Math.round(nutrition.totalProtein)}g</strong> · {t('macro_c')}: <strong className="text-(--text-h)">{Math.round(nutrition.totalCarbs)}g</strong> · {t('macro_f')}: <strong className="text-(--text-h)">{Math.round(nutrition.totalFats)}g</strong></p>
                      <p className="text-[10px]">{t('micros.iron')}: {nutrition.micronutrients.iron.toFixed(1)}mg · {t('micros.calcium')}: {Math.round(nutrition.micronutrients.calcium)}mg · {t('micros.vitamin_d')}: {nutrition.micronutrients.vitamin_d.toFixed(1)}µg</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
