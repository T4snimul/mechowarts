import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function MagicalBackground() {
  const { enableBackgroundEffects, reducedMotion } = useSettings();

  // Cursor trail particles that fade out behind the pointer
  const [cursorTrail, setCursorTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  const [cursorRunes, setCursorRunes] = useState<{ id: number; x: number; y: number; glyph: string }[]>([]);

  // Stable randomized backdrops
  const floatingElements = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
        size: 0.5 + Math.random() * 1.5,
      })),
    []
  );

  const rainDrops = useMemo(
    () =>
      Array.from({ length: 180 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        length: 18 + Math.random() * 48,
        duration: 0.85 + Math.random() * 0.9,
        delay: Math.random() * 3,
        opacity: 0.15 + Math.random() * 0.45,
        tilt: -12 + Math.random() * 6,
        hue: Math.random() > 0.8 ? 'from-amber-200/60 via-amber-300/50 to-amber-500/40' : 'from-cyan-50/40 via-purple-100/50 to-indigo-400/40',
      })),
    []
  );

  const thunderFlashes = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        delay: i * 1.5,
        duration: 1.2 + Math.random() * 0.6,
        gap: 5 + Math.random() * 4,
        intensity: 0.45 + Math.random() * 0.15,
      })),
    []
  );

  const lightningBolts = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        y: Math.random() * 40,
        length: 140 + Math.random() * 120,
        tilt: -8 + Math.random() * 16,
        delay: Math.random() * 3,
        gap: 6 + Math.random() * 7,
        intensity: 0.4 + Math.random() * 0.2,
      })),
    []
  );

  useEffect(() => {
    if (!enableBackgroundEffects || reducedMotion) {
      setCursorTrail([]);
      setCursorRunes([]);
      return;
    }

    let rafId: number | null = null;

    const sigils = ['✶', '✴', '✦', '✧', '✺', '✹'];

    const handleMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        setCursorTrail((prev) => {
          const next = [...prev, { id: performance.now(), x: clientX, y: clientY }];
          return next.slice(-12);
        });

        // Rune trail is sparser than glow trail
        if (Math.random() > 0.6) {
          setCursorRunes((prev) => {
            const next = [
              ...prev,
              {
                id: performance.now() + 1,
                x: clientX + (Math.random() * 16 - 8),
                y: clientY + (Math.random() * 16 - 8),
                glyph: sigils[Math.floor(Math.random() * sigils.length)],
              },
            ];
            return next.slice(-8);
          });
        }
      });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('pointermove', handleMove);
    };
  }, [enableBackgroundEffects, reducedMotion]);

  // Don't render anything if background effects are disabled
  if (!enableBackgroundEffects) {
    return null;
  }

  // Calmer reduced-motion variant: light mist + static runes
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-200/20 via-white/20 to-indigo-200/10 dark:from-purple-900/40 dark:via-gray-900/40 dark:to-indigo-900/30" />
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`calm-${i}`}
            className="absolute h-2 w-2 rounded-full bg-amber-200/70 dark:bg-amber-200/50 blur-[2px]"
            style={{
              left: `${10 + i * 10}%`,
              top: `${8 + (i % 4) * 18}%`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Rain layer */}
      {rainDrops.map((drop) => (
        <motion.span
          key={`rain-${drop.id}`}
          className={`absolute w-px bg-gradient-to-b ${drop.hue} dark:from-white/20 dark:via-blue-200/30 dark:to-purple-400/30 shadow-[0_8px_12px_-6px_rgba(88,28,135,0.35)]`}
          style={{
            left: `${drop.x}%`,
            top: '-10%',
            height: `${drop.length}px`,
            rotate: `${drop.tilt}deg`,
          }}
          animate={{
            y: ['-120%', '120%'],
            x: ['0%', '-3%'],
            opacity: [0, drop.opacity, 0],
          }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Thunderstorm flashes */}
      {thunderFlashes.map((flash) => (
        <motion.div
          key={`flash-${flash.id}`}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/8 to-amber-100/10 dark:via-purple-100/8 dark:to-white/12"
          animate={{ opacity: [0, 0, flash.intensity, 0] }}
          transition={{
            duration: flash.duration,
            delay: flash.delay,
            repeat: Infinity,
            repeatDelay: flash.gap,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Lightning bolts */}
      {lightningBolts.map((bolt) => (
        <motion.div
          key={`bolt-${bolt.id}`}
          className="absolute w-px bg-gradient-to-b from-white via-amber-100 to-transparent drop-shadow-[0_0_16px_rgba(255,255,255,0.5)]"
          style={{
            left: `${bolt.x}%`,
            top: `${bolt.y}%`,
            height: `${bolt.length}px`,
            rotate: `${bolt.tilt}deg`,
          }}
          animate={{
            opacity: [0, bolt.intensity, 0],
            scaleY: [0.8, 1.1, 0.9],
          }}
          transition={{
            duration: 0.6,
            delay: bolt.delay,
            repeat: Infinity,
            repeatDelay: bolt.gap,
            ease: 'easeOut',
          }}
        />
      ))}

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

      {/* Cursor-following sparkles */}
      {cursorTrail.map((point) => (
        <motion.div
          key={point.id}
          className="absolute w-7 h-7 rounded-full bg-amber-300/30 dark:bg-amber-200/15 blur-lg mix-blend-screen"
          style={{ left: point.x, top: point.y, transform: 'translate(-50%, -50%)' }}
          initial={{ scale: 0.4, opacity: 0.9 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}
      {cursorTrail.map((point) => (
        <motion.div
          key={`${point.id}-core`}
          className="absolute w-2.5 h-2.5 rounded-full bg-white/90 dark:bg-amber-100/90 shadow-[0_0_12px_rgba(255,255,255,0.55)]"
          style={{ left: point.x, top: point.y, transform: 'translate(-50%, -50%)' }}
          initial={{ scale: 0.6, opacity: 1 }}
          animate={{ scale: 1.15, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      ))}
      {/* Rune glyphs trailing the cursor */}
      {cursorRunes.map((point) => (
        <motion.div
          key={`${point.id}-rune`}
          className="absolute text-xs font-semibold text-amber-200 drop-shadow-[0_0_6px_rgba(255,223,125,0.6)]"
          style={{ left: point.x, top: point.y, transform: 'translate(-50%, -50%) rotate(-6deg)' }}
          initial={{ scale: 0.8, opacity: 0.8, rotate: -8 }}
          animate={{ scale: 1.4, opacity: 0, rotate: 8 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {point.glyph}
        </motion.div>
      ))}
    </div>
  );
}
