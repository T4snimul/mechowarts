import { useState, useEffect, useCallback } from 'react';
import { peopleApi } from '@/utils/api';
import type { Person } from '@/types';

export function usePeopleFromAPI() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPeople = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await peopleApi.getAll();
      setPeople(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load people';
      setError(errorMessage);
      console.error('Error fetching people:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return { people, isLoading, error, refetch: fetchPeople };
}
