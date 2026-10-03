import { useState, useCallback, useEffect } from 'react';
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
  const [calcResults, setCalcResults] = useState<NutritionalResults | null>(() => calcStorage.get());
  const [userData, setUserData] = useState<UserData | null>(() => userDataStorage.get());
  const [dietStartDate, setDietStartDate] = useState<string | null>(() => dietStartDateStorage.get());

  const dietPlan = useDietPlan(calcResults, userData, dietStartDate);

  // Trigger diet plan generation whenever calculator results become available
  useEffect(() => {
    const regeneratePlan = () => {
      if (calcResults) {
        dietPlan.regenerateDays(calcResults, userData);
      }
    };
    regeneratePlan();
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
  }, [dietStartDate]);

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

  // Provide a no-op setActiveTab for compatibility with components that still use it
  const noopSetActiveTab = useCallback(() => {
    // Navigation is now handled by react-router-dom
  }, []);

  return (
    <AppContext.Provider value={{
      calcResults,
      userData,
      dietPlan,
      setCalcResults,
      setUserData,
      handleCalculate,
      setActiveTab: setActiveTab || noopSetActiveTab,
      dietStartDate,
      setDietStartDate
    }}>
      {children}
    </AppContext.Provider>
  );
}
