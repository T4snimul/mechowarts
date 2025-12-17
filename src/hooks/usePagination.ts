import { useState, useMemo, useCallback } from 'react';

// ============================================
// Types
// ============================================

export interface UsePaginationOptions {
  /** Total number of items to paginate */
  totalItems: number;
  /** Number of items per page (default: 12) */
  itemsPerPage?: number;
  /** Initial page number (default: 1) */
  initialPage?: number;
}

export interface PaginationResult<T> {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Number of items per page */
  pageSize: number;
  /** Start index of current page (0-indexed) */
  startIndex: number;
  /** End index of current page (exclusive) */
  endIndex: number;
  /** Whether there is a next page */
  canGoNext: boolean;
  /** Whether there is a previous page */
  canGoPrev: boolean;
  /** Go to a specific page */
  goToPage: (page: number) => void;
  /** Go to the next page */
  nextPage: () => void;
  /** Go to the previous page */
  prevPage: () => void;
  /** Go to the first page */
  firstPage: () => void;
  /** Go to the last page */
  lastPage: () => void;
  /** Set the number of items per page */
  setPageSize: (size: number) => void;
  /** Paginate an array of items */
  paginateItems: (items: T[]) => T[];
}

// ============================================
// Hook
// ============================================

/**
 * Custom hook for pagination logic
 */
export function usePagination<T = unknown>({
  totalItems,
  itemsPerPage = 12,
  initialPage = 1,
}: UsePaginationOptions): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(itemsPerPage);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // Ensure current page is within valid range
  const validCurrentPage = useMemo(() => {
    return Math.min(Math.max(1, currentPage), totalPages);
  }, [currentPage, totalPages]);

  // Calculate start and end indices
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Navigation state
  const canGoNext = validCurrentPage < totalPages;
  const canGoPrev = validCurrentPage > 1;

  // Navigation functions
  const goToPage = useCallback(
    (page: number) => {
      const targetPage = Math.min(Math.max(1, page), totalPages);
      setCurrentPage(targetPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [canGoNext]);

  const prevPage = useCallback(() => {
    if (canGoPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [canGoPrev]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Helper function to paginate an array
  const paginateItems = useCallback(
    (items: T[]): T[] => {
      return items.slice(startIndex, endIndex);
    },
    [startIndex, endIndex]
  );

  return {
    currentPage: validCurrentPage,
    totalPages,
    pageSize,
    startIndex,
    endIndex,
    canGoNext,
    canGoPrev,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize,
    paginateItems,
  };
}
