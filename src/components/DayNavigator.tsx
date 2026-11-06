import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPlanState, DateKey } from '../types/dietPlan';

interface DayNavigatorProps {
  state: DietPlanState;
  currentDayIndex: number;
  onNavigate?: (delta: number) => void;
  onNavigateToDate: (date: DateKey) => void;
}

export function DayNavigator({
  state,
  currentDayIndex,
  onNavigateToDate,
}: DayNavigatorProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(
    state.days[currentDayIndex]?.date || state.startDate
  );

  // Compute available date range from generated days
  const availableDates = useMemo(() => {
    return state.days.map(day => day.date);
  }, [state.days]);

  const minDate = availableDates.length > 0 ? availableDates[0] : state.startDate;
  const maxDate = availableDates.length > 0
    ? availableDates[availableDates.length - 1]
    : state.startDate;

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      if (!newDate) return;
      setSelectedDate(newDate);
      onNavigateToDate(newDate as DateKey);
    },
    [onNavigateToDate]
  );

  const handleToday = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    onNavigateToDate(today as DateKey);
  }, [onNavigateToDate]);

  const currentDay = state.days[currentDayIndex];

  // Helper function to check if a date is a holiday
  const isHoliday = (date: string): boolean => {
    const [, monthStr, dayStr] = date.split('-');
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const holidays = [
      { month: 1, day: 1 }, // New Year's Day
      { month: 6, day: 2 }, // Epiphany
      { month: 4, day: 25 }, // Liberation Day
      { month: 2, day: 1 }, // Republic Day
      { month: 8, day: 15 }, // Assumption
      { month: 8, day: 8 }, // Immaculate Conception
      { month: 12, day: 8 }, // Immaculate Conception (optional)
      { month: 12, day: 25 }, // Christmas
      { month: 12, day: 26 }, // St. Stephen's Day
    ];
    return holidays.some(h => h.month === month && h.day === day);
  };

  // Compute week information
  const totalWeeks = Math.ceil(state.days.length / 7);
  const currentWeek = Math.floor(currentDayIndex / 7) + 1;

  return (
    <div className="p-4 rounded-2xl bg-(--code-bg) border border-(--border) shadow-sm mb-6">
      <h3 className="text-sm font-bold text-(--text-h) mb-3">{t('diet_day_navigation')}</h3>

      {/* Date Picker Section */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
        <label className="flex flex-col gap-1 flex-1">
          <span className="text-xs text-(--text) font-medium">
            {t('diet_date_picker_label')}
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={minDate}
            max={maxDate}
            className="px-3 py-2 rounded-lg bg-(--bg) border border-(--border) text-(--text-h) text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
            placeholder={t('diet_date_picker_placeholder')}
          />
        </label>
        <button
          onClick={handleToday}
          className="px-4 py-2 rounded-lg bg-(--accent) text-white text-sm font-medium hover:bg-(--accent-hover) transition self-end sm:self-center"
        >
          {t('diet_date_picker_today')}
        </button>
      </div>

      {/* Current Date Indicator */}
      {currentDay && (
        <div className="mb-4 text-sm text-(--text)">
          <span className="font-medium">{t('diet_current_date')}: </span>
          <span className="text-(--text-h)">
            {new Date(currentDay.date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      )}

      {/* Day navigation rows - week-per-row layout with week labels and holiday highlighting */}
      <div className="flex flex-col gap-5">
        {Array.from({ length: totalWeeks }, (_, weekIdx) => {
          const weekDays = state.days.slice(weekIdx * 7, (weekIdx + 1) * 7);
          const isWeekActive = currentWeek === weekIdx + 1;
          return (
            <div
              key={weekIdx}
              className={`p-3 rounded-xl border transition-all ${
                isWeekActive
                  ? 'bg-(--accent)/5 border-(--accent)/40 shadow-xs'
                  : 'bg-(--bg) border-(--border)'
              }`}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-(--text-h) uppercase tracking-wider">
                  {t('diet_week_label', { defaultValue: 'Settimana' })} {weekIdx + 1}
                </span>
                {isWeekActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent) text-white font-medium">
                    {t('diet_current_week', { defaultValue: 'Corrente' })}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const isCurrent = day.dayIndex === currentDayIndex;
                  const isCompleted = day.isCompleted;
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
                  const isHolidayDate = isHoliday(day.date);

                  return (
                    <button
                      key={day.dayIndex}
                      onClick={() => onNavigateToDate(day.date)}
                      className={`p-2 rounded-lg text-xs transition flex flex-col items-center justify-center border ${
                        isCurrent
                          ? 'bg-(--accent) text-white font-bold border-(--accent) shadow-sm'
                          : isCompleted
                          ? 'bg-purple-600 text-white font-medium border-purple-700'
                          : isHolidayDate
                          ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 font-semibold hover:bg-red-100 dark:hover:bg-red-900/40'
                          : 'bg-(--code-bg) text-(--text) border-(--border) hover:border-(--accent) hover:text-(--text-h)'
                      }`}
                      title={`${day.date}${isHolidayDate ? ' (Festivo)' : ''}`}
                    >
                      <span className="uppercase font-semibold">{dayName}</span>
                      <span className="text-[11px] opacity-80">{t('diet_day_label', { day: day.dayIndex + 1 })}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {isCompleted && <span className="text-[10px]">✓</span>}
                        {isHolidayDate && <span className="text-[10px]" title="Festivo">🎄</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-(--text)">
        {t('diet_current_day', {
          day: currentDayIndex + 1,
          total: state.days.length,
        })}
      </div>
    </div>
  );
}