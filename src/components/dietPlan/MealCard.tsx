import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MealPortion, GeneratedMeal } from '../../types/dietPlan';

interface MealCardProps {
  meal: GeneratedMeal;
  onConfirm: () => void;
  onModify: (modifications: Partial<MealPortion>[]) => void;
  isConfirming: boolean;
  isModifying: boolean;
}

export function MealCard({ 
  meal, 
  onConfirm, 
  onModify, 
  isConfirming, 
  isModifying 
}: MealCardProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPortions, setEditedPortions] = useState<Partial<MealPortion>[]>([]);

  const formatNum = (n: number, d = 0): string => {
    if (!isFinite(n)) return '0';
    return n.toFixed(d);
  };

  const handlePortionChange = (index: number, value: number) => {
    setEditedPortions(prev => {
      const newPortions = [...prev];
      if (!newPortions[index]) {
        newPortions[index] = {} as Partial<MealPortion>;
      }
      newPortions[index].grams = value;
      return newPortions;
    });
  };

  const handleSaveEdits = () => {
    onModify(editedPortions);
    setIsEditing(false);
  };

  const handleCancelEdits = () => {
    setIsEditing(false);
    setEditedPortions([]);
  };

  return (
    <div className="p-5 rounded-xl border border-(--border) bg-purple-500/5">
      <div className="flex justify-between items-center mb-3">
        <strong className="block text-base font-semibold text-(--accent) uppercase">
          {t(`diet_meals_${meal.key}`)}
        </strong>
        <span className="text-sm font-semibold text-(--text) bg-(--code-bg) px-2.5 py-0.5 rounded-full border border-(--border)">
          ~{formatNum(meal.totalNutrition.calories)} {t('unit_calories')}
        </span>
      </div>
      
      {!isEditing ? (
        <ul className="space-y-2 mb-4">
          {meal.portions.map((portion, i) => (
            <li key={i} className="text-sm text-(--text) flex justify-between items-baseline gap-2">
              <span className="flex items-center gap-1">
                {portion.reintroduced && <span title={t('diet_reintroduced')} className="cursor-help text-[10px]">⚠️ </span>}
                {portion.foodName}
                {portion.testGroup && (
                  <span className="text-[10px] text-(--text) opacity-70 ml-1">
                    ({t(`fodmap_${portion.testGroup}`)})
                  </span>
                )}
              </span>
              <span className="text-xs text-(--text) whitespace-nowrap">
                {formatNum(portion.grams)} {t('unit_grams')} · {formatNum(portion.nutrition.calories)} {t('unit_calories')}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-2">
          {meal.portions.map((portion, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="flex-1 text-sm text-(--text)">
                {portion.reintroduced && <span title={t('diet_reintroduced')} className="cursor-help text-[10px]">⚠️ </span>}
                {portion.foodName}
                {portion.testGroup && (
                  <span className="text-[10px] text-(--text) opacity-70 ml-1">
                    ({t(`fodmap_${portion.testGroup}`)})
                  </span>
                )}
              </span>
              <input
                type="number"
                min="1"
                value={editedPortions[i]?.grams ?? portion.grams}
                onChange={(e) => handlePortionChange(i, parseInt(e.target.value) || portion.grams)}
                className="w-20 px-2 py-1 rounded border-(--border) bg-(--bg) text-(--text) text-sm"
              />
              <span className="text-xs text-(--text)">{t('unit_grams')}</span>
            </div>
          ))}
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSaveEdits}
              className="mr-2 px-3 py-1 rounded bg-(--accent) text-white text-xs hover:bg-(--accent-hover)"
              disabled={isModifying}
            >
              {t('diet_save')}
            </button>
            <button
              onClick={handleCancelEdits}
              className="px-3 py-1 rounded bg-(--bg) border border-(--border) text-(--text) text-xs hover:bg-(--accent-border)"
            >
              {t('diet_cancel')}
            </button>
          </div>
        </div>
      )}
      
      <div className="pt-2 border-t border-(--border) text-sm space-y-1">
        <p className="text-[11px]">
          {t('diet_target_protein')} {formatNum(meal.totalNutrition.protein)}{t('unit_grams')} · {t('diet_target_carbs')} {formatNum(meal.totalNutrition.carbs)}{t('unit_grams')} · {t('diet_target_fats')} {formatNum(meal.totalNutrition.fat)}{t('unit_grams')} · {t('diet_fiber_short')} {formatNum(meal.totalNutrition.fiber)}{t('unit_grams')}
        </p>
        {meal.totalNutrition.sugar > 0 && (
          <p className="text-[10px]">🍬 {t('diet_sugar_short')} {formatNum(meal.totalNutrition.sugar)}{t('unit_grams')}</p>
        )}
        {meal.totalNutrition.sodium > 0 && (
          <p className="text-[10px]">🧂 {t('diet_sodium_short')} {formatNum(meal.totalNutrition.sodium)}{t('unit_milligrams')}</p>
        )}
      </div>
      
      {!meal.isConfirmed && !isConfirming ? (
        <button
          onClick={onConfirm}
          className="mt-3 w-full px-4 py-2 rounded bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition-colors"
        >
          {t('diet_confirm_meal')}
        </button>
      ) : meal.isConfirmed ? (
        <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-600">
          {t('diet_meal_confirmed')}
        </span>
      ) : (
        <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-(--accent) text-white animate-pulse">
          {t('diet_confirming')}
        </span>
      )}
    </div>
  );
}