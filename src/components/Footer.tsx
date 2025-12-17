import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-white/50 to-white/30 dark:from-gray-900/70 dark:to-gray-900/50 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 mt-16 py-12 md:py-16">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-8">
          {/* Header with emoji */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">🏰</span>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">MechoWarts</h3>
              <span className="text-4xl">✨</span>
            </div>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">School of Witchcraft & Wizardry</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Where magical education meets mechanical engineering excellence. Training the next generation of wizard-engineers since 2024.
            </p>
          </div>

          {/* Houses Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-6">
            <div className="group rounded-lg p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 hover:shadow-md transition-all duration-200">
              <div className="text-3xl mb-2">🦁</div>
              <p className="font-bold text-sm text-red-700 dark:text-red-300">Gryffindor</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">Brave & Bold</p>
            </div>
            <div className="group rounded-lg p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 hover:shadow-md transition-all duration-200">
              <div className="text-3xl mb-2">🦡</div>
              <p className="font-bold text-sm text-yellow-700 dark:text-yellow-300">Hufflepuff</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">Loyal & True</p>
            </div>
            <div className="group rounded-lg p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 hover:shadow-md transition-all duration-200">
              <div className="text-3xl mb-2">🦅</div>
              <p className="font-bold text-sm text-blue-700 dark:text-blue-300">Ravenclaw</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Wise & Clever</p>
            </div>
            <div className="group rounded-lg p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 hover:shadow-md transition-all duration-200">
              <div className="text-3xl mb-2">🐍</div>
              <p className="font-bold text-sm text-green-700 dark:text-green-300">Slytherin</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Cunning & Proud</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            <span className="text-2xl">⭐</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          </div>

          {/* Tech Stack with icons */}
          <div className="space-y-4">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800/30">
              <span className="text-lg">⚛️</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">React</span>
              <span className="text-lg">⚡</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Vite</span>
              <span className="text-lg">🎨</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tailwind</span>
              <span className="text-lg">📘</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">TypeScript</span>
              <span className="text-lg">✨</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Magic</span>
            </div>
            
            {/* Quote */}
            <div className="pt-2">
              <p className="text-sm italic text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                "It is our choices that show what we truly are, far more than our abilities."
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                — Albus Dumbledore 🧙‍♂️
              </p>
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-600 dark:text-gray-400">
              © 2025 MechoWarts. All magical rights reserved. ✨ Crafted with ❤️ and magic
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
