import { useTranslation } from 'react-i18next';
import type { UserData } from '../utils/nutritionEngine';

interface DayPlan {
  day: string;
  activity: string;
  duration: string;
  note?: string;
  rest?: boolean;
}

interface WorkoutContent {
  levelLabel: string;
  intro: string;
  week: DayPlan[];
  ibsNote: Record<string, string>;
  tips: string[];
}

interface WorkoutPlanProps {
  userData: UserData | null;
  onGoToCalculator: () => void;
}

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export default function WorkoutPlan({ userData, onGoToCalculator }: WorkoutPlanProps) {
  const { t, i18n } = useTranslation();
  const currentLang: 'it' | 'en' = i18n.language.startsWith('it') ? 'it' : 'en';

  const content: Record<'it' | 'en', WorkoutContent> = {
    it: {
      levelLabel: 'Livello rilevato',
      intro: 'Piano settimanale a basso-medio impatto: l\'attività regolare migliora la motilità intestinale e riduce lo stress viscerale, evitando i picchi che acutizzano l\'IBS.',
      week: [
        { day: 'mon', activity: 'Camminata veloce', duration: '30\'' },
        { day: 'tue', activity: 'Forza a corpo libero (squat, plank, push-up)', duration: '25\'', note: 'Evita crunch intensi nei giorni di riacutizzazione' },
        { day: 'wed', activity: 'Yoga / mobilità (torsioni dolci, cat-cow)', duration: '20\'', note: 'Le torsioni favoriscono il transito' },
        { day: 'thu', activity: 'Nuoto o camminata', duration: '30\'' },
        { day: 'fri', activity: 'Forza a corpo libero', duration: '25\'' },
        { day: 'sat', activity: 'Attività libera lunga (bici, trekking, ballo)', duration: '45-60\'' },
        { day: 'sun', activity: 'Riposo + respirazione diaframmatica', duration: '10\'', rest: true }
      ],
      ibsNote: {
        'IBS-D': 'Nei giorni di scariche frequenti preferisci yoga e camminata: evita corsa e HIIT che stimolano il riflesso gastrocolico. Allenati almeno 2 ore dopo i pasti.',
        'IBS-C': 'L\'attività aerobica quotidiana è la tua alleata: accelera il transito. Punta a muoverti ogni giorno anche solo 20 minuti, meglio al mattino.',
        'IBS-M': 'Alterna intensità in base al giorno: aerobica nei giorni stabili, yoga e respirazione nei giorni sintomatici.',
        'unknown': 'Parti gradualmente: camminata quotidiana + respirazione diaframmatica. Valuta la risposta e registra nel diario come ti senti dopo l\'attività.'
      },
      tips: [
        'Mai allenarti subito dopo i pasti: attendi 90-120 minuti.',
        'Idratazione costante: collega il tuo target acqua dal calcolo.',
        'Sospendi la forza intensa durante le riacutizzazioni dolorose.',
        'La respirazione diaframmatica (5-10\') riduce la sensibilità viscerale.'
      ]
    },
    en: {
      levelLabel: 'Detected level',
      intro: 'Weekly low-to-moderate impact plan: regular activity improves gut motility and lowers visceral stress while avoiding the intensity spikes that flare up IBS.',
      week: [
        { day: 'mon', activity: 'Brisk walk', duration: '30\'' },
        { day: 'tue', activity: 'Bodyweight strength (squat, plank, push-ups)', duration: '25\'', note: 'Skip intense crunches on flare-up days' },
        { day: 'wed', activity: 'Yoga / mobility (gentle twists, cat-cow)', duration: '20\'', note: 'Twists support transit' },
        { day: 'thu', activity: 'Swimming or walk', duration: '30\'' },
        { day: 'fri', activity: 'Bodyweight strength', duration: '25\'' },
        { day: 'sat', activity: 'Long free activity (bike, hike, dance)', duration: '45-60\'' },
        { day: 'sun', activity: 'Rest + diaphragmatic breathing', duration: '10\'', rest: true }
      ],
      ibsNote: {
        'IBS-D': 'On frequent-loose-stool days prefer yoga and walking: avoid running and HIIT which trigger the gastrocolic reflex. Train at least 2h after meals.',
        'IBS-C': 'Daily aerobic activity is your ally: it speeds up transit. Move every day, even just 20 minutes, ideally in the morning.',
        'IBS-M': 'Alternate intensity by the day: aerobic work on stable days, yoga and breathing on symptomatic ones.',
        'unknown': 'Start gradually: daily walking plus diaphragmatic breathing. Log in the diary how you feel after each session.'
      },
      tips: [
        'Never train right after meals: wait 90-120 minutes.',
        'Steady hydration: link your water target from the calculator.',
        'Pause intense strength work during painful flare-ups.',
        'Diaphragmatic breathing (5-10\') lowers visceral sensitivity.'
      ]
    }
  };

  const c = content[currentLang];
  const activityLevel = userData?.activityLevel;
  const ibsType = userData?.ibsType ?? 'unknown';
  const levelLabel = activityLevel ? t(`calc_act_${{ sedentary: 'sed', lightly_active: 'light', moderately_active: 'mod', very_active: 'very' }[activityLevel]}`) : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('workout_title')}
      </h2>

      {levelLabel ? (
        <div className="mb-6 p-4 rounded-2xl bg-(--accent-bg) border border-(--accent-border) animate-fade-in flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm text-(--text)">{c.intro}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-(--accent) bg-(--bg) border border-(--accent-border) px-2.5 py-1 rounded-full">
            {c.levelLabel}: {levelLabel}
          </span>
        </div>
      ) : (
        <button
          onClick={onGoToCalculator}
          className="w-full mb-6 p-4 rounded-2xl border border-dashed border-(--accent-border) bg-purple-500/5 text-sm text-(--text) hover:border-(--accent) transition-all cursor-pointer text-left"
        >
          ⚙️ {t('diet_link_cta')}
        </button>
      )}

      {!levelLabel && <p className="text-sm text-(--text) mb-6">{c.intro}</p>}

      {/* Settimana */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {c.week.map((day, i) => (
          <div
            key={day.day}
            className={`p-4 rounded-2xl border transition-all ${
              day.rest
                ? 'bg-(--code-bg) border-(--border) border-dashed'
                : 'bg-(--bg) border-(--border) hover:border-(--accent-border) shadow-sm'
            }`}
          >
            <span className="block text-xs font-bold uppercase tracking-wider text-(--accent) mb-1">
              {t(`days.${DAY_KEYS[i]}`)}
            </span>
            <h4 className="font-bold text-(--text-h) text-sm mb-1">{day.activity}</h4>
            <span className="inline-block text-xs font-semibold text-(--text) bg-(--code-bg) px-2 py-0.5 rounded-full border border-(--border) mb-1">
              ⏱ {day.duration}
            </span>
            {day.note && <p className="text-[11px] text-(--text) leading-snug mt-1">{day.note}</p>}
          </div>
        ))}
      </div>

      {/* Nota IBS */}
      <div className="p-4 rounded-2xl bg-purple-500/5 border border-(--accent-border) mb-6">
        <h4 className="text-sm font-bold text-(--accent) mb-1">
          {ibsType !== 'unknown' ? `🧬 IBS-${ibsType.slice(-1)}` : '🧬 IBS'}
        </h4>
        <p className="text-sm text-(--text) leading-relaxed">{c.ibsNote[ibsType] ?? c.ibsNote.unknown}</p>
      </div>

      {/* Regole pratiche */}
      <div className="p-4 rounded-2xl bg-(--code-bg) border border-(--border)">
        <h4 className="text-sm font-bold text-(--text-h) mb-2">📌 {t('workout_tips_title')}</h4>
        <ul className="list-disc pl-5 space-y-1.5">
          {c.tips.map((tip, i) => (
            <li key={i} className="text-xs md:text-sm text-(--text) leading-relaxed">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
