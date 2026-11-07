import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPlanState, DateKey, DayPlan } from '../types/dietPlan';
import { getSaintOfDay, getMoonPhase } from '../utils/calendarHelpers';

interface DayNavigatorProps {
  state: DietPlanState;
  currentDayIndex: number;
  onNavigateToDate: (date: DateKey) => void;
}

const NOTES_STORAGE_KEY = 'foodmapper_day_notes';

interface DayNoteEntry {
  note: string;
  reminderTime?: string; // HH:mm
}

interface DayNotesMap {
  [dateStr: string]: DayNoteEntry;
}

// Helper to parse local date string YYYY-MM-DD avoiding UTC timezone shifts
const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const isHoliday = (dateStr: string): boolean => {
  const [, monthStr, dayStr] = dateStr.split('-');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const holidays = [
    { month: 1, day: 1 },
    { month: 1, day: 6 },
    { month: 4, day: 25 },
    { month: 5, day: 1 },
    { month: 6, day: 2 },
    { month: 8, day: 15 },
    { month: 11, day: 1 },
    { month: 12, day: 8 },
    { month: 12, day: 25 },
    { month: 12, day: 26 },
  ];
  return holidays.some(h => h.month === month && h.day === day);
};

const isWeekend = (dateStr: string): boolean => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Saturday (6) and Sunday (0)
};

const getPhaseInfo = (phase?: string) => {
  switch (phase) {
    case 'phase0':
      return { name: 'Preparazione', bg: 'bg-blue-100/90 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-blue-100' };
    case 'phase1':
      return { name: 'Eliminazione', bg: 'bg-indigo-100/90 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-700 text-indigo-900 dark:text-indigo-100' };
    case 'phase2':
      return { name: 'Reintroduzione', bg: 'bg-amber-100/90 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-100' };
    case 'phase3':
      return { name: 'Mantenimento', bg: 'bg-emerald-100/90 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100' };
    default:
      return null;
  }
};

interface DayCellProps {
  dateStr: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isStartDate: boolean;
  isCompleted?: boolean;
  isHolidayDate: boolean;
  isWeekendDate: boolean;
  phaseInfo: { name: string; bg: string } | null;
  dayNote?: DayNoteEntry;
  onNavigateToDate: (date: DateKey, isCurrentMonth: boolean) => void;
  onOpenNoteModal: (dateStr: string) => void;
}

const DayCell = memo(function DayCell({
  dateStr,
  dayNum,
  isCurrentMonth,
  isSelected,
  isToday,
  isStartDate,
  isCompleted,
  isHolidayDate,
  isWeekendDate,
  phaseInfo,
  dayNote,
  onNavigateToDate,
  onOpenNoteModal,
}: DayCellProps) {
  const saint = useMemo(() => getSaintOfDay(dateStr), [dateStr]);
  const moon = useMemo(() => getMoonPhase(dateStr), [dateStr]);

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => onNavigateToDate(dateStr, isCurrentMonth)}
        className={`w-full p-2 rounded-2xl text-xs transition-all duration-100 flex flex-col items-center justify-between border relative min-h-26 shadow-xs cursor-pointer ${
          !isCurrentMonth
            ? 'bg-(--bg)/20 text-(--text)/30 border-(--border)/30 opacity-40 hover:opacity-75'
            : isSelected
            ? 'bg-(--accent) text-white font-black border-(--accent) shadow-xl ring-2 ring-white/60 scale-[1.03] z-20'
            : isToday
            ? 'bg-(--accent)/20 border-(--accent) text-(--text-h) font-extrabold ring-2 ring-(--accent)/60 shadow-sm'
            : isCompleted
            ? 'bg-purple-600 hover:bg-purple-700 text-white font-bold border-purple-700 shadow-sm'
            : isWeekendDate
            ? 'bg-rose-100/80 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800 font-bold'
            : phaseInfo
            ? phaseInfo.bg
            : isHolidayDate
            ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 font-semibold'
            : 'bg-(--code-bg) text-(--text) border-(--border) hover:border-(--accent) hover:text-(--text-h) hover:shadow-md'
        }`}
        title={`${dateStr} | ${saint} | ${moon.name}${isStartDate ? ' (Inizio Dieta)' : ''}${phaseInfo ? ` [${phaseInfo.name}]` : ''}${isHolidayDate ? ' 🎄 Festivo' : ''}${isWeekendDate ? ' 🌟 Weekend' : ''}`}
      >
        <div className="flex items-center justify-between w-full text-[9px] mb-0.5">
          {isStartDate ? (
            <span className="px-1 py-0.2 rounded bg-emerald-500 text-white font-black tracking-tighter shadow-xs">INIZIO</span>
          ) : isToday ? (
            <span className="px-1 py-0.2 rounded bg-(--accent) text-white font-black tracking-tighter">OGGI</span>
          ) : isWeekendDate ? (
            <span className="px-1 py-0.2 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-100 font-bold tracking-tighter">WKND</span>
          ) : (
            <span />
          )}
          <span title={moon.name}>{moon.icon}</span>
        </div>

        <span className={`text-base font-black ${!isCurrentMonth ? 'opacity-50' : isSelected || isCompleted ? 'text-white' : 'text-(--text-h)'}`}>
          {dayNum}
        </span>

        <div className="flex flex-col items-center gap-0.5 w-full text-[9px] mt-0.5 truncate">
          <span className="truncate w-full text-center opacity-85 font-medium" title={saint}>
            {saint}
          </span>
          {dayNote?.note && (
            <span className="truncate w-full text-center text-(--accent) font-extrabold bg-(--accent)/10 px-1 py-0.2 rounded" title={dayNote.note}>
              📝 {dayNote.note}
            </span>
          )}
          <div className="flex items-center gap-1">
            {isHolidayDate && <span title="Festivo">🎄</span>}
            {isCompleted && <span className="font-black text-white" title="Completato">✓</span>}
            {dayNote?.reminderTime && <span className="text-amber-500 font-black" title={`Promemoria: ${dayNote.reminderTime}`}>⏰ {dayNote.reminderTime}</span>}
          </div>
        </div>
      </button>

      {/* Quick edit note/reminder button at bottom right (away from moon phase icon at top right) */}
      {isCurrentMonth && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenNoteModal(dateStr);
          }}
          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition p-1 rounded-full bg-black/70 text-white text-[10px] hover:bg-black/90 shadow-sm z-30"
          title="Modifica note o promemoria"
        >
          ✏️
        </button>
      )}
    </div>
  );
});

