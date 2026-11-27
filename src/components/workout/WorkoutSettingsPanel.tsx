import { useTranslation } from 'react-i18next';
import InfoPopup from '../InfoPopup';
import type { EquipmentType } from '../../utils/workoutData';
import type { WorkoutPlanSettings } from '../../hooks/useWorkoutPlan';

interface WorkoutSettingsPanelProps {
  settings: WorkoutPlanSettings;
  equipmentOptions: { value: EquipmentType; label: string }[];
  onSettingChange: <K extends keyof WorkoutPlanSettings>(key: K, value: WorkoutPlanSettings[K]) => void;
  onGeneratePersonalized: () => void;
  onGenerateSuggested: () => void;
  onReset: () => void;
}

export default function WorkoutSettingsPanel({
  settings,
  equipmentOptions,
  onSettingChange,
  onGeneratePersonalized,
  onGenerateSuggested,
  onReset,
}: WorkoutSettingsPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4 rounded-xl border border-(--border) bg-(--code-bg) mb-6 space-y-4 animate-slide-down">
      <h3 className="font-semibold text-(--text-h)">{t('workout_plan_settings')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_activity_level')}</label>
          <select
            value={settings.activityLevel}
            onChange={(e) => onSettingChange('activityLevel', e.target.value as WorkoutPlanSettings['activityLevel'])}
            className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          >
            <option value="sedentary">{t('workout_activity_sedentary')}</option>
            <option value="lightly_active">{t('workout_activity_light')}</option>
            <option value="moderately_active">{t('workout_activity_moderate')}</option>
            <option value="very_active">{t('workout_activity_very')}</option>
            <option value="extremely_active">{t('workout_activity_extreme')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_goal')}</label>
          <select
            value={settings.goal}
            onChange={(e) => onSettingChange('goal', e.target.value as WorkoutPlanSettings['goal'])}
            className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          >
            <option value="weight_loss">{t('workout_goal_weight_loss')}</option>
            <option value="muscle_gain">{t('workout_goal_muscle_gain')}</option>
            <option value="maintenance">{t('workout_goal_maintenance')}</option>
            <option value="health">{t('workout_goal_health')}</option>
            <option value="endurance">{t('workout_goal_endurance')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_days_per_week')}</label>
          <select
            value={settings.daysPerWeek}
            onChange={(e) => onSettingChange('daysPerWeek', parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          >
            {[3, 4, 5, 6].map(d => <option key={d} value={d}>{d} {t('workout_days')}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_session_duration')}</label>
          <select
            value={settings.sessionDurationMin}
            onChange={(e) => onSettingChange('sessionDurationMin', parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          >
            {[20, 30, 40, 45, 60].map(d => <option key={d} value={d}>{d} min</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_intensity')}</label>
          <select
            value={settings.intensity}
            onChange={(e) => onSettingChange('intensity', e.target.value as WorkoutPlanSettings['intensity'])}
            className="w-full px-3 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          >
            <option value="low">{t('workout_intensity_low')}</option>
            <option value="moderate">{t('workout_intensity_moderate')}</option>
            <option value="high">{t('workout_intensity_high')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_preferences')}</label>
          <div className="flex flex-wrap gap-2">
            {['cardio', 'strength', 'yoga', 'mixed'].map(pref => (
              <label key={pref} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.preferences.includes(pref as WorkoutPlanSettings['preferences'][0])}
                  onChange={(e) => onSettingChange('preferences',
                    e.target.checked
                      ? [...settings.preferences, pref as 'cardio' | 'strength' | 'yoga' | 'mixed']
                      : settings.preferences.filter(p => p !== pref)
                  )}
                  className="rounded border-(--border) text-(--accent) focus:ring-(--accent)"
                />
                <span className="text-sm text-(--text)">{t(`workout_pref_${pref}`, { defaultValue: pref })}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_equipment_available')}</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {equipmentOptions.map(opt => (
              <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.equipment.includes(opt.value)}
                  onChange={(e) => onSettingChange('equipment',
                    e.target.checked
                      ? [...settings.equipment, opt.value]
                      : settings.equipment.filter(e => e !== opt.value)
                  )}
                  className="rounded border-(--border) text-(--accent) focus:ring-(--accent)"
                />
                <span className="text-sm text-(--text)">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text) mb-1">{t('workout_focus_areas')}</label>
          <div className="flex flex-wrap gap-2">
            {['core', 'glutes', 'upper_body', 'legs', 'cardio', 'mobility'].map(area => (
              <label key={area} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.focusAreas.includes(area)}
                  onChange={(e) => onSettingChange('focusAreas',
                    e.target.checked
                      ? [...settings.focusAreas, area]
                      : settings.focusAreas.filter(f => f !== area)
                  )}
                  className="rounded border-(--border) text-(--accent) focus:ring-(--accent)"
                />
                <span className="text-sm text-(--text)">{t(`workout_focus_${area}`, { defaultValue: area })}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.compensateCalories}
              onChange={(e) => onSettingChange('compensateCalories', e.target.checked)}
              className="rounded border-(--border) text-(--accent) focus:ring-(--accent)"
            />
            <span className="text-sm text-(--text)">{t('workout_compensate_calories')}</span>
            <InfoPopup infoKey="workout_compensate_calories" className="ml-1" />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-(--border)">
        <button
          onClick={onGeneratePersonalized}
          className="px-4 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
        >
          {t('workout_generate_personalized')}
        </button>
        <button
          onClick={onGenerateSuggested}
          className="px-4 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h) font-medium hover:border-(--accent) hover:text-(--accent) transition"
        >
          {t('workout_generate_suggested')}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg border border-(--border) text-(--text-h) font-medium hover:bg-(--bg) transition"
        >
          {t('workout_reset')}
        </button>
      </div>
    </div>
  );
}