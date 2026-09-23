import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserData } from '../utils/nutritionEngine';
import ExerciseFigure from './ExerciseFigure';
import type { ExerciseAnim } from './ExerciseFigure';

const STORAGE_KEY = 'foodmapper_workout_v1';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

interface DayPlan {
  day: DayKey;
  exerciseId: string;
  activity: string;
  duration: string;
  note?: string;
}

interface ExerciseInfo {
  anim: ExerciseAnim;
  description: Record<'it' | 'en', string>;
  steps: Record<'it' | 'en', string[]>;
}

interface WorkoutPlanProps {
  userData: UserData | null;
  onGoToCalculator: () => void;
}

const EXERCISES: Record<string, ExerciseInfo> = {
  walk: {
    anim: 'walk',
    description: {
      it: 'Camminata a passo sostenuto: attiva il riflesso gastrocolico e la motilità senza impatto. Passo che permette di parlare ma non cantare.',
      en: 'Brisk walking: activates the gastrocolic reflex and gut motility with no impact. A pace where you can talk but not sing.'
    },
    steps: {
      it: ['5 min di riscaldamento a passo lento', '20-40 min a passo veloce', '5 min di defaticamento'],
      en: ['5 min slow warm-up', '20-40 min fast pace', '5 min cool-down']
    }
  },
  strength: {
    anim: 'squat',
    description: {
      it: 'Circuito a corpo libero: squat, plank e push-up. Aumenta il tono addominale senza eccessiva pressione viscerale.',
      en: 'Bodyweight circuit: squats, plank and push-ups. Builds core tone without excessive visceral pressure.'
    },
    steps: {
      it: ['3 serie × 12 squat (pausa 60")', '3 serie × 20-30" plank', '3 serie × 8 push-up (ginocchia se serve)'],
      en: ['3 sets × 12 squats (60" rest)', '3 sets × 20-30" plank', '3 sets × 8 push-ups (knees if needed)']
    }
  },
  yoga: {
    anim: 'twist',
    description: {
      it: 'Mobilità e torsioni dolci (cat-cow, apanasana, torsione supina): massaggiano il colon e scaricano tensione viscerale.',
      en: 'Mobility and gentle twists (cat-cow, apanasana, supine twist): massage the colon and release visceral tension.'
    },
    steps: {
      it: ['Cat-cow × 8 respiri', 'Ginocchia al petto 30"', 'Torsione supina 30" per lato'],
      en: ['Cat-cow × 8 breaths', 'Knees-to-chest 30"', 'Supine twist 30" each side']
    }
  },
  swim: {
    anim: 'swim',
    description: {
      it: 'Nuoto o camminata in acqua: lavoro aerobico orizzontale, ideale nei giorni di sensibilità addominale.',
      en: 'Swimming or water walking: horizontal aerobic work, ideal on abdominal-sensitivity days.'
    },
    steps: {
      it: ['20-30 min stile libero o acquagym', 'Ritmo costante, respirazione regolare'],
      en: ['20-30 min freestyle or aqua-fitness', 'Steady rhythm, regular breathing']
    }
  },
  free: {
    anim: 'free',
    description: {
      it: 'Attività libera a piacere: bici, trekking, ballo. L\'obiettivo è il movimento prolungato e piacevole.',
      en: 'Free activity of choice: bike, hiking, dance. The goal is prolonged, enjoyable movement.'
    },
    steps: {
      it: ['45-60 min a intensità moderata', 'Scegli ciò che ti diverte di più'],
      en: ['45-60 min moderate intensity', 'Pick whatever you enjoy most']
    }
  },
  rest: {
    anim: 'breathe',
    description: {
      it: 'Respirazione diaframmatica: mano sulla pancia, inspira dal naso gonfiando l\'addome, espira lentamente. Riduce la sensibilità viscerale.',
      en: 'Diaphragmatic breathing: hand on belly, inhale through the nose expanding the abdomen, exhale slowly. Lowers visceral sensitivity.'
    },
    steps: {
      it: ['Inspira 4" gonfiando l\'addome', 'Trattieni 2"', 'Espira 6" × 10 cicli'],
      en: ['Inhale 4" expanding the abdomen', 'Hold 2"', 'Exhale 6" × 10 cycles']
    }
  }
};

