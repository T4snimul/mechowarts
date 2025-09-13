import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ProfileCardProps } from '@/types';
import { getHouseClasses, copyToClipboard, formatPhoneNumber, cn } from '@/utils';

interface ContactInfoProps {
  person: ProfileCardProps['person'];
}

function ContactInfo({ person }: ContactInfoProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(person.phone);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-2">
      {/* Blood Group */}
      <div className="flex items-center gap-2 rounded-xl border border-purple-200/70 bg-purple-50/70 p-2 shadow-sm backdrop-blur-sm dark:border-purple-500/40 dark:bg-purple-500/10">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-purple-500 dark:text-purple-300">
            Blood Group
          </p>
          <p className="text-xs font-semibold text-purple-900 dark:text-purple-200">
            {person.bloodGroup}
          </p>
        </div>
      </div>

      {/* Hometown */}
      <div className="flex items-center gap-2 rounded-xl border border-blue-200/70 bg-blue-50/70 p-2 shadow-sm backdrop-blur-sm dark:border-blue-500/40 dark:bg-blue-500/10">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-blue-500 dark:text-blue-300">
            Hometown
          </p>
          <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
            {person.hometown}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/70 p-2 shadow-sm backdrop-blur-sm dark:border-emerald-500/40 dark:bg-emerald-500/10">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.7}
          >
            <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.9 19.9 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2.1 3.2 2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.7c.12.9.32 1.8.6 2.6a2 2 0 0 1-.46 2.1L7.1 8.6a16 16 0 0 0 6.27 6.27l1.17-1.15a2 2 0 0 1 2.11-.45c.85.27 1.73.47 2.63.59A2 2 0 0 1 22 16.9Z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-emerald-500 dark:text-emerald-300">
            Phone
          </p>
          <button
            type="button"
            onClick={handleCopyPhone}
            className="relative cursor-copy text-xs font-semibold text-emerald-900 underline-offset-2 hover:underline dark:text-emerald-200"
            title="Click to copy"
          >
            {copied ? 'Copied!' : formatPhoneNumber(person.phone)}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`https://wa.me/${person.phone.replace(/[\s-]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
          </svg>
          WhatsApp
        </a>
        <a
          href={person.fb}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400"
        >
          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </a>
      </div>
    </div>
  );
}

interface CardContentDisplayProps {
  person: ProfileCardProps['person'];
  isOpen: boolean;
}

function CardContentDisplay({ person, isOpen }: CardContentDisplayProps) {
  const { chip } = getHouseClasses(person.house);

  return (
    <div className={cn(
      'absolute bottom-4 left-4 right-4 transition-opacity duration-300 pointer-events-none',
      isOpen ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
    )}>
      <div className="flex flex-wrap gap-1.5 mb-2">
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', chip)}>
          {person.house}
        </span>
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', chip)}>
          {person.bloodGroup}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white drop-shadow-2xl bg-gradient-to-r from-black/60 to-transparent rounded-lg px-2 py-1 backdrop-blur-sm">
        {person.name}
      </h3>
    </div>
  );
}

interface HoverPanelProps {
  person: ProfileCardProps['person'];
  isOpen: boolean;
}

function HoverPanel({ person, isOpen }: HoverPanelProps) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 rounded-t-xl bg-white/95 p-3 shadow-[0_-10px_28px_rgba(0,0,0,0.18)] transition-transform duration-500',
        'group-hover:translate-y-0 dark:bg-slate-900/95',
        isOpen ? 'translate-y-0' : 'translate-y-full'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-3">
        <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
          {person.name}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Roll: {person.roll}
        </p>
      </div>

      <ContactInfo person={person} />
    </div>
  );
}

export function ProfileCard({ person, index }: ProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ring, tint, roll } = getHouseClasses(person.house);

  const handleCardClick = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      onClick={handleCardClick}
      className={cn(
        'group relative h-[24rem] rounded-xl overflow-hidden bg-white/90 shadow-xl ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10 cursor-pointer backdrop-blur-sm',
        'hover:shadow-2xl hover:ring-2 hover:ring-indigo-500/20 transition-all duration-300',
        isOpen ? 'z-20' : ''
      )}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Magical particle effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-2 left-2 w-1 h-1 bg-amber-400 rounded-full animate-ping" />
        <div className="absolute top-6 right-4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-8 left-6 w-1 h-1 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      </div>

      {/* Glow effect */}
      <div className={cn(
        'pointer-events-none absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
        ring
      )} />

      {/* Background image */}
      <img
        src={person.avatar}
        alt={person.name}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out pointer-events-none',
          isOpen ? 'scale-110' : 'group-hover:scale-110'
        )}
      />

      {/* Tint overlay */}
      <div className={cn('absolute inset-0 mix-blend-soft-light pointer-events-none', tint)} />

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-60 dark:from-black/75 dark:via-black/20 pointer-events-none" />

      {/* Roll badge */}
      <div className="absolute -top-1 left-0 z-20 pointer-events-none">
        <span className={cn('inline-block rounded-br-full px-6 py-1 text-xs font-bold shadow-lg font-sans', roll)}>
          {person.roll}
        </span>
      </div>

      {/* Default content */}
      <CardContentDisplay person={person} isOpen={isOpen} />

      {/* Hover panel */}
      <HoverPanel person={person} isOpen={isOpen} />
    </motion.article>
  );
}
