import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginModal({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();
  const { errors, validateEmail, validatePassword, clearErrors } = useAuthValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    try {
      await login(email, password);
      onSuccess?.();
    } catch {
      // Error is handled by useAuth context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-6">Login</h2>

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
            Email
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <Input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}
