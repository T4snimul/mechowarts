import React from 'react';
import { ProfileCard } from './ProfileCard';
import type { GridProps } from '@/types';
import { cn } from '@/utils';
import { MagicalLoading } from './ui/LoadingSpinner';

interface EmptyStateProps {
  query?: string;
  onResetFilters?: () => void;
}

function EmptyState({ query, onResetFilters }: EmptyStateProps) {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center px-6">
      {/* Orb with sparkles */}
      <div className="relative mb-6">
        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-indigo-400/40 dark:from-indigo-400/20 dark:to-fuchsia-400/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-indigo-600 dark:text-indigo-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {/* Subtle glowing aura */}
        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20 dark:bg-indigo-400/15" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 font-display">
        {query ? 'No matches found' : 'Nothing to show'}
      </h2>

      {/* Subtitle */}
      <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400 font-sans">
        {query
          ? `The Marauder's Map shows no results for "${query}". Try casting a different spell`
          : 'The Marauder\'s Map is empty. Add some magical folk to see them here!'
        }
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}

interface GridLayoutProps {
  children: React.ReactNode;
  className?: string;
}

function GridLayout({ children, className }: GridLayoutProps) {
  // Get grid classes - hardcoded to large for consistent layout
  const getGridClasses = () => {
    return 'grid gap-4 max-w-7xl mx-auto place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4';
  };

  return (
    <div className={cn(getGridClasses(), className)}>
      {children}
    </div>
  );
}

interface ProfileGridProps extends GridProps {
  query?: string;
  className?: string;
  isLoading?: boolean;
  onResetFilters?: () => void;
  onOpenPerson?: (person: GridProps['people'][0]) => void;
}

function LoadingGrid() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <MagicalLoading message="Summoning wizards from the Great Hall..." />
    </div>
  );
}

export function ProfileGrid({ people, query, className, isLoading = false, onResetFilters, onOpenPerson }: ProfileGridProps) {
  if (isLoading) {
    return <LoadingGrid />;
  }

  if (people.length === 0) {
    return <EmptyState query={query} onResetFilters={onResetFilters} />;
  }

  // Fixed container size for consistent layout
  const containerClass = 'w-full max-w-sm';

  return (
    <GridLayout className={className}>
      {people.map((person, index) => (
        <div key={person.id} className={containerClass}>
          <ProfileCard person={person} index={index} onOpenPerson={onOpenPerson} />
        </div>
      ))}
    </GridLayout>
  );
}

// Legacy Grid component for backward compatibility
export default function Grid({ people }: GridProps) {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-8">
      <ProfileGrid people={people} />
    </section>
  );
}
