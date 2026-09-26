import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShoppingList, type ShoppingUnit } from '../hooks/useShoppingList';
import { useAppContext } from '../context/useAppContext';
import type { ShoppingListItem } from '../types/dietPlan';

const CATEGORIES = [
  'Carboidrati/Cereali',
  'Proteine/Formaggi',
  'Verdura',
  'Frutta',
  'Condimenti/Altro',
];

const UNITS: ShoppingUnit[] = ['g', 'kg', 'ml', 'pcs'];

interface FormData {
  foodName: string;
  category: string;
  totalGrams: string;
  unit: ShoppingUnit;
}

const emptyForm: FormData = {
  foodName: '',
  category: CATEGORIES[0],
  totalGrams: '',
  unit: 'g',
};

export default function ShoppingList() {
  const { t } = useTranslation();
  const { dietPlan } = useAppContext();
  const { state } = dietPlan;

  const {
    items,
    totals,
    togglePurchase,
    resetPurchases,
    addItem,
    updateItem,
    removeItem,
  } = useShoppingList({
    days: state.days,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const openAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (item: ShoppingListItem) => {
    setEditingItem(item);
    setForm({
      foodName: item.foodName,
      category: item.category,
      totalGrams: String(item.totalGrams),
      unit: item.unit,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grams = parseFloat(form.totalGrams);
    if (!form.foodName.trim() || Number.isNaN(grams) || grams <= 0) return;

    if (editingItem && editingItem.foodId.startsWith('custom-')) {
      updateItem(editingItem.foodId, {
        foodName: form.foodName.trim(),
        category: form.category,
        totalGrams: grams,
        unit: form.unit,
      });
    } else {
      addItem({
        foodName: form.foodName.trim(),
        category: form.category,
        totalGrams: grams,
        unit: form.unit,
      });
    }
    closeForm();
  };

  const handleRemove = (foodId: string) => {
    removeItem(foodId);
  };

  const formatQuantity = (grams: number, unit: string) => {
    if (unit === 'kg') {
      return `${(grams / 1000).toFixed(2)} kg`;
    }
    if (unit === 'ml') {
      return `${grams} ml`;
    }
    if (unit === 'pcs') {
      return `${grams} pz`;
    }
    return `${grams} g`;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Carboidrati/Cereali': t('categories.Carboidrati/Cereali', { defaultValue: 'Carboidrati & Cereali' }),
      'Proteine/Formaggi': t('categories.Proteine/Formaggi', { defaultValue: 'Proteine & Latticini' }),
      'Verdura': t('categories.Verdura', { defaultValue: 'Verdura' }),
      'Frutta': t('categories.Frutta', { defaultValue: 'Frutta' }),
      'Condimenti/Altro': t('categories.Condimenti/Altro', { defaultValue: 'Condimenti & Altro' }),
      'proteine': t('categories.proteine', { defaultValue: 'Proteine' }),
      'carboidrati': t('categories.carboidrati', { defaultValue: 'Carboidrati' }),
      'verdure': t('categories.verdure', { defaultValue: 'Verdure' }),
      'frutta': t('categories.frutta', { defaultValue: 'Frutta' }),
      'grassi': t('categories.grassi', { defaultValue: 'Grassi' }),
      'condimenti': t('categories.condimenti', { defaultValue: 'Condimenti' }),
      'bevande': t('categories.bevande', { defaultValue: 'Bevande' }),
      'altro': t('categories.altro', { defaultValue: 'Altro' }),
    };
    return categoryMap[category] || category;
  };

  // Group items by category
  const groupedItems = items.reduce((groups, item) => {
    const category = item.category || 'altro';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, typeof items>);

  const isManualItem = (item: ShoppingListItem) => item.foodId.startsWith('custom-');

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--text-h)">{t('shopping_title')}</h2>
        <div className="flex gap-2">
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
          >
            {t('shopping_add')}
          </button>
          <button
            onClick={resetPurchases}
            className="px-4 py-2 rounded-lg bg-(--code-bg) text-(--text) font-medium hover:bg-(--border) transition border border-(--border)"
          >
            {t('shopping_reset')}
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 rounded-xl bg-(--code-bg) border border-(--border)">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-(--text)">{t('shopping_total_items')}</p>
            <p className="text-xl font-bold text-(--text-h)">{totals.items}</p>
          </div>
          <div>
            <p className="text-sm text-(--text)">{t('shopping_total_grams')}</p>
            <p className="text-xl font-bold text-(--text-h)">{formatQuantity(totals.grams, 'g')}</p>
          </div>
          <div>
            <p className="text-sm text-(--text)">{t('shopping_purchased')}</p>
            <p className="text-xl font-bold text-(--text-h)">{totals.purchased}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="p-4 rounded-xl bg-(--bg) border border-(--border)">
            <h3 className="text-lg font-semibold text-(--text-h) mb-3">
              {getCategoryLabel(category)}
            </h3>
            <ul className="space-y-2">
              {categoryItems.map(item => (
                <li
                  key={item.foodId}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-(--code-bg) transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.isPurchased}
                      onChange={() => togglePurchase(item.foodId)}
                      className="w-4 h-4 rounded border-(--border) text-(--accent) focus:ring-(--accent) shrink-0"
                    />
                    <span className={`text-(--text) truncate ${item.isPurchased ? 'line-through opacity-60' : ''}`}>
                      {item.foodName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-(--text-h) font-medium">
                      {formatQuantity(item.totalGrams, item.unit)}
                    </span>
                    {isManualItem(item) && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          aria-label={t('shopping_edit', { defaultValue: 'Modifica' })}
                          className="p-1.5 rounded-md text-(--text) hover:bg-(--accent) hover:text-white transition"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleRemove(item.foodId)}
                          aria-label={t('shopping_delete', { defaultValue: 'Elimina' })}
                          className="p-1.5 rounded-md text-(--text) hover:bg-red-500 hover:text-white transition"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shopping-form-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-(--bg) border border-(--border) p-6 shadow-xl">
            <h3
              id="shopping-form-title"
              className="text-xl font-bold text-(--text-h) mb-4"
            >
              {editingItem ? t('shopping_edit_title') : t('shopping_add_title')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="shopping-name" className="block text-sm font-medium text-(--text) mb-1">
                  {t('shopping_name_label')}
                </label>
                <input
                  id="shopping-name"
                  type="text"
                  value={form.foodName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((prev) => ({ ...prev, foodName: e.target.value }))
                  }
                  placeholder={t('shopping_name_placeholder')}
                  className="w-full px-3 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                  required
                />
              </div>

              <div>
                <label htmlFor="shopping-category" className="block text-sm font-medium text-(--text) mb-1">
                  {t('shopping_category_label')}
                </label>
                <select
                  id="shopping-category"
                  value={form.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shopping-quantity" className="block text-sm font-medium text-(--text) mb-1">
                    {t('shopping_quantity_label')}
                  </label>
                  <input
                    id="shopping-quantity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={form.totalGrams}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setForm((prev) => ({ ...prev, totalGrams: e.target.value }))
                    }
                    placeholder="100"
                    className="w-full px-3 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="shopping-unit" className="block text-sm font-medium text-(--text) mb-1">
                    {t('shopping_unit_label')}
                  </label>
                  <select
                    id="shopping-unit"
                    value={form.unit}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setForm((prev) => ({ ...prev, unit: e.target.value as ShoppingUnit }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-(--code-bg) border border-(--border) text-(--text) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                  >
                    {UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {t(`shopping_unit_${unit}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2 rounded-lg bg-(--code-bg) text-(--text) font-medium hover:bg-(--border) transition border border-(--border)"
                >
                  {t('shopping_cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
                >
                  {editingItem ? t('shopping_save') : t('shopping_add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
