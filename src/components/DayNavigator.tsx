import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { DietPlanState } from '../types/dietPlan';

interface DayNavigatorProps {
  state: DietPlanState;
  currentDayIndex: number;
  onNavigate: (delta: number) => void;
}

export function DayNavigator({ state, currentDayIndex, onNavigate }: DayNavigatorProps) {
  const { t } = useTranslation();

  const navigateDay = useCallback((delta: number) => {
    onNavigate(delta);
  }, [onNavigate]);

  return (
    <div className="p-4 rounded-2xl bg-(--code-bg) border border-(--border) shadow-sm mb-6">
      <h3 className="text-sm font-bold text-(--text-h) mb-3">{t('diet_day_navigation')}</h3>
      <div className="flex gap-2 flex-wrap justify-center">
        {state.days.map((day, idx) => (
          <button
            key={day.dayIndex}
            onClick={() => navigateDay(idx - currentDayIndex)}
            className={`px-4 py-2 rounded text-sm ${idx === currentDayIndex
                ? 'bg-(--accent) text-white font-medium'
                : 'text-(--text) hover:text-(--text-h) hover:bg-(--accent-border)'}
            }`}
          >
            {t('diet_day_' + day.dayIndex, { defaultValue: 'Day ' + day.dayIndex })}
          </button>
        ))}
      </div>
      <div className="mt-4 text-xs text-(--text)">
        {'Day ' + (currentDayIndex + 1) + ' of ' + state.days.length}
      </div>
    </div>
  );
}