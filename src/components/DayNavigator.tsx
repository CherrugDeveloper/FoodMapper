import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPlanState, DateKey, DayPlan } from '../types/dietPlan';
import { getSaintOfDay, getMoonPhase } from '../utils/calendarHelpers';

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

const isItalianHoliday = (dateStr: string): string | null => {
  const [, m, d] = dateStr.split('-');
  const key = `${m}-${d}`;
  return ITALIAN_HOLIDAYS[key] || null;
};

export function DayNavigator({
  state,
  currentDayIndex,
  onNavigateToDate,
  onUpdateStartDate,
}: DayNavigatorProps) {
  const { t, i18n } = useTranslation();
  
  const currentDay = state.days[currentDayIndex];
  const currentSelectedDate = currentDay?.date || state.startDate || new Date().toISOString().split('T')[0];

  // Calendar view month/year state
  const [viewDate, setViewDate] = useState<Date>(() => {
    const d = new Date(currentSelectedDate);
    return isNaN(d.getTime()) ? new Date() : d;
  });

  // Keep viewDate in sync when currentDay changes
  useEffect(() => {
    if (currentDay?.date) {
      const d = new Date(currentDay.date);
      if (!isNaN(d.getTime())) {
        setViewDate(d);
      }
    }
  }, [currentDay?.date]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  // Start Date inline editor state
  const [isEditingStartDate, setIsEditingStartDate] = useState(false);
  const [newStartDateInput, setNewStartDateInput] = useState(state.startDate);

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

  // Month navigation handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();
    setViewDate(today);
    const todayStr = today.toISOString().split('T')[0];
    if (daysMap.has(todayStr)) {
      onNavigateToDate(todayStr as DateKey);
    }
  };

  const handleStartDateSubmit = useCallback(() => {
    if (newStartDateInput && onUpdateStartDate) {
      onUpdateStartDate(newStartDateInput);
      setIsEditingStartDate(false);
    }
  }, [newStartDateInput, onUpdateStartDate]);

  // Format month and year header localized
  const monthYearHeader = useMemo(() => {
    return viewDate.toLocaleDateString(i18n.language || 'it-IT', {
      month: 'long',
      year: 'numeric'
    });
  }, [viewDate, i18n.language]);

  const handleSaveModalMeta = (meta: DayCalendarMeta) => {
    if (!activeModalDate) return;
    setCalendarMeta(prev => ({
      ...prev,
      [activeModalDate]: meta
    }));
    setActiveModalDate(null);
  };

  // Weekdays header (Lun - Dom)
  const weekdays = useMemo(() => {
    // Monday start: 1, 2, 3, 4, 5, 6, 0
    return [
      t('common.mon', { defaultValue: 'Lun' }),
      t('common.tue', { defaultValue: 'Mar' }),
      t('common.wed', { defaultValue: 'Mer' }),
      t('common.thu', { defaultValue: 'Gio' }),
      t('common.fri', { defaultValue: 'Ven' }),
      t('common.sat', { defaultValue: 'Sab' }),
      t('common.sun', { defaultValue: 'Dom' }),
    ];
  }, [t]);

  // Calculate leading empty cells for week alignment (Monday start)
  const leadingEmptyCells = useMemo(() => {
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
    // Convert Sunday (0) to 7 for Monday-first grid
    const adjustedDay = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;
    return adjustedDay - 1;
  }, [year, month]);

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
          <button
            type="button"
            onClick={handleTodayClick}
            className="px-3 py-1.5 rounded-xl bg-(--accent) text-white text-xs font-semibold hover:bg-(--accent-hover) transition shadow-2xs cursor-pointer"
          >
            {t('diet_date_picker_today', { defaultValue: 'Oggi' })}
          </button>
          {onUpdateStartDate && (
            <button
              type="button"
              onClick={() => {
                setNewStartDateInput(state.startDate);
                setIsEditingStartDate(prev => !prev);
              }}
              className="px-3 py-1.5 rounded-xl bg-(--bg) border border-(--border) text-(--text-h) text-xs font-semibold hover:border-(--accent) hover:text-(--accent) transition shadow-2xs cursor-pointer"
            >
              {isEditingStartDate ? t('common.cancel', { defaultValue: 'Annulla' }) : t('diet_change_start_date_btn', { defaultValue: 'Inizio Piano' })}
            </button>
          )}
        </div>
      </div>

      {/* Start Date Editor Inline */}
      {isEditingStartDate && onUpdateStartDate && (
        <div className="mb-4 p-3.5 rounded-xl bg-(--bg) border border-(--border) shadow-inner flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs text-(--text) font-semibold whitespace-nowrap">
            {t('diet_start_date_label', { defaultValue: 'Nuova data inizio piano:' })}
          </span>
          <input
            type="date"
            value={newStartDateInput}
            onChange={(e) => setNewStartDateInput(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-(--code-bg) border border-(--border) text-(--text-h) text-xs focus:outline-none focus:ring-2 focus:ring-(--accent) flex-1 shadow-xs"
          />
          <button
            type="button"
            onClick={handleStartDateSubmit}
            className="px-4 py-1.5 rounded-xl bg-(--accent) text-white text-xs font-semibold hover:bg-(--accent-hover) transition shadow-xs cursor-pointer"
          >
            {t('common.save', { defaultValue: 'Salva' })}
          </button>
        </div>
      )}

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
      <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
        {weekdays.map((wd, i) => (
          <div key={i} className="text-xs font-extrabold text-(--text) uppercase tracking-wider py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Calendar Grid Days */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Leading empty cells for month alignment */}
        {Array.from({ length: leadingEmptyCells }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-24 sm:h-28 rounded-xl bg-(--bg)/30 border border-transparent opacity-30" />
        ))}

        {monthDays.map((dateStr) => {
          const dayPlan = daysMap.get(dateStr);
          const isSelected = currentSelectedDate === dateStr;
          const [y, m, d] = dateStr.split('-').map(Number);
          const dateObj = new Date(y, m - 1, d);
          const dayOfWeek = dateObj.getDay(); // 0: Sun, 6: Sat
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const holidayName = isItalianHoliday(dateStr);
          const saint = getSaintOfDay(dateStr);
          const moon = getMoonPhase(dateStr);
          const meta = calendarMeta[dateStr] || {};

          // Diet phase exclusive background color
          let phaseBgColor = 'bg-(--bg)';
          if (dayPlan) {
            if (dayPlan.phase === 'phase0') {
              phaseBgColor = 'bg-blue-500/10 dark:bg-blue-950/40';
            } else if (dayPlan.phase === 'phase1') {
              phaseBgColor = 'bg-purple-500/10 dark:bg-purple-950/40';
            } else if (dayPlan.phase === 'phase2') {
              phaseBgColor = 'bg-amber-500/10 dark:bg-amber-950/40';
            } else if (dayPlan.phase === 'phase3') {
              phaseBgColor = 'bg-emerald-500/10 dark:bg-emerald-950/40';
            }
          }

          return (
            <div
              key={dateStr}
              onClick={() => {
                if (dayPlan) {
                  onNavigateToDate(dateStr as DateKey);
                } else {
                  // Open modal automatically for non-phase days so user can add notes/birthdays/events/menstrual cycle
                  setActiveModalDate(dateStr);
                }
              }}
              onDoubleClick={() => setActiveModalDate(dateStr)}
              className={`relative h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl border transition-all duration-150 flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-(--accent)/15 border-(--accent) ring-2 ring-(--accent)/40 shadow-md scale-102 z-10'
                  : `${phaseBgColor} border-(--border) hover:border-(--accent) hover:bg-(--code-bg)`
              }`}
              title={`${dateStr} - ${saint} ${holidayName ? `(${holidayName})` : ''}`}
            >
              {/* Top row: Day number & Weekend badge / Completed check */}
              <div className="flex items-center justify-between">
                <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-(--accent)' : 'text-(--text-h)'}`}>
                  {d}
                </span>
                <div className="flex items-center gap-1">
                  {isWeekend && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded-full font-bold" title={dayOfWeek === 0 ? 'Domenica' : 'Sabato'}>
                      {dayOfWeek === 0 ? 'Dom' : 'Sab'}
                    </span>
                  )}
                  {dayPlan?.isCompleted && (
                    <span className="text-[10px] bg-green-500 text-white px-1 rounded-full font-bold" title="Completato">✓</span>
                  )}
                </div>
              </div>

              {/* Middle: Saint & Moon & Holiday */}
              <div className="text-[10px] text-(--text) line-clamp-2 leading-tight opacity-90 group-hover:opacity-100">
                {holidayName ? (
                  <span className="text-red-500 font-bold block truncate" title={holidayName}>🎉 {holidayName}</span>
                ) : (
                  <span className="truncate block" title={saint}>⛪ {saint}</span>
                )}
                <span className="flex items-center gap-1 mt-0.5" title={moon.name}>
                  <span>{moon.icon}</span>
                  <span className="opacity-70">{moon.name}</span>
                </span>
              </div>

              {/* Bottom indicators: notes, birthday, event, menstrual cycle */}
              <div className="flex items-center gap-1 pt-1 border-t border-(--border)/40 text-[10px]">
                {meta.note && <span title={meta.note}>📝</span>}
                {meta.birthday && <span title={meta.birthday}>🎂</span>}
                {meta.event && <span title={meta.event}>📌</span>}
                {meta.menstrualPhase && (
                  <span title={`Ciclo: ${meta.menstrualPhase}`}>
                    {meta.menstrualPhase === 'menstruation' ? '🩸' : meta.menstrualPhase === 'ovulation' ? '⭐' : '🔵'}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModalDate(dateStr);
                  }}
                  className="ml-auto opacity-0 group-hover:opacity-100 text-[10px] px-1 bg-(--accent) text-white rounded hover:bg-(--accent-hover) transition"
                  title="Aggiungi nota / evento / ciclo"
                >
                  +
                </button>
              </div>
            </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md p-6 rounded-2xl bg-(--code-bg) border border-(--border) shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-(--border)">
          <h3 className="text-base font-bold text-(--text-h)">
            {t('calendar_meta_title', { defaultValue: 'Dettagli Giorno' })}: {dateStr}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-(--text) hover:text-(--text-h) text-lg font-bold cursor-pointer"
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
              onClick={onClose}
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
