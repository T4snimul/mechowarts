import { motion } from 'framer-motion';

export function MagicalBackground() {
  // Create random positions and delays for floating elements
  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
    size: 0.5 + Math.random() * 1.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating magical particles */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute w-2 h-2 bg-purple-400/20 dark:bg-purple-300/10 rounded-full"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            scale: element.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 30, -20, 0],
            opacity: [0, 0.6, 0.8, 0.6, 0],
            scale: [element.size, element.size * 1.2, element.size],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle magical orbs */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400/30 to-blue-400/30 dark:from-purple-300/20 dark:to-blue-300/20 rounded-full blur-sm"
          style={{
            left: `${10 + i * 10}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Gentle magical shimmer waves */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/5 to-transparent dark:via-purple-400/5"
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Mystical energy lines */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-purple-300/20 to-transparent dark:via-purple-400/10"
          style={{
            top: `${25 + i * 15}%`,
            width: '200px',
            left: `${i * 20}%`,
          }}
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            delay: i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
