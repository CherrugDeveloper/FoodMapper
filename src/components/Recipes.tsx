import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { MealKey, Recipe, MealPortion } from '../types/dietPlan';
import { useRecipes } from '../hooks/useRecipes';

const MEAL_TYPES: MealKey[] = ['colazione', 'pranzo', 'spuntino', 'cena'];
const DIFFICULTIES: Array<Recipe['difficulty']> = ['easy', 'medium', 'hard'];
const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;

const emptyPortion: () => MealPortion = () => ({
  foodId: `food-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  foodName: '',
  grams: 0,
  nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
  isConfirmed: false,
  isModified: false,
});

const blankFormRecipe = (): Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  mealType: 'pranzo',
  portions: [emptyPortion()],
  instructions: [''],
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  difficulty: 'easy',
  tags: [],
  sourceDayIndex: -1,
  isCustom: true,
  sourceUrl: '',
  photoUrl: '',
  servings: 1,
});

export default function Recipes() {
  const { t } = useTranslation();
  const { recipes, groupedRecipes, addCustomRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>(blankFormRecipe());
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = useCallback(() => {
    setForm(blankFormRecipe());
    setEditingId(null);
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const openAdd = useCallback(() => {
    resetForm();
    setIsModalOpen(true);
  }, [resetForm]);

  const openEdit = useCallback((recipe: Recipe) => {
    setForm({
      name: recipe.name,
      mealType: recipe.mealType,
      portions: recipe.portions.length > 0 ? recipe.portions : [emptyPortion()],
      instructions: recipe.instructions.length > 0 ? recipe.instructions : [''],
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      difficulty: recipe.difficulty,
      tags: recipe.tags,
      sourceDayIndex: recipe.sourceDayIndex,
      isCustom: recipe.isCustom,
      sourceUrl: recipe.sourceUrl ?? '',
      photoUrl: recipe.photoUrl ?? '',
      servings: recipe.servings,
    });
    setEditingId(recipe.id);
    setPhotoError(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
  }, [resetForm]);

  const handleFieldChange = useCallback(<K extends keyof typeof form>(field: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNumericChange = useCallback((field: 'prepTimeMinutes' | 'cookTimeMinutes' | 'servings', value: string) => {
    const parsed = value === '' ? 0 : Math.max(0, Number(value));
    setForm((prev) => ({ ...prev, [field]: Number.isNaN(parsed) ? 0 : parsed }));
  }, []);

  const handleTagInput = useCallback((raw: string) => {
    setForm((prev) => ({
      ...prev,
      tags: raw.split(',').map((tag) => tag.trim()).filter(Boolean),
    }));
  }, []);

  const handleInstructionChange = useCallback((index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.instructions];
      next[index] = value;
      return { ...prev, instructions: next };
    });
  }, []);

  const addInstruction = useCallback(() => {
    setForm((prev) => ({ ...prev, instructions: [...prev.instructions, ''] }));
  }, []);

  const removeInstruction = useCallback((index: number) => {
    setForm((prev) => {
      const next = prev.instructions.filter((_, i) => i !== index);
      return { ...prev, instructions: next.length > 0 ? next : [''] };
    });
  }, []);

  const handlePortionChange = useCallback((index: number, field: 'foodName' | 'grams', value: string) => {
    setForm((prev) => {
      const next = [...prev.portions];
      const portion = { ...next[index] };
      if (field === 'grams') {
        const parsed = value === '' ? 0 : Math.max(0, Number(value));
        portion.grams = Number.isNaN(parsed) ? 0 : parsed;
      } else {
        portion.foodName = value;
      }
      next[index] = portion;
      return { ...prev, portions: next };
    });
  }, []);

  const addPortion = useCallback(() => {
    setForm((prev) => ({ ...prev, portions: [...prev.portions, emptyPortion()] }));
  }, []);

  const removePortion = useCallback((index: number) => {
    setForm((prev) => {
      const next = prev.portions.filter((_, i) => i !== index);
      return { ...prev, portions: next.length > 0 ? next : [emptyPortion()] };
    });
  }, []);

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setPhotoError(t('recipes.photo_too_large', { defaultValue: 'L\'immagine supera i 2 MB. Scegli un file più piccolo.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setForm((prev) => ({ ...prev, photoUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  }, [t]);

  const clearPhoto = useCallback(() => {
    setForm((prev) => ({ ...prev, photoUrl: '' }));
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!form.name.trim()) return false;
    if (!MEAL_TYPES.includes(form.mealType)) return false;
    if (form.portions.some((p) => !p.foodName.trim() || p.grams <= 0)) return false;
    if (form.instructions.every((i) => !i.trim())) return false;
    if (form.sourceUrl && !/^https?:\/\/.+/i.test(form.sourceUrl)) return false;
    return true;
  }, [form]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;
    const payload: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
      ...form,
      sourceUrl: form.sourceUrl || undefined,
      photoUrl: form.photoUrl || undefined,
      tags: form.tags.length > 0 ? form.tags : ['custom'],
    };
    if (editingId) {
      updateRecipe(editingId, payload);
    } else {
      addCustomRecipe(payload);
    }
    closeModal();
  }, [form, editingId, addCustomRecipe, updateRecipe, closeModal, validateForm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  const mealLabel = (mealType: MealKey) => t(`diet_meals_${mealType === 'colazione' ? 'breakfast' : mealType === 'pranzo' ? 'lunch' : mealType === 'spuntino' ? 'snack' : 'dinner'}`);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">{t('recipes.title', { defaultValue: 'Le Mie Ricette' })}</h1>

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={openAdd}
          className="bg-(--accent) hover:bg-(--accent)/90 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {t('recipes.add_custom', { defaultValue: 'Aggiungi Ricetta' })}
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-(--border) rounded-lg">
          <p className="text-(--text) mb-4">
            {t('recipes.no_recipes', { defaultValue: 'Nessuna ricetta salvata. Inizia dal piano alimentare per salvare le tue prime ricette oppure aggiungine una manualmente!' })}
          </p>
          <button
            onClick={openAdd}
            className="bg-(--accent) hover:bg-(--accent)/90 text-white font-medium py-2 px-6 rounded transition-colors"
          >
            {t('recipes.add_custom', { defaultValue: 'Aggiungi Ricetta' })}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRecipes).map(([mealType, recipesInGroup]) => (
            recipesInGroup.length > 0 && (
              <section key={mealType} className="border border-(--border) rounded-lg p-4 bg-(--bg)">
                <h2 className="text-xl font-semibold mb-4">{mealLabel(mealType as MealKey)}</h2>
                <div className="space-y-3">
                  {recipesInGroup.map((recipe) => (
                    <article key={recipe.id} className="border border-(--border) rounded p-3 hover:shadow-md transition-shadow text-left">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-(--text-h)">{recipe.name}</h3>
                          <p className="text-sm text-(--text)">
                            {t(`recipes.difficulty.${recipe.difficulty}`, { defaultValue: recipe.difficulty })} · {recipe.servings} {t('recipes.servings', { defaultValue: 'porzioni' })}
                          </p>
                        </div>
                        <div className="flex space-x-2 shrink-0">
                          <button
                            onClick={() => openEdit(recipe)}
                            className="text-(--accent) hover:text-(--text-h)"
                            aria-label={t('recipes.edit', { defaultValue: 'Modifica' })}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteRecipe(recipe.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={t('recipes.delete', { defaultValue: 'Elimina' })}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {recipe.photoUrl && (
                        <img
                          src={recipe.photoUrl}
                          alt={recipe.name}
                          className="mt-3 w-full max-h-48 object-cover rounded"
                          loading="lazy"
                        />
                      )}

                      <div className="mt-3 text-sm text-(--text)">
                        <p className="font-medium">{t('recipes.ingredients', { defaultValue: 'Ingredienti' })}:</p>
                        <ul className="list-disc list-inside">
                          {recipe.portions.map((portion) => (
                            <li key={portion.foodId}>{portion.foodName} — {portion.grams} g</li>
                          ))}
                        </ul>
                      </div>

                      <ol className="mt-3 list-decimal list-inside text-sm text-(--text)">
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>

                      {recipe.sourceUrl && (
                        <a
                          href={recipe.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block text-sm text-(--accent) hover:underline break-all"
                        >
                          {t('recipes.source_url', { defaultValue: 'Fonte ricetta' })}
                        </a>
                      )}

                      <div className="mt-3 pt-2 border-t border-(--border) text-xs text-(--text)">
                        {t('recipes.prep_time', { defaultValue: 'Preparazione' })}: {recipe.prepTimeMinutes} min | {t('recipes.cook_time', { defaultValue: 'Cottura' })}: {recipe.cookTimeMinutes} min
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <span key={tag} className="bg-(--code-bg) text-(--text-h) text-xs font-medium px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="recipe-modal-title"
        >
          <div className="bg-(--bg) rounded-lg shadow-[var(--shadow)] w-full max-w-2xl my-8 p-6 text-left">
            <div className="flex justify-between items-start mb-4">
              <h2 id="recipe-modal-title" className="text-xl font-semibold text-(--text-h)">
                {editingId ? t('recipes.edit_recipe', { defaultValue: 'Modifica Ricetta' }) : t('recipes.add_recipe', { defaultValue: 'Nuova Ricetta' })}
              </h2>
              <button
                onClick={closeModal}
                className="text-(--text) hover:text-(--text-h) text-2xl leading-none"
                aria-label={t('recipes.close', { defaultValue: 'Chiudi' })}
              >
                ×
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label htmlFor="recipe-name" className="block text-sm font-medium text-(--text-h) mb-1">
                  {t('recipes.name', { defaultValue: 'Nome' })} *
                </label>
                <input
                  id="recipe-name"
                  type="text"
                  value={form.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('name', e.target.value)}
                  className="w-full border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                  placeholder={t('recipes.name_placeholder', { defaultValue: 'Es. Pasta con zucchine' })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="recipe-meal" className="block text-sm font-medium text-(--text-h) mb-1">
                    {t('recipes.meal_type', { defaultValue: 'Tipo di pasto' })} *
                  </label>
                  <select
                    id="recipe-meal"
                    value={form.mealType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('mealType', e.target.value as MealKey)}
                    className="w-full border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                  >
                    {MEAL_TYPES.map((meal) => (
                      <option key={meal} value={meal}>
                        {mealLabel(meal)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="recipe-difficulty" className="block text-sm font-medium text-(--text-h) mb-1">
                    {t('recipes.difficulty_label', { defaultValue: 'Difficoltà' })}
                  </label>
                  <select
                    id="recipe-difficulty"
                    value={form.difficulty}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('difficulty', e.target.value as Recipe['difficulty'])}
                    className="w-full border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                  >
                    {DIFFICULTIES.map((diff) => (
                      <option key={diff} value={diff}>
                        {t(`recipes.difficulty.${diff}`, { defaultValue: diff })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="recipe-prep" className="block text-sm font-medium text-(--text-h) mb-1">
                    {t('recipes.prep_time', { defaultValue: 'Preparazione' })} (min)
                  </label>
                  <input
                    id="recipe-prep"
                    type="number"
                    min={0}
                    value={form.prepTimeMinutes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericChange('prepTimeMinutes', e.target.value)}
                    className="w-full border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                  />
                </div>
                <div>
                  <label htmlFor="recipe-cook" className="block text-sm font-medium text-(--text-h) mb-1">
                    {t('recipes.cook_time', { defaultValue: 'Cottura' })} (min)
                  </label>
                  <input
                    id="recipe-cook"
                    type="number"
                    min={0}
                    value={form.cookTimeMinutes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericChange('cookTimeMinutes', e.target.value)}
                    className="w-full border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                  />
                </div>
                <div>
                  <label htmlFor="recipe-servings" className="block text-sm font-medium text-(--text-h) mb-1">
                    {t('recipes.servings', { defaultValue: 'Porzioni' })}
                  </label>
                  <input
                    id="recipe-servings"
                    type="number"
                    min={1}
                    value={form.servings}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericChange('servings', e.target.value)}
                    className="w-full border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="recipe-tags" className="block text-sm font-medium text-(--text-h) mb-1">
                  {t('recipes.tags', { defaultValue: 'Tag' })}
                </label>
                <input
                  id="recipe-tags"
                  type="text"
                  value={form.tags.join(', ')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTagInput(e.target.value)}
                  className="w-full border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                  placeholder={t('recipes.tags_placeholder', { defaultValue: 'vegetarian, gluten-free, batch-cook' })}
                />
              </div>

              <div>
                <label htmlFor="recipe-url" className="block text-sm font-medium text-(--text-h) mb-1">
                  {t('recipes.source_url_label', { defaultValue: 'URL ricetta' })}
                </label>
                <input
                  id="recipe-url"
                  type="url"
                  value={form.sourceUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('sourceUrl', e.target.value)}
                  className="w-full border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label htmlFor="recipe-photo" className="block text-sm font-medium text-(--text-h) mb-1">
                  {t('recipes.photo', { defaultValue: 'Foto' })}
                </label>
                <input
                  id="recipe-photo"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="block w-full text-sm text-(--text) file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-(--accent) file:text-white hover:file:bg-(--accent)/90"
                />
                {photoError && <p className="mt-1 text-sm text-red-500">{photoError}</p>}
                {form.photoUrl && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={form.photoUrl}
                      alt={t('recipes.photo_preview', { defaultValue: 'Anteprima' })}
                      className="h-24 w-auto rounded border border-(--border)"
                    />
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      aria-label={t('recipes.remove_photo', { defaultValue: 'Rimuovi foto' })}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-(--text-h)">{t('recipes.ingredients', { defaultValue: 'Ingredienti' })} *</span>
                  <button
                    type="button"
                    onClick={addPortion}
                    className="text-sm text-(--accent) hover:underline"
                  >
                    {t('recipes.add_ingredient', { defaultValue: '+ Aggiungi ingrediente' })}
                  </button>
                </div>
                <div className="space-y-2">
                  {form.portions.map((portion, index) => (
                    <div key={portion.foodId} className="flex gap-2">
                      <input
                        type="text"
                        value={portion.foodName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePortionChange(index, 'foodName', e.target.value)}
                        placeholder={t('recipes.ingredient_name', { defaultValue: 'Nome ingrediente' })}
                        className="flex-1 border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                      />
                      <input
                        type="number"
                        min={0}
                        value={portion.grams}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePortionChange(index, 'grams', e.target.value)}
                        placeholder={t('recipes.grams', { defaultValue: 'g' })}
                        className="w-24 border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                      />
                      <button
                        type="button"
                        onClick={() => removePortion(index)}
                        className="text-red-500 hover:text-red-700 px-2"
                        aria-label={t('recipes.remove_ingredient', { defaultValue: 'Rimuovi ingrediente' })}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-(--text-h)">{t('recipes.instructions', { defaultValue: 'Istruzioni' })} *</span>
                  <button
                    type="button"
                    onClick={addInstruction}
                    className="text-sm text-(--accent) hover:underline"
                  >
                    {t('recipes.add_step', { defaultValue: '+ Aggiungi passaggio' })}
                  </button>
                </div>
                <div className="space-y-2">
                  {form.instructions.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea
                        value={step}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInstructionChange(index, e.target.value)}
                        placeholder={t('recipes.step_placeholder', { defaultValue: 'Descrivi il passaggio...' })}
                        rows={2}
                        className="flex-1 border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h) resize-y"
                      />
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="text-red-500 hover:text-red-700 px-2 self-start"
                        aria-label={t('recipes.remove_step', { defaultValue: 'Rimuovi passaggio' })}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-(--border)">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded border border-(--border) text-(--text-h) hover:bg-(--code-bg) transition-colors"
              >
                {t('recipes.cancel', { defaultValue: 'Annulla' })}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!validateForm()}
                className="px-4 py-2 rounded bg-(--accent) text-white font-medium hover:bg-(--accent)/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingId ? t('recipes.save_changes', { defaultValue: 'Salva modifiche' }) : t('recipes.save', { defaultValue: 'Salva ricetta' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}