import { useState, useMemo, useEffect, useCallback, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPlanState, DateKey, DayPlan } from '../types/dietPlan';
import { getSaintOfDay, getMoonPhase } from '../utils/calendarHelpers';
import { getDateFromDayIndex } from '../utils/mealGenerator';

interface DayNavigatorProps {
  state: DietPlanState;
  currentDayIndex: number;
  onNavigateToDate: (date: DateKey) => void;
  onUpdateStartDate?: (newStartDate: string) => void;
}

interface DayCalendarMeta {
  note?: string;
  birthday?: string;
  event?: string;
  menstrualPhase?: 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
}

const STORAGE_KEY = 'foodmapper_calendar_meta';

const ITALIAN_HOLIDAYS: Record<string, string> = {
  '01-01': 'Capodanno',
  '01-06': 'Epifania',
  '04-25': 'Festa della Liberazione',
  '05-01': 'Festa del Lavoro',
  '06-02': 'Festa della Repubblica',
  '08-15': 'Ferragosto',
  '11-01': 'Tutti i Santi',
  '12-08': 'Immacolata Concezione',
  '12-25': 'Natale',
  '12-26': 'Santo Stefano'
};

/**
 * Timezone-safe local date string helper (YYYY-MM-DD)
 */
const getLocalDateString = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const isItalianHoliday = (dateStr: string): string | null => {
  const parts = dateStr.split('-');
  if (parts.length < 3) return null;
  const [, m, d] = parts;
  const key = `${m}-${d}`;
  return ITALIAN_HOLIDAYS[key] || null;
};

