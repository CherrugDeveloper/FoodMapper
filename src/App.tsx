import { useState, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import Header from './components/Header';
import { AppProvider } from './context/AppContext.tsx';
import { useAppContext } from './context/useAppContext';

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

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-75">
    <div className="animate-spin rounded-full h-10 w-10 border-3 border-(--accent) border-t-transparent" aria-label="Loading..." />
  </div>
);

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
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { t } = useTranslation();
  const { calcResults, handleCalculate } = useAppContext();
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('calc');

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
                <DietPlan />
              )}
              {activeTab === 'recipes' && (
                <Recipes />
              )}
              {activeTab === 'shopping' && (
                <ShoppingList />
              )}
              {activeTab === 'workout' && (
                <WorkoutPlan />
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
