import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FOODS_DATABASE } from '../utils/foodsData';
import type { FoodItem } from '../utils/foodsData';

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

export default function FoodFilter() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [excludedGroups, setExcludedGroups] = useState<string[]>([]);

  const currentMonth = new Date().getMonth() + 1;

  const toggleGroupExclusion = (group: string) => {
    setExcludedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const monthNumber = selectedMonth === 'current'
    ? currentMonth
    : selectedMonth === 'all'
      ? null
      : Number(selectedMonth);

  const filteredFoods = FOODS_DATABASE.filter((food: FoodItem) => {
    const translatedName = t(`foods.${food.id}.name`);
    const matchesSearch =
      translatedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    // Senza mesi dichiarati = prodotto disponibile tutto l'anno, non scartato dal filtro stagionale
    const matchesMonth = monthNumber === null || !food.months || food.months.includes(monthNumber);
    const isExcluded = food.triggerGroup && excludedGroups.includes(food.triggerGroup);

    return matchesSearch && matchesCategory && matchesMonth && !isExcluded;
  });

  const allGroups = ['Fruttani', 'Lattosio', 'Fruttosio', 'Galattani', 'Polioli'];
  const categories = ['All', 'Carboidrati/Cereali', 'Proteine/Formaggi', 'Verdura', 'Frutta', 'Condimenti/Altro'];

  const monthLabel = (m: number) => t(`months.${MONTH_KEYS[m - 1]}`);

  const seasonalityLabel = (food: FoodItem): string => {
    if (!food.months) return `📅 ${t('seasons.all_year')}`;
    const sorted = [...food.months].sort((a, b) => a - b);
    return `📅 ${sorted.map(monthLabel).join(' · ')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6 text-left">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('filter_title')}
      </h2>

      <div className="p-6 md:p-7 rounded-2xl bg-(--bg) border border-(--border) shadow-sm space-y-7 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-(--text) mb-2">{t('filter_search_label')}</label>
            <input
              type="text"
              placeholder={t('filter_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text) mb-2">{t('filter_category_label')}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text) mb-2">{t('filter_month_label')}</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
            >
              <option value="all">{t('filter_month_all')}</option>
              <option value="current">🗓️ {t('filter_month_current')}</option>
              {MONTH_KEYS.map((mk, i) => (
                <option key={mk} value={i + 1}>{t(`months.${mk}`)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text) mb-3">
            {t('filter_exclusion_label')}
          </label>
          <div className="flex flex-wrap gap-3">
            {allGroups.map(group => {
              const isSelected = excludedGroups.includes(group);
              return (
                <button
                  key={group}
                  onClick={() => toggleGroupExclusion(group)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500 text-red-500'
                      : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
                  }`}
                >
                  {isSelected
                    ? t('filter_btn_without', { group: t(`fodmap_${group}`) })
                    : t('filter_btn_eliminate', { group: t(`fodmap_${group}`) })}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filteredFoods.map((food: FoodItem) => (
          <div
            key={food.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              food.fodmapLevel === 'high' ? 'bg-red-500/5 border-red-500/30' : 'bg-emerald-500/5 border-emerald-500/30'
            }`}
          >
            <div>
              <div className="flex justify-between items-start gap-3 mb-2">
                <h4 className="font-bold text-(--text-h) text-base md:text-lg leading-snug">
                  {t(`foods.${food.id}.name`)}
                </h4>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    food.fodmapLevel === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
                  }`}>
                    {food.fodmapLevel === 'high' ? t('filter_badge_high') : t('filter_badge_low')}
                  </span>
                  <span className="text-xs text-(--text) text-right leading-snug">
                    {seasonalityLabel(food)}
                  </span>
                </div>
              </div>
              <span className="text-sm text-(--text) block mb-3">📁 {t(`categories.${food.category}`)}</span>

              {/* Valori nutrizionali per 100g */}
              <div className="grid grid-cols-5 gap-2 mb-3 text-center">
                <div className="p-2 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text) mb-1">kcal</span>
                  <strong className="text-sm text-(--text-h)">{food.nutrition.kcal}</strong>
                </div>
                <div className="p-2 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text) mb-1">{t('macro_p')}</span>
                  <strong className="text-sm text-(--text-h)">{food.nutrition.protein}g</strong>
                </div>
                <div className="p-2 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text) mb-1">{t('macro_c')}</span>
                  <strong className="text-sm text-(--text-h)">{food.nutrition.carbs}g</strong>
                </div>
                <div className="p-2 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text) mb-1">{t('macro_f')}</span>
                  <strong className="text-sm text-(--text-h)">{food.nutrition.fats}g</strong>
                </div>
                <div className="p-2 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text) mb-1">{t('macro_fib')}</span>
                  <strong className="text-sm text-(--text-h)">{food.nutrition.fiber}g</strong>
                </div>
              </div>

              {food.micros && food.micros.length > 0 && (
                <p className="text-xs text-(--text) mb-3 leading-relaxed">
                  ⚛️ {food.micros.map(m => t(`micros.${m}`)).join(' · ')}
                </p>
              )}

              {food.triggerGroup && (
                <p className="text-sm text-red-400 mb-3 leading-relaxed">
                  {t('filter_contains')} <span className="font-semibold">{t(`fodmap_${food.triggerGroup}`)}</span>
                </p>
              )}
            </div>

            {food.alternative && (
              <div className="mt-3 pt-3 border-t border-(--border) text-sm text-(--text) leading-relaxed">
                <strong className="text-(--text-h)">{t('filter_alternative')}</strong> {t(`foods.${food.id}.alt`)}
              </div>
            )}
          </div>
        ))}

        {filteredFoods.length === 0 && (
          <p className="col-span-full text-center text-(--text) italic py-8">
            {t('filter_no_results')}
          </p>
        )}
      </div>
    </div>
  );
}
