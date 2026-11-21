import { useState, useEffect, useLayoutEffect, useRef, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import { changelogEntries } from './utils/changelogData';
import { AppProvider } from './context/AppContext.tsx';
import type { TabId } from './context/AppContextTypes';
import { useAppContext } from './context/useAppContext';
import { useToast } from './hooks/useToast';
import { Toast } from './components/Toast';
import { getBasePath, navigateTo, navigateRef } from './utils/navigation';

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
  { id: 'developer', icon: '👨\u200d💻', labelKey: 'tab_developer' }
];

export default function App() {
  return (
    <BrowserRouter basename={getBasePath()}>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [hasNewChangelog, setHasNewChangelog] = useState(false);
  const { toasts, removeToast } = useToast();
  
  // Use a counter-based key to force remount all components when language changes.
  // This ensures translations are properly reapplied, context state is reset,
  // and the medical disclaimer is shown again for the new language.
  // We use a separate counter that increments on 'language-changed' event.
  const [languageKey, setLanguageKey] = useState(0);
  
  // Keep a ref to the current i18n instance so the event listener can access it
  // without being re-registered when i18n.language changes.
  const i18nRef = useRef(i18n);
  i18nRef.current = i18n;
  
  // Listen for language change events to trigger remount.
  // Empty dependency array - listener is registered once and uses ref to access i18n.
  useEffect(() => {
    const handleLanguageChanged = () => {
      // Increment key to trigger remount of AppProvider and all children
      setLanguageKey((prev) => prev + 1);
    };
    window.addEventListener('language-changed', handleLanguageChanged);
    return () => window.removeEventListener('language-changed', handleLanguageChanged);
  }, []);

  // Update the module-level ref with the current navigate function
  // useLayoutEffect runs synchronously after DOM mutations but before paint
  useLayoutEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    // Handle SPA redirect from 404.html (GitHub Pages fallback)
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p) {
      const cleanPath = p.startsWith('/') ? p : '/' + p;
      const url = new URL(window.location.href);
      url.searchParams.delete('p');
      const newSearch = url.searchParams.toString() ? `?${url.searchParams.toString()}` : '';
      window.history.replaceState(null, '', url.pathname + newSearch + url.hash);
      navigate(cleanPath, { replace: true });
    }

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
    const handleChangelogSeen = () => checkChangelog();
    window.addEventListener('changelog-seen', handleChangelogSeen);

    // Event listener removed as navigation is handled directly by react-router-dom useNavigate
  }, [navigate, t]);

  return (
    <div className="flex flex-col p-2 sm:p-4 md:p-6 lg:p-8 max-w-full" data-testid="app-root">
      {/* AppProvider with key based on language change counter to force remount when language changes */}
      <AppProvider key={languageKey} setActiveTab={(tab) => {
        navigateTo(`/${tab}`, { force: true });
      }} currentLanguage={i18n.language} languageKey={languageKey}>
        <Header />

        {/* MedicalDisclaimer must be inside AppProvider to access context */}
        <MedicalDisclaimer key={languageKey} onAccept={() => {}} />

        {/* Desktop navigation tabs: fixed alignment and style */}
        <nav className="w-full mx-auto px-4 sm:px-6 md:px-8 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap justify-center items-center gap-2 md:gap-4 pb-4">
              {TABS.map(tab => {
                const showBadge = tab.id === 'changelog' && hasNewChangelog;
                const currentPath = location.pathname.replace(/\/+$/, '') || '/';
                const isActive =
                  currentPath === `/${tab.id}` ||
                  currentPath.startsWith(`/${tab.id}/`) ||
                  (tab.id === 'calc' && (currentPath === '/' || currentPath === ''));
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      navigateTo(`/${tab.id}`, { force: true });
                    }}
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
            <Routes>
              <Route path="/" element={<Navigate to="/calc" replace />} />
              <Route path="/calc" element={<CalculatorRoutes />} />
              <Route path="/diary" element={<DiaryRoutes />} />
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
      </AppProvider>

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

// Helper components to access app context for calculator and diary routes
function CalculatorRoutes() {
  const { handleCalculate, calcResults } = useAppContext();
  return <NutritionalCalculator onCalculate={handleCalculate} initialResults={calcResults} />;
}

function DiaryRoutes() {
  const { calcResults } = useAppContext();
  return <Diary waterTargetLiters={calcResults?.waterLiters ?? null} nutritionalResults={calcResults} />;
}