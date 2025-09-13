import React from 'react';
import { motion } from 'framer-motion';
import type { ProfileCardProps } from '@/types';
import { getHouseClasses, cn } from '@/utils';
import { CharacterImage } from '@/components/ui/CharacterImage';
import { useModal } from '@/contexts/ModalContext';
import { useSettings } from '@/contexts/SettingsContext';

interface CardContentDisplayProps {
  person: ProfileCardProps['person'];
}

function CardContentDisplay({ person }: CardContentDisplayProps) {
  const { chip } = getHouseClasses(person.house);
  const { enableAnimations } = useSettings();

  const handleContactClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Default content - shown when not hovering */}
      <div className={cn(
        'absolute bottom-4 left-4 right-4 transition-opacity duration-300 pointer-events-none',
        'opacity-100 group-hover:opacity-0'
      )}>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={cn('rounded-full px-3 py-1 text-xs font-medium capitalize', chip)}>
            {person.house}
          </span>
          <span className={cn('rounded-full px-3 py-1 text-xs font-medium', chip)}>
            {person.bloodGroup}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white drop-shadow-2xl bg-gradient-to-r from-black/60 to-transparent rounded-lg px-3 py-2 backdrop-blur-sm">
          {person.name}
        </h3>
      </div>

      {/* Hover content - contact buttons and hint */}
      <div className={cn(
        'absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100',
        'flex flex-col justify-between p-4'
      )}>
        {/* Top: Hover hint */}
        <div className="flex justify-center">
          <motion.div
            initial={enableAnimations ? { y: -10, opacity: 0 } : false}
            animate={enableAnimations ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20"
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <span className="text-purple-500"></span>
              Click to know more
              <span className="text-purple-500"></span>
            </p>
          </motion.div>
        </div>

        {/* Bottom: Contact buttons */}
        <div className="flex justify-center gap-3">
          <motion.button
            initial={enableAnimations ? { scale: 0, rotate: -180 } : false}
            animate={enableAnimations ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
            transition={enableAnimations ? { delay: 0.1, type: "spring", stiffness: 300 } : {}}
            onClick={(e) => handleContactClick(e, `https://wa.me/${person.phone.replace(/[\s-]/g, '')}`)}
            className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 pointer-events-auto"
            aria-label="Contact via WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
            </svg>
          </motion.button>

          <motion.button
            initial={enableAnimations ? { scale: 0, rotate: 180 } : false}
            animate={enableAnimations ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
            transition={enableAnimations ? { delay: 0.2, type: "spring", stiffness: 300 } : {}}
            onClick={(e) => handleContactClick(e, person.fb)}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 pointer-events-auto"
            aria-label="Visit Facebook profile"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </motion.button>
        </div>
      </div>
    </>
  );
}

export function ProfileCard({ person, index }: ProfileCardProps) {
  const { openModal } = useModal();
  const { enableAnimations, cardSize } = useSettings();
  const { ring, tint, roll } = getHouseClasses(person.house);

  const handleCardClick = () => {
    // Open modal using global context
    openModal(person);
  };

  // Special styling for special characters
  const getSpecialStyling = () => {
    if (!person.isSpecial) return '';

    switch (person.specialType) {
      case 'hero':
        return 'ring-4 ring-yellow-400/50 shadow-2xl shadow-yellow-400/25';
      case 'villain':
        return 'ring-4 ring-red-500/50 shadow-2xl shadow-red-500/25';
      case 'magical-being':
        return 'ring-4 ring-purple-400/50 shadow-2xl shadow-purple-400/25';
      default:
        return '';
    }
  };

  // Get height classes based on card size
  const getCardHeightClasses = () => {
    switch (cardSize) {
      case 'small':
        return 'h-[20rem]';
      case 'large':
        return 'h-[28rem]';
      default: // medium
        return 'h-[24rem]';
    }
  };

  return (
    <motion.article
      initial={enableAnimations ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={enableAnimations ? {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          delay: index * 0.05,
          ease: "easeOut"
        }
      } : { opacity: 1, y: 0, scale: 1 }}
      whileHover={enableAnimations ? {
        y: -8,
        scale: person.isSpecial ? 1.08 : 1.05,
        rotateY: 2,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      } : {}}
      whileTap={enableAnimations ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${person.name}, ${person.house} house, roll number ${person.roll}`}
      className={cn(
        'group relative rounded-xl overflow-hidden bg-white/90 shadow-xl ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10 cursor-pointer backdrop-blur-sm',
        'hover:shadow-2xl hover:ring-2 hover:ring-indigo-500/20 focus:shadow-2xl focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all duration-300',
        getCardHeightClasses(),
        getSpecialStyling()
      )}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Magical particle effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-2 left-2 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
        <div className="absolute top-6 right-4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-8 left-6 w-1 h-1 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      </div>

      {/* Glow effect */}
      <div className={cn(
        'pointer-events-none absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
        ring
      )} />

      {/* Background image */}
      <CharacterImage
        person={person}
        alt={person.name}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out pointer-events-none',
          'group-hover:scale-110'
        )}
      />

      {/* Tint overlay */}
      <div className={cn('absolute inset-0 mix-blend-soft-light pointer-events-none', tint)} />

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-60 dark:from-black/75 dark:via-black/20 pointer-events-none" />

      {/* Roll badge */}
      <div className="absolute -top-1 left-0 z-20 pointer-events-none">
        <span className={cn(
          'inline-block rounded-br-full px-6 py-1 text-xs font-bold shadow-lg font-sans',
          roll,
          person.isSpecial && person.specialType === 'hero' && 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 animate-pulse',
          person.isSpecial && person.specialType === 'villain' && 'bg-gradient-to-r from-red-500 to-red-700 text-red-100 animate-pulse',
          person.isSpecial && person.specialType === 'magical-being' && 'bg-gradient-to-r from-purple-400 to-purple-600 text-purple-100 animate-pulse'
        )}>
          {person.roll}
        </span>
        {person.isSpecial && (
          <div className="absolute -top-1 -right-1">
            {person.specialType === 'hero' && <span className="text-yellow-400 text-lg animate-bounce"></span>}
            {person.specialType === 'villain' && <span className="text-red-500 text-lg animate-bounce"></span>}
            {person.specialType === 'magical-being' && <span className="text-purple-400 text-lg animate-bounce"></span>}
          </div>
        )}
      </div>

      {/* Default content */}
      <CardContentDisplay person={person} />
    </motion.article>
  );
}
