import { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { TabId } from './AppContextTypes';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import { useDietPlan } from '../hooks/useDietPlan';
import { calcStorage, userDataStorage } from '../utils/storage';
import AppContext from './AppContext.ts';

interface AppProviderProps {
  children: ReactNode;
  setActiveTab: (tab: TabId) => void;
}

export function AppProvider({ children, setActiveTab }: AppProviderProps) {
  const [calcResults, setCalcResults] = useState<NutritionalResults | null>(() => calcStorage.get());
  const [userData, setUserData] = useState<UserData | null>(() => userDataStorage.get());

  const dietPlan = useDietPlan(calcResults, userData);

  // Trigger diet plan generation whenever calculator results become available
  useEffect(() => {
    if (calcResults) {
      dietPlan.regenerateDays(calcResults, userData);
    }
  }, [calcResults, userData, dietPlan]);

  const handleCalculate = useCallback((results: NutritionalResults, data: UserData) => {
    setCalcResults(results);
    setUserData(data);
    calcStorage.set(results);
    userDataStorage.set(data);
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

  return (
    <AppContext.Provider value={{
      calcResults,
      userData,
      dietPlan,
      setCalcResults,
      setUserData,
      handleCalculate,
      setActiveTab
    }}>
      {children}
    </AppContext.Provider>
  );
}
