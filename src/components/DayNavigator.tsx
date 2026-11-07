import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPlanState, DateKey, DayPlan } from '../types/dietPlan';

interface DayNavigatorProps {
  state: DietPlanState;
  currentDayIndex: number;
  onNavigateToDate: (date: DateKey) => void;
}

export function DayNavigator({
  state,
  currentDayIndex,
  onNavigateToDate,
}: DayNavigatorProps) {
  const { t } = useTranslation();

  // Robust lookup for current day
  const currentDay = state.days.find(d => d.dayIndex === currentDayIndex) || state.days.find(d => d.dayIndex === 0) || state.days[0] || null;
  const startDateStr = state.startDate;

  // Helper to check if a date is a holiday
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

  // Helper to check if a date is a weekend (Saturday=6, Sunday=0)
  const isWeekend = (dateStr: string): boolean => {
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Available months derived from state.days or default to current month of currentDay / today
  const monthsMap = new Map<string, { year: number; month: number; label: string }>();
  state.days.forEach(day => {
    const d = new Date(day.date);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-11
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    if (!monthsMap.has(monthKey)) {
      const label = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      monthsMap.set(monthKey, { year, month, label });
    }
  });

  if (monthsMap.size === 0) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    monthsMap.set(monthKey, { year, month, label: now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) });
  }

  const availableMonths = Array.from(monthsMap.entries()).map(([key, val]) => ({ key, ...val }));

  // Selected month state
  const currentDayDateObj = currentDay ? new Date(currentDay.date) : new Date();
  const currentDayMonthKey = `${currentDayDateObj.getFullYear()}-${String(currentDayDateObj.getMonth() + 1).padStart(2, '0')}`;

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(() => {
    return availableMonths.some(m => m.key === currentDayMonthKey) ? currentDayMonthKey : (availableMonths[0]?.key || currentDayMonthKey);
  });

  const activeMonthKey = availableMonths.some(m => m.key === selectedMonthKey)
    ? selectedMonthKey
    : (availableMonths[0]?.key || currentDayMonthKey);

  const activeMonthObj = monthsMap.get(activeMonthKey) || {
    year: currentDayDateObj.getFullYear(),
    month: currentDayDateObj.getMonth(),
    label: currentDayDateObj.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
  };

  const handlePrevMonth = () => {
    const idx = availableMonths.findIndex(m => m.key === activeMonthKey);
    if (idx > 0) {
      setSelectedMonthKey(availableMonths[idx - 1].key);
    } else {
      // Generate previous month dynamically if needed
      const [y, m] = activeMonthKey.split('-').map(Number);
      const prevDate = new Date(y, m - 2, 1);
      const newYear = prevDate.getFullYear();
      const newMonth = prevDate.getMonth();
      const newKey = `${newYear}-${String(newMonth + 1).padStart(2, '0')}`;
      setSelectedMonthKey(newKey);
    }
  };

  const handleNextMonth = () => {
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
  };

  // Build calendar days for activeMonthObj (weeks starting on Monday)
  const year = activeMonthObj.year;
  const month = activeMonthObj.month;
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // JS getDay(): Sunday=0, Monday=1 ... Saturday=6.
  // Monday start index: (day + 6) % 7 (Monday=0, Sunday=6)
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month, 1 - i - 1);
    const dateStr = d.toISOString().split('T')[0];
    calendarDays.push({ dateStr, dayNum: d.getDate(), isCurrentMonth: false });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const d = new Date(year, month, dayNum);
    const dateStr = d.toISOString().split('T')[0];
    calendarDays.push({ dateStr, dayNum, isCurrentMonth: true });
  }

  // Next month leading days to complete weeks (multiples of 7)
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    const dateStr = d.toISOString().split('T')[0];
    calendarDays.push({ dateStr, dayNum: d.getDate(), isCurrentMonth: false });
  }

  // Group into weeks of 7
  const weeks: Array<Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }>> = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const getPhaseBadge = (phase?: string) => {
    switch (phase) {
      case 'phase0': return { label: 'P0', color: 'bg-blue-500 text-white' };
      case 'phase1': return { label: 'P1', color: 'bg-purple-500 text-white' };
      case 'phase2': return { label: 'P2', color: 'bg-amber-500 text-white' };
      case 'phase3': return { label: 'P3', color: 'bg-green-500 text-white' };
      default: return null;
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-(--code-bg) border border-(--border) shadow-sm mb-6">
      {/* Header & Month Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-(--border)">
        <div>
          <h3 className="text-sm font-bold text-(--text-h)">{t('diet_day_navigation', { defaultValue: 'Navigazione Calendario Dieta' })}</h3>
          {currentDay && (
            <div className="text-xs text-(--text) mt-0.5 flex items-center gap-2">
              <span className="font-medium">{t('diet_current_date', { defaultValue: 'Data Selezionata' })}:</span>
              <span className="text-(--text-h) font-semibold">
                {new Date(currentDay.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2 bg-(--bg) px-3 py-1.5 rounded-xl border border-(--border)">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded hover:bg-(--code-bg) text-(--text-h) transition"
            aria-label={t('common.previous_month', { defaultValue: 'Mese precedente' })}
          >
            ◀
          </button>
          <span className="text-xs font-bold text-(--text-h) px-2 capitalize min-w-[130px] text-center">
            {activeMonthObj.label}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded hover:bg-(--code-bg) text-(--text-h) transition"
            aria-label={t('common.next_month', { defaultValue: 'Mese successivo' })}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Weekday headers starting on Monday */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-(--text-h) uppercase tracking-wider">
        <span>{t('days.mon', { defaultValue: 'Lun' })}</span>
        <span>{t('days.tue', { defaultValue: 'Mar' })}</span>
        <span>{t('days.wed', { defaultValue: 'Mer' })}</span>
        <span>{t('days.thu', { defaultValue: 'Gio' })}</span>
        <span>{t('days.fri', { defaultValue: 'Ven' })}</span>
        <span>{t('days.sat', { defaultValue: 'Sab' })}</span>
        <span>{t('days.sun', { defaultValue: 'Dom' })}</span>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-col gap-2">
        {weeks.map((weekDays, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-2">
            {weekDays.map(({ dateStr, dayNum, isCurrentMonth }) => {
              const dayPlan: DayPlan | undefined = state.days.find(d => d.date === dateStr);
              const isSelected = currentDay?.date === dateStr;
              const isToday = dateStr === todayStr;
              const isStartDate = dateStr === startDateStr;
              const isCompleted = dayPlan?.isCompleted;
              const isHolidayDate = isHoliday(dateStr);
              const isWeekendDate = isWeekend(dateStr);
              const phaseBadge = getPhaseBadge(dayPlan?.phase);

              return (
                <button
                  key={dateStr}
                  onClick={() => onNavigateToDate(dateStr)}
                  className={`p-2 rounded-xl text-xs transition flex flex-col items-center justify-between border relative min-h-[70px] ${
                    isSelected
                      ? 'bg-(--accent) text-white font-bold border-(--accent) shadow-md ring-2 ring-white/30 scale-[1.02] z-10'
                      : isToday
                      ? 'bg-(--accent)/10 border-(--accent) text-(--text-h) font-bold ring-1 ring-(--accent)/50'
                      : isCompleted
                      ? 'bg-purple-600 text-white font-medium border-purple-700 shadow-xs'
                      : isHolidayDate
                      ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200 border-red-400 font-semibold'
                      : isWeekendDate
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300'
                      : isCurrentMonth
                      ? 'bg-(--code-bg) text-(--text) border-(--border) hover:border-(--accent) hover:text-(--text-h)'
                      : 'bg-(--bg)/40 text-(--text)/40 border-(--border)/50 hover:opacity-75'
                  }`}
                  title={`${dateStr}${isStartDate ? ' (Inizio Dieta)' : ''}${isHolidayDate ? ' 🎄 Festivo' : ''}`}
                >
                  {/* Top badges */}
                  <div className="flex items-center justify-between w-full text-[9px] mb-0.5">
                    {isStartDate ? (
                      <span className="px-1 rounded bg-emerald-500 text-white font-extrabold tracking-tighter" title="Inizio Dieta">INIZIO</span>
                    ) : isToday ? (
                      <span className="px-1 rounded bg-(--accent) text-white font-bold tracking-tighter">OGGI</span>
                    ) : (
                      <span></span>
                    )}
                    {phaseBadge && (
                      <span className={`px-1 rounded text-[8px] font-bold ${isSelected ? 'bg-white/30 text-white' : phaseBadge.color}`}>
                        {phaseBadge.label}
                      </span>
                    )}
                  </div>

                  {/* Day number */}
                  <span className={`text-sm font-bold ${isSelected || isCompleted ? 'text-white' : 'text-(--text-h)'}`}>
                    {dayNum}
                  </span>

                  {/* Bottom indicators */}
                  <div className="flex items-center gap-1 text-[10px]">
                    {isHolidayDate && <span title="Festivo">🎄</span>}
                    {isCompleted && <span className="font-bold" title="Completato">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Legend & Current Day summary */}
      <div className="mt-4 pt-3 border-t border-(--border) flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-(--text)">
        <span>
          {currentDay ? (
            <>
              <span className="font-medium">{t('diet_current_day', { defaultValue: 'Giorno corrente' })}:</span>{' '}
              <strong className="text-(--text-h)">
                {currentDay.dayIndex >= 0 ? `Day ${currentDay.dayIndex + 1}` : `Pre-Start (${currentDay.dayIndex})`}
              </strong>
              {' '}({Math.max(1, state.days.filter(d => d.dayIndex >= 0).length)} totali)
            </>
          ) : (
            t('diet_no_active_day', { defaultValue: 'Nessun giorno selezionato' })
          )}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 font-semibold text-[10px]">
            🌱 Inizio Dieta
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200 border border-red-300 font-semibold text-[10px]">
            🎄 Festivi
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 font-semibold text-[10px]">
            📅 Weekend
          </span>
        </div>
      </div>
    </div>
  );
}
