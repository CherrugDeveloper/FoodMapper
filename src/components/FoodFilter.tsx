import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FOODS_DATABASE } from '../utils/foodsData';
import type { FoodItem, Micro } from '../utils/foodsData';
import { MICRO_NUTRIENT_INFO, type SupportedLocale } from '../utils/microNutrientInfo';

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

const allGroups = ['Fruttani', 'Lattosio', 'Fruttosio', 'Galattani', 'Polioli'] as const;
const categories = ['All', 'Carboidrati/Cereali', 'Proteine/Formaggi', 'Verdura', 'Frutta', 'Condimenti/Altro'] as const;

type GroupCount = Record<string, number>;
type CategoryCount = Record<string, number>;

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return ['it', 'en', 'de', 'es', 'fr'].includes(locale);
}

export default function FoodFilter() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [excludedGroups, setExcludedGroups] = useState<string[]>([]);
  const [expandedMicros, setExpandedMicros] = useState<Record<string, boolean>>({});
  const [activeMicroInfo, setActiveMicroInfo] = useState<{ key: Micro; foodId: string } | null>(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentLocale = isSupportedLocale(i18n.language) ? i18n.language : 'en';

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

  const matchesSearch = useCallback((food: FoodItem, term: string) => {
    const normalized = term.toLowerCase();
    const translatedName = t(`foods.${food.id}.name`);
    return translatedName.toLowerCase().includes(normalized) || food.name.toLowerCase().includes(normalized);
  }, [t]);

  const baseFilteredFoods = useMemo(() => FOODS_DATABASE.filter((food: FoodItem) => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    // Senza mesi dichiarati = prodotto disponibile tutto l'anno, non scartato dal filtro stagionale
    const matchesMonth = monthNumber === null || !food.months || food.months.includes(monthNumber);
    const isExcluded = food.triggerGroup && excludedGroups.includes(food.triggerGroup);

    return matchesCategory && matchesMonth && !isExcluded;
  }), [selectedCategory, monthNumber, excludedGroups]);

  const filteredFoods = useMemo(() =>
    baseFilteredFoods.filter(food => matchesSearch(food, searchTerm)),
    [baseFilteredFoods, matchesSearch, searchTerm]
  );

  // Conteggio categorie e gruppi basato sui filtri attivi (search, mese, esclusioni)
  const allMonthNumber = useMemo(() =>
    selectedMonth === 'current' ? currentMonth : null,
    [selectedMonth, currentMonth]
  );

  const allFoodsForCounts = useMemo(() => {
    const base = FOODS_DATABASE.filter(food => {
      const matchesMonth = allMonthNumber === null || !food.months || food.months.includes(allMonthNumber);
      const isExcluded = food.triggerGroup && excludedGroups.includes(food.triggerGroup);
      return matchesMonth && !isExcluded;
    });

    return searchTerm ? base.filter(food => matchesSearch(food, searchTerm)) : base;
  }, [searchTerm, allMonthNumber, excludedGroups, matchesSearch]);

  const allCategoryCounts = useMemo(() => {
    const counts: CategoryCount = {};
    categories.forEach(cat => { counts[cat] = 0; });
    allFoodsForCounts.forEach(food => {
      counts[food.category] = (counts[food.category] ?? 0) + 1;
    });
    return counts;
  }, [allFoodsForCounts]);

  const allGroupCounts = useMemo(() => {
    const counts: GroupCount = {};
    allGroups.forEach(group => { counts[group] = 0; });
    allFoodsForCounts.forEach(food => {
      if (food.triggerGroup) {
        counts[food.triggerGroup] = (counts[food.triggerGroup] ?? 0) + 1;
      }
    });
    return counts;
  }, [allFoodsForCounts]);

  const monthLabel = (m: number) => t(`months.${MONTH_KEYS[m - 1]}`);

  const seasonalityLabel = (food: FoodItem): string => {
    if (!food.months) return `📅 ${t('seasons.all_year')}`;
    const sorted = [...food.months].sort((a, b) => a - b);
    return `📅 ${sorted.map(monthLabel).join(' · ')}`;
  };

  const toggleMicroDetails = (foodId: string) => {
    setExpandedMicros(prev => ({ ...prev, [foodId]: !prev[foodId] }));
  };

  const openMicroInfo = (key: Micro, foodId: string) => {
    setActiveMicroInfo(activeMicroInfo?.key === key && activeMicroInfo.foodId === foodId ? null : { key, foodId });
  };

  const renderMicroValue = (key: Micro, value: number) => {
    const info = MICRO_NUTRIENT_INFO[key];
    if (!info) return `${value}`;
    return `${value} ${info.unit.replace('/100g', '')}`;
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text) mb-2">{t('filter_category_label')}</label>
            <select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
              className="w-full p-3 rounded-xl border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent)"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {t(`categories.${cat}`)} {cat !== 'All' && `(${allCategoryCounts[cat] ?? 0})`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text) mb-2">{t('filter_month_label')}</label>
            <select
              value={selectedMonth}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(e.target.value)}
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
              const count = allGroupCounts[group] ?? 0;
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
                  <span className="ml-1.5 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-(--text)">
          {t('filter_count', { count: filteredFoods.length })}
        </p>
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
                <div className="mb-3">
                  <p className="text-xs text-(--text) leading-relaxed mb-2">
                    ⚛️ {food.micros.map(m => t(`micros.${m}`)).join(' · ')}
                  </p>
                  <button
                    onClick={() => toggleMicroDetails(food.id)}
                    className="text-xs font-medium text-(--accent) hover:underline cursor-pointer"
                    aria-expanded={!!expandedMicros[food.id]}
                  >
                    {expandedMicros[food.id] ? t('filter_micro_hide') : t('filter_micro_details')}
                  </button>

                  {expandedMicros[food.id] && (
                    <div className="mt-3 p-3 rounded-xl bg-(--code-bg) border border-(--border)">
                      <p className="text-[11px] uppercase font-semibold text-(--text) mb-2">/100g</p>
                      <div className="flex flex-wrap gap-2">
                        {food.micros.map(micro => {
                          const value = food.microDetails?.[micro] ?? food.nutrition.micronutrients?.[micro];
                          const info = MICRO_NUTRIENT_INFO[micro];
                          const isActive = activeMicroInfo?.key === micro && activeMicroInfo.foodId === food.id;

                          return (
                            <div key={micro} className="relative">
                              <button
                                onClick={() => openMicroInfo(micro, food.id)}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer text-left ${
                                  isActive
                                    ? 'bg-(--accent) text-white border-(--accent)'
                                    : 'bg-(--bg) border-(--border) text-(--text-h) hover:border-(--accent)'
                                }`}
                                title={info ? info[currentLocale].function : ''}
                              >
                                <span className="font-medium">{t(`micros.${micro}`)}</span>
                                {value !== undefined && (
                                  <span className="block opacity-90 mt-0.5">
                                    {renderMicroValue(micro, value)}
                                  </span>
                                )}
                              </button>

                              {isActive && info && (
                                <div className="absolute z-10 mt-2 left-0 w-64 p-3 rounded-xl bg-(--bg) border border-(--accent) shadow-lg text-xs text-(--text)">
                                  <p className="font-semibold text-(--text-h) mb-1">
                                    {t(`micros.${micro}`)} ({info.unit})
                                  </p>
                                  <div className="space-y-1.5">
                                    <p>
                                      <span className="font-medium text-emerald-500">{t('filter_micro_function')}:</span>{' '}
                                      {info[currentLocale].function}
                                    </p>
                                    <p>
                                      <span className="font-medium text-amber-500">{t('filter_micro_deficiency')}:</span>{' '}
                                      {info[currentLocale].deficiency}
                                    </p>
                                    <p>
                                      <span className="font-medium text-red-400">{t('filter_micro_excess')}:</span>{' '}
                                      {info[currentLocale].excess}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => setActiveMicroInfo(null)}
                                    className="mt-2 text-(--accent) hover:underline cursor-pointer"
                                  >
                                    {t('diary_hide_details')}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
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
