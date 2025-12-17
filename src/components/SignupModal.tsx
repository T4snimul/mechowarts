import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function SignupModal({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { sendMagicLink, isLoading, error, clearError } = useAuth();
  const { errors, validateEmail, clearErrors } = useAuthValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!validateEmail(email)) {
      return;
    }

    const success = await sendMagicLink(email);
    if (success) {
      setMagicLinkSent(true);
      onSuccess?.();
    }
  };

  if (magicLinkSent) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="p-6 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
            Magic Link Sent! ✨
          </h2>
          <p className="text-green-700 dark:text-green-300">
            Check your email ({email}) for a login link to complete your registration.
            The link will expire in 1 hour.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-6">Sign Up</h2>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-200 text-sm">
            {error}
            <button
              type="button"
              onClick={clearError}
              className="ml-2 font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            RUET Email
          </label>
          <Input
            type="email"
            placeholder="24080XX@student.ruet.ac.bd"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use your RUET student email to sign up. We'll send you a magic link!
          </p>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>
    </div>
  );
}
