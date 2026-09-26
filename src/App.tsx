import { useState, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import Header from './components/Header';
import type { UserData, NutritionalResults } from './utils/nutritionEngine';
import { useDietPlan } from './hooks/useDietPlan';

// Lazy-loaded route components for code-splitting
const NutritionalCalculator = lazy(() => import('./components/NutritionalCalculator'));
const EducationalHub = lazy(() => import('./components/EducationalHub'));
const FoodFilter = lazy(() => import('./components/FoodFilter'));
const DietPlan = lazy(() => import('./components/DietPlan'));
const Diary = lazy(() => import('./components/Diary'));
const WorkoutPlan = lazy(() => import('./components/WorkoutPlan'));
const Devices = lazy(() => import('./components/Devices'));
const Recipes = lazy(() => import('./components/Recipes'));
const ShoppingList = lazy(() => import('./components/ShoppingList'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-75">
    <div className="animate-spin rounded-full h-10 w-10 border-3 border-(--accent) border-t-transparent" aria-label="Loading..." />
  </div>
);

const CALC_STORAGE_KEY = 'foodmapper_calc_results';
const USER_DATA_STORAGE_KEY = 'foodmapper_user_data';

type TabId = 'calc' | 'diary' | 'diet' | 'recipes' | 'shopping' | 'workout' | 'foods' | 'devices' | 'hub';

const TABS: { id: TabId; icon: string; labelKey: string }[] = [
  { id: 'calc', icon: '⚙️', labelKey: 'tab_calc' },
  { id: 'diary', icon: '📔', labelKey: 'tab_diary' },
  { id: 'diet', icon: '🍽️', labelKey: 'tab_diet' },
  { id: 'recipes', icon: '📖', labelKey: 'tab_recipes' },
  { id: 'shopping', icon: '🛒', labelKey: 'tab_shopping' },
  { id: 'workout', icon: '💪', labelKey: 'tab_workout' },
  { id: 'foods', icon: '🔍', labelKey: 'tab_foods' },
  { id: 'devices', icon: '⌚', labelKey: 'tab_devices' },
  { id: 'hub', icon: '📚', labelKey: 'tab_hub' }
];

export default function App() {
  const { t } = useTranslation();
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('calc');

  // Risultati del calcolo condivisi con Diario, Dieta e Allenamento
  const [calcResults, setCalcResults] = useState<NutritionalResults | null>(() => {
    try {
      const savedCalc = localStorage.getItem(CALC_STORAGE_KEY);
      return savedCalc ? (JSON.parse(savedCalc) as NutritionalResults) : null;
    } catch {
      return null;
    }
  });
  const [userData, setUserData] = useState<UserData | null>(() => {
    try {
      const savedUserData = localStorage.getItem(USER_DATA_STORAGE_KEY);
      return savedUserData ? (JSON.parse(savedUserData) as UserData) : null;
    } catch {
      return null;
    }
  });

  // Single source of truth for diet plan state
  const dietPlan = useDietPlan(calcResults, userData);

  const handleCalculate = (results: NutritionalResults, data: UserData) => {
    setCalcResults(results);
    setUserData(data);
    // Salva in localStorage
    try {
      localStorage.setItem(CALC_STORAGE_KEY, JSON.stringify(results));
      localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Silenzioso fallimento
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8">
      <MedicalDisclaimer onAccept={() => setIsAppUnlocked(true)} />

      {isAppUnlocked && (
        <div className="w-full max-w-4xl mt-8">
          <Header />

          {/* Navigazione a schede: centrata e responsiva senza overflow laterale. */}
          <nav className="w-full max-w-4xl mx-auto px-6 md:px-8 mb-4">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 pb-3">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-w-0 items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm md:text-base font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-(--accent) text-white border-(--accent) shadow-md'
                        : 'bg-(--bg) border-(--border) text-(--text) hover:text-(--text-h) hover:border-(--accent-border)'
                    }`}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    {t(tab.labelKey)}
                  </button>
                );
              })}
            </div>
          </nav>

          <main>
            <Suspense fallback={<LoadingFallback />}>
              {activeTab === 'calc' && (
                <NutritionalCalculator onCalculate={handleCalculate} initialResults={calcResults} />
              )}
              {activeTab === 'diary' && (
                <Diary
                  waterTargetLiters={calcResults?.waterLiters ?? null}
                  nutritionalResults={calcResults}
                  onGoToCalculator={() => setActiveTab('calc')}
                />
              )}
              {activeTab === 'diet' && (
                <DietPlan
                  results={calcResults}
                  userData={userData}
                  onGoToCalculator={() => setActiveTab('calc')}
                  dietPlan={dietPlan}
                />
              )}
              {activeTab === 'recipes' && (
                <Recipes />
              )}
              {activeTab === 'shopping' && (
                <ShoppingList
                  dietPlan={dietPlan}
                />
              )}
              {activeTab === 'workout' && (
                <WorkoutPlan
                  userData={userData}
                  onGoToCalculator={() => setActiveTab('calc')}
                />
              )}
              {activeTab === 'foods' && <FoodFilter />}
              {activeTab === 'devices' && <Devices />}
              {activeTab === 'hub' && <EducationalHub />}
            </Suspense>
          </main>
        </div>
      )}
    </div>
  );
}
