import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { useRecipes } from '../hooks/useRecipes';
import { FOODS_DATABASE } from '../utils/foodsData';
import {
  RECIPES_DATABASE,
  calculateRecipeMacros,
  isRecipeLowFODMAP,
  getRecipeSeasons,
  getRecipeProteins,
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS,
  RECIPE_CATEGORY_MAP,
} from '../utils/recipesData';
import InfoPopup from './InfoPopup';
import type { Recipe, MealPortion } from '../types/dietPlan';

interface RecipeDetailProps {
  recipeId?: string;
}

export default function RecipeDetail({ recipeId: propRecipeId }: RecipeDetailProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userData } = useAppContext();
  const { recipes: userRecipes, deleteRecipe } = useRecipes({ userData });
  const { recipeId: paramRecipeId } = useParams<{ recipeId: string }>();
  const recipeId = propRecipeId || paramRecipeId;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFoodModal, setShowFoodModal] = useState<string | null>(null);
  const [selectedPortion, setSelectedPortion] = useState<MealPortion | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'instructions'>('details');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load recipe on mount
  useEffect(() => {
    if (!recipeId) {
      navigate('/recipes');
      return;
    }

    const loadRecipe = () => {
      setIsLoading(true);
      // First check user recipes
      let foundRecipe = userRecipes.find(r => r.id === recipeId);
      
      // Then check predefined recipes database
      if (!foundRecipe) {
        const predefinedIndex = RECIPES_DATABASE.findIndex((_, i) => `predefined-${i}` === recipeId);
        if (predefinedIndex >= 0) {
          const predefined = RECIPES_DATABASE[predefinedIndex];
          foundRecipe = {
            ...predefined,
            id: `predefined-${predefinedIndex}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Recipe;
        }
      }

      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        // Recipe not found
        setToast({ message: t('recipes.not_found', { defaultValue: 'Ricetta non trovata' }), type: 'error' });
        setTimeout(() => navigate('/recipes'), 2000);
      }
      setIsLoading(false);
    };

    loadRecipe();
  }, [recipeId, userRecipes, navigate, t]);

  // Show toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddToShoppingList = useCallback(() => {
    // Navigate to shopping list with recipe ingredients
    navigate('/shopping', { state: { recipeIngredients: recipe.portions } });
    setToast({ message: t('recipes.added_to_shopping', { defaultValue: 'Ingredienti aggiunti alla lista spesa' }), type: 'success' });
  }, [navigate, recipe, t]);

  const handleAddToDietPlan = useCallback(() => {
    // Navigate to diet plan with recipe
    navigate('/diet', { state: { recipeToAdd: recipe } });
    setToast({ message: t('recipes.added_to_diet', { defaultValue: 'Ricetta aggiunta al piano alimentare' }), type: 'success' });
  }, [navigate, recipe, t]);

  const handleEditRecipe = useCallback(() => {
    // Navigate to recipes tab with edit mode
    navigate('/recipes', { state: { editRecipeId: recipe.id } });
  }, [navigate, recipe.id]);

  const handleDeleteRecipe = useCallback(() => {
    if (window.confirm(t('recipes.confirm_delete', { defaultValue: 'Sei sicuro di voler eliminare questa ricetta?' }))) {
      if (recipe.id.startsWith('predefined-')) {
        setToast({ message: t('recipes.cannot_delete_predefined', { defaultValue: 'Non puoi eliminare le ricette predefinite' }), type: 'error' });
      } else {
        deleteRecipe(recipe.id);
        setToast({ message: t('recipes.deleted', { defaultValue: 'Ricetta eliminata' }), type: 'success' });
        setTimeout(() => navigate('/recipes'), 1000);
      }
    }
  }, [recipe, deleteRecipe, navigate, t]);

  const openFoodDetail = useCallback((portion: MealPortion) => {
    setSelectedPortion(portion);
    setShowFoodModal(portion.foodId);
  }, []);

  const closeFoodModal = useCallback(() => {
    setShowFoodModal(null);
    setSelectedPortion(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-(--accent) border-t-transparent" aria-label={t('common.loading', { defaultValue: 'Caricamento...' })} />
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  const macros = calculateRecipeMacros(recipe);
  const isLowFODMAP = isRecipeLowFODMAP(recipe);
  const seasons = getRecipeSeasons(recipe);
  const proteins = getRecipeProteins(recipe);
  const category = RECIPE_CATEGORY_MAP[recipe.name] || 'Altro';
  const difficultyColor = DIFFICULTY_COLORS[recipe.difficulty];
  const difficultyLabel = DIFFICULTY_LABELS[recipe.difficulty];

  const monthNames = [
    '', t('months.jan', { defaultValue: 'Gen' }), t('months.feb', { defaultValue: 'Feb' }),
    t('months.mar', { defaultValue: 'Mar' }), t('months.apr', { defaultValue: 'Apr' }),
    t('months.may', { defaultValue: 'Mag' }), t('months.jun', { defaultValue: 'Giu' }),
    t('months.jul', { defaultValue: 'Lug' }), t('months.aug', { defaultValue: 'Ago' }),
    t('months.sep', { defaultValue: 'Set' }), t('months.oct', { defaultValue: 'Ott' }),
    t('months.nov', { defaultValue: 'Nov' }), t('months.dec', { defaultValue: 'Dic' })
  ];

  const seasonLabels = seasons.map(m => monthNames[m]).join(', ');

  const getFoodItem = (foodId: string) => FOODS_DATABASE.find(f => f.id === foodId);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      {/* Back button */}
      <Link
        to="/recipes"
        className="inline-flex items-center gap-2 text-(--accent) hover:underline mb-4 sm:mb-6"
      >
        ← {t('recipes.back_to_list', { defaultValue: 'Torna alle ricette' })}
      </Link>

      {toast && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {toast.message}
        </div>
      )}

      {/* Hero Image */}
      {recipe.photoUrl && (
        <div className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-6">
          <img
            src={recipe.photoUrl}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold">{recipe.name}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              <span className={`px-2 py-1 rounded-full ${difficultyColor}`}>
                {t(`recipes.difficulty.${recipe.difficulty}`, { defaultValue: difficultyLabel.it })}
              </span>
              <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur">
                {t('recipes.category', { defaultValue: 'Categoria' })}: {category}
              </span>
              {isLowFODMAP && (
                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                  {t('recipes.low_fodmap', { defaultValue: 'Low-FODMAP' })}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {!recipe.photoUrl && (
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-(--text-h) mb-2">{recipe.name}</h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className={`px-2 py-1 rounded-full ${difficultyColor}`}>
              {t(`recipes.difficulty.${recipe.difficulty}`, { defaultValue: difficultyLabel.it })}
            </span>
            <span className="px-2 py-1 rounded-full bg-(--code-bg) text-(--text-h)">
              {t('recipes.category', { defaultValue: 'Categoria' })}: {category}
            </span>
            {isLowFODMAP && (
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                {t('recipes.low_fodmap', { defaultValue: 'Low-FODMAP' })}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 p-4 bg-(--bg) border border-(--border) rounded-xl">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-(--accent)">{recipe.servings}</div>
          <div className="text-xs text-(--text)">{t('recipes.servings', { defaultValue: 'Porzioni' })}</div>
        </div>
        <div className="text-center border-l border-(--border) pl-3 sm:pl-4">
          <div className="text-2xl sm:text-3xl font-bold text-(--text-h)">{formatTime(recipe.prepTimeMinutes)}</div>
          <div className="text-xs text-(--text)">{t('recipes.prep_time', { defaultValue: 'Preparazione' })}</div>
        </div>
        <div className="text-center border-l border-(--border) pl-3 sm:pl-4">
          <div className="text-2xl sm:text-3xl font-bold text-(--text-h)">{formatTime(recipe.cookTimeMinutes)}</div>
          <div className="text-xs text-(--text)">{t('recipes.cook_time', { defaultValue: 'Cottura' })}</div>
        </div>
        <div className="text-center border-l border-(--border) pl-3 sm:pl-4">
          <div className="text-2xl sm:text-3xl font-bold text-(--text-h)">{formatTime(totalTime)}</div>
          <div className="text-xs text-(--text)">{t('recipes.total_time', { defaultValue: 'Totale' })}</div>
        </div>
      </div>

      {/* Macro Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-(--bg) border border-(--border) rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-(--accent)">{macros.perServing.calories}</div>
          <div className="text-xs text-(--text)">{t('recipes.calories', { defaultValue: 'Calorie' })}</div>
          <div className="text-xs text-(--text-h) mt-1">{t('recipes.per_serving', { defaultValue: 'per porzione' })}</div>
        </div>
        <div className="bg-(--bg) border border-(--border) rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-500">{macros.perServing.protein}g</div>
          <div className="text-xs text-(--text)">{t('recipes.protein', { defaultValue: 'Proteine' })}</div>
          <div className="text-xs text-(--text-h) mt-1">{t('recipes.per_serving', { defaultValue: 'per porzione' })}</div>
        </div>
        <div className="bg-(--bg) border border-(--border) rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-amber-500">{macros.perServing.carbs}g</div>
          <div className="text-xs text-(--text)">{t('recipes.carbs', { defaultValue: 'Carboidrati' })}</div>
          <div className="text-xs text-(--text-h) mt-1">{t('recipes.per_serving', { defaultValue: 'per porzione' })}</div>
        </div>
        <div className="bg-(--bg) border border-(--border) rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-rose-500">{macros.perServing.fat}g</div>
          <div className="text-xs text-(--text)">{t('recipes.fat', { defaultValue: 'Grassi' })}</div>
          <div className="text-xs text-(--text-h) mt-1">{t('recipes.per_serving', { defaultValue: 'per porzione' })}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-(--border) mb-6">
        <nav className="flex gap-1" role="tablist">
          {[
            { id: 'details', label: t('recipes.tab_details', { defaultValue: 'Dettagli' }) },
            { id: 'nutrition', label: t('recipes.tab_nutrition', { defaultValue: 'Nutrizione' }) },
            { id: 'instructions', label: t('recipes.tab_instructions', { defaultValue: 'Preparazione' }) },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-(--accent) text-white'
                  : 'text-(--text) hover:text-(--text-h) hover:bg-(--code-bg)'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Ingredients */}
            <section>
              <h2 className="text-lg font-semibold text-(--text-h) mb-4 flex items-center gap-2">
                {t('recipes.ingredients', { defaultValue: 'Ingredienti' })}
                <InfoPopup infoKey="recipe_ingredients" className="ml-1.5" />
              </h2>
              <div className="space-y-2">
                {recipe.portions.map((portion) => {
                  const food = getFoodItem(portion.foodId);
                  const isProblematic = food && food.fodmapLevel === 'high';
                  return (
                    <div
                      key={portion.foodId}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isProblematic ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20' : 'border-(--border) bg-(--bg) hover:bg-(--code-bg)/50'
                      }`}
                      onClick={() => openFoodDetail(portion)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-(--accent)/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{food ? getFoodEmoji(food.category) : '🍽️'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-(--text-h) truncate">{portion.foodName}</span>
                          {isProblematic && (
                            <span className="px-1.5 py-0.5 text-xs rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              {t('recipes.high_fodmap', { defaultValue: 'High FODMAP' })}
                            </span>
                          )}
                          {food?.triggerGroup && (
                            <span className="px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {food.triggerGroup}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-(--text)">
                          {portion.grams}g · {portion.nutrition.calories} kcal · P: {portion.nutrition.protein}g C: {portion.nutrition.carbs}g F: {portion.nutrition.fat}g
                        </div>
                      </div>
                      <div className="text-(--accent) font-medium">
                        {t('recipes.click_for_details', { defaultValue: 'Dettagli →' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recipe Info */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-(--bg) border border-(--border) rounded-xl p-4">
                <h3 className="font-medium text-(--text-h) mb-3">{t('recipes.info', { defaultValue: 'Informazioni' })}</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-(--text)">{t('recipes.servings', { defaultValue: 'Porzioni' })}</dt>
                    <dd className="font-medium text-(--text-h)">{recipe.servings}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-(--text)">{t('recipes.difficulty_label', { defaultValue: 'Difficoltà' })}</dt>
                    <dd className="font-medium text-(--text-h)">
                      <span className={`px-2 py-0.5 rounded text-xs ${difficultyColor}`}>
                        {t(`recipes.difficulty.${recipe.difficulty}`, { defaultValue: difficultyLabel.it })}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-(--text)">{t('recipes.category', { defaultValue: 'Categoria' })}</dt>
                    <dd className="font-medium text-(--text-h)">{category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-(--text)">{t('recipes.meal_type', { defaultValue: 'Tipo pasto' })}</dt>
                    <dd className="font-medium text-(--text-h) capitalize">{recipe.mealType}</dd>
                  </div>
                  {seasonLabels && (
                    <div className="flex justify-between">
                      <dt className="text-(--text)">{t('recipes.seasonality', { defaultValue: 'Stagionalità' })}</dt>
                      <dd className="font-medium text-(--text-h)">{seasonLabels}</dd>
                    </div>
                  )}
                  {proteins.length > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-(--text)">{t('recipes.main_proteins', { defaultValue: 'Proteine principali' })}</dt>
                      <dd className="font-medium text-(--text-h)">{proteins.join(', ')}</dd>
                    </div>
                  )}
                  {recipe.tags.length > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-(--text)">{t('recipes.tags', { defaultValue: 'Tag' })}</dt>
                      <dd className="font-medium text-(--text-h)">
                        <div className="flex flex-wrap gap-1">
                          {recipe.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs rounded bg-(--code-bg) text-(--text-h)">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-(--bg) border border-(--border) rounded-xl p-4">
                <h3 className="font-medium text-(--text-h) mb-3">{t('recipes.macros_total', { defaultValue: 'Macro Totali (ricetta intera)' })}</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-(--text)">{t('recipes.calories', { defaultValue: 'Calorie' })}</dt><dd className="font-bold text-(--text-h)">{macros.total.calories} kcal</dd></div>
                  <div className="flex justify-between"><dt className="text-(--text)">{t('recipes.protein', { defaultValue: 'Proteine' })}</dt><dd className="font-bold text-blue-500">{macros.total.protein}g</dd></div>
                  <div className="flex justify-between"><dt className="text-(--text)">{t('recipes.carbs', { defaultValue: 'Carboidrati' })}</dt><dd className="font-bold text-amber-500">{macros.total.carbs}g</dd></div>
                  <div className="flex justify-between"><dt className="text-(--text)">{t('recipes.fat', { defaultValue: 'Grassi' })}</dt><dd className="font-bold text-rose-500">{macros.total.fat}g</dd></div>
                  <div className="flex justify-between"><dt className="text-(--text)">{t('recipes.fiber', { defaultValue: 'Fibre' })}</dt><dd className="font-bold text-green-500">{macros.total.fiber}g</dd></div>
                  <div className="flex justify-between"><dt className="text-(--text)">{t('recipes.sugar', { defaultValue: 'Zuccheri' })}</dt><dd className="font-bold text-orange-500">{macros.total.sugar}g</dd></div>
                  <div className="flex justify-between"><dt className="text-(--text)">{t('recipes.sodium', { defaultValue: 'Sodio' })}</dt><dd className="font-bold text-(--text-h)">{macros.total.sodium}mg</dd></div>
                </dl>
              </div>
            </section>

            {/* Actions */}
            <section className="flex flex-wrap gap-3 pt-4 border-t border-(--border)">
              <button
                onClick={handleAddToShoppingList}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent)/90 transition-colors"
              >
                🛒 {t('recipes.add_to_shopping', { defaultValue: 'Aggiungi a Shopping List' })}
              </button>
              <button
                onClick={handleAddToDietPlan}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-(--accent) text-(--accent) font-medium hover:bg-(--accent)/10 transition-colors"
              >
                🍽️ {t('recipes.add_to_diet', { defaultValue: 'Aggiungi a Piano Alimentare' })}
              </button>
              {recipe.isCustom && (
                <>
                  <button
                    onClick={handleEditRecipe}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-(--border) text-(--text-h) font-medium hover:bg-(--code-bg) transition-colors"
                  >
                    ✏️ {t('recipes.edit', { defaultValue: 'Modifica' })}
                  </button>
                  <button
                    onClick={handleDeleteRecipe}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-500/10 transition-colors"
                  >
                    🗑️ {t('recipes.delete', { defaultValue: 'Elimina' })}
                  </button>
                </>
              )}
            </section>
          </div>
        )}

        {/* NUTRITION TAB */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-(--text-h) mb-4">{t('recipes.nutrition_per_serving', { defaultValue: 'Valori nutrizionali per porzione' })}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-(--border) text-left">
                      <th className="pb-2 text-(--text)">{t('recipes.nutrient', { defaultValue: 'Nutriente' })}</th>
                      <th className="pb-2 text-(--text) text-right">{t('recipes.per_serving', { defaultValue: 'Per porzione' })}</th>
                      <th className="pb-2 text-(--text) text-right">{t('recipes.total', { defaultValue: 'Totale' })}</th>
                      <th className="pb-2 text-(--text) text-right">{t('recipes.per_100g', { defaultValue: 'Per 100g' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-(--border)/50">
                      <td className="py-2 font-medium text-(--text-h)">{t('recipes.calories', { defaultValue: 'Energia' })}</td>
                      <td className="py-2 text-right font-bold text-(--accent)">{macros.perServing.calories} kcal</td>
                      <td className="py-2 text-right text-(--text)">{macros.total.calories} kcal</td>
                      <td className="py-2 text-right text-(--text)">{Math.round(macros.total.calories / (recipe.portions.reduce((s, p) => s + p.grams, 0) / 100))} kcal</td>
                    </tr>
                    <tr className="border-b border-(--border)/50">
                      <td className="py-2 font-medium text-(--text-h)">{t('recipes.protein', { defaultValue: 'Proteine' })}</td>
                      <td className="py-2 text-right font-bold text-blue-500">{macros.perServing.protein}g</td>
                      <td className="py-2 text-right text-(--text)">{macros.total.protein}g</td>
                      <td className="py-2 text-right text-(--text)">{Math.round((macros.total.protein / (recipe.portions.reduce((s, p) => s + p.grams, 0) / 100)) * 10) / 10}g</td>
                    </tr>
                    <tr className="border-b border-(--border)/50">
                      <td className="py-2 font-medium text-(--text-h)">{t('recipes.carbs', { defaultValue: 'Carboidrati' })}</td>
                      <td className="py-2 text-right font-bold text-amber-500">{macros.perServing.carbs}g</td>
                      <td className="py-2 text-right text-(--text)">{macros.total.carbs}g</td>
                      <td className="py-2 text-right text-(--text)">{Math.round((macros.total.carbs / (recipe.portions.reduce((s, p) => s + p.grams, 0) / 100)) * 10) / 10}g</td>
                    </tr>
                    <tr className="border-b border-(--border)/50">
                      <td className="py-2 font-medium text-(--text-h)">{t('recipes.fat', { defaultValue: 'Grassi' })}</td>
                      <td className="py-2 text-right font-bold text-rose-500">{macros.perServing.fat}g</td>
                      <td className="py-2 text-right text-(--text)">{macros.total.fat}g</td>
                      <td className="py-2 text-right text-(--text)">{Math.round((macros.total.fat / (recipe.portions.reduce((s, p) => s + p.grams, 0) / 100)) * 10) / 10}g</td>
                    </tr>
                    <tr className="border-b border-(--border)/50">
                      <td className="py-2 font-medium text-(--text-h)">{t('recipes.fiber', { defaultValue: 'Fibre' })}</td>
                      <td className="py-2 text-right font-bold text-green-500">{macros.perServing.fiber}g</td>
                      <td className="py-2 text-right text-(--text)">{macros.total.fiber}g</td>
                      <td className="py-2 text-right text-(--text)">{Math.round((macros.total.fiber / (recipe.portions.reduce((s, p) => s + p.grams, 0) / 100)) * 10) / 10}g</td>
                    </tr>
                    <tr className="border-b border-(--border)/50">
                      <td className="py-2 font-medium text-(--text-h)">{t('recipes.sugar', { defaultValue: 'Zuccheri' })}</td>
                      <td className="py-2 text-right font-bold text-orange-500">{macros.perServing.sugar}g</td>
                      <td className="py-2 text-right text-(--text)">{macros.total.sugar}g</td>
                      <td className="py-2 text-right text-(--text)">{Math.round((macros.total.sugar / (recipe.portions.reduce((s, p) => s + p.grams, 0) / 100)) * 10) / 10}g</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-(--text-h)">{t('recipes.sodium', { defaultValue: 'Sodio' })}</td>
                      <td className="py-2 text-right font-bold text-(--text-h)">{macros.perServing.sodium}mg</td>
                      <td className="py-2 text-right text-(--text)">{macros.total.sodium}mg</td>
                      <td className="py-2 text-right text-(--text)">{Math.round((macros.total.sodium / (recipe.portions.reduce((s, p) => s + p.grams, 0) / 100)) * 10) / 10}mg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Micronutrients from ingredients */}
            <section>
              <h2 className="text-lg font-semibold text-(--text-h) mb-4">{t('recipes.micronutrients', { defaultValue: 'Micronutrienti principali' })}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {getTopMicronutrients(recipe).map(([micro, value]) => (
                  <div key={micro} className="bg-(--bg) border border-(--border) rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-(--accent)">{value}</div>
                    <div className="text-xs text-(--text) capitalize">{micro.replace(/_/g, ' ')}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* INSTRUCTIONS TAB */}
        {activeTab === 'instructions' && (
          <div className="space-y-4">
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-3 p-4 bg-(--bg) border border-(--border) rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-(--accent) text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1 text-(--text-h) leading-relaxed">{step}</div>
                </li>
              ))}
            </ol>
            {recipe.instructions.length === 0 && (
              <p className="text-(--text) text-center py-8">{t('recipes.no_instructions', { defaultValue: 'Nessuna istruzione disponibile' })}</p>
            )}
          </div>
        )}
      </div>

      {/* Food Detail Modal */}
      {showFoodModal && selectedPortion && (
        <FoodDetailModal
          foodId={showFoodModal}
          portion={selectedPortion}
          onClose={closeFoodModal}
          t={t}
        />
      )}
    </div>
  );
}

/**
 * Modal per dettagli alimento (link a Food Database)
 */
function FoodDetailModal({ foodId, portion, onClose, t }: { foodId: string; portion: MealPortion; onClose: () => void; t: (key: string, options?: any) => string }) {
  const food = FOODS_DATABASE.find(f => f.id === foodId);
  if (!food) return null;

  const monthNames = [
    '', t('months.jan', { defaultValue: 'Gennaio' }), t('months.feb', { defaultValue: 'Febbraio' }),
    t('months.mar', { defaultValue: 'Marzo' }), t('months.apr', { defaultValue: 'Aprile' }),
    t('months.may', { defaultValue: 'Maggio' }), t('months.jun', { defaultValue: 'Giugno' }),
    t('months.jul', { defaultValue: 'Luglio' }), t('months.aug', { defaultValue: 'Agosto' }),
    t('months.sep', { defaultValue: 'Settembre' }), t('months.oct', { defaultValue: 'Ottobre' }),
    t('months.nov', { defaultValue: 'Novembre' }), t('months.dec', { defaultValue: 'Dicembre' })
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-detail-title"
    >
      <div className="bg-(--bg) rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-(--bg) border-b border-(--border) p-4 flex justify-between items-center">
          <h2 id="food-detail-title" className="text-xl font-semibold text-(--text-h)">{food.name}</h2>
          <button onClick={onClose} className="text-(--text) hover:text-(--text-h) text-2xl leading-none" aria-label={t('common.close', { defaultValue: 'Chiudi' })}>×</button>
        </div>

        <div className="p-4 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-(--code-bg) rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-(--accent)">{food.nutrition.kcal}</div>
              <div className="text-xs text-(--text)">{t('foods.kcal_per_100g', { defaultValue: 'kcal/100g' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{food.nutrition.protein}g</div>
              <div className="text-xs text-(--text)">{t('foods.protein', { defaultValue: 'Proteine' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{food.nutrition.carbs}g</div>
              <div className="text-xs text-(--text)">{t('foods.carbs', { defaultValue: 'Carboidrati' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-500">{food.nutrition.fats}g</div>
              <div className="text-xs text-(--text)">{t('foods.fats', { defaultValue: 'Grassi' })}</div>
            </div>
          </div>

          {/* FODMAP & Category */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              food.fodmapLevel === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              food.fodmapLevel === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
              'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
            }`}>
              {food.fodmapLevel === 'low' ? t('foods.low_fodmap', { defaultValue: 'Low FODMAP' }) :
               food.fodmapLevel === 'medium' ? t('fodmap_details.medium_fodmap', { defaultValue: 'FODMAP Medio' }) :
               t('foods.high_fodmap', { defaultValue: 'High FODMAP' })}
            </span>
            {food.triggerGroup && (
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {t(`fodmap_${food.triggerGroup}`)}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-sm bg-(--code-bg) text-(--text-h)">
              {t(`categories.${food.category}`)}
            </span>
            {food.months && (
              <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                {t('foods.seasonal', { defaultValue: 'Stagionale' })}: {food.months.map(m => monthNames[m]).join(', ')}
              </span>
            )}
          </div>

          {/* Allergens */}
          {food.allergens && food.allergens.length > 0 && (
            <div>
              <h3 className="font-medium text-(--text-h) mb-2">{t('foods.allergens', { defaultValue: 'Allergeni' })}</h3>
              <div className="flex flex-wrap gap-2">
                {food.allergens.map(allergen => (
                  <span key={allergen} className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    {allergen.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Details */}
          <div>
            <h3 className="font-medium text-(--text-h) mb-3">{t('foods.nutrition_details', { defaultValue: 'Dettagli nutrizionali per 100g' })}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'fiber', label: t('foods.fiber', { defaultValue: 'Fibre' }), value: food.nutrition.fiber, unit: 'g' },
                { key: 'sugar', label: t('foods.sugar', { defaultValue: 'Zuccheri' }), value: food.nutrition.carbs * 0.1, unit: 'g' },
                ...Object.entries(food.nutrition.micronutrients || {}).map(([key, value]) => ({
                  key, label: t(`foods.micro.${key}`, { defaultValue: key.replace(/_/g, ' ') }), value, unit: getMicroUnit(key)
                }))
              ].filter(item => item.value && item.value > 0).map(item => (
                <div key={item.key} className="bg-(--code-bg) rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-(--text-h)">{typeof item.value === 'number' ? item.value.toFixed(item.value < 1 ? 2 : 0) : item.value}{item.unit}</div>
                  <div className="text-xs text-(--text)">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Portion Info */}
          <div className="p-3 rounded-lg border border-(--accent) bg-(--accent)/5">
            <h3 className="font-medium text-(--text-h) mb-2">{t('recipes.this_portion', { defaultValue: 'In questa porzione' })}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div><span className="text-(--text)">{t('recipes.grams', { defaultValue: 'Peso' })}:</span> <span className="font-medium">{portion.grams}g</span></div>
              <div><span className="text-(--text)">{t('recipes.calories', { defaultValue: 'Calorie' })}:</span> <span className="font-medium">{portion.nutrition.calories} kcal</span></div>
              <div><span className="text-(--text)">{t('recipes.protein', { defaultValue: 'Proteine' })}:</span> <span className="font-medium text-blue-500">{portion.nutrition.protein}g</span></div>
              <div><span className="text-(--text)">{t('recipes.carbs', { defaultValue: 'Carboidrati' })}:</span> <span className="font-medium text-amber-500">{portion.nutrition.carbs}g</span></div>
              <div><span className="text-(--text)">{t('recipes.fat', { defaultValue: 'Grassi' })}:</span> <span className="font-medium text-rose-500">{portion.nutrition.fat}g</span></div>
              <div><span className="text-(--text)">{t('recipes.fiber', { defaultValue: 'Fibre' })}:</span> <span className="font-medium text-green-500">{portion.nutrition.fiber}g</span></div>
              <div><span className="text-(--text)">{t('recipes.sodium', { defaultValue: 'Sodio' })}:</span> <span className="font-medium">{portion.nutrition.sodium}mg</span></div>
            </div>
          </div>

          {/* Alternative */}
          {food.alternative && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">{t('foods.alternative', { defaultValue: 'Alternativa low-FODMAP' })}</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">{food.alternative}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getFoodEmoji(category: string): string {
  switch (category) {
    case 'Carboidrati/Cereali': return '🌾';
    case 'Proteine/Formaggi': return '🥩';
    case 'Verdura': return '🥦';
    case 'Frutta': return '🍓';
    case 'Condimenti/Altro': return '🫒';
    default: return '🍽️';
  }
}

function getMicroUnit(key: string): string {
  const mgKeys = ['potassium', 'magnesium', 'calcium', 'iron', 'zinc', 'sodium', 'phosphorus', 'vitamin_c', 'vitamin_e', 'omega3'];
  const ugKeys = ['folate', 'vitamin_a', 'vitamin_d', 'b12', 'selenium', 'iodine', 'vitamin_k', 'vitamin_b6', 'manganese', 'copper'];
  if (mgKeys.includes(key)) return 'mg';
  if (ugKeys.includes(key)) return 'µg';
  return '';
}

function getTopMicronutrients(recipe: Recipe): [string, string][] {
  const microTotals: Record<string, number> = {};
  
  recipe.portions.forEach(portion => {
    const food = FOODS_DATABASE.find(f => f.id === portion.foodId);
    if (food?.microDetails) {
      Object.entries(food.microDetails).forEach(([key, value]) => {
        if (value && value > 0) {
          const factor = portion.grams / 100;
          microTotals[key] = (microTotals[key] || 0) + value * factor;
        }
      });
    }
  });

  return Object.entries(microTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key, value]) => [key, `${value.toFixed(value < 1 ? 2 : 0)}${getMicroUnit(key)}`]);
}