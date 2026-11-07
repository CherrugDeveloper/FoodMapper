import { useState, useMemo } from 'react';
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

  // Helper to parse local date string YYYY-MM-DD avoiding UTC timezone shifts
  const parseLocalDate = (dateStr: string): Date => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const formatLocalDate = (dateStr: string, options: Intl.DateTimeFormatOptions): string => {
    return parseLocalDate(dateStr).toLocaleDateString(undefined, options);
  };

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
    const dateObj = parseLocalDate(dateStr);
    const dayOfWeek = dateObj.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Memoized O(1) day lookup map
  const daysMap = useMemo(() => {
    const map = new Map<string, DayPlan>();
    state.days.forEach(d => map.set(d.date, d));
    return map;
  }, [state.days]);

  // Available months derived from state.days or default to current month of currentDay / today
  const monthsMap = new Map<string, { year: number; month: number; label: string }>();
  state.days.forEach(day => {
    const d = parseLocalDate(day.date);
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
  const currentDayDateObj = currentDay ? parseLocalDate(currentDay.date) : new Date();
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

  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month, 1 - i - 1);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum: d.getDate(), isCurrentMonth: false });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const d = new Date(year, month, dayNum);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum, isCurrentMonth: true });
  }

  // Next month leading days to complete weeks (multiples of 7)
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum: d.getDate(), isCurrentMonth: false });
  }

  // Group into weeks of 7
  const weeks: Array<Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }>> = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const nowLocal = new Date();
  const todayStr = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, '0')}-${String(nowLocal.getDate()).padStart(2, '0')}`;

  const getPhaseBadge = (phase?: string) => {
    switch (phase) {
      case 'phase0': return { label: 'P0', color: 'bg-blue-500 text-white shadow-xs' };
      case 'phase1': return { label: 'P1', color: 'bg-purple-500 text-white shadow-xs' };
      case 'phase2': return { label: 'P2', color: 'bg-amber-500 text-white shadow-xs' };
      case 'phase3': return { label: 'P3', color: 'bg-emerald-500 text-white shadow-xs' };
      default: return null;
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-(--code-bg) border border-(--border) shadow-md mb-6 backdrop-blur-md">
      {/* Header & Month Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 pb-4 border-b border-(--border)">
        <div>
          <h3 className="text-base font-extrabold text-(--text-h) flex items-center gap-2">
            <span>📅</span> {t('diet_day_navigation', { defaultValue: 'Navigazione Calendario Dieta' })}
          </h3>
          {currentDay && (
            <div className="text-xs text-(--text) mt-1 flex items-center gap-2">
              <span className="font-medium">{t('diet_current_date', { defaultValue: 'Data Selezionata' })}:</span>
              <span className="text-(--text-h) font-bold capitalize">
                {formatLocalDate(currentDay.date, {
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
        <div className="flex items-center gap-3 bg-(--bg) px-4 py-2 rounded-2xl border border-(--border) shadow-inner">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl hover:bg-(--code-bg) text-(--text-h) transition font-bold"
            aria-label={t('common.previous_month', { defaultValue: 'Mese precedente' })}
          >
            ◀
          </button>
          <span className="text-sm font-extrabold text-(--text-h) px-3 capitalize min-w-[150px] text-center tracking-wide">
            {activeMonthObj.label}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl hover:bg-(--code-bg) text-(--text-h) transition font-bold"
            aria-label={t('common.next_month', { defaultValue: 'Mese successivo' })}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Weekday headers starting on Monday */}
      <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-black text-(--text-h) uppercase tracking-wider">
        <span className="py-1">{t('days.mon', { defaultValue: 'Lun' })}</span>
        <span className="py-1">{t('days.tue', { defaultValue: 'Mar' })}</span>
        <span className="py-1">{t('days.wed', { defaultValue: 'Mer' })}</span>
        <span className="py-1">{t('days.thu', { defaultValue: 'Gio' })}</span>
        <span className="py-1">{t('days.fri', { defaultValue: 'Ven' })}</span>
        <span className="py-1 text-amber-600 dark:text-amber-400">{t('days.sat', { defaultValue: 'Sab' })}</span>
        <span className="py-1 text-red-600 dark:text-red-400">{t('days.sun', { defaultValue: 'Dom' })}</span>
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
              const phaseBadge = dayPlan && dayPlan.dayIndex >= 0 ? getPhaseBadge(dayPlan.phase) : null;

              return (
                <button
                  key={dateStr}
                  onClick={() => onNavigateToDate(dateStr)}
                  className={`p-2.5 rounded-2xl text-xs transition-all duration-200 flex flex-col items-center justify-between border relative min-h-[82px] shadow-xs ${
                    isSelected
                      ? 'bg-(--accent) text-white font-black border-(--accent) shadow-lg ring-2 ring-white/40 scale-[1.03] z-10'
                      : isToday
                      ? 'bg-(--accent)/15 border-(--accent) text-(--text-h) font-extrabold ring-2 ring-(--accent)/60 shadow-sm'
                      : isCompleted
                      ? 'bg-purple-600 hover:bg-purple-700 text-white font-bold border-purple-700 shadow-sm'
                      : isHolidayDate
                      ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 font-semibold'
                      : isWeekendDate
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50'
                      : isCurrentMonth
                      ? 'bg-(--code-bg) text-(--text) border-(--border) hover:border-(--accent) hover:text-(--text-h) hover:shadow-md'
                      : 'bg-(--bg)/40 text-(--text)/35 border-(--border)/40 hover:opacity-80'
                  }`}
                  title={`${dateStr}${isStartDate ? ' (Inizio Dieta)' : ''}${isHolidayDate ? ' 🎄 Festivo' : ''}`}
                >
                  {/* Top badges */}
                  <div className="flex items-center justify-between w-full text-[9px] mb-1">
                    {isStartDate ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white font-black tracking-tighter shadow-xs" title="Inizio Dieta">INIZIO</span>
                    ) : isToday ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-(--accent) text-white font-black tracking-tighter">OGGI</span>
                    ) : (
                      <span></span>
                    )}
                    {phaseBadge && (
                      <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${isSelected ? 'bg-white/30 text-white' : phaseBadge.color}`}>
                        {phaseBadge.label}
                      </span>
                    )}
                  </div>

                  {/* Day number */}
                  <span className={`text-base font-black ${isSelected || isCompleted ? 'text-white' : 'text-(--text-h)'}`}>
                    {dayNum}
                  </span>

                  {/* Bottom indicators */}
                  <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                    {isHolidayDate && <span title="Festivo">🎄</span>}
                    {isCompleted && <span className="font-black text-white" title="Completato">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Legend & Current Day summary */}
      <div className="mt-5 pt-4 border-t border-(--border) flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 text-xs text-(--text)">
        <div className="flex items-center gap-2">
          {currentDay ? (
            <>
              <strong className="text-(--text-h) font-extrabold px-2 py-0.5 rounded-lg bg-(--bg) border border-(--border)">
                {currentDay.dayIndex >= 0
                  ? t('diet_current_day', { day: currentDay.dayIndex + 1, total: state.days.filter(d => d.dayIndex >= 0).length })
                  : `${t('diet_pre_start', { defaultValue: 'Pre-Inizio' })} (${currentDay.dayIndex})`}
              </strong>
            </>
          ) : (
            t('diet_no_active_day', { defaultValue: 'Nessun giorno selezionato' })
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
            🌱 Inizio Dieta
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200 border border-red-300 font-bold text-[11px]">
            🎄 Festivi
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 font-bold text-[11px]">
            📅 Weekend
          </span>
        </div>
      </div>
    </div>
  );
}
