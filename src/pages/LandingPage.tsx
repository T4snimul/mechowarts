import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MagicalBackground } from '@/components/ui/MagicalBackground';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');

  const features = [
    {
      icon: '🎓',
      title: 'Student Directory',
      description: 'Explore profiles of Mechatronics Engineering students sorted into Hogwarts houses.',
    },
    {
      icon: '🏰',
      title: 'Great Hall',
      description: 'Visit the Great Hall to discover students by house, blood group, and academic achievements.',
    },
    {
      icon: '🦉',
      title: 'Owlery',
      description: 'Send messages to fellow students through our magical messaging system.',
    },
    {
      icon: '⚡',
      title: 'Detailed Profiles',
      description: 'View comprehensive profiles with academic records, projects, skills, and magical properties.',
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Magical Background */}
      <MagicalBackground />

      {/* Header */}
      <Header query={query} setQuery={setQuery} />

      {/* Main content with padding for header */}
      <main className="flex-1 pt-20 pb-12">
        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="space-y-6 animate-fade-in">
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 drop-shadow-lg">
              Welcome to MechoWarts
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-serif">
              Where Mechatronics Engineering meets Magic
            </p>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the profiles of RUET Mechatronics Engineering students, sorted into Hogwarts houses based on their unique qualities and achievements.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <button
                onClick={() => navigate('/greathall')}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">🏰 Enter Great Hall</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-600"
                >
                  ✨ Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Magical Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">4</div>
              <div className="text-gray-600 dark:text-gray-400">Hogwarts Houses</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">100+</div>
              <div className="text-gray-600 dark:text-gray-400">Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">∞</div>
              <div className="text-gray-600 dark:text-gray-400">Possibilities</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">1</div>
              <div className="text-gray-600 dark:text-gray-400">Amazing Journey</div>
            </div>
          </div>
        </div>

        {/* House Showcase */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            The Four Houses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-gradient-to-br from-red-600 to-yellow-600 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2">
              <div className="text-4xl mb-2">🦁</div>
              <h3 className="text-2xl font-bold text-white mb-2">Gryffindor</h3>
              <p className="text-white/90 text-sm">Courage, Bravery, Determination</p>
            </div>

            <div className="group bg-gradient-to-br from-green-700 to-gray-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2">
              <div className="text-4xl mb-2">🐍</div>
              <h3 className="text-2xl font-bold text-white mb-2">Slytherin</h3>
              <p className="text-white/90 text-sm">Ambition, Cunning, Leadership</p>
            </div>

            <div className="group bg-gradient-to-br from-blue-600 to-gray-600 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2">
              <div className="text-4xl mb-2">🦅</div>
              <h3 className="text-2xl font-bold text-white mb-2">Ravenclaw</h3>
              <p className="text-white/90 text-sm">Intelligence, Wisdom, Creativity</p>
            </div>

            <div className="group bg-gradient-to-br from-yellow-600 to-gray-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2">
              <div className="text-4xl mb-2">🦡</div>
              <h3 className="text-2xl font-bold text-white mb-2">Hufflepuff</h3>
              <p className="text-white/90 text-sm">Loyalty, Patience, Hard Work</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Begin Your Magical Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join the MechoWarts community and explore the wizarding world of engineering.
            </p>
            <button
              onClick={() => navigate(isAuthenticated ? '/greathall' : '/login')}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {isAuthenticated ? '🏰 Go to Great Hall' : '✨ Get Started Now'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
