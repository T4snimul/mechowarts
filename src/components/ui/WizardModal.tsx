import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Person } from '@/types';
import { CharacterImage } from '@/components/ui/CharacterImage';
import { getHouseClasses, formatPhoneNumber, cn } from '@/utils';

interface WizardModalProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WizardModal({ person, isOpen, onClose }: WizardModalProps) {
  if (!person) return null;

  const { chip } = getHouseClasses(person.house);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
              y: 50,
              rotateX: -10
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.5
              }
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
              y: 30,
              rotateX: 5,
              transition: {
                duration: 0.2,
                ease: "easeIn"
              }
            }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/80 dark:bg-white/20 backdrop-blur-md hover:bg-black/90 dark:hover:bg-white/30 transition-all duration-200 text-white shadow-2xl"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with character image */}
            <div className="relative h-80 md:h-96 overflow-hidden">
              <CharacterImage
                person={person}
                className="w-full h-full object-cover"
                alt={person.name}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />

              {/* Character info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className={cn('px-4 py-2 rounded-full text-sm font-medium capitalize', chip)}>
                    {person.house}
                  </span>
                  {person.isSpecial && (
                    <span className="px-4 py-2 rounded-full bg-yellow-500/90 text-yellow-900 text-sm font-medium">
                      {person.specialType === 'hero' ? 'Hero' :
                       person.specialType === 'villain' ? 'Dark Lord' :
                       'Magical Being'}
                    </span>
                  )}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-2">{person.name}</h2>
                <p className="text-gray-200 text-lg">
                  Roll: {person.roll} • House Roll: {person.houseRoll}
                </p>
                {person.houseRole && (
                  <p className="text-yellow-300 text-lg italic mt-2">{person.houseRole}</p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 lg:p-12 space-y-8 max-w-4xl mx-auto">
              {/* Story section */}
              {person.story && (
                <section>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="text-3xl mr-3">📜</span>
                    The Wizard's Tale
                  </h3>
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic text-lg">
                      "{person.story}"
                    </p>
                  </div>
                </section>
              )}

              {/* Magical Profile */}
              {(person.patronus || person.wand || person.yearsAtHogwarts) && (
                <section>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="text-3xl mr-3"></span>
                    Magical Profile
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {person.patronus && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-600 dark:text-blue-400 text-xl">🦌</span>
                          <span className="text-base font-medium text-blue-900 dark:text-blue-200">Patronus</span>
                        </div>
                        <p className="text-blue-800 dark:text-blue-300 font-semibold text-lg">{person.patronus}</p>
                      </div>
                    )}

                    {person.wand && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-purple-600 dark:text-purple-400 text-xl">🪄</span>
                          <span className="text-base font-medium text-purple-900 dark:text-purple-200">Wand</span>
                        </div>
                        <p className="text-purple-800 dark:text-purple-300 font-semibold text-base">{person.wand}</p>
                      </div>
                    )}

                    {person.yearsAtHogwarts !== undefined && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600 dark:text-green-400 text-xl"></span>
                          <span className="text-base font-medium text-green-900 dark:text-green-200">Years at Hogwarts</span>
                        </div>
                        <p className="text-green-800 dark:text-green-300 font-semibold text-lg">{person.yearsAtHogwarts}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Skills & Abilities */}
              {person.skills && person.skills.length > 0 && (
                <section>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="text-3xl mr-3"></span>
                    Magical Skills & Abilities
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {person.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-base font-medium border border-indigo-200 dark:border-indigo-800/50 hover:scale-105 transition-transform duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Owl Post Information */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="text-3xl mr-3">🦉</span>
                  Owl Post Delivery
                </h3>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-red-500 text-xl">🩸</span>
                        <span className="text-base font-medium text-gray-700 dark:text-gray-300">Blood Status</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">{person.bloodGroup}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-blue-500 text-xl">📍</span>
                        <span className="text-base font-medium text-gray-700 dark:text-gray-300">Owl Delivery Address</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">{person.hometown}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-purple-500 text-xl">🪄</span>
                        <span className="text-base font-medium text-gray-700 dark:text-gray-300">Years at Hogwarts</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">{person.yearsAtHogwarts || 'N/A'}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-emerald-500 text-xl">�</span>
                        <span className="text-base font-medium text-gray-700 dark:text-gray-300">Patronus</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">{person.patronus || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center">
                      <span className="text-lg mr-2">⚡</span>
                      <span><strong>Magical Note:</strong> Owl post delivery guaranteed within 24 hours to any wizarding location. Standard Hogwarts postage rates apply.</span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact & Communication */}
              <section>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="text-3xl mr-3">📞</span>
                  Muggle Communication
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-green-500 text-xl">📱</span>
                        <span className="text-base font-medium text-gray-700 dark:text-gray-300">Magical Phone</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">{formatPhoneNumber(person.phone)}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-orange-500 text-xl">🔮</span>
                        <span className="text-base font-medium text-gray-700 dark:text-gray-300">Wand</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">{person.wand || 'Unknown'}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center">
                      <span className="text-lg mr-2">📡</span>
                      <span><strong>Ministry Notice:</strong> Muggle communication devices have been enchanted for magical use. Signal strength may vary near magical barriers.</span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Action buttons */}
              <section>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/${person.phone.replace(/[\s-]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                    </svg>
                    Send Owl via WhatsApp
                  </a>

                  <a
                    href={person.fb}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center rounded-xl border-2 border-blue-500 bg-white dark:bg-gray-800 px-4 py-3 text-blue-600 dark:text-blue-400 font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Connect on Facebook
                  </a>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
