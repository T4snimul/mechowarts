import type { HouseClasses, House } from '@/types';

// ============================================
// Class Name Utilities
// ============================================

/**
 * Utility function to combine class names (similar to clsx/classnames)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// House Styling Utilities
// ============================================

const HOUSE_CLASSES: Record<House, HouseClasses> = {
  gryffindor: {
    ring: 'from-red-500 to-yellow-500',
    tint: 'bg-red-500/30',
    chip: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    name: 'text-red-100',
    roll: 'bg-red-600 text-white',
  },
  hufflepuff: {
    ring: 'from-yellow-500 to-yellow-600',
    tint: 'bg-yellow-500/30',
    chip: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    name: 'text-yellow-100',
    roll: 'bg-yellow-600 text-white',
  },
  ravenclaw: {
    ring: 'from-blue-500 to-blue-600',
    tint: 'bg-blue-500/30',
    chip: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    name: 'text-blue-100',
    roll: 'bg-blue-600 text-white',
  },
  slytherin: {
    ring: 'from-green-500 to-green-600',
    tint: 'bg-green-500/30',
    chip: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    name: 'text-green-100',
    roll: 'bg-green-600 text-white',
  },
};

/**
 * Get house-specific styling classes
 */
export function getHouseClasses(house: string): HouseClasses {
  return HOUSE_CLASSES[house as House] ?? HOUSE_CLASSES.gryffindor;
}

/**
 * Get house display name with proper capitalization
 */
export function getHouseDisplayName(house: string): string {
  return house.charAt(0).toUpperCase() + house.slice(1);
}

// ============================================
// String Utilities
// ============================================

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  // Format as +XX XXXXX XXXXX if it's a Bangladeshi number
  if (cleaned.startsWith('880') && cleaned.length === 13) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }

  return phone;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================
// Clipboard Utilities
// ============================================

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}

// ============================================
// Function Utilities
// ============================================

/**
 * Debounce function to limit the rate of function calls
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit function calls
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================
// ID & Random Utilities
// ============================================

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================
// Device Detection Utilities
// ============================================

/**
 * Check if device has touch capability
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Check if running on mobile device
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// ============================================
// Animation Utilities
// ============================================

/**
 * Animate number counting
 */
export function animateCount(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
): void {
  const startTime = performance.now();
  const difference = end - start;

  function step(currentTime: number): void {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out cubic)
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const current = Math.floor(start + difference * easedProgress);
    callback(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// ============================================
// Validation Utilities
// ============================================

/** RUET email pattern */
export const RUET_EMAIL_REGEX = /^(24080\d{2})@student\.ruet\.ac\.bd$/i;

/**
 * Validate RUET email format
 */
export function isValidRuetEmail(email: string): boolean {
  return RUET_EMAIL_REGEX.test(email);
}

/**
 * Extract roll number from RUET email
 */
export function extractRollFromEmail(email: string): string | null {
  const match = email.match(RUET_EMAIL_REGEX);
  return match ? match[1] : null;
}
