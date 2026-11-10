import { useState, useCallback } from 'react';
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

  const handleViewRecipe = useCallback((mealKey: MealKey) => {
    const recipe = findMatchingRecipe(mealKey);
    if (recipe) {
      const recipeIndex = RECIPES_DATABASE.findIndex(r => r.mealType === mealKey && r.name === recipe.name);
      if (recipeIndex !== -1) {
        navigateTo(`/recipes/${recipeIndex}`);
      }
    } else {
      navigateTo('/recipes');
    }
  }, []);

  const formatNum = (n: number, d = 0): string => {
    if (!isFinite(n)) return '0';
    return n.toFixed(d);
  };

  const handlePortionChange = useCallback((index: number, value: number) => {
    setEditedPortions(prev => {
      const newPortions = [...prev];
      if (!newPortions[index]) {
        newPortions[index] = {} as Partial<MealPortion>;
      }
      newPortions[index].grams = value;
      return newPortions;
    });
  }, []);

  const handleSaveEdits = useCallback(() => {
    onModify(editedPortions);
    setIsEditing(false);
  }, [editedPortions, onModify]);

  const handleCancelEdits = useCallback(() => {
    setIsEditing(false);
    setEditedPortions([]);
  }, []);

  const mealTranslationKey = mealKeyMap[meal.key] || meal.key;
  const mealDisplayName = t(`diet_meals_${mealTranslationKey}`, { defaultValue: meal.key });

  // Meal icons mapping
  const mealIcons: Record<string, string> = {
    colazione: '☕',
    spuntinoMattina: '🍎',
    pranzo: '🍽️',
    spuntinoPomeriggio: '🥜',
    spuntino: '🥪',
    spuntinoSera: '🌙',
    cena: '🍲'
  };
  const mealIcon = mealIcons[meal.key] || '🍽️';

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-(--border) bg-(--code-bg) shadow-md transition-all hover:border-(--accent)/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b border-(--border)">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl p-2 rounded-xl bg-(--bg) border border-(--border) shadow-2xs flex items-center justify-center">
            {mealIcon}
          </span>
          <div>
            <strong className="block text-base sm:text-lg font-bold text-(--text-h) uppercase tracking-wide">
              {mealDisplayName}
            </strong>
            <span className="text-xs text-(--text) opacity-80">
              {meal.portions.length} {t('diet_ingredients_count', { defaultValue: 'ingredienti' })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-(--accent) bg-(--accent)/10 px-3 py-1 rounded-full border border-(--accent)/20 shadow-2xs">
            🔥 {formatNum(meal.totalNutrition.calories)} {t('unit_calories')}
          </span>
          {meal.isConfirmed && (
            <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
              ✓ {t('diet_meal_confirmed', { defaultValue: 'Confermata' })}
            </span>
          )}
        </div>
      </div>
      
      {/* Portions / Ingredients List */}
      {!isEditing ? (
        <div className="space-y-2.5 mb-5">
          {meal.portions.map((portion, i) => (
            <div key={i} className="p-3 rounded-xl bg-(--bg) border border-(--border) flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-2xs">
              <span className="flex items-center gap-2 text-sm font-medium text-(--text-h)">
                {portion.reintroduced && (
                  <span title={t('diet_reintroduced')} className="cursor-help text-xs bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold">
                    ⚠️ {t('diet_reintroduced_short', { defaultValue: 'Reintrodotto' })}
                  </span>
                )}
                <span>{portion.foodName}</span>
                {portion.testGroup && (
                  <span className="text-[11px] text-(--text) opacity-70 bg-(--code-bg) px-2 py-0.5 rounded-md border border-(--border)">
                    FODMAP: {t(`fodmap_${portion.testGroup}`)}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-(--text) font-semibold self-end sm:self-center">
                <span className="px-2.5 py-1 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h)">
                  {formatNum(portion.grams)} {t('unit_grams')}
                </span>
                <span className="opacity-70">
                  {formatNum(portion.nutrition.calories)} {t('unit_calories')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 mb-5 p-4 rounded-xl bg-(--bg) border border-(--border)">
          <h4 className="text-xs font-bold text-(--text-h) uppercase tracking-wider mb-2">
            {t('diet_edit_portions', { defaultValue: 'Modifica Porzioni (grammi)' })}
          </h4>
          {meal.portions.map((portion, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 pb-2 border-b border-(--border) last:border-b-0">
              <span className="flex-1 text-sm text-(--text-h) font-medium">
                {portion.reintroduced && <span title={t('diet_reintroduced')} className="cursor-help text-xs">⚠️ </span>}
                {portion.foodName}
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  min="1"
                  value={editedPortions[i]?.grams ?? portion.grams}
                  onChange={(e) => handlePortionChange(i, parseInt(e.target.value) || portion.grams)}
                  className="w-24 px-3 py-1.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) text-sm font-bold shadow-xs focus:ring-2 focus:ring-(--accent)"
                />
                <span className="text-xs text-(--text)">{t('unit_grams')}</span>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleCancelEdits}
              className="px-4 py-2 rounded-xl bg-(--code-bg) border border-(--border) text-(--text) text-xs font-semibold hover:bg-(--accent)/10 transition cursor-pointer"
            >
              {t('diet_cancel')}
            </button>
            <button
              onClick={handleSaveEdits}
              className="px-4 py-2 rounded-xl bg-(--accent) text-white text-xs font-semibold hover:bg-(--accent-hover) transition shadow-sm cursor-pointer"
              disabled={isModifying}
            >
              {t('diet_save')}
            </button>
          </div>
        </div>
      )}
      
      {/* Nutritional Summary Footer */}
      <div className="p-3.5 rounded-xl bg-(--bg) border border-(--border) grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-4">
        <div className="flex flex-col">
          <span className="text-(--text) opacity-70">{t('diet_target_protein')}</span>
          <span className="font-bold text-(--text-h)">{formatNum(meal.totalNutrition.protein, 1)} {t('unit_grams')}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-(--text) opacity-70">{t('diet_target_carbs')}</span>
          <span className="font-bold text-(--text-h)">{formatNum(meal.totalNutrition.carbs, 1)} {t('unit_grams')}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-(--text) opacity-70">{t('diet_target_fats')}</span>
          <span className="font-bold text-(--text-h)">{formatNum(meal.totalNutrition.fat, 1)} {t('unit_grams')}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-(--text) opacity-70">{t('diet_fiber_short')}</span>
          <span className="font-bold text-(--text-h)">{formatNum(meal.totalNutrition.fiber, 1)} {t('unit_grams')}</span>
        </div>
        {(meal.totalNutrition.sugar > 0 || meal.totalNutrition.sodium > 0) && (
          <div className="col-span-2 sm:col-span-4 pt-2 border-t border-(--border) flex flex-wrap gap-4 text-[11px] text-(--text)">
            {meal.totalNutrition.sugar > 0 && (
              <span>🍬 {t('diet_sugar_short')}: {formatNum(meal.totalNutrition.sugar, 1)} {t('unit_grams')}</span>
            )}
            {meal.totalNutrition.sodium > 0 && (
              <span>🧂 {t('diet_sodium_short')}: {formatNum(meal.totalNutrition.sodium, 1)} {t('unit_milligrams')}</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all text-xs sm:text-sm text-center shadow-sm cursor-pointer disabled:opacity-50"
          >
            ✓ {t('diet_confirm_meal')}
          </button>
        ) : meal.isConfirmed ? (
          <span className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-green-500/20 text-green-600 font-bold text-center border border-green-500/30">
            ✅ {t('diet_meal_confirmed')}
          </span>
        ) : (
          <span className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-(--accent) text-white animate-pulse font-bold text-center">
            {t('diet_confirming')}
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewRecipe(meal.key as MealKey)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-(--accent) text-white text-xs sm:text-sm font-semibold hover:bg-(--accent-hover) transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            aria-label={t('diet_view_recipe', { defaultValue: 'Visualizza ricetta' })}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{t('diet_recipe', { defaultValue: 'Ricetta' })}</span>
          </button>

          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditedPortions(meal.portions.map(p => ({ grams: p.grams })));
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-(--bg) border border-(--border) text-(--text-h) text-xs sm:text-sm font-semibold hover:border-(--accent) hover:text-(--accent) transition-all flex items-center justify-center gap-1 cursor-pointer"
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
