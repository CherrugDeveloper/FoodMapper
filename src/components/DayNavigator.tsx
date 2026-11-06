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

  const currentDay = state.days[currentDayIndex];

  // Helper function to check if a date is a holiday
  const isHoliday = (date: string): boolean => {
    const [, monthStr, dayStr] = date.split('-');
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const holidays = [
      { month: 1, day: 1 }, // New Year's Day
      { month: 1, day: 6 }, // Epiphany (6th January)
      { month: 4, day: 25 }, // Liberation Day
      { month: 5, day: 1 }, // Labour Day
      { month: 6, day: 2 }, // Republic Day
      { month: 8, day: 15 }, // Assumption
      { month: 11, day: 1 }, // All Saints' Day
      { month: 12, day: 8 }, // Immaculate Conception
      { month: 12, day: 25 }, // Christmas
      { month: 12, day: 26 }, // St. Stephen's Day
    ];
    return holidays.some(h => h.month === month && h.day === day);
  };

  // Helper function to check if a date is a weekend (Saturday=6, Sunday=0)
  const isWeekend = (date: string): boolean => {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Compute week information (guaranteed multiples of 7 weeks e.g. 28 days = 4 weeks)
  const totalWeeks = Math.ceil(state.days.length / 7);
  const currentWeek = Math.floor(currentDayIndex / 7) + 1;

  return (
    <div className="p-4 rounded-2xl bg-(--code-bg) border border-(--border) shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-(--text-h)">{t('diet_day_navigation')}</h3>
        {currentDay && (
          <div className="text-xs text-(--text)">
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
      </div>

      {/* Day navigation rows - week-per-row layout with week labels and prominent holiday highlighting */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: totalWeeks }, (_, weekIdx) => {
          const weekDays = state.days.slice(weekIdx * 7, (weekIdx + 1) * 7);
          const isWeekActive = currentWeek === weekIdx + 1;
          return (
            <div
              key={weekIdx}
              className={`p-3 rounded-xl border transition-all ${
                isWeekActive
                  ? 'bg-(--accent)/5 border-(--accent)/40 shadow-xs ring-1 ring-(--accent)/30'
                  : 'bg-(--bg) border-(--border)'
              }`}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-(--text-h) uppercase tracking-wider">
                    {t('diet_week_label', { defaultValue: 'Settimana' })} {weekIdx + 1}
                  </span>
                  <span className="text-[10px] text-(--text) opacity-70">
                    ({weekDays[0]?.date} — {weekDays[weekDays.length - 1]?.date})
                  </span>
                </div>
                {isWeekActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent) text-white font-medium shadow-xs">
                    {t('diet_current_week', { defaultValue: 'Settimana Corrente' })}
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
                  const isWeekendDate = isWeekend(day.date);
                  const dayLabel = `${t('diet_day_label', { day: day.dayIndex + 1 })}${isWeekendDate ? ' 📅' : ''}`;
                  const dayTitle = `${day.date}${isHolidayDate ? ' 🎄 (Giorno Festivo)' : ''}${isWeekendDate && !isHolidayDate ? ' (Weekend)' : ''}`;

                  return (
                    <button
                      key={day.dayIndex}
                      onClick={() => onNavigateToDate(day.date)}
                      className={`p-2 rounded-lg text-xs transition flex flex-col items-center justify-center border relative overflow-hidden ${
                        isCurrent
                          ? 'bg-(--accent) text-white font-bold border-(--accent) shadow-md ring-2 ring-white/20 scale-[1.02]'
                          : isCompleted
                          ? 'bg-purple-600 text-white font-medium border-purple-700 shadow-xs'
                          : isHolidayDate
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200 border-red-400 dark:border-red-600 font-bold hover:bg-red-200 dark:hover:bg-red-900/80 shadow-xs ring-1 ring-red-400/50'
                          : isWeekendDate
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-600 font-medium hover:bg-amber-200 dark:hover:bg-amber-800/80 shadow-xs ring-1 ring-amber-400/50'
                          : 'bg-(--code-bg) text-(--text) border-(--border) hover:border-(--accent) hover:text-(--text-h)'
                      }`}
                      title={dayTitle}
                    >
                      {isHolidayDate && (
                        <div className="absolute top-0 right-0 left-0 bg-red-500 text-white text-[9px] font-bold py-0.5 text-center tracking-tighter">
                          🎄 FESTIVO
                        </div>
                      )}
                      <span className={`uppercase font-semibold ${isHolidayDate ? 'mt-3' : ''}`}>{dayName}</span>
                      <span className="text-[11px] opacity-90">{dayLabel}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {isCompleted && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-(--border) flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-(--text)">
        <span>
          {t('diet_current_day', {
            day: currentDayIndex + 1,
            total: state.days.length,
          })}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-800 dark:border-red-300 dark:text-red-200 border border-red-300 font-semibold text-[10px]">
              🎄 {t('diet_holiday_legend', { defaultValue: 'Giorni Festivi' })}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-600 font-semibold text-[10px]">
              📅 {t('diet_weekend_legend', { defaultValue: 'Weekend' })}
            </span>
          </div>
          <span className="italic text-[11px] opacity-75">
            {t('diet_weeks_total', { count: totalWeeks, defaultValue: `${totalWeeks} settimane (28 gg)` })}
          </span>
        </div>
      </div>
    </div>
  );
}
