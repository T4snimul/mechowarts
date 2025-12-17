import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProfileCardProps } from '@/types';
import { useSettings } from '@/contexts/SettingsContext';

interface CardContextMenuProps {
  person: ProfileCardProps['person'];
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onViewProfile: () => void;
  onContact: (type: 'whatsapp' | 'facebook') => void;
}

export function CardContextMenu({
  person,
  isOpen,
  position,
  onClose,
  onViewProfile,
  onContact,
}: CardContextMenuProps) {
  const { enableAnimations } = useSettings();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleContactClick = (type: 'whatsapp' | 'facebook', url: string) => {
    window.open(url, '_blank');
    onContact(type);
    onClose();
  };

  const whatsappUrl = `https://wa.me/${person.phone.replace(/[\s-]/g, '')}`;
  const facebookUrl = person.fb;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={enableAnimations ? { opacity: 0, scale: 0.95, y: -10 } : { opacity: 1, scale: 1, y: 0 }}
          animate={enableAnimations ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
          exit={enableAnimations ? { opacity: 0, scale: 0.95, y: -10 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 50,
          }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="min-w-max">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {person.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {person.house} • #{person.roll}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {/* View Profile */}
              <button
                onClick={() => {
                  onViewProfile();
                  onClose();
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors group"
              >
                <svg className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>View full profile</span>
              </button>

              <div className="px-0 my-1 border-t border-gray-200 dark:border-gray-700" />

              {/* WhatsApp */}
              <button
                onClick={() => handleContactClick('whatsapp', whatsappUrl)}
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 transition-colors group"
              >
                <svg className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
                </svg>
                <span>Message on WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleContactClick('facebook', facebookUrl)}
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2 transition-colors group"
              >
                <svg className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Visit Facebook profile</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
