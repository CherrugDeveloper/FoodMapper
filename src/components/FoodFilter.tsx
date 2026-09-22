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
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('filter_title')}
      </h2>

      <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm space-y-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-(--text) mb-1">{t('filter_search_label')}</label>
            <input
              type="text"
              placeholder={t('filter_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text) mb-1">{t('filter_category_label')}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text) mb-1">{t('filter_month_label')}</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
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
          <label className="block text-sm font-medium text-(--text) mb-2">
            {t('filter_exclusion_label')}
          </label>
          <div className="flex flex-wrap gap-2">
            {allGroups.map(group => {
              const isSelected = excludedGroups.includes(group);
              return (
                <button
                  key={group}
                  onClick={() => toggleGroupExclusion(group)}
                  className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500 text-red-500'
                      : 'bg-(--code-bg) border-(--border) text-(--text) hover:text-(--text-h)'
                  }`}
                >
                  {isSelected
                    ? t('filter_btn_without', { group })
                    : t('filter_btn_eliminate', { group })}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredFoods.map((food: FoodItem) => (
          <div
            key={food.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              food.fodmapLevel === 'high' ? 'bg-red-500/5 border-red-500/30' : 'bg-emerald-500/5 border-emerald-500/30'
            }`}
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="font-bold text-(--text-h) text-base md:text-lg">
                  {t(`foods.${food.id}.name`)}
                </h4>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    food.fodmapLevel === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
                  }`}>
                    {food.fodmapLevel === 'high' ? t('filter_badge_high') : t('filter_badge_low')}
                  </span>
                  <span className="text-[11px] text-(--text) text-right">
                    {seasonalityLabel(food)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-(--text) block mb-2">📁 {t(`categories.${food.category}`)}</span>

              {/* Valori nutrizionali per 100g */}
              <div className="grid grid-cols-5 gap-1 mb-2 text-center">
                <div className="p-1.5 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text)">kcal</span>
                  <strong className="text-xs text-(--text-h)">{food.nutrition.kcal}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text)">{t('macro_p')}</span>
                  <strong className="text-xs text-(--text-h)">{food.nutrition.protein}g</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text)">{t('macro_c')}</span>
                  <strong className="text-xs text-(--text-h)">{food.nutrition.carbs}g</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text)">{t('macro_f')}</span>
                  <strong className="text-xs text-(--text-h)">{food.nutrition.fats}g</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-(--code-bg) border border-(--border)">
                  <span className="block text-[10px] uppercase text-(--text)">{t('macro_fib')}</span>
                  <strong className="text-xs text-(--text-h)">{food.nutrition.fiber}g</strong>
                </div>
              </div>

              {food.micros && food.micros.length > 0 && (
                <p className="text-[11px] text-(--text) mb-2">
                  ⚛️ {food.micros.map(m => t(`micros.${m}`)).join(' · ')}
                </p>
              )}

              {food.triggerGroup && (
                <p className="text-xs text-red-400 mb-2">
                  {t('filter_contains')} <span className="font-semibold">{food.triggerGroup}</span>
                </p>
              )}
            </div>

            {food.alternative && (
              <div className="mt-2 pt-2 border-t border-(--border) text-xs text-(--text)">
                <strong className="text-(--text-h)">{t('filter_alternative')}</strong> {t(`foods.${food.id}.alt`)}
              </div>
            )}
          </div>
        ))}

        {filteredFoods.length === 0 && (
          <p className="col-span-full text-center text-(--text) italic py-6">
            {t('filter_no_results')}
          </p>
        )}
      </div>
    </div>
  );
}