const DEFAULT_WEEK: DayPlan[] = [
  { day: 'mon', exerciseId: 'walk', activity: 'Camminata veloce', duration: '30\'' },
  { day: 'tue', exerciseId: 'strength', activity: 'Forza a corpo libero', duration: '25\'', note: 'Evita crunch intensi nei giorni di riacutizzazione' },
  { day: 'wed', exerciseId: 'yoga', activity: 'Yoga / mobilità', duration: '20\'', note: 'Le torsioni favoriscono il transito' },
  { day: 'thu', exerciseId: 'swim', activity: 'Nuoto o camminata', duration: '30\'' },
  { day: 'fri', exerciseId: 'strength', activity: 'Forza a corpo libero', duration: '25\'' },
  { day: 'sat', exerciseId: 'free', activity: 'Attività libera (bici, trekking, ballo)', duration: '45-60\'' },
  { day: 'sun', exerciseId: 'rest', activity: 'Riposo + respirazione diaframmatica', duration: '10\'' }
];

const DEFAULT_WEEK_EN: DayPlan[] = [
  { day: 'mon', exerciseId: 'walk', activity: 'Brisk walk', duration: '30\'' },
  { day: 'tue', exerciseId: 'strength', activity: 'Bodyweight strength', duration: '25\'', note: 'Skip intense crunches on flare-up days' },
  { day: 'wed', exerciseId: 'yoga', activity: 'Yoga / mobility', duration: '20\'', note: 'Twists support transit' },
  { day: 'thu', exerciseId: 'swim', activity: 'Swimming or walk', duration: '30\'' },
  { day: 'fri', exerciseId: 'strength', activity: 'Bodyweight strength', duration: '25\'' },
  { day: 'sat', exerciseId: 'free', activity: 'Free activity (bike, hike, dance)', duration: '45-60\'' },
  { day: 'sun', exerciseId: 'rest', activity: 'Rest + diaphragmatic breathing', duration: '10\'' }
];

type Overrides = Record<string, { activity: string; duration: string }>;

const loadOverrides = (): Overrides => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Overrides : {};
  } catch {
    return {};
  }
};

