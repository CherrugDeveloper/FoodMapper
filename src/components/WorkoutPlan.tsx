import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
      en: 'Diaphragmatic breathing: hand on belly, inhale through nose inflating abdomen, exhale slowly. Reduces visceral sensitivity.'
    },
    steps: {
      it: ['5 min di respirazione lenta', '5-10 min di meditazione guidata'],
      en: ['5 min slow breathing', '5-10 min guided meditation']
    }
  }
};

const DAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export default function WorkoutPlan() {
  const { t } = useTranslation();
  
  const [workoutPlan, setWorkoutPlan] = useState<Record<DayKey, DayPlan>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Record<DayKey, DayPlan>) : {
        mon: { day: 'mon', exerciseId: 'walk', activity: 'Camminata', duration: '30 min' },
        tue: { day: 'tue', exerciseId: 'strength', activity: 'Forza', duration: '25 min' },
        wed: { day: 'wed', exerciseId: 'yoga', activity: 'Yoga', duration: '30 min' },
        thu: { day: 'thu', exerciseId: 'walk', activity: 'Camminata', duration: '35 min' },
        fri: { day: 'fri', exerciseId: 'strength', activity: 'Forza', duration: '30 min' },
        sat: { day: 'sat', exerciseId: 'swim', activity: 'Nuoto', duration: '40 min' },
        sun: { day: 'sun', exerciseId: 'rest', activity: 'Riposo', duration: '20 min' }
      };
    } catch {
      return {
        mon: { day: 'mon', exerciseId: 'walk', activity: 'Camminata', duration: '30 min' },
        tue: { day: 'tue', exerciseId: 'strength', activity: 'Forza', duration: '25 min' },
        wed: { day: 'wed', exerciseId: 'yoga', activity: 'Yoga', duration: '30 min' },
        thu: { day: 'thu', exerciseId: 'walk', activity: 'Camminata', duration: '35 min' },
        fri: { day: 'fri', exerciseId: 'strength', activity: 'Forza', duration: '30 min' },
        sat: { day: 'sat', exerciseId: 'swim', activity: 'Nuoto', duration: '40 min' },
        sun: { day: 'sun', exerciseId: 'rest', activity: 'Riposo', duration: '20 min' }
      };
    }
  });

  const [currentDay, setCurrentDay] = useState<DayKey>('mon');

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workoutPlan));
    } catch (error) {
      console.error('Failed to save workout plan:', error);
    }
  };

  const handleExerciseChange = (day: DayKey, exerciseId: string) => {
    setWorkoutPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exerciseId,
        activity: EXERCISES[exerciseId]?.description.it?.split(':')[0] || exerciseId,
        duration: '30 min'
      }
    }));
    handleSave();
  };

  const handleDurationChange = (day: DayKey, duration: string) => {
    setWorkoutPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        duration
      }
    }));
    handleSave();
  };

  const handleNoteChange = (day: DayKey, note: string) => {
    setWorkoutPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        note: note.trim()
      }
    }));
    handleSave();
  };

  const handleGoToCalculator = () => {
    // Navigate to calculator tab
    // This would need to be handled by the parent App component
    console.log('Navigate to calculator');
  };

  const getDayName = (day: DayKey): string => {
    const dayNames: Record<DayKey, string> = {
      mon: 'Lunedì',
      tue: 'Martedì',
      wed: 'Mercoledì',
      thu: 'Giovedì',
      fri: 'Venerdì',
      sat: 'Sabato',
      sun: 'Domenica'
    };
    return dayNames[day];
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--text-h)">{t('workout_title')}</h2>
        <button
          onClick={handleGoToCalculator}
          className="px-4 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
        >
          {t('workout_go_to_calculator')}
        </button>
      </div>

      <div className="space-y-6">
        {DAYS.map(day => (
          <div key={day} className="p-5 rounded-xl border border-(--border) bg-(--code-bg)">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-(--text-h)">{getDayName(day)}</h3>
                <p className="text-sm text-(--text)">{workoutPlan[day].activity}</p>
              </div>
              <div className="space-x-3">
                <select
                  value={workoutPlan[day].exerciseId}
                  onChange={(e) => handleExerciseChange(day, e.target.value as string)}
                  className="px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                >
                  {Object.entries(EXERCISES).map(([id]) => (
                    <option key={id} value={id}>
                      {t(`workout_${id}`)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={workoutPlan[day].duration}
                  onChange={(e) => handleDurationChange(day, e.target.value)}
                  className="px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                  placeholder="30 min"
                />
              </div>
            </div>

            <ExerciseFigure
              anim={EXERCISES[workoutPlan[day].exerciseId]?.anim}
              className="h-48 w-full object-contain"
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-(--text) mb-2">
                {t('workout_note')}
              </label>
              <textarea
                value={workoutPlan[day].note || ''}
                onChange={(e) => handleNoteChange(day, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent) h-20 resize-none"
                placeholder={t('workout_note_placeholder')}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-(--border)">
        <div className="flex justify-between items-center">
          <span className="text-sm text-(--text)">{t('workout_current_day')}: {getDayName(currentDay)}</span>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                const currentIndex = DAYS.indexOf(currentDay);
                const prevIndex = (currentIndex - 1 + DAYS.length) % DAYS.length;
                setCurrentDay(DAYS[prevIndex]);
              }}
              className="px-3 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
            >
              ‹
            </button>
            <button
              onClick={() => {
                const currentIndex = DAYS.indexOf(currentDay);
                const nextIndex = (currentIndex + 1) % DAYS.length;
                setCurrentDay(DAYS[nextIndex]);
              }}
              className="px-3 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
