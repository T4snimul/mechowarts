import React, { createContext, useContext, useState } from 'react';
import type { Person, FilterState, SortBy } from '@/types';

interface AppContextType {
  people: Person[];
  setPeople: (people: Person[]) => void;
  filters: FilterState;
  setQuery: (query: string) => void;
  setSortBy: (sortBy: SortBy) => void;
  filteredPeople: Person[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({
  children,
  initialPeople = []
}: {
  children: React.ReactNode;
  initialPeople?: Person[];
}) {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    sortBy: 'roll'
  });

  const setQuery = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const setSortBy = (sortBy: SortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  // Compute filtered people
  const filteredPeople = React.useMemo(() => {
    const q = filters.query.toLowerCase().trim();

    const list = people.filter((p) => {
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.roll.toLowerCase().includes(q) ||
        p.bloodGroup.toLowerCase().includes(q) ||
        p.hometown.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
      );
    });

    // Sort the results
    list.sort((a, b) => {
      const aVal = a[filters.sortBy] || '';
      const bVal = b[filters.sortBy] || '';
      if (filters.sortBy === 'roll') {
        return Number(aVal) - Number(bVal);
      }
      return aVal.localeCompare(bVal);
    });

    return list;
  }, [people, filters.query, filters.sortBy]);

  const value = {
    people,
    setPeople,
    filters,
    setQuery,
    setSortBy,
    filteredPeople,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
