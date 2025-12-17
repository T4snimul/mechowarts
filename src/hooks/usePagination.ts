import { useState, useMemo } from 'react';

export interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

export interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  paginateItems: (items: T[]) => T[];
}

/**
 * Custom hook for pagination logic
 */
export function usePagination<T = any>({
  totalItems,
  itemsPerPage = 12,
  initialPage = 1,
}: UsePaginationOptions): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(itemsPerPage);

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

  // Navigation helpers
  const canGoNext = validCurrentPage < totalPages;
  const canGoPrev = validCurrentPage > 1;

  const goToPage = (page: number) => {
    const targetPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(targetPage);
  };

  const nextPage = () => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (canGoPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSetPageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Helper function to paginate an array
  const paginateItems = (items: T[]): T[] => {
    return items.slice(startIndex, endIndex);
  };

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
    setPageSize: handleSetPageSize,
    paginateItems,
  };
}
