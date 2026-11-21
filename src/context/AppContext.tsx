import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { TabId } from './AppContextTypes';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import { useDietPlan } from '../hooks/useDietPlan';
import { calcStorage, userDataStorage, dietStartDateStorage, disclaimerStorage } from '../utils/storage';
import AppContext from './AppContext.ts';

interface AppProviderProps {
  children: ReactNode;
  setActiveTab?: (tab: TabId) => void;
  /** When true, forces the medical disclaimer to appear even if previously accepted */
  forceDisclaimer?: boolean;
  /** Current i18n language - used to detect language changes and reset disclaimer state */
  currentLanguage?: string;
  /** Counter that increments on language change - forces remount and disclaimer reset */
  languageKey?: number;
}

export function AppProvider({ children, setActiveTab, forceDisclaimer = false, currentLanguage, languageKey }: AppProviderProps) {
  const [calcResults, setCalcResults] = useState<NutritionalResults | null>(() => {
    const res = calcStorage.get();
    return res;
  });
  const [userData, setUserData] = useState<UserData | null>(() => {
    const data = userDataStorage.get();
    return data;
  });
  const [dietStartDate, setDietStartDate] = useState<string | null>(() => {
    const date = dietStartDateStorage.get();
    return date;
  });
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(() => {
    // If forceDisclaimer is true, start with accepted = false to show the disclaimer
    if (forceDisclaimer) return false;
    const result = disclaimerStorage.get();
    return result?.accepted || false;
  });

  // Track language changes to reset disclaimer state when language changes.
  // When language-changed event is received, reset the disclaimer to force it
  // to appear for the new language.
  // The remount counter is managed in App.tsx via languageKey.
  useEffect(() => {
    const handleLanguageChange = () => {
      // Reset disclaimer state to force it to appear for new language
      setIsDisclaimerAccepted(false);
    };
    
    window.addEventListener('language-changed', handleLanguageChange);
    return () => window.removeEventListener('language-changed', handleLanguageChange);
  }, []);
  
  // When languageKey changes (due to language change), reset disclaimer state
  // to force it to appear for the new language. This runs after remount.
  useEffect(() => {
    setIsDisclaimerAccepted(false);
  }, [languageKey]);
  
  // Update prevLanguageRef when currentLanguage changes (for initial mount detection)
  const prevLanguageRef = useRef<string | undefined>(currentLanguage);
  useEffect(() => {
    // On remount (key change in App.tsx), currentLanguage is the new language
    // and prevLanguageRef.current is also the new language (set above).
    // We need to detect if this is a remount due to language change.
    if (prevLanguageRef.current !== undefined && prevLanguageRef.current !== currentLanguage) {
      // Language changed - reset disclaimer state to force it to appear for new language
      setIsDisclaimerAccepted(false);
    }
    prevLanguageRef.current = currentLanguage;
  }, [currentLanguage]);

  // Call useDietPlan as a top-level hook per React Rules of Hooks.
  // IMPORTANT: useDietPlan must be called directly (not inside useMemo) to ensure
  // React's hooks are always invoked in the same order. The useMemo below only
  // memoizes the return value to prevent unnecessary recalculations, but the hook
  // call itself must be at the top level outside useMemo.
  const dietPlanRaw = useDietPlan(calcResults, userData, dietStartDate);
  const dietPlan = useMemo(
    () => dietPlanRaw,
    [calcResults, userData, dietStartDate]
  );

  // Trigger diet plan generation whenever calculator results become available.
  // We depend on stable dietPlan.regenerateDays to avoid infinite re-render loops.
  const isInitialMountRef = useRef(true);
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (calcResults) {
      dietPlan.regenerateDays(calcResults, userData);
    }
  }, [calcResults, userData, dietStartDate, dietPlan.regenerateDays]);

  const handleCalculate = useCallback((results: NutritionalResults, data: UserData) => {
    setCalcResults(results);
    setUserData(data);
    
    // Set diet start date if not already set (first calculation)
    if (!dietStartDate) {
      const today = new Date().toISOString().split('T')[0];
      setDietStartDate(today);
      dietStartDateStorage.set(today);
    }
  }, [dietStartDate, setDietStartDate]);

  const handleAcceptDisclaimer = useCallback(() => {
    setIsDisclaimerAccepted(true);
    disclaimerStorage.set(true);
  }, []);

  // Persist calculator results whenever they change (e.g. loaded from context or set externally)
  useEffect(() => {
    if (calcResults) {
      calcStorage.set(calcResults);
    }
  }, [calcResults]);

  // Persist user data whenever it changes
  useEffect(() => {
    if (userData) {
      userDataStorage.set(userData);
    }
  }, [userData]);

  // setActiveTab MUST be provided by AppWithProvider via the real React Router navigate().
  // The raw navigateTo() fallback was removed because React Router v7 does not respond to
  // window.history.pushState + popstate events — using it silently broke tab navigation.
  const handleSetActiveTab = useCallback((tab: TabId) => {
    if (import.meta.env.MODE !== 'production') {
      console.error(
        `[AppContext] setActiveTab("${tab}") called without a router-aware prop. ` +
        `Wrap AppProvider inside BrowserRouter and pass setActiveTab={(tab) => navigate(\`/\${tab}\`)} as a prop.`
      );
    }
  }, []);

  return (
    <AppContext.Provider value={{
      calcResults,
      userData,
      dietPlan,
      setCalcResults,
      setUserData,
      handleCalculate,
      setActiveTab: setActiveTab ?? handleSetActiveTab,
      dietStartDate,
      setDietStartDate,
      isDisclaimerAccepted,
      onAcceptDisclaimer: handleAcceptDisclaimer,
    }}>
      {children}
    </AppContext.Provider>
  );
}