import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  // Animation preferences
  enableAnimations: boolean;
  setEnableAnimations: (enabled: boolean) => void;

  // Background effects
  enableBackgroundEffects: boolean;
  setEnableBackgroundEffects: (enabled: boolean) => void;

  // Performance settings
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;

  // Layout preferences
  cardSize: 'small' | 'medium' | 'large';
  setCardSize: (size: 'small' | 'medium' | 'large') => void;

  // Accessibility
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Load settings from localStorage with defaults
  const [enableAnimations, setEnableAnimations] = useState(() => {
    const saved = localStorage.getItem('mechowarts-animations');
    return saved ? JSON.parse(saved) : true;
  });

  const [enableBackgroundEffects, setEnableBackgroundEffects] = useState(() => {
    const saved = localStorage.getItem('mechowarts-background-effects');
    return saved ? JSON.parse(saved) : true;
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem('mechowarts-reduced-motion');
    const systemPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return saved ? JSON.parse(saved) : systemPreference;
  });

  const [cardSize, setCardSize] = useState<'small' | 'medium' | 'large'>(() => {
    const saved = localStorage.getItem('mechowarts-card-size');
    return (saved as 'small' | 'medium' | 'large') || 'medium';
  });

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('mechowarts-high-contrast');
    const systemPreference = window.matchMedia('(prefers-contrast: high)').matches;
    return saved ? JSON.parse(saved) : systemPreference;
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('mechowarts-animations', JSON.stringify(enableAnimations));
  }, [enableAnimations]);

  useEffect(() => {
    localStorage.setItem('mechowarts-background-effects', JSON.stringify(enableBackgroundEffects));
  }, [enableBackgroundEffects]);

  useEffect(() => {
    localStorage.setItem('mechowarts-reduced-motion', JSON.stringify(reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('mechowarts-card-size', cardSize);
  }, [cardSize]);

  useEffect(() => {
    localStorage.setItem('mechowarts-high-contrast', JSON.stringify(highContrast));
  }, [highContrast]);

  // Apply CSS custom properties for settings
  useEffect(() => {
    const root = document.documentElement;

    if (reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [reducedMotion, highContrast]);

  const value = {
    enableAnimations,
    setEnableAnimations,
    enableBackgroundEffects,
    setEnableBackgroundEffects,
    reducedMotion,
    setReducedMotion,
    cardSize,
    setCardSize,
    highContrast,
    setHighContrast,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
