import { useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { TabId } from './AppContextTypes';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import { useDietPlan } from '../hooks/useDietPlan';
import { calcStorage, userDataStorage, dietStartDateStorage } from '../utils/storage';
import AppContext from './AppContext.ts';

interface AppProviderProps {
  children: ReactNode;
  setActiveTab?: (tab: TabId) => void;
}

export function AppProvider({ children, setActiveTab }: AppProviderProps) {
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

  const dietPlan = useDietPlan(calcResults, userData, dietStartDate);

  // Trigger diet plan generation whenever calculator results become available
  // Use ref to avoid re-running when dietPlan.regenerateDays is called
  const isInitialMountRef = useRef(true);
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (calcResults) {
      dietPlan.regenerateDays(calcResults, userData);
    }
  }, [calcResults, userData, dietPlan]);

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
      setDietStartDate
    }}>
      {children}
    </AppContext.Provider>
  );
}