export default function DayNavigator({
  state,
  currentDayIndex,
  onNavigateToDate,
  onUpdateStartDate,
}: DayNavigatorProps) {
  const { t, i18n } = useTranslation();

  // Refs for callback props to avoid stale closure issues in React 19
  const onNavigateToDateRef = useRef(onNavigateToDate);
  const onUpdateStartDateRef = useRef(onUpdateStartDate);
  // Tracks whether viewDate navigation was triggered by a start-date change
  // (double-click on a day cell). Used to prevent Effect A from overriding
  // the start-date sync in Effect B.
  const startDateChangeRef = useRef(false);

  // Keep refs updated with latest values
  useEffect(() => {
    onNavigateToDateRef.current = onNavigateToDate;
    if (onUpdateStartDate) {
      onUpdateStartDateRef.current = onUpdateStartDate;
    }
  }, [onNavigateToDate, onUpdateStartDate]);

  const currentDay = useMemo(() => {
    return state.days.find(d => d.dayIndex === currentDayIndex) || state.days.find(d => d.date === state.startDate) || undefined;
  }, [state.days, currentDayIndex, state.startDate]);

  const currentSelectedDate = useMemo(() => {
    if (currentDay?.date) return currentDay.date;
    if (state.startDate) {
      return getDateFromDayIndex(currentDayIndex, state.startDate as DateKey);
    }
    return getLocalDateString();
  }, [currentDay?.date, state.startDate, currentDayIndex]);

  // Today's date string for badge highlighting
  const todayStr = useMemo(() => getLocalDateString(), []);

  // Calendar view month/year state - initialize to today's local date by default
  const [viewDate, setViewDate] = useState<Date>(() => {
    const today = new Date();
    if (!isNaN(today.getTime())) return today;
    const parts = currentSelectedDate.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      const [y, m, d] = parts;
      const dateObj = new Date(y, m - 1, d);
      if (!isNaN(dateObj.getTime())) return dateObj;
    }
    return new Date();
  });

  // Keep viewDate in sync when currentDay changes.
  // Skips sync when a start-date change (double-click) is in progress so
  // Effect B (startDate sync) wins and the calendar stays on the new start date's month.
  useEffect(() => {
    if (startDateChangeRef.current) return;
    if (currentDay?.date) {
      const parts = currentDay.date.split('-').map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        const [y, m, d] = parts;
        const dateObj = new Date(y, m - 1, d);
        if (!isNaN(dateObj.getTime())) {
          setViewDate(prev => {
            if (prev.getFullYear() === y && prev.getMonth() === (m - 1)) {
              return prev;
            }
            return dateObj;
          });
        }
      }
    }
  }, [currentDay?.date]);

  // When the diet start date changes (e.g. via double-click on a day cell),
  // navigate the calendar view to the new start date so phase colors update
  // visibly in the current month grid.
  useEffect(() => {
    if (!state.startDate) return;
    const parts = state.startDate.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return;
    const [y, m, d] = parts;
    const startDateObj = new Date(y, m - 1, d);
    if (isNaN(startDateObj.getTime())) return;
    setViewDate(prev => {
      if (prev.getFullYear() === y && prev.getMonth() === (m - 1)) {
        return prev;
      }
      return startDateObj;
    });
    startDateChangeRef.current = false;
  }, [state.startDate]);

  // Mount effect: navigate to today if current date differs from today
  useEffect(() => {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    if (state.startDate !== todayStr) {
      onNavigateToDateRef.current(todayStr as DateKey);
    }
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  // Day detail modal / popover state for notes, birthdays, events, menstrual cycle
  const [activeModalDate, setActiveModalDate] = useState<string | null>(null);
  const [calendarMeta, setCalendarMeta] = useState<Record<string, DayCalendarMeta>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save calendar meta to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(calendarMeta));
    } catch (e) {
      console.error('Failed to save calendar meta to localStorage', e);
    }
  }, [calendarMeta]);

  // Map state.days by date for fast lookup
  const daysMap = useMemo(() => {
    const map = new Map<string, DayPlan>();
    state.days.forEach(day => {
      map.set(day.date, day);
    });
    return map;
  }, [state.days]);

  // Compute days of current month only (solving UI responsiveness bug)
  const monthDays = useMemo(() => {
    const result: string[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      result.push(`${year}-${mStr}-${dStr}`);
    }
    return result;
  }, [year, month]);

  // Month navigation handlers — also trigger day generation for the new month
  // so diet phase backgrounds are available for all dates in the viewed month
  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(year, month - 1, 1);
    setViewDate(newDate);
    onNavigateToDateRef.current(getLocalDateString(newDate) as DateKey);
  }, [year, month]);

  const handleNextMonth = useCallback(() => {
    const newDate = new Date(year, month + 1, 1);
    setViewDate(newDate);
    onNavigateToDateRef.current(getLocalDateString(newDate) as DateKey);
  }, [year, month]);

  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setViewDate(today);
    const todayStr = getLocalDateString(today);
    onNavigateToDateRef.current(todayStr as DateKey);
  }, []);

  // Incremental day navigation handlers
  const handlePrevDay = useCallback(() => {
    const prevDay = new Date(viewDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setViewDate(prevDay);
    const prevStr = getLocalDateString(prevDay);
    onNavigateToDateRef.current(prevStr as DateKey);
  }, [viewDate]);

  const handleNextDay = useCallback(() => {
    const nextDay = new Date(viewDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setViewDate(nextDay);
    const nextStr = getLocalDateString(nextDay);
    onNavigateToDateRef.current(nextStr as DateKey);
  }, [viewDate]);

  // Format month and year header localized
  const monthYearHeader = useMemo(() => {
    return viewDate.toLocaleDateString(i18n.language || 'it-IT', {
      month: 'long',
      year: 'numeric'
    });
  }, [viewDate, i18n.language]);

  const handleSaveModalMeta = useCallback((meta: DayCalendarMeta) => {
    if (!activeModalDate) return;
    setCalendarMeta(prev => ({
      ...prev,
      [activeModalDate]: meta
    }));
    setActiveModalDate(null);
  }, [activeModalDate]);

  // Weekdays header (Lun - Dom) with weekend styling
  const weekdays = useMemo(() => {
    return [
      { name: t('common.mon', { defaultValue: 'Lun' }), isWeekend: false },
      { name: t('common.tue', { defaultValue: 'Mar' }), isWeekend: false },
      { name: t('common.wed', { defaultValue: 'Mer' }), isWeekend: false },
      { name: t('common.thu', { defaultValue: 'Gio' }), isWeekend: false },
      { name: t('common.fri', { defaultValue: 'Ven' }), isWeekend: false },
      { name: t('common.sat', { defaultValue: 'Sab' }), isWeekend: true },
      { name: t('common.sun', { defaultValue: 'Dom' }), isWeekend: true },
    ];
  }, [t]);

  // Calculate leading empty cells for week alignment (Monday start)
  const leadingEmptyCells = useMemo(() => {
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
    const adjustedDay = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;
    return adjustedDay - 1;
  }, [year, month]);

const DayCell = memo(function DayCell({
  dateStr,
  dayPlan,
  isSelected,
  isWeekend,
  isToday,
  phaseBgColor,
  phaseTextColor,
  ariaLabelText,
  onDayClick,
  onDayDoubleClick,
  onDayKeyDown,
  onEditClick,
  holidayName,
  saint,
  moon,
  meta,
  t,
  onUpdateStartDate,
}: {
  dateStr: string;
  dayPlan: DayPlan | undefined;
  isSelected: boolean;
  isWeekend: boolean;
  isToday: boolean;
  phaseBgColor: string;
  phaseTextColor: string;
  ariaLabelText: string;
  onDayClick: (e: React.MouseEvent) => void;
  onDayDoubleClick: (e: React.MouseEvent) => void;
  onDayKeyDown: (e: React.KeyboardEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  holidayName: string | null;
  saint: string;
  moon: { name: string; icon: string };
  meta: DayCalendarMeta;
  t: (key: string, options?: Record<string, unknown>) => string;
  onUpdateStartDate?: (newStartDate: string) => void;
}) {
  const d = dateStr.split('-')[2] || '1';

  return (
    <div
      key={dateStr}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={ariaLabelText}
      onClick={onDayClick}
      onDoubleClick={onDayDoubleClick}
      onKeyDown={onDayKeyDown}
      className={`relative h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl transition-all duration-150 flex flex-col justify-between cursor-pointer group ${
        isSelected
          ? `${phaseBgColor} ${isWeekend ? 'border-2 border-red-500 ring-2 ring-(--accent)/40' : `border-2 border-(--accent) ring-2 ring-(--accent)/40`} shadow-md scale-102 z-10`
          : `border ${phaseBgColor} ${isWeekend ? 'border-2 border-red-500/80 dark:border-red-500/80' : 'border-(--border)'} hover:border-(--accent) hover:opacity-90 ${isToday ? 'ring-2 ring-(--accent)/50' : ''}`
      }`}
      title={`${dateStr} - ${saint} ${holidayName ? `(${holidayName})` : ''}${onUpdateStartDate ? '\n' + t('diet_start_date_dblclick') : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs sm:text-sm font-bold ${
          isWeekend ? 'text-red-500 dark:text-red-400 font-extrabold' :
          isSelected ? 'text-(--accent)' :
          phaseTextColor || 'text-(--text-h)'
        }`}>
          {d}
        </span>
        <div className="flex items-center gap-1">
          {dayPlan?.isCompleted && (
            <span className="text-[10px] bg-green-500 text-white px-1 rounded-full font-bold" title="Completato">✓</span>
          )}
        </div>
      </div>

      {/* Middle: Saint & Moon & Holiday */}
      <div className="text-[10px] text-(--text) line-clamp-2 leading-tight opacity-90 group-hover:opacity-100">
        {holidayName ? (
          <span className="text-red-500 font-bold block" title={holidayName}>🎉 {holidayName}</span>
        ) : (
          <span className="block" title={saint}>⛪ {saint}</span>
        )}
        <span className="flex items-center gap-1 mt-0.5" title={moon.name}>
          <span>{moon.icon}</span>
          <span className="opacity-70">{moon.name}</span>
        </span>
      </div>

      {/* Bottom indicators & subtle edit button */}
      <div className="flex items-center justify-between pt-1 border-t border-(--border)/40 text-[10px]">
        <div className="flex items-center gap-1">
          {meta.note && <span title={meta.note}>📝</span>}
          {meta.birthday && <span title={meta.birthday}>🎂</span>}
          {meta.event && <span title={meta.event}>📌</span>}
          {meta.menstrualPhase && (
            <span title={`Ciclo: ${meta.menstrualPhase}`}>
              {meta.menstrualPhase === 'menstruation' ? '🩸' : meta.menstrualPhase === 'ovulation' ? '⭐' : '🔵'}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onEditClick}
          className="p-1 rounded-md text-(--text) opacity-40 hover:opacity-100 group-hover:opacity-75 hover:bg-(--accent)/15 hover:text-(--accent) transition-all cursor-pointer text-xs leading-none"
          title="Aggiungi o modifica nota / evento / ciclo"
          aria-label="Aggiungi o modifica nota, evento o ciclo"
        >
          ✏️
        </button>
      </div>
    </div>
  );
});

return (
    <div className="p-4 sm:p-6 rounded-2xl bg-(--code-bg) border border-(--border) shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-(--text-h) flex items-center gap-2">
            <span>📅</span>
            {t('diet_calendar_title', { defaultValue: 'Calendario & Navigazione Giornaliera' })}
          </h3>
          <p className="text-xs text-(--text) opacity-80">
            {t('diet_calendar_subtitle', { defaultValue: 'Visualizza fasi della dieta, santi, fasi lunari, festività e note personali.' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Always visible start date bar with direct controls */}
          {onUpdateStartDate && (
            <>
              <button
                type="button"
                onClick={handlePrevDay}
                className="px-3 py-1.5 rounded-xl bg-(--bg) border border-(--border) text-(--text-h) text-xs font-semibold hover:border-(--accent) hover:text-(--accent) transition shadow-2xs cursor-pointer"
                aria-label="Giorno precedente"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNextDay}
                className="px-3 py-1.5 rounded-xl bg-(--bg) border border-(--border) text-(--text-h) text-xs font-semibold hover:border-(--accent) hover:text-(--accent) transition shadow-2xs cursor-pointer"
                aria-label="Giorno successivo"
              >
                ›
              </button>
              <button
                type="button"
                onClick={handleTodayClick}
                className="px-3 py-1.5 rounded-xl bg-(--accent) text-white text-xs font-semibold hover:bg-(--accent-hover) transition shadow-2xs cursor-pointer"
              >
                Oggi
              </button>
            </>
          )}
        </div>
      </div>

      {/* Calendar grid: always visible */}
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-(--bg) border border-(--border)">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) hover:border-(--accent) hover:text-(--accent) transition cursor-pointer"
          aria-label={t('common.prev_month', { defaultValue: 'Mese precedente' })}
        >
          ◀
        </button>
        <h4 className="text-sm sm:text-base font-bold text-(--text-h) capitalize">
          {monthYearHeader}
        </h4>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) hover:border-(--accent) hover:text-(--accent) transition cursor-pointer"
          aria-label={t('common.next_month', { defaultValue: 'Mese successivo' })}
        >
          ▶
        </button>
      </div>

      {/* Calendar Grid Header (Weekdays) */}
      <div className="grid grid-cols-7 gap-1.5 mb-2 text-center" role="row">
        {weekdays.map((wd, i) => (
          <div
            key={i}
            className={`text-xs font-extrabold uppercase tracking-wider py-1 ${
              wd.isWeekend ? 'text-red-500 dark:text-red-400' : 'text-(--text)'
            }`}
            role="columnheader"
          >
            {wd.name}
          </div>
        ))}
      </div>

      {/* Visible double-click instruction when start date can be set */}
      {onUpdateStartDate && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-sm font-medium flex items-center gap-2">
          <span>👆</span>
          {t('diet_start_date_dblclick')}
        </div>
      )}

      {/* Calendar Grid Days */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2" role="grid">
        {/* Leading empty cells for month alignment */}
        {Array.from({ length: leadingEmptyCells }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-24 sm:h-28 rounded-xl bg-(--bg)/30 border border-transparent opacity-30" aria-hidden="true" />
        ))}

        {monthDays.map((dateStr) => {
          const dayPlan = daysMap.get(dateStr);
          const isSelected = currentSelectedDate === dateStr;
          const dateObj = new Date(dateStr);
          const dayOfWeek = dateObj.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const holidayName = isItalianHoliday(dateStr);
          const saint = getSaintOfDay(dateStr);
          const moon = getMoonPhase(dateStr);
          const meta = calendarMeta[dateStr] || {};

          let phaseBgColor = 'bg-transparent';
          let phaseTextColor = '';
          if (dateStr < state.startDate) {
            phaseBgColor = 'bg-transparent';
            phaseTextColor = '';
          } else if (dayPlan) {
            if (dayPlan.phase === 'phase0') {
              phaseBgColor = 'bg-sky-500/10 dark:bg-sky-500/20';
              phaseTextColor = 'text-sky-600';
            } else if (dayPlan.phase === 'phase1') {
              phaseBgColor = 'bg-purple-500/10 dark:bg-purple-500/20';
              phaseTextColor = 'text-purple-600';
            } else if (dayPlan.phase === 'phase2') {
              phaseBgColor = 'bg-amber-500/10 dark:bg-amber-500/20';
              phaseTextColor = 'text-amber-600';
            } else if (dayPlan.phase === 'phase3') {
              phaseBgColor = 'bg-emerald-500/10 dark:bg-emerald-500/20';
              phaseTextColor = 'text-emerald-600';
            }
          } else {
            phaseBgColor = 'bg-transparent';
            phaseTextColor = '';
          }

          const ariaLabelText = `${dateStr}, ${saint}${holidayName ? `, ${holidayName}` : ''}${dayPlan?.isCompleted ? ', Completato' : ''}`;

          const handleDayClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            onNavigateToDateRef.current(dateStr as DateKey);
          };

          const handleDayDoubleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            startDateChangeRef.current = true;
            if (onUpdateStartDate) {
              onUpdateStartDateRef.current?.(dateStr);
            } else {
              setActiveModalDate(dateStr);
            }
          };

          const handleDayKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onNavigateToDateRef.current(dateStr as DateKey);
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              e.stopPropagation();
              handlePrevDay();
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              e.stopPropagation();
              handleNextDay();
            }
          };

          const onEditClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setActiveModalDate(dateStr);
          };

          const isToday = dateStr === todayStr;

          return (
            <DayCell
              key={dateStr}
              dateStr={dateStr}
              dayPlan={dayPlan}
              isSelected={isSelected}
              isWeekend={isWeekend}
              isToday={isToday}
              phaseBgColor={phaseBgColor}
              phaseTextColor={phaseTextColor}
              ariaLabelText={ariaLabelText}
              onDayClick={handleDayClick}
              onDayDoubleClick={handleDayDoubleClick}
              onDayKeyDown={handleDayKeyDown}
              onEditClick={onEditClick}
              holidayName={holidayName}
              saint={saint}
              moon={moon}
              meta={meta}
              t={t}
              onUpdateStartDate={onUpdateStartDate}
            />
          );
        })}
      </div>

      {/* Day Details / Meta Modal */}
      {activeModalDate && (
        <DayMetaModal
          dateStr={activeModalDate}
          initialMeta={calendarMeta[activeModalDate] || {}}
          onSave={handleSaveModalMeta}
          onClose={() => setActiveModalDate(null)}
          t={t}
        />
      )}
    </div>
  );
}

