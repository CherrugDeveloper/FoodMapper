import { useTranslation } from 'react-i18next';
import type { MealKey } from '../types/dietPlan';
import { useRecipes } from '../hooks/useRecipes';
import type { Recipe } from '../types/dietPlan';

export default function Recipes() {
  const { t } = useTranslation();
  const { recipes, groupedRecipes, addCustomRecipe, deleteRecipe } = useRecipes();

  // For demo purposes, we'll add a sample recipe if none exist
  // In a real app, this would come from the diet plan or user input
  // We are not modifying the state here, just showing an example if empty.

  const handleAddCustom = () => {
    const newRecipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
      name: t('recipes.sample_recipe_name', { defaultValue: 'Ricetta Personalizzata' }),
      mealType: 'pranzo' as MealKey,
      portions: [], // User would fill this in a form
      instructions: [t('recipes.sample_instructions', { defaultValue: 'Seguire le indicazioni del piano alimentare.' })],
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      difficulty: 'medium',
      tags: ['personalizzato'],
      sourceDayIndex: 0,
      isCustom: true,
    };
    addCustomRecipe(newRecipe);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">{t('recipes.title', { defaultValue: 'Le Mie Ricette' })}</h1>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          {t('recipes.no_recipes', { defaultValue: 'Nessuna ricetta salvata. Inizia dal piano alimentare per salvare le tue prime ricette!' })}
        </p>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={handleAddCustom}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              {t('recipes.add_custom', { defaultValue: 'Aggiungi Ricetta Personalizzata' })}
            </button>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedRecipes).map(([mealType, recipesInGroup]) => (
              <div key={mealType} className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">{mealType}</h2>
                <div className="space-y-3">
                  {recipesInGroup.map((recipe) => (
                    <div key={recipe.id} className="border rounded p-3 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{recipe.name}</h3>
                          <p className="text-sm text-gray-500">{t(`recipes.difficulty.${recipe.difficulty}`, { defaultValue: recipe.difficulty })}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // In a real app, we would open an edit form
                              alert(t('recipes.edit_not_implemented', { defaultValue: 'Modifica non ancora implementata' }));
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteRecipe(recipe.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{recipe.instructions}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <span key={tag} className="bg-gray-200 text-xs font-medium px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                        {t('recipes.prep_time', { defaultValue: 'Preparazione' })}: {recipe.prepTimeMinutes} min |
                        {t('recipes.cook_time', { defaultValue: 'Cottura' })}: {recipe.cookTimeMinutes} min
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}