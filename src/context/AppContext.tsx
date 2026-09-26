import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import { useDietPlan } from '../hooks/useDietPlan';
import AppContext from './AppContext.ts';

export function AppProvider({ children }: { children: ReactNode }) {
  const [calcResults, setCalcResults] = useState<NutritionalResults | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const dietPlan = useDietPlan(calcResults, userData);

  const handleCalculate = useCallback((results: NutritionalResults, data: UserData) => {
    setCalcResults(results);
    setUserData(data);
    // Persist to localStorage
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setActiveTab = useCallback((_tab: string) => {
    // This will be handled by the App component's state
    // We just need to provide the function for the Header to call
  }, []);

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
