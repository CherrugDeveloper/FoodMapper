import { useTranslation } from 'react-i18next';
import { useShoppingList } from '../hooks/useShoppingList';
import { useDietPlan } from '../hooks/useDietPlan';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';

interface ShoppingListProps {
  results: NutritionalResults | null;
  userData: UserData | null;
}

export default function ShoppingList({ results, userData }: ShoppingListProps) {
  const { t } = useTranslation();
  const { state } = useDietPlan(results, userData);
  
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

  const categories = Object.keys(groupedItems).sort();

  if (items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">{t('shopping.title', { defaultValue: 'Lista della Spesa' })}</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {t('shopping.no_items', { defaultValue: 'Nessun articolo nella lista. Genera un piano alimentare per creare la lista della spesa.' })}
          </p>
          <p className="text-sm text-gray-400">
            {t('shopping.hint', { defaultValue: 'Vai alla scheda "Piano Alimentare" e genera i giorni per popolare questa lista.' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('shopping.title', { defaultValue: 'Lista della Spesa' })}</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {t('shopping.total_items', { defaultValue: 'Articoli totali' })}: <span className="font-medium">{totals.items}</span>
          </div>
          <div className="text-sm text-gray-600">
            {t('shopping.total_weight', { defaultValue: 'Peso totale' })}: <span className="font-medium">{formatQuantity(totals.grams, 'g')}</span>
          </div>
          <div className="text-sm text-gray-600">
            {t('shopping.purchased', { defaultValue: 'Acquistati' })}: <span className="font-medium">{totals.purchased}/{totals.items}</span>
          </div>
          <button
            onClick={resetPurchases}
            className="text-sm text-red-500 hover:text-red-700"
            disabled={totals.purchased === 0}
          >
            {t('shopping.reset', { defaultValue: 'Resetta acquisti' })}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b font-semibold">
              {getCategoryLabel(category)}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({groupedItems[category].length} {t('shopping.items_count', { defaultValue: 'articoli' })})
              </span>
            </div>
            <div className="divide-y">
              {groupedItems[category].map((item) => (
                <div
                  key={item.foodId}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  style={{ opacity: item.isPurchased ? 0.6 : 1 }}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.isPurchased}
                      onChange={() => togglePurchase(item.foodId)}
                      className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="min-w-0">
                      <h3 className="font-medium truncate">{item.foodName}</h3>
                      <p className="text-sm text-gray-500">
                        {t('shopping.needed_for_days', { defaultValue: 'Necessario per i giorni' })}: {item.daysNeeded.map(d => d + 1).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">{formatQuantity(item.totalGrams, item.unit)}</p>
                    {item.estimatedCost && (
                      <p className="text-sm text-gray-500">
                        ~€{item.estimatedCost.toFixed(2)}
                      </p>
                    )}
                    {item.isPurchased && item.purchasedAt && (
                      <p className="text-xs text-green-600">
                        {t('shopping.purchased_at', { defaultValue: 'Acquistato il' })} {new Date(item.purchasedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">{t('shopping.tips_title', { defaultValue: 'Suggerimenti' })}</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• {t('shopping.tip1', { defaultValue: 'Spunta gli articoli man mano che li acquisti' })}</li>
          <li>• {t('shopping.tip2', { defaultValue: 'Le quantità sono calcolate per tutti i giorni del piano selezionati' })}</li>
          <li>• {t('shopping.tip3', { defaultValue: 'Modifica il piano alimentare per aggiornare automaticamente la lista' })}</li>
        </ul>
      </div>
    </div>
  );
}