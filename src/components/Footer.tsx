import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md shadow-lg border-t border-gray-200/40 dark:border-gray-700/40 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-base text-gray-600 dark:text-gray-400 font-sans">
            © 2025 MechoWarts School of Witchcraft and Wizardry. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 font-sans italic">
            "It is our choices that show what we truly are, far more than our abilities." - Albus Dumbledore
          </p>
        </div>
      </div>
    </footer>
  );
};
