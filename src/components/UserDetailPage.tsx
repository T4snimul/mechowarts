import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/SettingsContext';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { getHouseClasses, cn } from '@/utils';
import { Header } from '@/components/Header';
import { CharacterImage } from '@/components/ui/CharacterImage';
import { MagicalBackground } from '@/components/ui/MagicalBackground';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { people } = useAppData();
  const { enableAnimations } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'about' | 'skills' | 'magical'>('about');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Find the person by ID
  const person = people.find((p) => p.id === id);

  if (!person) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <MagicalBackground />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Wizard Not Found</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            This magical being couldn't be located in the Great Hall
          </p>
          <motion.button
            whileHover={enableAnimations ? { scale: 1.05 } : {}}
            whileTap={enableAnimations ? { scale: 0.95 } : {}}
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
          >
            ← Back to Great Hall
          </motion.button>
        </div>
      </div>
    );
  }

  const { ring } = getHouseClasses(person.house);
  const isOwnProfile = isAuthenticated && user?.roll === person.roll;

  const handleContactClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    window.open(url, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/40 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <MagicalBackground />

      {/* Header */}
      <Header />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Cover image section */}
        <motion.div
          initial={enableAnimations ? { opacity: 0, y: 20 } : false}
          animate={enableAnimations ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={enableAnimations ? { duration: 0.3 } : {}}
          className={cn(
            'relative rounded-2xl overflow-hidden h-40 sm:h-56 md:h-72 mb-0',
            'bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30',
            ring
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>

        {/* Profile section with image and basic info */}
        <motion.div
          initial={enableAnimations ? { opacity: 0, y: 20 } : false}
          animate={enableAnimations ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={enableAnimations ? { delay: 0.1, duration: 0.3 } : {}}
          className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 px-4 sm:px-8 py-6 -mt-24 sm:-mt-32 md:-mt-40 relative z-20 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Profile Image */}
            <motion.div
              initial={enableAnimations ? { opacity: 0, scale: 0.95 } : false}
              animate={enableAnimations ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              transition={enableAnimations ? { delay: 0.15, duration: 0.3 } : {}}
              className={cn(
                'flex-shrink-0 w-32 sm:w-40 h-32 sm:h-40 rounded-2xl overflow-hidden',
                'bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30',
                'border-4 border-white/50 dark:border-gray-800/50 shadow-lg',
                ring
              )}
            >
              <CharacterImage
                person={person}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Name and basic info */}
            <div className="flex flex-col justify-end flex-1">
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-1">
                    {person.name}
                  </h1>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={cn('text-lg font-bold', getHouseClasses(person.house).chip)}>
                      {person.house.charAt(0).toUpperCase() + person.house.slice(1)} House
                    </span>
                    {person.isSpecial && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-semibold">
                        <span>★</span>
                        {person.specialType === 'hero' && 'Hero'}
                        {person.specialType === 'villain' && 'Villain'}
                        {person.specialType === 'magical-being' && 'Magical Being'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">◆</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Blood Status</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{person.bloodGroup}</p>
                    </div>
                  </div>
                  {person.yearsAtHogwarts && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">∿</span>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Years</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{person.yearsAtHogwarts}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {isOwnProfile && (
                    <motion.button
                      whileHover={enableAnimations ? { scale: 1.05 } : {}}
                      whileTap={enableAnimations ? { scale: 0.95 } : {}}
                      onClick={() => navigate('/profile')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                    >
                      <span>✏️</span>
                      Edit Profile
                    </motion.button>
                  )}
                  {person.phone && (
                    <motion.button
                      whileHover={enableAnimations ? { scale: 1.05 } : {}}
                      whileTap={enableAnimations ? { scale: 0.95 } : {}}
                      onClick={(e) => handleContactClick(e, `https://wa.me/${person.phone.replace(/[\s-]/g, '')}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                    >
                      <span>💭</span>
                      Message
                    </motion.button>
                  )}
                  {person.fb && (
                    <motion.button
                      whileHover={enableAnimations ? { scale: 1.05 } : {}}
                      whileTap={enableAnimations ? { scale: 0.95 } : {}}
                      onClick={(e) => handleContactClick(e, person.fb)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                    >
                      <span>👤</span>
                      Profile
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={enableAnimations ? { opacity: 0, y: 20 } : false}
          animate={enableAnimations ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={enableAnimations ? { delay: 0.2, duration: 0.3 } : {}}
          className="flex gap-1 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50 dark:border-gray-700/50 w-fit"
        >
          {(['about', 'skills', 'magical'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base',
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              {tab === 'about' && '📋 About'}
              {tab === 'skills' && '⚡ Skills'}
              {tab === 'magical' && '✨ Magical'}
            </button>
          ))}
        </motion.div>

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - left side */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'about' && (
              <motion.div
                initial={enableAnimations ? { opacity: 0, y: 10 } : false}
                animate={enableAnimations ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={enableAnimations ? { duration: 0.2 } : {}}
                className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              >
                <div className="px-6 sm:px-8 py-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span>ℹ</span>
                    About
                  </h2>

                  <div className="space-y-6">
                    {/* Bio on top */}
                    <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-3">Biography</p>
                      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        Member of {person.house.charAt(0).toUpperCase() + person.house.slice(1)} House, distinguished {person.roll.toLowerCase()} at MechoWarts School of
                        Witchcraft & Wizardry. {person.isSpecial && `Known as a ${person.specialType}.`}
                      </p>
                    </div>

                    {person.hometown && (
                      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">📍 Hometown</p>
                        <p className="text-lg text-gray-900 dark:text-white">{person.hometown}</p>
                      </div>
                    )}

                    {person.phone && (
                      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">☎ Contact</p>
                        <a
                          href={`tel:${person.phone}`}
                          className="text-lg text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {person.phone}
                        </a>
                      </div>
                    )}

                    {person.roll && (
                      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">🎓 Position</p>
                        <p className={cn('text-lg font-bold', getHouseClasses(person.house).chip)}>
                          {person.roll}
                        </p>
                      </div>
                    )}

                    {person.bloodGroup && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">🩸 Blood Status</p>
                        <p className="text-lg text-gray-900 dark:text-white font-medium">{person.bloodGroup}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div
                initial={enableAnimations ? { opacity: 0, y: 10 } : false}
                animate={enableAnimations ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={enableAnimations ? { duration: 0.2 } : {}}
                className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              >
                <div className="px-6 sm:px-8 py-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span>⚡</span>
                    Skills & Abilities
                  </h2>

                  {person.skills && person.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {person.skills.map((skill, i) => (
                        <motion.div
                          key={i}
                          initial={enableAnimations ? { opacity: 0, scale: 0.9 } : false}
                          animate={enableAnimations ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                          transition={enableAnimations ? { delay: i * 0.05, duration: 0.2 } : {}}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-800/50 rounded-full text-sm font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm"
                        >
                          {skill}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No skills recorded yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'magical' && (
              <motion.div
                initial={enableAnimations ? { opacity: 0, y: 10 } : false}
                animate={enableAnimations ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={enableAnimations ? { duration: 0.2 } : {}}
                className="space-y-6"
              >
                {person.patronus && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200/50 dark:border-blue-800/30 overflow-hidden">
                    <div className="px-6 sm:px-8 py-6">
                      <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <span className="text-3xl">◈</span>
                        Patronus
                      </h3>
                      <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold">{person.patronus}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        The wizard's guardian spirit, manifested in corporeal form.
                      </p>
                    </div>
                  </div>
                )}

                {person.wand && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200/50 dark:border-purple-800/30 overflow-hidden">
                    <div className="px-6 sm:px-8 py-6">
                      <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                        <span className="text-3xl">↯</span>
                        Wand
                      </h3>
                      <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold">{person.wand}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        The magical instrument through which the wizard channels their power.
                      </p>
                    </div>
                  </div>
                )}

                {!person.patronus && !person.wand && (
                  <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 px-6 sm:px-8 py-6">
                    <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                      Magical properties not yet revealed.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar - right side */}
          <motion.div
            initial={enableAnimations ? { opacity: 0, x: 20 } : false}
            animate={enableAnimations ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={enableAnimations ? { delay: 0.25, duration: 0.3 } : {}}
            className="space-y-6"
          >
            {/* House Info Card */}
            <div className={cn(
              'rounded-xl shadow-lg border overflow-hidden',
              getHouseClasses(person.house).chip,
              'text-white'
            )}>
              <div className="px-6 py-8 text-center">
                <p className="text-4xl mb-3">
                  {person.house === 'gryffindor' && '🦁'}
                  {person.house === 'hufflepuff' && '🦡'}
                  {person.house === 'ravenclaw' && '🦅'}
                  {person.house === 'slytherin' && '🐍'}
                </p>
                <h3 className="text-2xl font-bold mb-2">{person.house}</h3>
                <p className="text-sm opacity-90">House Member</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>⊕</span>
                  Connect
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {person.phone && (
                  <motion.button
                    whileHover={enableAnimations ? { scale: 1.02 } : {}}
                    onClick={(e) => handleContactClick(e, `https://wa.me/${person.phone.replace(/[\s-]/g, '')}`)}
                    className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>💭</span>
                    WhatsApp
                  </motion.button>
                )}
                {person.fb && (
                  <motion.button
                    whileHover={enableAnimations ? { scale: 1.02 } : {}}
                    onClick={(e) => handleContactClick(e, person.fb)}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>👤</span>
                    Facebook
                  </motion.button>
                )}
                {!person.phone && !person.fb && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No contact information available
                  </p>
                )}
              </div>
            </div>

            {/* Roll Info */}
            {person.roll && (
              <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>🎓</span>
                    Role
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <p className={cn('font-bold text-lg', getHouseClasses(person.house).chip)}>
                    {person.roll}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
