import { useTranslation } from 'react-i18next';
import { useShoppingList } from '../hooks/useShoppingList';
import { useAppContext } from '../context/AppContext';

export default function ShoppingList() {
  const { t } = useTranslation();
  const { dietPlan } = useAppContext();
  const { state } = dietPlan;
  
  // Use all days from the diet plan
  const { items, totals, togglePurchase, resetPurchases } = useShoppingList({
    days: state.days,
  });

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

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--text-h)">{t('shopping_title')}</h2>
        <button
          onClick={resetPurchases}
          className="px-4 py-2 rounded-lg bg-(--accent) text-white font-medium hover:bg-(--accent-hover) transition"
        >
          {t('shopping_reset')}
        </button>
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
                <li key={item.foodId} className="flex items-center justify-between p-2 rounded-lg hover:bg-(--code-bg) transition">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.isPurchased}
                      onChange={() => togglePurchase(item.foodId)}
                      className="w-4 h-4 rounded border-(--border) text-(--accent) focus:ring-(--accent)"
                    />
                    <span className="text-(--text)">{item.foodName}</span>
                  </div>
                  <span className="text-sm text-(--text-h) font-medium">
                    {formatQuantity(item.totalGrams, item.unit)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}