import { useState } from 'react';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';
import { Button } from './ui/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6">
        {mode === 'login' ? (
          <LoginModal onSuccess={onClose} />
        ) : (
          <SignupModal onSuccess={onClose} />
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>

        <Button
          onClick={onClose}
          variant="secondary"
          className="w-full mt-4"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
