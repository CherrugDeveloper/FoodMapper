import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FOODS_DATABASE } from '../utils/foodsData';
import type { FoodItem } from '../utils/foodsData';

export default function FoodFilter() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [excludedGroups, setExcludedGroups] = useState<string[]>([]);

  const toggleGroupExclusion = (group: string) => {
    setExcludedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const filteredFoods = FOODS_DATABASE.filter((food: FoodItem) => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const isExcluded = food.triggerGroup && excludedGroups.includes(food.triggerGroup);
    
    return matchesSearch && matchesCategory && !isExcluded;
  });

  const allGroups = ['Fruttani', 'Lattosio', 'Fruttosio', 'Galattani', 'Polioli'];
  const categories = ['All', 'Carboidrati/Cereali', 'Proteine/Formaggi', 'Verdura', 'Frutta', 'Condimenti/Altro'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left mt-8 border-t border-(--border)">
      <h2 className="text-2xl font-bold text-(--text-h) mb-4 text-center md:text-left">
        {t('filter_title')}
      </h2>

      <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm space-y-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
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
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  food.fodmapLevel === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {food.fodmapLevel === 'high' ? t('filter_badge_high') : t('filter_badge_low')}
                </span>
              </div>
              <span className="text-xs text-(--text) block mb-2">📁 {t(`categories.${food.category}`)}</span>
              
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
