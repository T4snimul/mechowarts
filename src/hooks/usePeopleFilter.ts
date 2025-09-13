import { useMemo } from 'react';
import type { Person, SortBy } from '@/types';

/**
 * Hook to filter and sort people based on query and sort criteria
 */
export function usePeopleFilter(
  people: Person[],
  query: string,
  sortBy: SortBy,
  houseFilter?: string,
  bloodGroupFilter?: string
): Person[] {
  return useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    // Filter people based on query
    let filteredPeople = people;

    if (normalizedQuery) {
      filteredPeople = people.filter((person) => {
        const searchableFields = [
          person.name,
          person.roll,
          person.bloodGroup,
          person.hometown,
          person.phone,
          person.house,
        ];

        return searchableFields.some(field =>
          field.toLowerCase().includes(normalizedQuery)
        );
      });
    }

    // Apply house filter
    if (houseFilter) {
      filteredPeople = filteredPeople.filter(person =>
        person.house.toLowerCase() === houseFilter.toLowerCase()
      );
    }

    // Apply blood group filter
    if (bloodGroupFilter) {
      filteredPeople = filteredPeople.filter(person =>
        person.bloodGroup === bloodGroupFilter
      );
    }

    // Sort the filtered results
    filteredPeople.sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';

      // Special handling for roll numbers (numeric sort)
      if (sortBy === 'roll') {
        return Number(aValue) - Number(bValue);
      }

      // Alphabetical sort for other fields
      return aValue.localeCompare(bValue);
    });

    return filteredPeople;
  }, [people, query, sortBy, houseFilter, bloodGroupFilter]);
}

/**
 * Hook to get statistics about people data
 */
export function usePeopleStats(people: Person[]) {
  return useMemo(() => {
    const totalCount = people.length;
    const activeCount = people.filter(p => p.status === 'active').length;

    // House distribution
    const houseStats = people.reduce((acc, person) => {
      acc[person.house] = (acc[person.house] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Blood group distribution
    const bloodGroupStats = people.reduce((acc, person) => {
      acc[person.bloodGroup] = (acc[person.bloodGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Hometown distribution
    const hometownStats = people.reduce((acc, person) => {
      acc[person.hometown] = (acc[person.hometown] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCount,
      activeCount,
      inactiveCount: totalCount - activeCount,
      houseStats,
      bloodGroupStats,
      hometownStats,
    };
  }, [people]);
}
