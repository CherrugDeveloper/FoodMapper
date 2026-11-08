import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../hooks/useToast';
import { navigateTo } from '../../utils/navigation';
import { RECIPES_DATABASE } from '../../utils/recipesData';
import type { MealPortion, GeneratedMeal, MealKey } from '../../types/dietPlan';

interface MealCardProps {
  meal: GeneratedMeal;
  onConfirm: () => void;
  onModify: (modifications: Partial<MealPortion>[]) => void;
  isConfirming: boolean;
  isModifying: boolean;
  onConfirmed?: () => void;
}

export function MealCard({
  meal,
  onConfirm,
  onModify,
  isConfirming,
  isModifying,
  onConfirmed
}: MealCardProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPortions, setEditedPortions] = useState<Partial<MealPortion>[]>([]);
  const [localIsConfirming, setLocalIsConfirming] = useState(false);
  const effectiveIsConfirming = isConfirming || localIsConfirming;

  // Map Italian meal keys to translation keys
  const mealKeyMap: Record<string, string> = {
    colazione: 'breakfast',
    spuntinoMattina: 'spuntinoMattina',
    pranzo: 'lunch',
    spuntinoPomeriggio: 'spuntinoPomeriggio',
    spuntino: 'snack',
    spuntinoSera: 'spuntinoSera',
    cena: 'dinner'
  };

  // Find a recipe matching the meal type
  const findMatchingRecipe = (mealKey: MealKey) => {
    return RECIPES_DATABASE.find(recipe => recipe.mealType === mealKey);
  };

  const handleViewRecipe = (mealKey: MealKey) => {
    const recipe = findMatchingRecipe(mealKey);
    if (recipe) {
      // Find the index of this recipe in the database
      const recipeIndex = RECIPES_DATABASE.findIndex(r => r.mealType === mealKey && r.name === recipe.name);
      if (recipeIndex !== -1) {
        navigateTo(`/recipes/${recipeIndex}`);
      }
    } else {
      // Navigate to recipes page if no specific recipe found
      navigateTo('/recipes');
    }
  };

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

  // Get translated meal name
  const mealTranslationKey = mealKeyMap[meal.key] || meal.key;
  const mealDisplayName = t(`diet_meals_${mealTranslationKey}`, { defaultValue: meal.key });

  return (
    <div className="p-5 rounded-xl border border-(--border) bg-purple-500/5">
      <div className="flex justify-between items-center mb-3">
        <strong className="block text-base font-semibold text-(--accent) uppercase">
          {mealDisplayName}
        </strong>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-(--text) bg-(--code-bg) px-2.5 py-0.5 rounded-full border border-(--border)">
            ~{formatNum(meal.totalNutrition.calories)} {t('unit_calories')}
          </span>
        </div>
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

      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {!meal.isConfirmed && !effectiveIsConfirming ? (
          <button
            onClick={async () => {
              setLocalIsConfirming(true);
              try {
                await onConfirm();
                showToast(t('diet_meal_confirmed'), 'success');
                onConfirmed?.();
              } finally {
                setLocalIsConfirming(false);
              }
            }}
            disabled={effectiveIsConfirming}
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all text-xs sm:text-sm text-center shadow-sm cursor-pointer disabled:opacity-50"
          >
            {t('diet_confirm_meal')}
          </button>
        ) : meal.isConfirmed ? (
          <span className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-green-500/20 text-green-600 font-medium text-center border border-green-500/30">
            ✅ {t('diet_meal_confirmed')}
          </span>
        ) : (
          <span className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-(--accent) text-white animate-pulse font-medium text-center">
            {t('diet_confirming')}
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewRecipe(meal.key as MealKey)}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-(--accent) text-white text-xs sm:text-sm font-medium hover:bg-(--accent-hover) transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            aria-label={t('diet_view_recipe', { defaultValue: 'Visualizza ricetta' })}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{t('diet_recipe')}</span>
          </button>

          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditedPortions(meal.portions.map(p => ({ grams: p.grams })));
              }}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-(--code-bg) border border-(--border) text-(--text) text-xs sm:text-sm font-medium hover:bg-(--accent)/10 transition-all flex items-center justify-center gap-1 cursor-pointer"
              aria-label={t('diet_edit', { defaultValue: 'Modifica' })}
            >
              <span>✏️ {t('diet_edit', { defaultValue: 'Modifica' })}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}