import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-purple-200 dark:border-purple-800 border-t-purple-500 dark:border-t-purple-400 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

interface MagicalLoadingProps {
  message?: string;
  className?: string;
}

export function MagicalLoading({ message = "Casting magical spells...", className = '' }: MagicalLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-16 h-16 border-2 border-purple-200 dark:border-purple-800 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner spinning wand */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-2xl">🪄</span>
        </motion.div>

        {/* Magical particles */}
        <motion.div
          className="absolute -top-1 -right-1 text-yellow-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >

        </motion.div>

        <motion.div
          className="absolute -bottom-1 -left-1 text-purple-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        >

        </motion.div>
      </div>

      <motion.p
        className="text-gray-600 dark:text-gray-400 text-sm font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
}

export default LoadingSpinner;
