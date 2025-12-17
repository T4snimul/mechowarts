import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { sendMagicLink, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const ok = await sendMagicLink(email.trim());
    if (ok) {
      setStatus('Magic link sent. Check your RUET inbox and return here after clicking it.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">Sign in</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Use your RUET email to get a magic link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="24080xx@student.ruet.ac.bd"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Sending...' : 'Send magic link'}
          </Button>
        </form>

        {status && <p className="mt-3 text-sm text-green-600 dark:text-green-300">{status}</p>}
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <Button
          onClick={onClose}
          variant="secondary"
          className="w-full mt-6"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
