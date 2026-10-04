import { useState, useEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import Header from './components/Header';
import { changelogEntries } from './utils/changelogData';
import { AppProvider } from './context/AppContext.tsx';
import { useAppContext } from './context/useAppContext';
import type { TabId } from './context/AppContextTypes';
import { useToast } from './hooks/useToast';
import { Toast } from './components/Toast';

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
const RecipeDetail = lazy(() => import('./components/RecipeDetail'));
const SleepTracker = lazy(() => import('./components/SleepTracker'));

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
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { t } = useTranslation();
  const { calcResults, handleCalculate } = useAppContext();
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [hasNewChangelog, setHasNewChangelog] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    const checkChangelog = () => {
      try {
        const latestVersion = changelogEntries[0]?.version;
        const seenVersion = localStorage.getItem(SEEN_VERSION_KEY);
        setHasNewChangelog(latestVersion && seenVersion !== latestVersion ? true : false);
      } catch {
        setHasNewChangelog(false);
      }
    };
    checkChangelog();
    // Listen for popstate events to update active tab highlight
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="flex flex-col p-2 sm:p-4 md:p-6 lg:p-8 max-w-full" data-testid="app-root">
      <MedicalDisclaimer onAccept={() => setIsAppUnlocked(true)} />

      {isAppUnlocked && (
        <div className="w-full mt-8">
          <Header />

          {/* Desktop navigation tabs: fixed alignment and style */}
          <nav className="w-full mx-auto px-4 sm:px-6 md:px-8 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap justify-center items-center gap-2 md:gap-4 pb-4">
              {TABS.map(tab => {
                const showBadge = tab.id === 'changelog' && hasNewChangelog;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      window.history.pushState(null, '', `/${tab.id}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`relative flex min-w-0 items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                      currentPath === `/${tab.id}` || (tab.id === 'calc' && currentPath === '/')
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
              <Routes>
                              <Route path="/" element={<Navigate to="/calc" replace />} />
                              <Route path="/calc" element={<NutritionalCalculator onCalculate={handleCalculate} initialResults={calcResults} />} />
                              <Route path="/diary" element={<Diary waterTargetLiters={calcResults?.waterLiters ?? null} nutritionalResults={calcResults} />} />
                              <Route path="/diet" element={<DietPlan />} />
                              <Route path="/recipes" element={<Recipes />} />
                              <Route path="/recipes/:recipeId" element={<RecipeDetail />} />
                              <Route path="/shopping" element={<ShoppingList />} />
                              <Route path="/workout" element={<WorkoutPlan />} />
                              <Route path="/sleep" element={<SleepTracker />} />
                              <Route path="/foods" element={<FoodFilter />} />
                              <Route path="/hub" element={<EducationalHub />} />
                              <Route path="/changelog" element={<Changelog />} />
                              <Route path="/developer" element={<DeveloperCard />} />
                              <Route path="*" element={<Navigate to="/calc" replace />} />
                            </Routes>
            </Suspense>
          </main>
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
