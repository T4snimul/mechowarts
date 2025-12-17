import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Person } from '@/types';
import type { ToastItem } from '@/components/ui/Toast';
import { peopleApi } from '@/utils/api';

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
  value?: AppContextType;
}

export function AppDataProvider({ children, value }: AppDataProviderProps) {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchPeople = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const response = await peopleApi.getAll();
      setPeople(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load people';
      setApiError(errorMessage);
      console.error('Error fetching people:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!value) {
      fetchPeople();
    }
  }, [fetchPeople, value]);

  const pushToast = useCallback((_toast: Omit<ToastItem, 'id'>) => {
    // Toast functionality will be provided by NotificationContext
  }, []);

  const contextValue: AppContextType = value ?? {
    people,
    isLoading,
    apiError,
    refetch: fetchPeople,
    pushToast,
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
}
