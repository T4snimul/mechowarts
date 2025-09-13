import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/40 dark:bg-gray-900/60 backdrop-blur-md shadow-lg border-t border-gray-200/40 dark:border-gray-700/40 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Decorative magical elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-2 left-8 text-purple-500/30 dark:text-purple-400/20 text-lg select-none animate-pulse">

          </div>
          <div className="absolute bottom-2 right-12 text-purple-500/30 dark:text-purple-400/20 text-sm select-none">

          </div>
          <div className="absolute top-1/2 left-1/3 text-blue-500/20 dark:text-blue-400/15 text-xl select-none">

          </div>
        </div>

        <div className="relative text-center space-y-6">
          {/* MechoWarts Main Info */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 font-display">
              MechoWarts School of Witchcraft & Wizardry
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-300 font-sans max-w-2xl mx-auto">
              Where magical education meets mechanical engineering excellence.
              Training the next generation of wizard-engineers since 2024.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-sans italic">
              "Technology is best when it brings people together" - but magic makes it extraordinary
            </p>
          </div>          {/* Divider */}
          <div className="flex items-center justify-center space-x-4 py-2">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-400 dark:via-purple-600 to-transparent w-20"></div>
            <span className="text-purple-500 dark:text-purple-400 text-lg"></span>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-400 dark:via-purple-600 to-transparent w-20"></div>
          </div>

          {/* Houses and Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            <div className="text-center">
              <div className="text-red-500 text-2xl mb-1"></div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Gryffindor</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Brave Hearts</p>
            </div>
            <div className="text-center">
              <div className="text-yellow-500 text-2xl mb-1"></div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Hufflepuff</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Loyal Souls</p>
            </div>
            <div className="text-center">
              <div className="text-blue-500 text-2xl mb-1"></div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Ravenclaw</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wise Minds</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-1"></div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Slytherin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ambitious Spirits</p>
            </div>
          </div>

          {/* Copyright and Tech */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
              © 2025 MechoWarts. All magical rights reserved.
              <span className="block md:inline md:ml-2">
                Crafted with love and a touch of magic
              </span>
            </p>            {/* Tech Stack Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50">
                <span className="text-xs text-purple-700 dark:text-purple-300 font-mono">
                  React • Vite • Tailwind • TypeScript • Magic
                </span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-sans italic max-w-md mx-auto">
              "It is our choices that show what we truly are, far more than our abilities."
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-sans">
              — Albus Dumbledore
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
