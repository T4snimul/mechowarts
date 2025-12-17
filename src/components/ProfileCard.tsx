import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ProfileCardProps, PrivacyLevel } from '@/types';
import { cn } from '@/utils';
import { CharacterImage } from '@/components/ui/CharacterImage';
import { CardContextMenu } from '@/components/ui/CardContextMenu';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

// Check if a field should be visible based on privacy settings
function isFieldVisible(privacy: PrivacyLevel | undefined, isAuthenticated: boolean): boolean {
  if (!privacy || privacy === 'public') return true;
  if (privacy === 'authenticated' && isAuthenticated) return true;
  if (privacy === 'private') return false;
  return false;
}

// House cover images/gradients
const HOUSE_COVERS = {
  gryffindor: 'from-red-400/30 via-orange-300/20 to-yellow-200/30',
  slytherin: 'from-green-400/30 via-emerald-300/20 to-teal-200/30',
  ravenclaw: 'from-blue-400/30 via-indigo-300/20 to-purple-200/30',
  hufflepuff: 'from-yellow-400/30 via-amber-300/20 to-orange-200/30',
};

export function ProfileCard({ person, index, onOpenPerson }: ProfileCardProps) {
  const { enableAnimations } = useSettings();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const isDark = theme === 'dark';
  const houseCover = HOUSE_COVERS[person.house as keyof typeof HOUSE_COVERS] || HOUSE_COVERS.gryffindor;

  // Check privacy for contact info
  const showPhone = person.phone && isFieldVisible(person.privacy?.phone, isAuthenticated);
  const showFb = person.fb && isFieldVisible(person.privacy?.fb, isAuthenticated);

  const handleCardClick = () => {
    if (onOpenPerson) {
      onOpenPerson(person);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  const handleDMClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/owlery?dm=${person.roll}`);
  };

  const handleContactClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  // Calculate a "progress" percentage based on roll number for visual interest
  const progressPercent = ((parseInt(person.roll.replace(/\D/g, '')) || 50) % 100);

  return (
    <>
      <motion.article
        initial={enableAnimations ? { opacity: 0, y: 20, scale: 0.95 } : false}
        animate={enableAnimations ? {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.4,
            delay: index * 0.03,
            ease: "easeOut"
          }
        } : { opacity: 1, y: 0, scale: 1 }}
        whileHover={enableAnimations ? {
          y: -4,
          transition: { duration: 0.2, ease: "easeOut" }
        } : {}}
        whileTap={enableAnimations ? { scale: 0.98 } : {}}
        onClick={handleCardClick}
        onContextMenu={handleContextMenu}
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
          'group relative rounded-2xl overflow-hidden cursor-pointer',
          'shadow-lg hover:shadow-xl transition-all duration-300',
          isDark ? 'bg-gray-800' : 'bg-white',
          'border',
          isDark ? 'border-gray-700' : 'border-gray-200'
        )}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Header/Cover Section */}
        <div className={cn(
          'relative h-24 sm:h-28 overflow-hidden',
          'bg-gradient-to-br',
          isDark ? 'from-gray-700 via-gray-600 to-gray-700' : 'from-gray-100 via-gray-50 to-gray-100'
        )}>
          {/* Decorative clouds/shapes */}
          <div className={cn('absolute inset-0 bg-gradient-to-br', houseCover)} />
          <div className="absolute top-4 left-8 w-16 h-8 bg-white/40 rounded-full blur-md" />
          <div className="absolute top-6 left-16 w-20 h-10 bg-white/30 rounded-full blur-lg" />
          <div className="absolute top-8 right-12 w-24 h-12 bg-white/35 rounded-full blur-lg" />
          <div className="absolute bottom-2 right-8 w-12 h-6 bg-white/25 rounded-full blur-md" />

          {/* Follow Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFollowClick}
            className={cn(
              'absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
              isFollowing
                ? isDark
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-500 text-white'
                : isDark
                  ? 'bg-gray-900/80 text-white hover:bg-gray-900'
                  : 'bg-white/90 text-gray-800 hover:bg-white shadow-sm'
            )}
          >
            {isFollowing ? (
              <>Following</>
            ) : (
              <>
                Follow
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </>
            )}
          </motion.button>
        </div>

        {/* Profile Avatar with Progress Ring */}
        <div className="relative -mt-12 sm:-mt-14 flex justify-center">
          <div className="relative">
            {/* Progress Ring SVG */}
            <svg className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isDark ? '#374151' : '#e5e7eb'}
                strokeWidth="4"
              />
              {/* Progress ring with house colors */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${progressPercent * 2.83} 283`}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={person.house === 'gryffindor' ? '#ef4444' : person.house === 'slytherin' ? '#22c55e' : person.house === 'ravenclaw' ? '#3b82f6' : '#eab308'} />
                  <stop offset="50%" stopColor={person.house === 'gryffindor' ? '#f97316' : person.house === 'slytherin' ? '#10b981' : person.house === 'ravenclaw' ? '#6366f1' : '#f59e0b'} />
                  <stop offset="100%" stopColor={person.house === 'gryffindor' ? '#eab308' : person.house === 'slytherin' ? '#14b8a6' : person.house === 'ravenclaw' ? '#a855f7' : '#ea580c'} />
                </linearGradient>
              </defs>
            </svg>
            {/* Avatar */}
            <div className={cn(
              'absolute inset-2 sm:inset-2.5 rounded-full overflow-hidden',
              'ring-4',
              isDark ? 'ring-gray-800' : 'ring-white'
            )}>
              <CharacterImage
                person={person}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 pt-2 pb-4">
          {/* Name */}
          <h3 className={cn(
            'text-center text-lg font-bold leading-tight',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            {person.name}
          </h3>

          {/* Description / House & Roll */}
          <p className={cn(
            'text-center text-sm mt-1 line-clamp-2',
            isDark ? 'text-gray-400' : 'text-gray-500'
          )}>
            {person.story || `${person.house.charAt(0).toUpperCase() + person.house.slice(1)} • #${person.roll}`}
          </p>

          {/* Stats Row */}
          <div className={cn(
            'flex justify-center items-center gap-6 mt-4 pt-4 border-t',
            isDark ? 'border-gray-700' : 'border-gray-100'
          )}>
            <div className="text-center">
              <p className={cn('text-base font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                {person.roll.slice(-2) || '00'}
              </p>
              <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>Roll</p>
            </div>
            <div className={cn('w-px h-8', isDark ? 'bg-gray-700' : 'bg-gray-200')} />
            <div className="text-center">
              <p className={cn('text-base font-bold capitalize', isDark ? 'text-white' : 'text-gray-900')}>
                {person.house.slice(0, 4)}
              </p>
              <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>House</p>
            </div>
            <div className={cn('w-px h-8', isDark ? 'bg-gray-700' : 'bg-gray-200')} />
            <div className="text-center">
              <p className={cn('text-base font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                {person.bloodGroup || '—'}
              </p>
              <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>Blood</p>
            </div>
          </div>

          {/* Social Icons */}
          <div className={cn(
            'flex justify-center items-center gap-4 mt-4 pt-4 border-t',
            isDark ? 'border-gray-700' : 'border-gray-100'
          )}>
            {/* DM Button */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDMClick}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark ? 'text-gray-400 hover:text-purple-400 hover:bg-gray-700' : 'text-gray-500 hover:text-purple-600 hover:bg-gray-100'
                )}
                aria-label="Send direct message"
                title="Send DM"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </motion.button>
            )}

            {/* WhatsApp */}
            {showPhone && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleContactClick(e, `https://wa.me/${person.phone.replace(/[\s-]/g, '')}`)}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700' : 'text-gray-500 hover:text-green-600 hover:bg-gray-100'
                )}
                aria-label="Contact via WhatsApp"
                title="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
                </svg>
              </motion.button>
            )}

            {/* Facebook */}
            {showFb && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleContactClick(e, person.fb)}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                )}
                aria-label="Visit Facebook profile"
                title="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.button>
            )}

            {/* View Profile hint if no social links */}
            {!isAuthenticated && !showPhone && !showFb && (
              <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
                Click to view profile
              </p>
            )}
          </div>
        </div>
      </motion.article>

      <CardContextMenu
        person={person}
        isOpen={contextMenu !== null}
        position={contextMenu || { x: 0, y: 0 }}
        onClose={() => setContextMenu(null)}
        onViewProfile={handleCardClick}
        onContact={() => { }}
      />
    </>
  );
}
