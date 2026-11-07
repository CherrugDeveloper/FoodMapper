import { useState, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPlanState, DateKey, DayPlan } from '../types/dietPlan';
import { getSaintOfDay, getMoonPhase } from '../utils/calendarHelpers';

interface DayNavigatorProps {
  state: DietPlanState;
  currentDayIndex: number;
  onNavigateToDate: (date: DateKey) => void;
}

// Helper to parse local date string YYYY-MM-DD avoiding UTC timezone shifts
const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Helper functions extracted outside component to avoid recreation
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
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const getPhaseInfo = (phase?: string) => {
  switch (phase) {
    case 'phase0':
      return { name: 'Preparazione', bg: 'bg-blue-50/90 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100' };
    case 'phase1':
      return { name: 'Eliminazione', bg: 'bg-purple-50/90 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-100' };
    case 'phase2':
      return { name: 'Reintroduzione', bg: 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-100' };
    case 'phase3':
      return { name: 'Mantenimento', bg: 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100' };
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
  onNavigateToDate: (date: DateKey) => void;
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
  onNavigateToDate,
}: DayCellProps) {
  const saint = useMemo(() => getSaintOfDay(dateStr), [dateStr]);
  const moon = useMemo(() => getMoonPhase(dateStr), [dateStr]);

  return (
    <button
      onClick={() => onNavigateToDate(dateStr)}
      className={`p-2 rounded-2xl text-xs transition-all duration-150 flex flex-col items-center justify-between border relative min-h-24 shadow-xs cursor-pointer ${
        !isCurrentMonth
          ? 'bg-(--bg)/20 text-(--text)/30 border-(--border)/30 opacity-40 hover:opacity-75'
          : isSelected
          ? 'bg-(--accent) text-white font-black border-(--accent) shadow-lg ring-2 ring-white/40 scale-[1.03] z-10'
          : isToday
          ? 'bg-(--accent)/20 border-(--accent) text-(--text-h) font-extrabold ring-2 ring-(--accent)/60 shadow-sm'
          : isCompleted
          ? 'bg-purple-600 hover:bg-purple-700 text-white font-bold border-purple-700 shadow-sm'
          : phaseInfo
          ? `${phaseInfo.bg} ${isWeekendDate ? 'ring-2 ring-amber-400/70 dark:ring-amber-500/60' : ''}`
          : isHolidayDate
          ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 font-semibold'
          : isWeekendDate
          ? 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
          : 'bg-(--code-bg) text-(--text) border-(--border) hover:border-(--accent) hover:text-(--text-h) hover:shadow-md'
      }`}
      title={`${dateStr} | ${saint} | ${moon.name}${isStartDate ? ' (Inizio Dieta)' : ''}${phaseInfo ? ` [${phaseInfo.name}]` : ''}${isHolidayDate ? ' 🎄 Festivo' : ''}`}
    >
      <div className="flex items-center justify-between w-full text-[9px] mb-0.5">
        {isStartDate ? (
          <span className="px-1 py-0.2 rounded bg-emerald-500 text-white font-black tracking-tighter shadow-xs" title="Inizio Dieta">INIZIO</span>
        ) : isToday ? (
          <span className="px-1 py-0.2 rounded bg-(--accent) text-white font-black tracking-tighter">OGGI</span>
        ) : isWeekendDate ? (
          <span className="text-[10px]" title="Weekend">Weekend</span>
        ) : (
          <span />
        )}
        <span title={moon.name}>{moon.icon}</span>
      </div>

      <span className={`text-base font-black ${!isCurrentMonth ? 'opacity-50' : isSelected || isCompleted ? 'text-white' : 'text-(--text-h)'}`}>
        {dayNum}
      </span>

      <div className="flex flex-col items-center gap-0.5 w-full text-[9px] mt-0.5 truncate">
        <span className="truncate w-full text-center opacity-80 font-medium" title={saint}>
          {saint}
        </span>
        <div className="flex items-center gap-1">
          {isHolidayDate && <span title="Festivo">🎄</span>}
          {isCompleted && <span className="font-black text-white" title="Completato">✓</span>}
        </div>
      </div>
    </button>
  );
});

export function DayNavigator({
  state,
  currentDayIndex,
  onNavigateToDate,
}: DayNavigatorProps) {
  const { t } = useTranslation();

  // Robust lookup for current day using memoized find
  const currentDay = useMemo(() => {
    return state.days.find(d => d.dayIndex === currentDayIndex) || 
           state.days.find(d => d.dayIndex === 0) || 
           state.days[0] || 
           null;
  }, [state.days, currentDayIndex]);

  const startDateStr = state.startDate;

  // Memoized day lookup map for O(1) access
  const daysMap = useMemo(() => {
    const map = new Map<string, DayPlan>();
    state.days.forEach(d => map.set(d.date, d));
    return map;
  }, [state.days]);

  // Available months derived from state.days
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

  // Selected month state
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

  // Build calendar days for activeMonthObj (weeks starting on Monday)
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
          onClick={handleNextMonth}
          className="p-1.5 rounded-xl hover:bg-(--code-bg) text-(--text-h) transition font-bold cursor-pointer"
          aria-label={t('common.next_month', { defaultValue: 'Mese successivo' })}
        >
          ▶
        </button>
      </div>

      {/* Phase Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-[11px] font-semibold">
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
          <span>{t('diet_phase0', { defaultValue: 'Fase 0: Prep' })}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-100 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>
          <span>{t('diet_phase1', { defaultValue: 'Fase 1: Eliminazione' })}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-100 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0"></span>
          <span>{t('diet_phase2', { defaultValue: 'Fase 2: Reintroduzione' })}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
          <span>{t('diet_phase3', { defaultValue: 'Fase 3: Mantenimento' })}</span>
        </div>
      </div>

      {/* Weekday headers starting on Monday */}
      <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-black text-(--text-h) uppercase tracking-wider">
        <span className="py-1">{t('days.mon', { defaultValue: 'Lun' })}</span>
        <span className="py-1">{t('days.tue', { defaultValue: 'Mar' })}</span>
        <span className="py-1">{t('days.wed', { defaultValue: 'Mer' })}</span>
        <span className="py-1">{t('days.thu', { defaultValue: 'Gio' })}</span>
        <span className="py-1">{t('days.ven', { defaultValue: 'Ven' })}</span>
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
              const phaseInfo = dayPlan && dayPlan.dayIndex >= 0 ? getPhaseInfo(dayPlan.phase) : null;

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
                  onNavigateToDate={onNavigateToDate}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
