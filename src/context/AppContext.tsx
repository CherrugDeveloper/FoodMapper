import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import { useDietPlan } from '../hooks/useDietPlan';

interface AppContextValue {
  calcResults: NutritionalResults | null;
  userData: UserData | null;
  dietPlan: ReturnType<typeof useDietPlan>;
  setCalcResults: (results: NutritionalResults) => void;
  setUserData: (data: UserData) => void;
  handleCalculate: (results: NutritionalResults, data: UserData) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [calcResults, setCalcResults] = useState<NutritionalResults | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const dietPlan = useDietPlan(calcResults, userData);
  
  const handleCalculate = useCallback((results: NutritionalResults, data: UserData) => {
    setCalcResults(results);
    setUserData(data);
    // Persist to localStorage
  }, []);
  
  return (
    <AppContext.Provider value={{
      calcResults,
      userData,
      dietPlan,
      setCalcResults,
      setUserData,
      handleCalculate
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