export function DayNavigator({
  state,
  currentDayIndex,
  onNavigateToDate,
}: DayNavigatorProps) {
  const { t } = useTranslation();

  // Notes & Reminders state
  const [dayNotes, setDayNotes] = useState<DayNotesMap>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeModalDate, setActiveModalDate] = useState<string | null>(null);
  const [modalNoteText, setModalNoteText] = useState('');
  const [modalReminderTime, setModalReminderTime] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(dayNotes));
    } catch (error) {
      console.error('Failed to save day notes:', error);
    }
  }, [dayNotes]);

  // Check and fire browser notifications for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const entry = dayNotes[todayStr];
      if (entry && entry.reminderTime === currentHourMin) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`FoodMapper Promemoria (${todayStr})`, {
            body: entry.note || 'Promemoria attività giornaliera',
            icon: '/favicon.svg',
          });
        }
      }
    };

    const interval = window.setInterval(checkReminders, 30000);
    return () => window.clearInterval(interval);
  }, [dayNotes]);

  const handleOpenNoteModal = useCallback((dateStr: string) => {
    setActiveModalDate(dateStr);
    const existing = dayNotes[dateStr] || { note: '', reminderTime: '' };
    setModalNoteText(existing.note || '');
    setModalReminderTime(existing.reminderTime || '');
  }, [dayNotes]);

  const handleSaveNoteModal = async () => {
    if (!activeModalDate) return;
    
    // Request notification permission if reminder time is set
    if (modalReminderTime && 'Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    setDayNotes(prev => ({
      ...prev,
      [activeModalDate]: {
        note: modalNoteText.trim(),
        reminderTime: modalReminderTime || undefined,
      }
    }));
    setActiveModalDate(null);
  };

  const currentDay = useMemo(() => {
    return state.days.find(d => d.dayIndex === currentDayIndex) || 
           state.days.find(d => d.dayIndex === 0) || 
           state.days[0] || 
           null;
  }, [state.days, currentDayIndex]);

  const startDateStr = state.startDate;

  const daysMap = useMemo(() => {
    const map = new Map<string, DayPlan>();
    state.days.forEach(d => map.set(d.date, d));
    return map;
  }, [state.days]);

  const monthsMap = useMemo(() => {
    const map = new Map<string, { year: number; month: number; label: string }>();
    state.days.forEach(day => {
      const d = parseLocalDate(day.date);
      const year = d.getFullYear();
      const month = d.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      if (!map.has(monthKey)) {
        const label = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        map.set(monthKey, { year, month, label });
      }
    });
    return map;
  }, [state.days]);

  const availableMonths = useMemo(() => {
    if (monthsMap.size === 0) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      return [{ key: monthKey, year, month, label: now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) }];
    }
    return Array.from(monthsMap.entries()).map(([key, val]) => ({ key, ...val }));
  }, [monthsMap]);

  const currentDayDateObj = useMemo(() => {
    return currentDay ? parseLocalDate(currentDay.date) : new Date();
  }, [currentDay]);

  const currentDayMonthKey = useMemo(() => {
    return `${currentDayDateObj.getFullYear()}-${String(currentDayDateObj.getMonth() + 1).padStart(2, '0')}`;
  }, [currentDayDateObj]);

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(() => {
    return availableMonths.some(m => m.key === currentDayMonthKey) ? currentDayMonthKey : (availableMonths[0]?.key || currentDayMonthKey);
  });

  const activeMonthKey = useMemo(() => {
    return availableMonths.some(m => m.key === selectedMonthKey)
      ? selectedMonthKey
      : (availableMonths[0]?.key || currentDayMonthKey);
  }, [availableMonths, selectedMonthKey, currentDayMonthKey]);

  const activeMonthObj = useMemo(() => {
    const monthData = monthsMap.get(activeMonthKey);
    if (monthData) return monthData;
    return {
      year: currentDayDateObj.getFullYear(),
      month: currentDayDateObj.getMonth(),
      label: currentDayDateObj.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    };
  }, [activeMonthKey, monthsMap, currentDayDateObj]);

  const handlePrevMonth = useCallback(() => {
    const idx = availableMonths.findIndex(m => m.key === activeMonthKey);
    if (idx > 0) {
      setSelectedMonthKey(availableMonths[idx - 1].key);
    } else {
      const [y, m] = activeMonthKey.split('-').map(Number);
      const prevDate = new Date(y, m - 2, 1);
      const newYear = prevDate.getFullYear();
      const newMonth = prevDate.getMonth();
      const newKey = `${newYear}-${String(newMonth + 1).padStart(2, '0')}`;
      setSelectedMonthKey(newKey);
    }
  }, [activeMonthKey, availableMonths]);

  const handleNextMonth = useCallback(() => {
    const idx = availableMonths.findIndex(m => m.key === activeMonthKey);
    if (idx >= 0 && idx < availableMonths.length - 1) {
      setSelectedMonthKey(availableMonths[idx + 1].key);
    } else {
      const [y, m] = activeMonthKey.split('-').map(Number);
      const nextDate = new Date(y, m, 1);
      const newYear = nextDate.getFullYear();
      const newMonth = nextDate.getMonth();
      const newKey = `${newYear}-${String(newMonth + 1).padStart(2, '0')}`;
      setSelectedMonthKey(newKey);
    }
  }, [activeMonthKey, availableMonths]);

  const { weeks, todayStr } = useMemo(() => {
    const year = activeMonthObj.year;
    const month = activeMonthObj.month;
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastDayOfMonth.getDate();

    const days: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, 1 - i - 1);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d.getDate(), isCurrentMonth: false });
    }

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const d = new Date(year, month, dayNum);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({ dateStr, dayNum, isCurrentMonth: true });
    }

    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(year, month + 1, i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d.getDate(), isCurrentMonth: false });
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const nowLocal = new Date();
    const todayStr = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, '0')}-${String(nowLocal.getDate()).padStart(2, '0')}`;

    return { weeks, todayStr };
  }, [activeMonthObj]);

  return (
    <div className="p-5 rounded-3xl bg-(--code-bg) border border-(--border) shadow-md mb-6 backdrop-blur-md">
      {/* Month Navigation Controls */}
      <div className="flex items-center gap-3 bg-(--bg) px-4 py-2 rounded-2xl border border-(--border) shadow-inner mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 rounded-xl hover:bg-(--code-bg) text-(--text-h) transition font-bold cursor-pointer"
          aria-label={t('common.previous_month', { defaultValue: 'Mese precedente' })}
        >
          ◀
        </button>
        <span className="text-sm font-extrabold text-(--text-h) px-3 capitalize min-w-37.5 text-center tracking-wide">
          {activeMonthObj.label}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-xl hover:bg-(--code-bg) text-(--text-h) transition font-bold cursor-pointer"
          aria-label={t('common.next_month', { defaultValue: 'Mese successivo' })}
        >
          ▶
        </button>
      </div>

      {/* Weekday headers starting on Monday (Saturday & Sunday styled identically) */}
      <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-black text-(--text-h) uppercase tracking-wider">
        <span className="py-1">{t('days.mon', { defaultValue: 'Lun' })}</span>
        <span className="py-1">{t('days.tue', { defaultValue: 'Mar' })}</span>
        <span className="py-1">{t('days.wed', { defaultValue: 'Mer' })}</span>
        <span className="py-1">{t('days.thu', { defaultValue: 'Gio' })}</span>
        <span className="py-1">{t('days.ven', { defaultValue: 'Ven' })}</span>
        <span className="py-1 text-rose-600 dark:text-rose-400">{t('days.sat', { defaultValue: 'Sab' })}</span>
        <span className="py-1 text-rose-600 dark:text-rose-400">{t('days.sun', { defaultValue: 'Dom' })}</span>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-col gap-2.5">
        {weeks.map((weekDays, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-2">
            {weekDays.map(({ dateStr, dayNum, isCurrentMonth }) => {
              const dayPlan = daysMap.get(dateStr);
              const isSelected = currentDay?.date === dateStr;
              const isToday = dateStr === todayStr;
              const isStartDate = dateStr === startDateStr;
              const isCompleted = dayPlan?.isCompleted;
              const isHolidayDate = isHoliday(dateStr);
              const isWeekendDate = isWeekend(dateStr);
              const phaseInfo = dayPlan && dayPlan.dayIndex >= 0 ? getPhaseInfo(dayPlan.phase) : null;
              const dayNote = dayNotes[dateStr];

              return (
                <DayCell
                  key={dateStr}
                  dateStr={dateStr}
                  dayNum={dayNum}
                  isCurrentMonth={isCurrentMonth}
                  isSelected={isSelected}
                  isToday={isToday}
                  isStartDate={isStartDate}
                  isCompleted={isCompleted}
                  isHolidayDate={isHolidayDate}
                  isWeekendDate={isWeekendDate}
                  phaseInfo={phaseInfo}
                  dayNote={dayNote}
                  onNavigateToDate={(d, currMonth) => {
                    if (!currMonth) {
                      setSelectedMonthKey(d.slice(0, 7));
                    }
                    onNavigateToDate(d);
                  }}
                  onOpenNoteModal={handleOpenNoteModal}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Day Notes & Reminder Modal */}
      {activeModalDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setActiveModalDate(null)}
        >
          <div
            className="bg-(--code-bg) border border-(--border) rounded-3xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-(--text-h) mb-2">
              📝 Nota & Promemoria per il giorno {activeModalDate}
            </h3>
            <p className="text-xs text-(--text) mb-4">
              Aggiungi attività, eventi o appunti personali per questo giorno, con eventuale notifica push.
            </p>

            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-(--text-h) mb-1">Predisposizioni rapide</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    { label: '🎂 Compleanno', text: '🎂 Compleanno' },
                    { label: '🔴 Ciclo', text: '🔴 Ciclo mestruale' },
                    { label: '🩺 Visita medica', text: '🩺 Visita medica di controllo' },
                    { label: '🩸 Analisi', text: '🩸 Analisi del sangue' },
                    { label: '✈️ Viaggio', text: '✈️ Viaggio / Vacanza' },
                  ].map(preset => (
                    <button
                      key={preset.text}
                      type="button"
                      onClick={() => setModalNoteText(prev => prev ? `${prev} - ${preset.text}` : preset.text)}
                      className="px-2.5 py-1 rounded-lg bg-(--bg) border border-(--border) text-[11px] font-medium hover:border-(--accent) hover:text-(--accent) transition cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <label className="block text-xs font-bold text-(--text-h) mb-1">Nota / Attività</label>
                <textarea
                  value={modalNoteText}
                  onChange={(e) => setModalNoteText(e.target.value)}
                  placeholder="Es. Visita medica di controllo, allenamento intenso..."
                  className="w-full p-3 rounded-xl border border-(--border) bg-(--bg) text-(--text) text-xs focus:outline-none focus:ring-2 focus:ring-(--accent) min-h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--text-h) mb-1">Orario Promemoria Notifica</label>
                <input
                  type="time"
                  value={modalReminderTime}
                  onChange={(e) => setModalReminderTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-(--border) bg-(--bg) text-(--text) text-xs focus:outline-none focus:ring-2 focus:ring-(--accent)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModalDate(null)}
                className="px-4 py-2 rounded-xl bg-(--bg) border border-(--border) text-(--text-h) text-xs font-bold hover:bg-(--border)/20 transition cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleSaveNoteModal}
                className="px-4 py-2 rounded-xl bg-(--accent) text-white text-xs font-bold hover:bg-(--accent-hover) transition cursor-pointer shadow-md"
              >
                Salva Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