export default function WorkoutPlan({ userData, onGoToCalculator }: WorkoutPlanProps) {
  const { t, i18n } = useTranslation();
  const currentLang: 'it' | 'en' = i18n.language.startsWith('it') ? 'it' : 'en';

  const [overrides, setOverrides] = useState<Overrides>(loadOverrides);
  const [expandedDay, setExpandedDay] = useState<DayKey | null>(null);
  const [editingDay, setEditingDay] = useState<DayKey | null>(null);
  const [draft, setDraft] = useState({ activity: '', duration: '' });

  const defaultWeek = currentLang === 'it' ? DEFAULT_WEEK : DEFAULT_WEEK_EN;
  const week = defaultWeek.map(d => ({
    ...d,
    ...(overrides[d.day] ?? {})
  }));
  const isCustomized = Object.keys(overrides).length > 0;

  const startEdit = (day: DayKey) => {
    const current = week.find(d => d.day === day)!;
    setDraft({ activity: current.activity, duration: current.duration });
    setEditingDay(day);
  };

  const saveEdit = () => {
    if (!editingDay) return;
    const next = { ...overrides, [editingDay]: draft };
    setOverrides(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEditingDay(null);
  };

  const resetPlan = () => {
    setOverrides({});
    localStorage.removeItem(STORAGE_KEY);
    setEditingDay(null);
  };

  const activityLevel = userData?.activityLevel;
  const ibsType = userData?.ibsType ?? 'unknown';
  const levelLabel = activityLevel ? t(`calc_act_${{ sedentary: 'sed', lightly_active: 'light', moderately_active: 'mod', very_active: 'very' }[activityLevel]}`) : null;

  const ibsNote: Record<string, Record<'it' | 'en', string>> = {
    'IBS-D': {
      it: 'Nei giorni di scariche frequenti preferisci yoga e camminata: evita corsa e HIIT che stimolano il riflesso gastrocolico. Allenati almeno 2 ore dopo i pasti.',
      en: 'On frequent-loose-stool days prefer yoga and walking: avoid running and HIIT which trigger the gastrocolic reflex. Train at least 2h after meals.'
    },
    'IBS-C': {
      it: 'L\'attività aerobica quotidiana è la tua alleata: accelera il transito. Punta a muoverti ogni giorno anche solo 20 minuti, meglio al mattino.',
      en: 'Daily aerobic activity is your ally: it speeds up transit. Move every day, even just 20 minutes, ideally in the morning.'
    },
    'IBS-M': {
      it: 'Alterna intensità in base al giorno: aerobica nei giorni stabili, yoga e respirazione nei giorni sintomatici.',
      en: 'Alternate intensity by the day: aerobic work on stable days, yoga and breathing on symptomatic ones.'
    },
    unknown: {
      it: 'Parti gradualmente: camminata quotidiana + respirazione diaframmatica. Valuta la risposta e registra nel diario come ti senti dopo l\'attività.',
      en: 'Start gradually: daily walking plus diaphragmatic breathing. Log in the diary how you feel after each session.'
    }
  };

  const tips: Record<'it' | 'en', string[]> = {
    it: [
      'Mai allenarti subito dopo i pasti: attendi 90-120 minuti.',
      'Idratazione costante: collega il tuo target acqua dal calcolo.',
      'Sospendi la forza intensa durante le riacutizzazioni dolorose.',
      'La respirazione diaframmatica (5-10\') riduce la sensibilità viscerale.'
    ],
    en: [
      'Never train right after meals: wait 90-120 minutes.',
      'Steady hydration: link your water target from the calculator.',
      'Pause intense strength work during painful flare-ups.',
      'Diaphragmatic breathing (5-10\') lowers visceral sensitivity.'
    ]
  };

  const intro = currentLang === 'it'
    ? 'Piano settimanale a basso-medio impatto: l\'attività regolare migliora la motilità intestinale e riduce lo stress viscerale, evitando i picchi che acutizzano l\'IBS. Tocca un giorno per la guida all\'esercizio.'
    : 'Weekly low-to-moderate impact plan: regular activity improves gut motility and lowers visceral stress while avoiding the intensity spikes that flare up IBS. Tap a day for the exercise guide.';

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-8 text-left">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-2xl font-bold text-(--text-h) text-center md:text-left">
          {t('workout_title')}
        </h2>
        {isCustomized && (
          <button
            onClick={resetPlan}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-(--border) bg-(--code-bg) text-(--text) hover:text-(--text-h) cursor-pointer"
          >
            ↺ {t('workout_reset')}
          </button>
        )}
      </div>

      {levelLabel ? (
        <div className="mb-8 p-5 rounded-2xl bg-(--accent-bg) border border-(--accent-border) animate-fade-in flex items-center justify-between flex-wrap gap-3">
          <span className="text-base text-(--text)">{intro}</span>
          <span className="text-sm font-bold uppercase tracking-wider text-(--accent) bg-(--bg) border border-(--accent-border) px-3 py-1.5 rounded-full">
            {t('workout_level_label')}: {levelLabel}
          </span>
        </div>
      ) : (
        <>
          <button
            onClick={onGoToCalculator}
            className="w-full mb-6 p-5 rounded-2xl border border-dashed border-(--accent-border) bg-purple-500/5 text-base text-(--text) hover:border-(--accent) transition-all cursor-pointer text-left"
          >
            ⚙️ {t('diet_link_cta')}
          </button>
          <p className="text-base text-(--text) mb-8">{intro}</p>
        </>
      )}

      {/* Settimana */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {week.map(day => {
          const exercise = EXERCISES[day.exerciseId];
          const isExpanded = expandedDay === day.day;
          const isEditing = editingDay === day.day;
          const isRest = day.exerciseId === 'rest';
          return (
            <div
              key={day.day}
              className={`p-5 rounded-2xl border transition-all min-h-43 ${
                isRest
                  ? 'bg-(--code-bg) border-(--border) border-dashed'
                  : 'bg-(--bg) border-(--border) hover:border-(--accent-border) shadow-sm'
              } ${isExpanded ? 'sm:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="block text-sm font-bold uppercase tracking-wider text-(--accent)">
                  {t(`days.${day.day}`)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                    title={t('workout_show_exercise')}
                    className="w-9 h-9 rounded-lg border border-(--border) bg-(--code-bg) text-sm cursor-pointer"
                  >
                    {isExpanded ? '✕' : 'ℹ️'}
                  </button>
                  <button
                    onClick={() => startEdit(day.day)}
                    title={t('workout_edit_day')}
                    className="w-9 h-9 rounded-lg border border-(--border) bg-(--code-bg) text-sm cursor-pointer"
                  >
                    ✏️
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <input
                    value={draft.activity}
                    onChange={e => setDraft(d => ({ ...d, activity: e.target.value }))}
                    placeholder={t('workout_activity_ph')}
                    className="w-full p-3 rounded-lg border border-(--border) bg-(--code-bg) text-sm text-(--text-h) focus:outline-none focus:border-(--accent)"
                  />
                  <input
                    value={draft.duration}
                    onChange={e => setDraft(d => ({ ...d, duration: e.target.value }))}
                    placeholder={t('workout_duration_ph')}
                    className="w-full p-3 rounded-lg border border-(--border) bg-(--code-bg) text-sm text-(--text-h) focus:outline-none focus:border-(--accent)"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-4 py-2 rounded-lg text-sm font-bold bg-(--accent) text-white cursor-pointer">✓</button>
                    <button onClick={() => setEditingDay(null)} className="px-4 py-2 rounded-lg text-sm border border-(--border) text-(--text) cursor-pointer">✕</button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-bold text-(--text-h) text-base mb-2 mt-1 leading-snug">{day.activity}</h4>
                  <span className="inline-block text-sm font-semibold text-(--text) bg-(--code-bg) px-3 py-1 rounded-full border border-(--border) mb-2">
                    ⏱ {day.duration}
                  </span>
                  {day.note && <p className="text-sm text-(--text) leading-relaxed">{day.note}</p>}
                </>
              )}

              {/* Dettaglio esercizio espandibile con animazione */}
              {isExpanded && exercise && !isEditing && (
                <div className="mt-4 pt-4 border-t border-(--border) flex gap-4 animate-fade-in">
                  <ExerciseFigure anim={exercise.anim} className="w-24 h-24 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-(--text) leading-relaxed mb-3">{exercise.description[currentLang]}</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {exercise.steps[currentLang].map((step, i) => (
                        <li key={i} className="text-sm text-(--text)">{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nota IBS */}
      <div className="p-5 rounded-2xl bg-purple-500/5 border border-(--accent-border) mb-8">
        <h4 className="text-base font-bold text-(--accent) mb-1">
          {ibsType !== 'unknown' ? `🧬 IBS-${ibsType.slice(-1)}` : '🧬 IBS'}
        </h4>
        <p className="text-sm text-(--text) leading-relaxed">{ibsNote[ibsType]?.[currentLang] ?? ibsNote.unknown[currentLang]}</p>
      </div>

      {/* Regole pratiche */}
      <div className="p-5 rounded-2xl bg-(--code-bg) border border-(--border)">
        <h4 className="text-base font-bold text-(--text-h) mb-3">📌 {t('workout_tips_title')}</h4>
        <ul className="list-disc pl-5 space-y-2">
          {tips[currentLang].map((tip, i) => (
            <li key={i} className="text-sm md:text-base text-(--text) leading-relaxed">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
