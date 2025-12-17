import React, { createContext, useContext } from 'react';
import type { Person } from '@/types';
import type { ToastItem } from '@/components/ui/Toast';

export interface AppContextType {
  people: Person[];
  isLoading: boolean;
  apiError: string | null;
  refetch: () => void;
  pushToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const AppDataContext = createContext<AppContextType | null>(null);

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}

interface AppDataProviderProps {
  children: React.ReactNode;
  value: AppContextType;
}

export function AppDataProvider({ children, value }: AppDataProviderProps) {
  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
