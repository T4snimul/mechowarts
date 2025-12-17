import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface Cursor3DModelProps {
  className?: string;
}

export function Cursor3DModel({ className = '' }: Cursor3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Smooth spring animation for mouse tracking
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  // Transform mouse position to rotation
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  // Floating animation offset
  const floatY = useSpring(0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize to -0.5 to 0.5
      const x = (e.clientX - centerX) / rect.width;
      const y = (e.clientY - centerY) / rect.height;

      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      mouseX.set(0);
      mouseY.set(0);
    };

    // Floating animation
    const floatInterval = setInterval(() => {
      floatY.set(Math.sin(Date.now() / 1000) * 10);
    }, 50);

    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(floatInterval);
    };
  }, [mouseX, mouseY, floatY]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          y: floatY,
        }}
        className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
      >
        {/* Main Container - Mechatronic Magic Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer glow */}
          <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-transparent blur-3xl animate-pulse" />

          {/* Rotating Gear Ring - Outer */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-full h-full"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full text-gray-400/30 dark:text-gray-500/20">
              {/* Large gear teeth */}
              {[...Array(16)].map((_, i) => (
                <rect
                  key={i}
                  x="96"
                  y="2"
                  width="8"
                  height="12"
                  rx="2"
                  fill="currentColor"
                  transform={`rotate(${i * 22.5} 100 100)`}
                />
              ))}
              <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </motion.div>

          {/* Rotating Gear Ring - Inner (opposite direction) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-3/4 h-3/4"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full text-cyan-500/30 dark:text-cyan-400/20">
              {[...Array(12)].map((_, i) => (
                <rect
                  key={i}
                  x="97"
                  y="8"
                  width="6"
                  height="10"
                  rx="1"
                  fill="currentColor"
                  transform={`rotate(${i * 30} 100 100)`}
                />
              ))}
              <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </motion.div>

          {/* Main orb - The Magic Core */}
          <motion.div
            animate={{
              scale: isHovering ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
          >
            {/* Glass sphere effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-purple-200/30 to-cyan-300/20 dark:from-gray-800/40 dark:via-purple-900/30 dark:to-cyan-900/20 backdrop-blur-sm border border-white/30 dark:border-white/10 shadow-2xl" />

            {/* Inner glow - Electric/Magic hybrid */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-400/30 via-cyan-500/20 to-amber-400/10 dark:from-purple-600/20 dark:via-cyan-700/15 dark:to-amber-600/10 blur-xl" />

            {/* Shine effect */}
            <div className="absolute top-4 left-6 w-16 h-8 rounded-full bg-white/50 dark:bg-white/20 blur-md transform -rotate-45" />

            {/* Central Icon - Robot Arm with Wand */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
              >
                {/* Robot Arm Base */}
                <rect x="42" y="70" width="16" height="12" rx="2" className="fill-gray-500/70 dark:fill-gray-400/60" />
                <rect x="38" y="78" width="24" height="8" rx="2" className="fill-gray-600/70 dark:fill-gray-500/60" />

                {/* Arm Segment 1 */}
                <rect x="46" y="45" width="8" height="28" rx="2" className="fill-gray-400/80 dark:fill-gray-300/70" />
                <circle cx="50" cy="45" r="6" className="fill-cyan-500/70 dark:fill-cyan-400/60" />

                {/* Arm Segment 2 (angled) */}
                <rect x="48" y="25" width="6" height="22" rx="2" className="fill-gray-400/80 dark:fill-gray-300/70" transform="rotate(-15 50 35)" />
                <circle cx="50" cy="25" r="5" className="fill-cyan-500/70 dark:fill-cyan-400/60" />

                {/* Gripper/Hand holding wand */}
                <path d="M 45 12 L 48 18 L 52 18 L 55 12 Z" className="fill-gray-500/80 dark:fill-gray-400/70" />

                {/* Magic Wand */}
                <rect x="48" y="2" width="4" height="14" rx="1" className="fill-amber-700/90" />
                <rect x="47" y="14" width="6" height="3" rx="1" className="fill-amber-500/90" />

                {/* Wand Spark/Magic Effect */}
                <motion.circle
                  cx="50"
                  cy="2"
                  r="3"
                  className="fill-yellow-400"
                  animate={{
                    r: [2, 4, 2],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Circuit patterns on arm */}
                <path d="M 50 50 L 50 55 L 55 55" fill="none" stroke="cyan" strokeWidth="0.5" opacity="0.5" />
                <path d="M 50 60 L 45 60 L 45 65" fill="none" stroke="cyan" strokeWidth="0.5" opacity="0.5" />
                <circle cx="55" cy="55" r="1" className="fill-cyan-400/70" />
                <circle cx="45" cy="65" r="1" className="fill-cyan-400/70" />
              </svg>
            </div>

            {/* Floating Magic Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-yellow-400/80' : 'bg-cyan-400/80'}`}
                  animate={{
                    y: [0, -60, 0],
                    x: [0, Math.random() * 30 - 15, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 1.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${25 + Math.random() * 50}%`,
                    bottom: '30%',
                  }}
                />
              ))}
            </div>

            {/* Electric Arc Effects */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <motion.path
                d="M 30 50 Q 35 45 40 50 Q 45 55 50 50"
                fill="none"
                stroke="cyan"
                strokeWidth="0.5"
                opacity="0.6"
                animate={{
                  d: [
                    "M 30 50 Q 35 45 40 50 Q 45 55 50 50",
                    "M 30 50 Q 35 55 40 50 Q 45 45 50 50",
                    "M 30 50 Q 35 45 40 50 Q 45 55 50 50",
                  ],
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
              <motion.path
                d="M 50 50 Q 55 45 60 50 Q 65 55 70 50"
                fill="none"
                stroke="cyan"
                strokeWidth="0.5"
                opacity="0.6"
                animate={{
                  d: [
                    "M 50 50 Q 55 55 60 50 Q 65 45 70 50",
                    "M 50 50 Q 55 45 60 50 Q 65 55 70 50",
                    "M 50 50 Q 55 55 60 50 Q 65 45 70 50",
                  ],
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Orbiting elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          {/* Floating Gear */}
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 30 30" className="w-8 h-8 text-gray-400/70 dark:text-gray-500/60">
              {[...Array(8)].map((_, i) => (
                <rect
                  key={i}
                  x="13"
                  y="1"
                  width="4"
                  height="5"
                  rx="1"
                  fill="currentColor"
                  transform={`rotate(${i * 45} 15 15)`}
                />
              ))}
              <circle cx="15" cy="15" r="8" fill="currentColor" />
              <circle cx="15" cy="15" r="4" className="fill-gray-300 dark:fill-gray-600" />
            </svg>
          </motion.div>

          {/* Magic Rune Symbols */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute text-purple-400/60 dark:text-purple-300/50 text-lg font-bold"
              style={{
                top: `${30 + i * 25}%`,
                left: i % 2 === 0 ? '0%' : '88%',
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
              }}
            >
              {['⚡', '⚙', '✧'][i]}
            </motion.div>
          ))}
        </motion.div>

        {/* Second orbit - opposite direction */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          {/* Small Sensor/Circuit Node */}
          <motion.div
            className="absolute bottom-4 left-1/4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-sm shadow-lg shadow-cyan-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* Magic Star */}
          <motion.div
            className="absolute top-1/4 right-4 text-amber-400/80 text-xl"
            animate={{
              rotate: 360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity },
            }}
          >
            ⭐
          </motion.div>
        </motion.div>

        {/* Magic sparkle trail following mouse */}
        {isHovering && (
          <motion.div
            className="absolute w-4 h-4 pointer-events-none"
            style={{
              left: `${50 + mousePosition.x * 100}%`,
              top: `${50 + mousePosition.y * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur-md animate-ping" />
            <div className="absolute inset-0 w-2 h-2 m-auto bg-white rounded-full" />
          </motion.div>
        )}
      </motion.div>

      {/* Reflection */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-t from-purple-500/10 via-cyan-500/5 to-transparent rounded-full blur-2xl" />
    </div>
  );
}