interface DayMetaModalProps {
  dateStr: string;
  initialMeta: DayCalendarMeta;
  onSave: (meta: DayCalendarMeta) => void;
  onClose: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

function DayMetaModal({ dateStr, initialMeta, onSave, onClose, t }: DayMetaModalProps) {
  const [note, setNote] = useState(initialMeta.note || '');
  const [birthday, setBirthday] = useState(initialMeta.birthday || '');
  const [event, setEvent] = useState(initialMeta.event || '');
  const [menstrualPhase, setMenstrualPhase] = useState<DayCalendarMeta['menstrualPhase']>(initialMeta.menstrualPhase);
  const onCloseRef = useRef(onClose);

  // Keep the ref updated with the latest onClose callback
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Handle ESC key to close modal - using ref to avoid stale closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle backdrop click to close modal - using ref to avoid stale closure
  const handleBackdropClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).role === 'dialog') {
      onCloseRef.current();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      note: note.trim() || undefined,
      birthday: birthday.trim() || undefined,
      event: event.trim() || undefined,
      menstrualPhase,
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" 
      role="dialog" 
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-md p-6 rounded-2xl bg-(--code-bg) border border-(--border) shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b border-(--border)">
          <h3 className="text-base font-bold text-(--text-h)">
            {t('calendar_meta_title', { defaultValue: 'Dettagli Giorno' })}: {dateStr}
          </h3>
          <button
            type="button"
            onClick={onCloseRef.current}
            className="text-(--text) hover:text-(--text-h) text-lg font-bold cursor-pointer"
            aria-label={t('common.close', { defaultValue: 'Chiudi' })}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-(--text-h) mb-1">
              📝 {t('calendar_note_label', { defaultValue: 'Nota personale' })}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={t('calendar_note_placeholder', { defaultValue: 'Aggiungi una nota per questo giorno...' })}
              className="w-full p-2.5 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent) resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-(--text-h) mb-1">
              🎂 {t('calendar_birthday_label', { defaultValue: 'Compleanno / Ricorrenza' })}
            </label>
            <input
              type="text"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              placeholder={t('calendar_birthday_placeholder', { defaultValue: 'Es. Compleanno di Marco' })}
              className="w-full p-2.5 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
            />
          </div>

          <div>
            <label className="block font-semibold text-(--text-h) mb-1">
              📌 {t('calendar_event_label', { defaultValue: 'Evento importante' })}
            </label>
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder={t('calendar_event_placeholder', { defaultValue: 'Es. Visita medica / Riunione' })}
              className="w-full p-2.5 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
            />
          </div>

          <div>
            <label className="block font-semibold text-(--text-h) mb-1">
              🩸 {t('calendar_menstrual_label', { defaultValue: 'Tracciamento Ciclo Vescicale / Mestruale' })}
            </label>
            <select
              value={menstrualPhase || ''}
              onChange={(e) => setMenstrualPhase(e.target.value as DayCalendarMeta['menstrualPhase'] || undefined)}
              className="w-full p-2.5 rounded-xl border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
            >
              <option value="">{t('common.none', { defaultValue: '-- Nessuno / Non specificato --' })}</option>
              <option value="menstruation">🩸 {t('cycle_menstruation', { defaultValue: 'Mestruazione' })}</option>
              <option value="follicular">🟢 {t('cycle_follicular', { defaultValue: 'Fase Follicolare' })}</option>
              <option value="ovulation">⭐ {t('cycle_ovulation', { defaultValue: 'Ovulazione' })}</option>
              <option value="luteal">🔵 {t('cycle_luteal', { defaultValue: 'Fase Luteale' })}</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-(--border)">
            <button
              type="button"
              onClick={onCloseRef.current}
              className="px-4 py-2 rounded-xl bg-(--bg) border border-(--border) text-(--text) font-semibold hover:bg-(--accent)/10 transition cursor-pointer"
            >
              {t('common.cancel', { defaultValue: 'Annulla' })}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-(--accent) text-white font-semibold hover:bg-(--accent-hover) transition shadow-sm cursor-pointer"
            >
              {t('common.save', { defaultValue: 'Salva' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
