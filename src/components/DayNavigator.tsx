import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPlanState, DateKey } from '../types/dietPlan';

interface DayNavigatorProps {
  state: DietPlanState;
  currentDayIndex: number;
  onNavigateToDate: (date: DateKey) => void;
  onUpdateStartDate?: (newStartDate: string) => void;
}

export function DayNavigator({
  state,
  currentDayIndex,
  onNavigateToDate,
  onUpdateStartDate,
}: DayNavigatorProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(
    state.days[currentDayIndex]?.date || state.startDate
  );
  const [isEditingStartDate, setIsEditingStartDate] = useState(false);
  const [newStartDateInput, setNewStartDateInput] = useState(state.startDate);

  // Synchronize selectedDate when currentDayIndex changes
  useEffect(() => {
    const currentDay = state.days[currentDayIndex];
    if (currentDay?.date) {
      setSelectedDate(currentDay.date);
    }
  }, [currentDayIndex]);

  const handleStartDateSubmit = useCallback(() => {
    if (newStartDateInput && onUpdateStartDate) {
      onUpdateStartDate(newStartDateInput);
      setIsEditingStartDate(false);
    }
  }, [newStartDateInput, onUpdateStartDate]);

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

  // Compute week information
  const totalWeeks = Math.ceil(state.days.length / 7) || 1;
  const currentWeek = Math.floor(currentDayIndex / 7) + 1;

  return (
    <div className="p-4 rounded-2xl bg-(--code-bg) border border-(--border) shadow-sm mb-6">
      <h3 className="text-sm font-bold text-(--text-h) mb-3">{t('diet_day_navigation')}</h3>

      {/* Date Picker Section & Start Date Toggle */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
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
              className="px-3 py-2 rounded-xl bg-(--bg) border border-(--border) text-(--text-h) text-sm focus:outline-none focus:ring-2 focus:ring-(--accent) shadow-sm"
              placeholder={t('diet_date_picker_placeholder')}
            />
          </label>
          <div className="flex gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleToday}
              className="px-4 py-2 rounded-xl bg-(--accent) text-white text-sm font-medium hover:bg-(--accent-hover) transition shadow-sm border border-transparent cursor-pointer"
            >
              {t('diet_date_picker_today')}
            </button>
            {onUpdateStartDate && (
              <button
                type="button"
                onClick={() => {
                  setNewStartDateInput(state.startDate);
                  setIsEditingStartDate(prev => !prev);
                }}
                className="px-3 py-2 rounded-xl bg-(--code-bg) border border-(--border) text-(--text-h) text-sm font-medium hover:border-(--accent) hover:text-(--accent) transition shadow-sm cursor-pointer"
                title={t('diet_change_start_date', { defaultValue: 'Modifica data inizio' })}
              >
                {isEditingStartDate ? t('common.cancel', { defaultValue: 'Annulla' }) : t('diet_change_start_date_btn', { defaultValue: 'Cambia Inizio' })}
              </button>
            )}
          </div>
        </div>

        {/* Lightweight Start Date Editor Inline Container */}
        {isEditingStartDate && onUpdateStartDate && (
          <div className="p-3 rounded-xl bg-(--bg) border border-(--border) shadow-inner flex flex-col sm:flex-row items-center gap-2">
            <span className="text-xs text-(--text) font-medium whitespace-nowrap">
              {t('diet_start_date_label', { defaultValue: 'Nuova data inizio piano:' })}
            </span>
            <input
              type="date"
              value={newStartDateInput}
              onChange={(e) => setNewStartDateInput(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-(--code-bg) border border-(--border) text-(--text-h) text-sm focus:outline-none focus:ring-2 focus:ring-(--accent) flex-1 shadow-sm"
            />
            <button
              type="button"
              onClick={handleStartDateSubmit}
              className="px-3 py-1.5 rounded-xl bg-(--accent) text-white text-xs font-semibold hover:bg-(--accent-hover) transition shadow-sm cursor-pointer"
            >
              {t('common.save', { defaultValue: 'Salva' })}
            </button>
          </div>
        )}
      </div>

      {/* Current Date Indicator */}
      {currentDay && (
        <div className="mb-4 text-sm text-(--text) px-1">
          <span className="font-medium">{t('diet_current_date')}: </span>
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

      {/* Week indicator */}
      <div className="mb-4 px-1">
        <h4 className="text-sm font-semibold text-(--text-h) mb-2">
          Settimana {currentWeek} di {totalWeeks}
        </h4>
      </div>

      {/* Quick Day Navigation Buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        {state.days.map((day, idx) => {
          const isCurrent = idx === currentDayIndex;
          const isCompleted = day.isCompleted;
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });

          return (
            <button
              key={day.dayIndex}
              type="button"
              onClick={() => onNavigateToDate(day.date)}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm border transition-all duration-150 flex flex-col items-center shadow-sm cursor-pointer ${
                isCurrent
                  ? 'bg-(--accent) text-white font-bold border-(--accent) shadow-md ring-2 ring-white/25'
                  : isCompleted
                  ? 'bg-purple-600 text-white font-bold border-purple-700 shadow-md'
                  : 'bg-(--bg) border-(--border) text-(--text) hover:text-(--text-h) hover:border-(--accent)'
              }`}
              title={day.date}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium capitalize">{dayName}</span>
                <span className="text-[11px] opacity-80">{t('diet_day_label', { day: day.dayIndex + 1 })}</span>
                {isCompleted && (
                  <span className="text-[11px] text-white/95 font-bold mt-0.5">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-(--text) px-1">
        {t('diet_current_day', {
          day: currentDayIndex + 1,
          total: state.days.length,
        })}
      </div>
    </div>
  );
}
