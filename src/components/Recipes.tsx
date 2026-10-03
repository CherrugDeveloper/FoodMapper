import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import InfoPopup from './InfoPopup';
import type { MealKey, Recipe, MealPortion } from '../types/dietPlan';
import { useRecipes } from '../hooks/useRecipes';
import { RECIPES_DATABASE, calculateRecipeMacros, isRecipeLowFODMAP, DIFFICULTY_COLORS, DIFFICULTY_LABELS, RECIPE_CATEGORY_MAP } from '../utils/recipesData';

// Constants and helper functions must be defined before any hooks or conditional logic
const MEAL_TYPES: MealKey[] = ['colazione', 'pranzo', 'spuntino', 'cena'];
const DIFFICULTIES: Array<Recipe['difficulty']> = ['easy', 'medium', 'hard'];
const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;
const SIMULATED_SCAN_DELAY_MS = 1500;

export type RecipeInputMode = 'manual' | 'url' | 'photo';

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
  const navigate = useNavigate();
  const { userData } = useAppContext();
  const { recipes: userRecipes, addCustomRecipe, updateRecipe, deleteRecipe, getRecipeCompatibility } = useRecipes({ userData, showOnlyCompatible: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>(blankFormRecipe());
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<RecipeInputMode>('manual');
  const [isScanning, setIsScanning] = useState(false);
  const [extractionNotice, setExtractionNotice] = useState<string | null>(null);
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Combine predefined recipes with user recipes
  const allRecipes = useMemo(() => {
    const predefinedRecipes: Recipe[] = RECIPES_DATABASE.map((r, i) => ({
      ...r,
      id: `predefined-${i}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Recipe));
    return [...predefinedRecipes, ...userRecipes];
  }, [userRecipes]);

  // Filter recipes based on compatibility
  const filteredRecipes = useMemo(() => {
    if (!showOnlyCompatible || !userData) return allRecipes;
    return allRecipes.filter((recipe) => getRecipeCompatibility(recipe).isCompatible);
  }, [allRecipes, userData, showOnlyCompatible, getRecipeCompatibility]);

  // Group recipes by meal type
  const groupedRecipes = useMemo(() => {
    return filteredRecipes.reduce<Record<MealKey, Recipe[]>>((groups, recipe) => {
      groups[recipe.mealType] = [...(groups[recipe.mealType] || []), recipe];
      return groups;
    }, {
      colazione: [],
      pranzo: [],
      spuntino: [],
      cena: [],
    });
  }, [filteredRecipes]);

  const resetForm = useCallback(() => {
    setForm(blankFormRecipe());
    setEditingId(null);
    setPhotoError(null);
    setInputMode('manual');
    setIsScanning(false);
    setExtractionNotice(null);
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
    setInputMode(recipe.sourceUrl ? 'url' : recipe.photoUrl ? 'photo' : 'manual');
    setExtractionNotice(null);
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

  const generateExtractedRecipe = useCallback((sourceType: 'url' | 'photo', title: string): Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>> => {
    const now = new Date();
    const timestampedName = sourceType === 'photo'
      ? `${t('recipes.photo_recipe_default', { defaultValue: 'Piatto fotografato' })} — ${now.toLocaleDateString()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
      : title;
    return {
      name: timestampedName,
      portions: [
        { ...emptyPortion(), foodName: t('recipes.extracted_ingredient_1', { defaultValue: 'Ingrediente principale' }), grams: 200 },
        { ...emptyPortion(), foodName: t('recipes.extracted_ingredient_2', { defaultValue: 'Contorno' }), grams: 150 },
        { ...emptyPortion(), foodName: t('recipes.extracted_ingredient_3', { defaultValue: 'Condimento' }), grams: 15 },
      ],
      instructions: [
        t('recipes.extracted_step_1', { defaultValue: 'Preparare tutti gli ingredienti.' }),
        t('recipes.extracted_step_2', { defaultValue: 'Cuocere seguendo le indicazioni di sicurezza alimentare.' }),
        t('recipes.extracted_step_3', { defaultValue: 'Aggiustare sale, spezie e quantità in base alla tolleranza individuale.' }),
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      difficulty: 'easy',
      tags: sourceType === 'url' ? ['imported-url'] : ['photo-scan'],
      servings: 2,
    };
  }, [t]);

  const extractTitleFromUrl = useCallback((url: string): string => {
    try {
      const parsed = new URL(url);
      const lastSegment = parsed.pathname.split('/').filter(Boolean).pop() ?? '';
      const clean = lastSegment
        .replace(/\.(html?|php|aspx?)$/i, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .trim();
      return clean || t('recipes.extracted_title_fallback', { defaultValue: 'Ricetta importata' });
    } catch {
      return t('recipes.extracted_title_fallback', { defaultValue: 'Ricetta importata' });
    }
  }, [t]);

  const handleExtractFromUrl = useCallback(() => {
    const url = (form.sourceUrl ?? '').trim();
    if (!url) return;
    const title = extractTitleFromUrl(url);
    const extracted = generateExtractedRecipe('url', title);
    setForm((prev) => ({
      ...prev,
      ...extracted,
      sourceUrl: url,
    }));
    setExtractionNotice(t('recipes.url_extraction_notice', { defaultValue: 'Estrazione simulata: verifica e modifica i dati prima di salvare.' }));
  }, [form.sourceUrl, extractTitleFromUrl, generateExtractedRecipe, t]);

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setPhotoError(t('recipes.photo_too_large', { defaultValue: 'L\'immagine supera i 2 MB. Scegli un file più piccolo.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setPhotoError(null);
    setIsScanning(true);
    setExtractionNotice(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setTimeout(() => {
          const extracted = generateExtractedRecipe('photo', '');
          setForm((prev) => ({
            ...prev,
            ...extracted,
            photoUrl: result,
          }));
          setIsScanning(false);
          setExtractionNotice(t('recipes.photo_extraction_notice', { defaultValue: 'Scansione simulata: verifica e modifica i dati prima di salvare.' }));
        }, SIMULATED_SCAN_DELAY_MS);
      } else {
        setIsScanning(false);
      }
    };
    reader.onerror = () => setIsScanning(false);
    reader.readAsDataURL(file);
  }, [t, generateExtractedRecipe]);

  const clearPhoto = useCallback(() => {
    setForm((prev) => ({ ...prev, photoUrl: '' }));
    setPhotoError(null);
    setExtractionNotice(null);
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

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const navigateToRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">{t('recipes.title', { defaultValue: 'Le Mie Ricette' })}</h1>
        <button
          onClick={openAdd}
          className="w-full sm:w-auto bg-(--accent) hover:bg-(--accent)/90 text-white font-medium py-2.5 px-6 rounded transition-colors"
        >
          {t('recipes.add_recipe', { defaultValue: 'Nuova Ricetta' })}
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyCompatible}
            onChange={(e) => setShowOnlyCompatible(e.target.checked)}
            className="w-4 h-4 rounded border-(--border) text-(--accent) focus:ring-(--accent)"
          />
          <span className="text-sm text-(--text-h)">{t('recipes.show_compatible_only', { defaultValue: 'Mostra solo ricette compatibili' })}</span>
          <InfoPopup infoKey="recipe_compatible_filter" className="ml-1.5" />
        </label>
        {userData && (
          <span className="text-xs text-(--text) bg-(--code-bg) px-2 py-1 rounded">
            {t('recipes.filter_active', { defaultValue: 'Filtro attivo per: {conditions}', conditions: [...(userData.conditions ?? []), ...(userData.allergens ?? [])].join(', ') || 'nessuna condizione' })}
          </span>
        )}
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-10 sm:py-12 border border-dashed border-(--border) rounded-lg px-4">
          <p className="text-(--text) mb-4 text-sm sm:text-base">
            {t('recipes.no_recipes', { defaultValue: 'Nessuna ricetta salvata. Inizia dal piano alimentare per salvare le tue prime ricette oppure aggiungine una manualmente!' })}
          </p>
          <button
            onClick={openAdd}
            className="w-full sm:w-auto bg-(--accent) hover:bg-(--accent)/90 text-white font-medium py-2.5 sm:py-2 px-6 rounded transition-colors"
          >
            {t('recipes.add_custom', { defaultValue: 'Aggiungi Ricetta' })}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRecipes).map(([mealType, recipesInGroup]) =>
            recipesInGroup.length > 0 && (
              <section key={mealType} className="border border-(--border) rounded-lg p-3 sm:p-4 bg-(--bg)">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">{mealLabel(mealType as MealKey)}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recipesInGroup.map((recipe) => {
                    const compatibility = getRecipeCompatibility(recipe);
                    const macros = calculateRecipeMacros(recipe);
                    const isLowFODMAP = isRecipeLowFODMAP(recipe);
                    const category = RECIPE_CATEGORY_MAP[recipe.name] || 'Altro';
                    const difficultyColor = DIFFICULTY_COLORS[recipe.difficulty];
                    const difficultyLabel = DIFFICULTY_LABELS[recipe.difficulty];
                    const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

                    return (
                      <article
                        key={recipe.id}
                        className={`border border-(--border) rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-(--bg) ${!compatibility.isCompatible ? 'border-amber-500/30' : ''}`}
                        onClick={() => navigateToRecipe(recipe.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Recipe Image */}
                        <div className="relative h-40 sm:h-48 bg-(--code-bg) overflow-hidden">
                          {recipe.photoUrl ? (
                            <img
                              src={recipe.photoUrl}
                              alt={recipe.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                              {recipe.mealType === 'colazione' && '🍳'}
                              {recipe.mealType === 'pranzo' && '🍝'}
                              {recipe.mealType === 'cena' && '🍽️'}
                              {recipe.mealType === 'spuntino' && '🍎'}
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
                              {t(`recipes.difficulty.${recipe.difficulty}`, { defaultValue: difficultyLabel.it })}
                            </span>
                            {isLowFODMAP && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                {t('recipes.low_fodmap', { defaultValue: 'Low-FODMAP' })}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Recipe Content */}
                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold text-(--text-h) text-base line-clamp-1">{recipe.name}</h3>

                          {/* Category & Servings */}
                          <div className="flex items-center gap-2 text-xs text-(--text)">
                            <span className="px-2 py-0.5 rounded bg-(--code_bg) text-(--text-h)">{category}</span>
                            <span>·</span>
                            <span>{recipe.servings} {t('recipes.servings', { defaultValue: 'porzioni' })}</span>
                            <span>·</span>
                            <span>{formatTime(totalTime)}</span>
                          </div>

                          {/* Macro Summary */}
                          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-(--border)">
                            <div className="text-center">
                              <div className="text-lg font-bold text-(--accent)">{macros.perServing.calories}</div>
                              <div className="text-[10px] text-(--text)">{t('recipes.calories_short', { defaultValue: 'kcal' })}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-500">{macros.perServing.protein}g</div>
                              <div className="text-[10px] text-(--text)">{t('recipes.protein_short', { defaultValue: 'P' })}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-amber-500">{macros.perServing.carbs}g</div>
                              <div className="text-[10px] text-(--text)">{t('recipes.carbs_short', { defaultValue: 'C' })}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-rose-500">{macros.perServing.fat}g</div>
                              <div className="text-[10px] text-(--text)">{t('recipes.fat_short', { defaultValue: 'G' })}</div>
                            </div>
                          </div>

                          {/* Compatibility Warning */}
                          {!compatibility.isCompatible && (
                            <div className="flex flex-wrap gap-1">
                              {compatibility.problematicIngredients.slice(0, 2).map((ing, idx) => (
                                <span key={idx} className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                                  ⚠️ {ing.length > 15 ? ing.slice(0, 15) + '…' : ing}
                                </span>
                              ))}
                              {compatibility.problematicIngredients.length > 2 && (
                                <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                                  +{compatibility.problematicIngredients.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Tags */}
                          {recipe.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {recipe.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-0.5 text-[10px] rounded bg-(--code_bg) text-(--text-h)">
                                  {tag}
                                </span>
                              ))}
                              {recipe.tags.length > 3 && (
                                <span className="px-2 py-0.5 text-[10px] rounded bg-(--code_bg) text-(--text)">
                                  +{recipe.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Action buttons - only show on hover or for custom recipes */}
                          <div className="flex gap-2 pt-2 border-t border-(--border) opacity-0 group-hover:opacity-100 transition-opacity">
                            {recipe.isCustom && !recipe.id.startsWith('predefined-') && (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); openEdit(recipe); }}
                                  className="flex-1 text-xs px-2 py-1 rounded text-(--accent) hover:bg-(--accent)/10 transition-colors"
                                  aria-label={t('recipes.edit', { defaultValue: 'Modifica' })}
                                >
                                  ✏️ {t('recipes.edit_short', { defaultValue: 'Modifica' })}
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }}
                                  className="flex-1 text-xs px-2 py-1 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                                  aria-label={t('recipes.delete', { defaultValue: 'Elimina' })}
                                >
                                  🗑️ {t('recipes.delete_short', { defaultValue: 'Elimina' })}
                                </button>
                              </>
                            )}
                            {!recipe.isCustom && (
                              <button
                                onClick={(e) => { e.stopPropagation(); navigateToRecipe(recipe.id); }}
                                className="flex-1 text-xs px-2 py-1 rounded text-(--accent) hover:bg-(--accent)/10 transition-colors"
                              >
                                {t('recipes.view_details', { defaultValue: 'Dettagli' })} →
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )
          )}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="recipe-modal-title"
        >
          <div className="bg-(--bg) rounded-lg shadow-(--shadow) w-full max-w-2xl my-4 sm:my-8 mx-0 sm:mx-4 p-4 sm:p-6 text-left">
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

            <div className="space-y-4 max-h-[65vh] sm:max-h-[70vh] overflow-y-auto pr-1 sm:pr-2">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <InfoPopup infoKey="recipe_servings" className="ml-1.5 align-middle" />
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
                <label className="block text-sm font-medium text-(--text-h) mb-1">
                  {t('recipes.input_mode', { defaultValue: 'Modalità di inserimento' })}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['manual', 'url', 'photo'] as RecipeInputMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setInputMode(mode)}
                      className={`px-3 py-2 rounded text-sm border transition-colors ${
                        inputMode === mode
                          ? 'bg-(--accent) text-white border-(--accent)'
                          : 'bg-(--bg) text-(--text-h) border-(--border) hover:bg-(--code_bg)'
                      }`}
                      aria-pressed={inputMode === mode}
                    >
                      {mode === 'manual' && t('recipes.mode_manual', { defaultValue: 'Manuale' })}
                      {mode === 'url' && t('recipes.mode_url', { defaultValue: 'Da URL' })}
                      {mode === 'photo' && t('recipes.mode_photo', { defaultValue: 'Da foto' })}
                    </button>
                  ))}
                </div>
              </div>

              {inputMode === 'url' && (
                <div>
                  <label htmlFor="recipe-url" className="block text-sm font-medium text-(--text-h) mb-1">
                    {t('recipes.source_url_label', { defaultValue: 'URL ricetta' })}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="recipe-url"
                      type="url"
                      value={form.sourceUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('sourceUrl', e.target.value)}
                      className="flex-1 border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={handleExtractFromUrl}
                      disabled={!form.sourceUrl?.trim()}
                      className="px-4 py-2 rounded bg-(--accent) text-white font-medium hover:bg-(--accent)/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {t('recipes.extract_url', { defaultValue: 'Estrai' })}
                    </button>
                  </div>
                </div>
              )}

              {inputMode === 'photo' && (
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
                  {isScanning && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-(--text)">
                      <span className="inline-block w-4 h-4 border-2 border-(--accent) border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      {t('recipes.photo_scanning', { defaultValue: 'Analisi della foto in corso...' })}
                    </div>
                  )}
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
              )}

              {extractionNotice && (
                <div className="p-3 rounded border border-yellow-500/30 bg-yellow-500/10 text-sm text-(--text)">
                  {extractionNotice}
                </div>
              )}

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
                    <div key={portion.foodId} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={portion.foodName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePortionChange(index, 'foodName', e.target.value)}
                        placeholder={t('recipes.ingredient_name', { defaultValue: 'Nome ingrediente' })}
                        className="flex-1 border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={0}
                          value={portion.grams}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePortionChange(index, 'grams', e.target.value)}
                          placeholder={t('recipes.grams', { defaultValue: 'g' })}
                          className="w-full sm:w-24 border border-(--border) rounded px-3 py-2 bg-(--bg) text-(--text-h)"
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
                className="px-4 py-2 rounded border border-(--border) text-(--text-h) hover:bg-(--code_bg) transition-colors"
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