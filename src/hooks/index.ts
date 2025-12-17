import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// Local Storage Hook
// ============================================

/**
 * Hook for managing localStorage with type safety
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        setValue((prev) => {
          const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.warn(`[useLocalStorage] Error setting key "${key}":`, error);
      }
    },
    [key]
  );

  return [value, setStoredValue];
}

// ============================================
// Debounce Hook
// ============================================

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// Clipboard Hook
// ============================================

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  isCopied: boolean;
  reset: () => void;
}

/**
 * Hook for copying text to clipboard
 */
export function useClipboard(resetDelay = 2000): UseClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Reset after delay
        timeoutRef.current = setTimeout(() => setIsCopied(false), resetDelay);
        return true;
      } catch (error) {
        console.error('[useClipboard] Failed to copy text:', error);
        setIsCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  const reset = useCallback(() => {
    setIsCopied(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copy, isCopied, reset };
}

// ============================================
// Media Query Hook
// ============================================

/**
 * Hook for detecting media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Set initial value
    setMatches(media.matches);

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// ============================================
// Device Detection Hooks
// ============================================

/**
 * Hook for detecting touch devices
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}

/**
 * Hook for detecting mobile devices
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * Hook for detecting tablet devices
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * Hook for detecting desktop devices
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

// ============================================
// Previous Value Hook
// ============================================

/**
 * Hook to get the previous value of a variable
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ============================================
// Document Title Hook
// ============================================

/**
 * Hook to update document title
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

// ============================================
// Re-exports
// ============================================

export { usePagination } from './usePagination';
export { usePeopleFilter, usePeopleStats } from './usePeopleFilter';
export { usePeopleFromAPI } from './usePeopleFromAPI';
export type { UsePaginationOptions, PaginationResult } from './usePagination';

// Export auth validation hook
export { useAuthValidation } from './useAuthValidation';
