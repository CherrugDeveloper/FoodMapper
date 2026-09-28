import { useState, useEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import Header from './components/Header';
import { changelogEntries } from './utils/changelogData';
import { AppProvider } from './context/AppContext.tsx';
import { useAppContext } from './context/useAppContext';
import type { TabId } from './context/AppContextTypes';

const SEEN_VERSION_KEY = 'foodmapper_seen_changelog_version';

// Lazy-loaded route components for code-splitting
const NutritionalCalculator = lazy(() => import('./components/NutritionalCalculator'));
const EducationalHub = lazy(() => import('./components/EducationalHub'));
const FoodFilter = lazy(() => import('./components/FoodFilter'));
const DietPlan = lazy(() => import('./components/DietPlan'));
const Diary = lazy(() => import('./components/Diary'));
const WorkoutPlan = lazy(() => import('./components/WorkoutPlan'));
const Recipes = lazy(() => import('./components/Recipes'));
const ShoppingList = lazy(() => import('./components/ShoppingList'));
const Changelog = lazy(() => import('./components/Changelog'));
const DeveloperCard = lazy(() => import('./components/DeveloperCard'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-75">
    <div className="animate-spin rounded-full h-10 w-10 border-3 border-(--accent) border-t-transparent" aria-label="Loading..." />
  </div>
);


const TABS: { id: TabId; icon: string; labelKey: string }[] = [
  { id: 'calc', icon: '⚙️', labelKey: 'tab_calc' },
  { id: 'diary', icon: '📔', labelKey: 'tab_diary' },
  { id: 'diet', icon: '🍽️', labelKey: 'tab_diet' },
  { id: 'recipes', icon: '📖', labelKey: 'tab_recipes' },
  { id: 'shopping', icon: '🛒', labelKey: 'tab_shopping' },
  { id: 'workout', icon: '💪', labelKey: 'tab_workout' },
  { id: 'sleep', icon: '🌙', labelKey: 'tab_sleep' },
  { id: 'foods', icon: '🔍', labelKey: 'tab_foods' },
  { id: 'hub', icon: '📚', labelKey: 'tab_hub' },
  { id: 'changelog', icon: '📋', labelKey: 'tab_changelog' },
  { id: 'developer', icon: '👨‍💻', labelKey: 'tab_developer' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('calc');

  return (
    <AppProvider setActiveTab={setActiveTab}>
      <AppContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </AppProvider>
  );
}

interface AppContentProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

function AppContent({ activeTab, setActiveTab }: AppContentProps) {
  const { t } = useTranslation();
  const { calcResults, handleCalculate } = useAppContext();
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [hasNewChangelog, setHasNewChangelog] = useState(false);

  useEffect(() => {
    try {
      const latestVersion = changelogEntries[0]?.version;
      const seenVersion = localStorage.getItem(SEEN_VERSION_KEY);
      if (latestVersion && seenVersion !== latestVersion) {
        setHasNewChangelog(true);
      } else {
        setHasNewChangelog(false);
      }
    } catch {
      setHasNewChangelog(false);
    }
  }, [activeTab]);

  const handleTabClick = (tabId: TabId) => {
    if (tabId === 'changelog') {
      const latestVersion = changelogEntries[0]?.version;
      if (latestVersion) {
        try {
          localStorage.setItem(SEEN_VERSION_KEY, latestVersion);
        } catch {
          // Ignore storage errors
        }
      }
      setHasNewChangelog(false);
    }
    setActiveTab(tabId);
  };

  return (
    <div className="flex flex-col p-2 sm:p-4 md:p-6 lg:p-8 max-w-full">
      <MedicalDisclaimer onAccept={() => setIsAppUnlocked(true)} />

      {isAppUnlocked && (
        <div className="w-full mt-8">
          <Header />

          {/* Navigazione a schede: centrata e responsiva senza overflow laterale. */}
          <nav className="w-full mx-auto px-4 sm:px-6 md:px-8 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap justify-center gap-2 md:gap-3 pb-3">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                const showBadge = tab.id === 'changelog' && hasNewChangelog;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`relative flex min-w-0 items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-(--accent) text-white border-(--accent) shadow-md'
                        : 'bg-(--bg) border-(--border) text-(--text) hover:text-(--text-h) hover:border-(--accent-border)'
                    }`}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    {t(tab.labelKey)}
                    {showBadge && (
                      <span
                        className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block animate-pulse ml-1"
                        aria-label="Nuova versione disponibile"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          <main className="w-full">
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
              {activeTab === 'hub' && <EducationalHub />}
              {activeTab === 'changelog' && <Changelog />}
              {activeTab === 'developer' && <DeveloperCard />}
            </Suspense>
          </main>
        </div>
      )}
    </div>
  );
}
