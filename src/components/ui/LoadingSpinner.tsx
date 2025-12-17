import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div
      className={`relative flex items-center justify-center max-h-[28vh] sm:max-h-none ${className}`}
      style={{ minHeight: '8rem' }}
    >
      {/* Outer rotating ring */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-2 border-purple-200/60 dark:border-purple-800/60 border-t-amber-400/80 dark:border-t-amber-300/80 shadow-[0_0_24px_rgba(125,90,255,0.25)]`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner sigil */}
      <motion.div
        className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 via-amber-300/25 to-indigo-400/25 blur-[1px]"
        animate={{ rotate: -360, scale: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Wand */}
      <motion.div
        className="absolute flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-10 h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-purple-500 shadow-[0_0_12px_rgba(255,225,150,0.6)]" />
      </motion.div>

      {/* Sparkle pulses */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-amber-300/90 shadow-[0_0_16px_rgba(255,215,128,0.7)]"
        animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
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
    <div
      className={`flex flex-col items-center justify-center space-y-5 max-h-[32vh] sm:max-h-none ${className}`}
      style={{ minHeight: '10rem' }}
    >
      <div className="relative">
        {/* Arcane ring */}
        <motion.div
          className="w-24 h-24 rounded-full border border-amber-300/70 dark:border-amber-200/40 shadow-[0_0_28px_rgba(255,214,153,0.35)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner wards */}
        <motion.div
          className="absolute inset-3 rounded-full border border-purple-400/50 dark:border-purple-300/40"
          animate={{ rotate: -360, scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating runes */}
        {['✶', '✦', '✺'].map((glyph, idx) => (
          <motion.span
            key={glyph}
            className="absolute text-lg text-amber-200 drop-shadow-[0_0_10px_rgba(255,225,160,0.8)]"
            style={{
              top: idx === 0 ? '12%' : idx === 1 ? '48%' : '78%',
              left: idx === 0 ? '50%' : idx === 1 ? '18%' : '72%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2 + idx * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {glyph}
          </motion.span>
        ))}

        {/* Wand */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-purple-500 shadow-[0_0_18px_rgba(255,225,160,0.7)]" />
        </motion.div>

        {/* Core pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-4 h-4 rounded-full bg-amber-200/90 shadow-[0_0_16px_rgba(255,225,160,0.8)]" />
        </motion.div>
      </div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 text-sm font-semibold tracking-wide text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center px-6">
        Hint: toggle background magic or calm mode in settings if you prefer a quieter hall.
      </p>
    </div>
  );
}

export default LoadingSpinner;
