import { useMemo } from 'react';
import type { Person, SortBy, House } from '@/types';

// ============================================
// Types
// ============================================

export interface PeopleFilterOptions {
  query?: string;
  house?: House | string;
  bloodGroup?: string;
}

export interface PeopleStats {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  houseStats: Record<string, number>;
  bloodGroupStats: Record<string, number>;
  hometownStats: Record<string, number>;
}

// ============================================
// Filter Hook
// ============================================

/**
 * Hook to filter and sort people based on query and sort criteria
 */
export function usePeopleFilter(
  people: Person[],
  query: string,
  sortBy: SortBy,
  houseFilter?: string,
  bloodGroupFilter?: string,
  seriesFilter?: string
): Person[] {
  return useMemo(() => {
    // Defensive programming: ensure we have valid data
    if (!people || !Array.isArray(people)) {
      return [];
    }

    const normalizedQuery = query?.toLowerCase().trim() ?? '';

    // Start with all people
    let filteredPeople = [...people];

    // Apply search query filter
    if (normalizedQuery) {
      filteredPeople = filteredPeople.filter((person) => {
        if (!person) return false;

        const searchableFields = [
          person.name,
          person.roll,
          person.bloodGroup,
          person.hometown,
          person.phone,
          person.house,
        ].map((field) => (field ?? '').toLowerCase());

        return searchableFields.some((field) => field.includes(normalizedQuery));
      });
    }

    // Apply house filter
    if (houseFilter) {
      const normalizedHouse = houseFilter.toLowerCase();
      filteredPeople = filteredPeople.filter(
        (person) => person?.house?.toLowerCase() === normalizedHouse
      );
    }

    // Apply blood group filter
    if (bloodGroupFilter) {
      filteredPeople = filteredPeople.filter(
        (person) => person?.bloodGroup === bloodGroupFilter
      );
    }

    // Apply series filter (extract first 2 digits of roll number)
    // Roll number format: YYZZXXX where YY = series (e.g., 24 for 2024-2025)
    if (seriesFilter) {
      filteredPeople = filteredPeople.filter((person) => {
        if (!person?.roll) return false;
        const series = person.roll.substring(0, 2);
        return series === seriesFilter;
      });
    }

    // Sort the filtered results
    filteredPeople.sort((a, b) => {
      const aValue = a[sortBy] ?? '';
      const bValue = b[sortBy] ?? '';

      // Special handling for roll numbers (numeric sort)
      if (sortBy === 'roll') {
        return Number(aValue) - Number(bValue);
      }

      // Alphabetical sort for other fields
      return String(aValue).localeCompare(String(bValue));
    });

    return filteredPeople;
  }, [people, query, sortBy, houseFilter, bloodGroupFilter, seriesFilter]);
}

// ============================================
// Stats Hook
// ============================================

/**
 * Hook to get statistics about people data
 */
export function usePeopleStats(people: Person[]): PeopleStats {
  return useMemo(() => {
    if (!people || !Array.isArray(people)) {
      return {
        totalCount: 0,
        activeCount: 0,
        inactiveCount: 0,
        houseStats: {},
        bloodGroupStats: {},
        hometownStats: {},
      };
    }

    const totalCount = people.length;
    const activeCount = people.filter((p) => p.status === 'active').length;

    // House distribution
    const houseStats = people.reduce<Record<string, number>>((acc, person) => {
      const house = person.house ?? 'unknown';
      acc[house] = (acc[house] ?? 0) + 1;
      return acc;
    }, {});

    // Blood group distribution
    const bloodGroupStats = people.reduce<Record<string, number>>((acc, person) => {
      const bloodGroup = person.bloodGroup ?? 'unknown';
      acc[bloodGroup] = (acc[bloodGroup] ?? 0) + 1;
      return acc;
    }, {});

    // Hometown distribution
    const hometownStats = people.reduce<Record<string, number>>((acc, person) => {
      const hometown = person.hometown ?? 'unknown';
      acc[hometown] = (acc[hometown] ?? 0) + 1;
      return acc;
    }, {});

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
