import { motion } from 'framer-motion';

export function ProfileCardSkeleton() {
  return (
    <div className="group relative h-[24rem] rounded-xl overflow-hidden bg-white/90 shadow-xl ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10 backdrop-blur-sm">
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-gray-600/20"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Roll badge skeleton */}
      <div className="absolute -top-1 left-0 z-20">
        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-br-full animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="absolute bottom-4 left-4 right-4 space-y-3">
        {/* House and blood group badges */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
        </div>

        {/* Name */}
        <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
}

export function SkeletonGrid({ count = 12 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  );
}
