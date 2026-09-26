import { useContext } from 'react';
import AppContext from './AppContext';
import type { AppContextValue } from './AppContextTypes';

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}