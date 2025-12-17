import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'info' | 'success' | 'error';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

const typeStyles: Record<ToastType, string> = {
  info: 'bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white border border-blue-400/30 shadow-lg',
  success: 'bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 text-white border border-emerald-400/30 shadow-lg',
  error: 'bg-gradient-to-r from-red-500/90 to-red-600/90 text-white border border-red-400/30 shadow-lg',
};

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-[100] flex flex-col gap-3 sm:right-8">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 100 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`pointer-events-auto max-w-sm rounded-lg px-4 py-3 ${typeStyles[toast.type]} backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg flex-shrink-0" aria-hidden>
                {toast.type === 'success' ? '✨' : toast.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-white/90 hover:text-white ml-2 flex-shrink-0 focus:outline-none transition-opacity duration-150"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
