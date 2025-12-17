import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isValidRuetEmail } from '@/utils';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signin' | 'signup';
}

export function UnifiedAuthModal({ isOpen, onClose, mode = 'signin' }: UnifiedAuthModalProps) {
  const { sendMagicLink, signInWithPassword, signUp, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authMethod, setAuthMethod] = useState<'magic' | 'password'>('magic');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(mode);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidRuetEmail(trimmedEmail)) {
      setStatus('error');
      setStatusMessage('Please enter a valid email address');
      return;
    }

    if (authMethod === 'password') {
      if (!password) {
        setStatus('error');
        setStatusMessage('Please enter your password');
        return;
      }
      if (authMode === 'signup' && password !== confirmPassword) {
        setStatus('error');
        setStatusMessage('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setStatus('error');
        setStatusMessage('Password must be at least 6 characters');
        return;
      }
    }

    setStatus('sending');
    setStatusMessage(null);
    clearError();

    let success = false;

    if (authMethod === 'magic') {
      success = await sendMagicLink(trimmedEmail);
      if (success) {
        setStatus('sent');
        setStatusMessage(`✨ Magic link sent to ${email}! Check your inbox.`);
      }
    } else {
      if (authMode === 'signin') {
        success = await signInWithPassword(trimmedEmail, password);
        if (success) {
          setStatus('sent');
          setStatusMessage('✅ Signed in successfully!');
          onClose();
        }
      } else {
        success = await signUp(trimmedEmail, password);
        if (success) {
          setStatus('sent');
          setStatusMessage('✅ Account created successfully!');
          onClose();
        }
      }
    }

    if (!success) {
      setStatus('error');
      setStatusMessage(error || 'An error occurred. Please try again.');
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setStatus('idle');
    setStatusMessage(null);
    clearError();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {authMode === 'signin' ? '✨ Sign In' : '🎓 Create Account'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {authMode === 'signin' ? 'Access your magical account' : 'Join the school'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status === 'sent' && authMethod === 'magic' ? (
          /* Success state for magic link */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Check your email!</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              We sent a magic link to <strong>{email}</strong>. Click it to {authMode === 'signin' ? 'sign in' : 'complete registration'}.
            </p>
            <button
              onClick={handleClose}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mode switcher */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setStatus('idle'); clearError(); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${authMode === 'signin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setStatus('idle'); clearError(); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${authMode === 'signup'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Method switcher */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => { setAuthMethod('magic'); setStatus('idle'); clearError(); }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${authMethod === 'magic'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
              >
                ✨ Magic Link
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('password'); setStatus('idle'); clearError(); }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${authMethod === 'password'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
              >
                🔑 Password
              </button>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'sending' || isLoading}
                className="w-full"
                required
              />
            </div>

            {/* Password fields */}
            {authMethod === 'password' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={status === 'sending' || isLoading}
                    className="w-full"
                    required
                  />
                  {authMode === 'signup' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 6 characters</p>
                  )}
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={status === 'sending' || isLoading}
                      className="w-full"
                      required
                    />
                  </div>
                )}
              </>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={status === 'sending' || isLoading}
              className="w-full relative"
            >
              {status === 'sending' ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                `${authMethod === 'magic' ? 'Send Magic Link' : authMode === 'signin' ? 'Sign In' : 'Create Account'}`
              )}
            </Button>

            {/* Error message */}
            {(error || status === 'error') && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-200 text-sm">
                {statusMessage || error}
              </div>
            )}

            {/* Success message */}
            {status === 'sent' && statusMessage && (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded text-green-700 dark:text-green-200 text-sm">
                {statusMessage}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
