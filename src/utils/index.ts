import type { HouseClasses } from '@/types';

/**
 * Utility function to combine class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get house-specific styling classes
 */
export function getHouseClasses(house: string): HouseClasses {
  const houseClasses: Record<string, HouseClasses> = {
    gryffindor: {
      ring: 'from-red-500 to-yellow-500',
      tint: 'bg-red-500/30',
      chip: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
      name: 'text-red-100',
      roll: 'bg-red-600 text-white'
    },
    hufflepuff: {
      ring: 'from-yellow-500 to-yellow-600',
      tint: 'bg-yellow-500/30',
      chip: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
      name: 'text-yellow-100',
      roll: 'bg-yellow-600 text-white'
    },
    ravenclaw: {
      ring: 'from-blue-500 to-blue-600',
      tint: 'bg-blue-500/30',
      chip: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      name: 'text-blue-100',
      roll: 'bg-blue-600 text-white'
    },
    slytherin: {
      ring: 'from-green-500 to-green-600',
      tint: 'bg-green-500/30',
      chip: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      name: 'text-green-100',
      roll: 'bg-green-600 text-white'
    }
  };

  return houseClasses[house] || houseClasses.gryffindor;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as +XX XXXXX XXXXX if it's a Bangladeshi number
  if (cleaned.startsWith('880') && cleaned.length === 13) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }

  // Return original if not matching expected format
  return phone;
}

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

/**
 * Debounce function to limit the rate of function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Check if device has touch capability
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

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

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const current = Math.floor(start + difference * easedProgress);
    callback(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
