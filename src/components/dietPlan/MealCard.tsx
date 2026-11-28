import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../hooks/useToast';
import { navigateTo } from '../../utils/navigation';
import { RECIPES_DATABASE } from '../../utils/recipesData';
import { formatMealForCopy, formatNum, getUnitDisplay, cleanFoodName, formatPortionDisplay } from '../../utils/mealCopyFormatter';
import type { MealPortion, GeneratedMeal, MealKey, DietPhase, Recipe } from '../../types/dietPlan';

interface MealCardProps {
  meal: GeneratedMeal;
  onConfirm: () => void;
  onUnconfirm?: () => void;
  onModify: (modifications: Partial<MealPortion>[]) => void;
  isConfirming: boolean;
  isModifying: boolean;
  onConfirmed?: () => void;
  phase?: DietPhase;
}

export function MealCard({
  meal,
  onConfirm,
  onUnconfirm,
  onModify,
  isConfirming,
  isModifying,
  onConfirmed,
  phase
}: MealCardProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPortions, setEditedPortions] = useState<Partial<MealPortion>[]>([]);
  const [localIsConfirming, setLocalIsConfirming] = useState(false);
  const effectiveIsConfirming = isConfirming || localIsConfirming;

  // Day name mapping for copy operation (consistente con DietPlan.tsx dayNameMap)
  const MEAL_DISPLAY_NAMES: Record<MealKey, string> = {
    colazione: 'Colazione',
    spuntinoMattina: 'Spuntino Mattina',
    pranzo: 'Pranzo',
    spuntinoPomeriggio: 'Spuntino Pomeriggio',
    spuntino: 'Spuntino',
    spuntinoSera: 'Spuntino Sera',
    cena: 'Cena'
  };

  // Find a recipe matching the meal type and ingredients
  const findMatchingRecipe = (mealKey: MealKey, portions?: MealPortion[]) => {
    const mealPortions = portions ?? meal.portions;
    
    // Get the set of ingredient names from the meal (food names, excluding unit/gram info)
    const mealIngredientNames = new Set(
      mealPortions.map(p => p.foodName.toLowerCase().trim())
    );
    
    // Filter recipes that match the meal type
    const matchingRecipes = RECIPES_DATABASE.filter(
      recipe => recipe.mealType === mealKey
    );
    
    if (matchingRecipes.length === 0) {
      return null;
    }
    
    // Score each recipe based on ingredient overlap
    const scoredRecipes = matchingRecipes.map(recipe => {
      const recipeIngredientNames = new Set(
        recipe.portions.map(p => p.foodName.toLowerCase().trim())
      );
      
      // Calculate overlap: count how many meal ingredients appear in recipe
      let overlapCount = 0;
      mealIngredientNames.forEach(mealIng => {
        if (recipeIngredientNames.has(mealIng)) {
          overlapCount++;
        }
      });
      
      // Also check reverse: recipe ingredients in meal
      let reverseOverlap = 0;
      recipeIngredientNames.forEach(recipeIng => {
        if (mealIngredientNames.has(recipeIng)) {
          reverseOverlap++;
        }
      });
      
      const totalScore = overlapCount + reverseOverlap;
      const mealIngredientCount = mealIngredientNames.size;
      const recipeIngredientCount = recipeIngredientNames.size;
      
      // Calculate percentages for good match detection
      const mealCoverage = mealIngredientCount > 0 ? overlapCount / mealIngredientCount : 0;
      const recipePurity = recipeIngredientCount > 0 ? reverseOverlap / recipeIngredientCount : 1;
      
      // A good match requires:
      // 1. Most meal ingredients are in the recipe (at least 75% coverage)
      // 2. Most recipe ingredients are in the meal (at least 70% purity - limited foreign ingredients)
      const isGoodMatch = mealCoverage >= 0.75 && recipePurity >= 0.7;
      
      return {
        recipe,
        score: totalScore,
        mealCoverage,
        recipePurity,
        isGoodMatch
      };
    });
    
    // Sort by score (highest first) and return the best match
    scoredRecipes.sort((a, b) => b.score - a.score);
    
    // Return the best matching recipe if it's a good match, otherwise null
    // This will cause fall-through to findOrCreateRecipeForMeal
    const best = scoredRecipes[0];
    return best && best.isGoodMatch ? best.recipe : null;
  };

  // Genera il nome della ricetta dal pasto
  const generateRecipeName = (mealKey: MealKey, portions: MealPortion[]): string => {
    const mealNames: Record<MealKey, string> = {
      colazione: 'Colazione',
      spuntinoMattina: 'Spuntino Mattina',
      pranzo: 'Pranzo',
      spuntinoPomeriggio: 'Spuntino Pomeriggio',
      spuntino: 'Spuntino',
      spuntinoSera: 'Spuntino Sera',
      cena: 'Cena'
    };

    // Identifica ingrediente principale (proteina o carboidrato)
    const mainIngredient = portions
      .filter(p => p.nutrition.protein > 5 || p.nutrition.carbs > 20)
      .sort((a, b) => b.grams - a.grams)[0];

    const mainName = mainIngredient ? cleanFoodName(mainIngredient.foodName) : '';
    const count = portions.length;

    return `${mealNames[mealKey]}: ${mainName}${count > 1 ? ` + ${count - 1} ingredienti` : ''}`;
  };

  // Genera istruzioni base per la ricetta
  const generateInstructions = (portions: MealPortion[]): string[] => {
    const hasCooking = portions.some(p =>
      p.foodName.toLowerCase().includes('uova') ||
      p.foodName.toLowerCase().includes('patate') ||
      p.foodName.toLowerCase().includes('pollo') ||
      p.foodName.toLowerCase().includes('pesce')
    );

    if (hasCooking) {
      return [
        'Preparare tutti gli ingredienti pesandoli secondo le quantità indicate.',
        'Cuocere gli alimenti che richiedono cottura (uova, patate, proteine) secondo preferenza.',
        'Assemblare il pasto combinando tutti gli ingredienti.',
        'Condire a piacere con olio EVO, sale, spezie tollerate.',
        'Consumare subito per massimizzare freschezza e digeribilità.'
      ];
    }

    return [
      'Preparare tutti gli ingredienti pesandoli secondo le quantità indicate.',
      'Lavare e tagliare frutta/verdura se necessario.',
      'Assemblare il pasto combinando tutti gli ingredienti.',
      'Condire a piacere con olio EVO, sale, spezie tollerate.',
      'Consumare subito.'
    ];
  };

  // Find or create a recipe from meal ingredients
  const findOrCreateRecipeForMeal = useCallback((mealKey: MealKey, portions: MealPortion[]) => {
    // 1. Filtra ingredienti validi per ricetta
    // Si affida a filterPoolByMealSuitability in mealGenerator.ts per l'esclusione bulgur da colazione
    // (mealSuitability: 'lunch_dinner' definito in foodsData.ts line 263)
    const validPortions = portions.filter(p => p.grams > 0 || (p.unitValue !== undefined && p.unitValue > 0));

    if (validPortions.length === 0) return null;

    // 2. Cerca ricetta esistente in RECIPES_DATABASE che matchi
    const matchingRecipe = findMatchingRecipe(mealKey, validPortions);
    if (matchingRecipe) return matchingRecipe;

    // 3. Crea nuova ricetta "virtuale" dal pasto
    const recipeName = generateRecipeName(mealKey, validPortions);
    const newRecipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
      name: recipeName,
      mealType: mealKey,
      servings: 1,
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      difficulty: 'easy',
      tags: ['auto-generated', 'from-meal'],
      isCustom: true,
      sourceDayIndex: -1,
      portions: validPortions.map(p => ({
        ...p,
        recipeId: `meal-${mealKey}-${Date.now()}`
      })),
      instructions: generateInstructions(validPortions),
    };

    return newRecipe;
  }, []);

  // Derived values from meal - defined before callbacks that use them
  const mealDisplayName = MEAL_DISPLAY_NAMES[meal.key] || meal.key;

  // Find or create the recipe for the current meal to display its name
  const currentRecipe = useMemo(
    () => findOrCreateRecipeForMeal(meal.key as MealKey, meal.portions),
    [findOrCreateRecipeForMeal, meal.key, meal.portions]
  );
  const recipeDisplayName = currentRecipe?.name ?? mealDisplayName;

  const handleViewRecipe = useCallback((mealKey: MealKey) => {
    const recipe = findOrCreateRecipeForMeal(mealKey, meal.portions);
    if (recipe) {
      // Se è ricetta predefinita, naviga direttamente
      if (!recipe.isCustom) {
        const recipeIndex = RECIPES_DATABASE.findIndex(r => r.name === recipe.name && r.mealType === mealKey);
        if (recipeIndex !== -1) {
          const backRef = { source: 'mealCard' as const, targetId: `predefined-${recipeIndex}`, mealKey };
          localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));
          navigateTo(`/recipes/predefined-${recipeIndex}`);
          return;
        }
      }

      // Se è ricetta custom/auto-generata, salva temporaneamente e naviga
      const tempRecipeId = `temp-${Date.now()}`;
      localStorage.setItem(`foodmapper_temp_recipe_${tempRecipeId}`, JSON.stringify(recipe));
      const backRef = { source: 'mealCard' as const, targetId: tempRecipeId, mealKey };
      localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));
      navigateTo(`/recipes/${tempRecipeId}`);
    } else {
      localStorage.removeItem('foodmapper_recipe_back_ref');
      navigateTo('/recipes');
    }
  }, [navigateTo, meal.portions, meal.key]);

  // Navigate to the recipe only if the clicked ingredient is part of the current meal's recipe
  const handleViewIngredientRecipe = useCallback((foodName: string) => {
    const ingredientName = foodName.toLowerCase().trim();

    const recipe = currentRecipe;
    if (!recipe) return;

    const isPartOfRecipe = recipe.portions.some(portion => {
      const portionName = portion.foodName.toLowerCase().trim();
      // Exact match
      if (portionName === ingredientName) return true;
      // Partial match: ingredient is contained in portion name (e.g., "arancia" in "arancia rossa")
      if (portionName.includes(ingredientName) && ingredientName.length >= 3) return true;
      // Partial match: portion name is contained in ingredient (e.g., "mela" in "mela golden")
      if (ingredientName.includes(portionName) && portionName.length >= 3) return true;
      return false;
    });

    if (!isPartOfRecipe) return;

    // Navigate to the recipe
    if (!recipe.isCustom) {
      const recipeIndex = RECIPES_DATABASE.findIndex(r => r.name === recipe.name && r.mealType === recipe.mealType);
      if (recipeIndex !== -1) {
        // Store back navigation reference (for "Torna al pasto" button)
        const backRef = {
          source: 'mealCard' as const,
          targetId: `predefined-${recipeIndex}`,
          mealKey: meal.key as MealKey,
        };
        localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));
        navigateTo(`/recipes/predefined-${recipeIndex}`);
      }
    } else {
      const tempRecipeId = `temp-${Date.now()}`;
      localStorage.setItem(`foodmapper_temp_recipe_${tempRecipeId}`, JSON.stringify(recipe));
      const backRef = {
        source: 'mealCard' as const,
        targetId: tempRecipeId,
        mealKey: meal.key as MealKey,
      };
      localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));
      navigateTo(`/recipes/${tempRecipeId}`);
    }
  }, [navigateTo, meal.key, currentRecipe]);

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

  const handleCopyMeal = useCallback(() => {
    const mealText = formatMealForCopy(meal, mealDisplayName, phase);

    navigator.clipboard.writeText(mealText).then(() => {
      showToast(t('diet_meal_copied', { defaultValue: 'Pasto copiato!' }), 'success');
    }).catch(() => {
      showToast(t('diet_meal_copy_error', { defaultValue: 'Errore nella copia' }), 'error');
    });
  }, [meal, mealDisplayName, phase, showToast, t]);

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-(--border) bg-(--code-bg) shadow-md transition-all hover:border-(--accent)/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b border-(--border)">
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => handleViewRecipe(meal.key as MealKey)}
            className="cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleViewRecipe(meal.key as MealKey); }}
            title={t('diet_view_recipe', { defaultValue: 'Visualizza ricetta' })}
          >
            <strong className="block text-base sm:text-lg font-bold text-(--text-h) group-hover:text-(--accent) group-hover:underline transition-colors">
              {recipeDisplayName}
            </strong>
            <span className="text-xs text-(--text) opacity-80">
              {meal.portions.length} {t('diet_ingredients_count', { defaultValue: 'ingredienti' })} • {t('diet_click_for_recipe', { defaultValue: 'Clicca per la ricetta' })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-(--accent) bg-(--accent)/10 px-3 py-1 rounded-full border border-(--accent)/20 shadow-2xs">
            {formatNum(meal.totalNutrition.calories)} {t('unit_calories')}
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
          {meal.portions
            .filter(p => {
              // Escludi porzioni con grams = 0 e nessun unitValue valido
              if (p.grams === 0) {
                if (p.unitValue === undefined || p.unitValue === 0) return false;
              }
              // Per unità con unitValue = 0, escludi esplicitamente
              if (p.unitValue !== undefined && p.unitValue === 0) return false;
              // Escludi cucchiai con grammi = 0
              if (p.unit?.includes('cucchiai') && p.grams === 0) return false;
              return true;
            })
            .map((portion, i) => (
              <div key={i} className="p-3 rounded-xl bg-(--bg) border border-(--border) flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-2xs">
                <span className="flex items-center gap-2 text-sm font-medium text-(--text-h)">
                  {portion.reintroduced && (
                    <span title={t('diet_reintroduced')} className="cursor-help text-xs bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold">
                      ⚠️ {t('diet_reintroduced_short', { defaultValue: 'Reintrodotto' })}
                    </span>
                  )}
                  <span
                    onClick={() => handleViewIngredientRecipe(portion.foodName)}
                    className="cursor-pointer hover:text-(--accent) hover:underline"
                  >
                    {cleanFoodName(portion.foodName)}
                  </span>
                  {portion.testGroup && (
                    <span className="text-[11px] text-(--text) opacity-70 bg-(--code-bg) px-2 py-0.5 rounded-md border border-(--border)">
                      FODMAP: {t(`fodmap_${portion.testGroup}`)}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-(--text) font-semibold self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-lg bg-(--code-bg) border border-(--border) text-(--text-h)">
                    {formatPortionDisplay(portion, getUnitDisplay).amountStr}
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
          {meal.portions
            .filter(p => {
              // Escludi porzioni con grams = 0 e nessun unitValue valido
              if (p.grams === 0) {
                if (p.unitValue === undefined || p.unitValue === 0) return false;
              }
              // Per unità con unitValue = 0, escludi esplicitamente
              if (p.unitValue !== undefined && p.unitValue === 0) return false;
              // Escludi cucchiai con grammi = 0
              if (p.unit?.includes('cucchiai') && p.grams === 0) return false;
              return true;
            })
            .map((portion, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 pb-2 border-b border-(--border) last:border-b-0">
                <span className="flex-1 text-sm text-(--text-h) font-medium">
                  {portion.reintroduced && <span title={t('diet_reintroduced')} className="cursor-help text-xs">⚠️ </span>}
                  {cleanFoodName(portion.foodName)}
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
          <button
            onClick={() => onUnconfirm?.()}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-green-500/20 text-green-600 font-bold text-center border border-green-500/30 hover:bg-green-500/30 transition-colors cursor-pointer"
          >
            ↺ {t('diet_unconfirm_meal', { defaultValue: 'Annulla conferma' })}
          </button>
        ) : (
          <span className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-(--accent) text-white animate-pulse font-bold text-center">
            {t('diet_confirming')}
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMeal}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-(--bg) border border-(--border) text-(--text-h) text-xs sm:text-sm font-semibold hover:border-(--accent) hover:text-(--accent) transition-all flex items-center justify-center gap-1 cursor-pointer"
            aria-label={t('diet_copy_meal', { defaultValue: 'Copia pasto' })}
          >
            📋 {t('diet_copy', { defaultValue: 'Copia' })}
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
              ✏️ {t('diet_edit', { defaultValue: 'Modifica' })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
