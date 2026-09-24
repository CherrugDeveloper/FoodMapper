import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPlanState, DateKey } from '../types/dietPlan';

interface DayNavigatorProps {
  state: DietPlanState;
  currentDayIndex: number;
  onNavigate: (delta: number) => void;
  onNavigateToDate: (date: DateKey) => void;
}

export function DayNavigator({
  state,
  currentDayIndex,
  onNavigate,
  onNavigateToDate,
}: DayNavigatorProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(
    state.days[currentDayIndex]?.date || state.startDate
  );

  const navigateDay = useCallback(
    (delta: number) => {
      onNavigate(delta);
    },
    [onNavigate]
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

      {/* Quick Day Navigation Buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        {state.days.map((day, idx) => {
          const isCurrent = idx === currentDayIndex;
          const date = new Date(day.date);
          const formattedDate = date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });
          return (
            <button
              key={day.dayIndex}
              onClick={() => navigateDay(idx - currentDayIndex)}
              className={`px-4 py-2 rounded text-sm ${isCurrent
                  ? 'bg-(--accent) text-white font-medium'
                  : 'text-(--text) hover:text-(--text-h) hover:bg-(--accent-border)'}`}
              title={day.date}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium">{formattedDate}</span>
                <span className="text-xs text-(--text)/70">Day {day.dayIndex + 1}</span>
              </div>
            </button>
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