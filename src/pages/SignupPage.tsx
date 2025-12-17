import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isValidRuetEmail, isDevelopment } from '@/utils';
import { BackButton } from '@/components/ui/BackButton';

export function SignupPage() {
  const { signUp, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format (RUET restriction only in production)
    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidRuetEmail(trimmedEmail)) {
      setStatus('error');
      setStatusMessage(
        isDevelopment()
          ? 'Please enter a valid email address'
          : 'Please use a valid RUET email (24080XX@student.ruet.ac.bd)'
      );
      return;
    }

    // Validate password
    if (password.length < 6) {
      setStatus('error');
      setStatusMessage('Password must be at least 6 characters');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setStatus('error');
      setStatusMessage('Passwords do not match');
      return;
    }

    setStatus('sending');
    setStatusMessage(null);
    clearError?.();

    const ok = await signUp(email.trim(), password);
    if (ok) {
      setStatus('sent');
      setStatusMessage('🎉 Account created! Check your email to verify your account, then you can log in.');
    } else {
      setStatus('error');
      setStatusMessage(error || 'Failed to create account. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/greathall');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated magical background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Stars */}
        <div className="stars absolute inset-0 opacity-50" />
      </div>

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <BackButton to="/login" label="Back to Login" variant="light" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 shadow-2xl shadow-amber-500/50 mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              Mecho
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
              warts
            </span>
          </h1>
          <p className="text-purple-200/80 text-lg">Create your magical account</p>
        </div>

        {/* Signup card */}
        <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl shadow-purple-900/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-purple-200/90 text-left mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder={isDevelopment() ? 'any@email.com' : '24080XX@student.ruet.ac.bd'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'sending'}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-amber-300/80 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200/90 text-left mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === 'sending'}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-amber-300/80 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200/90 text-left mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={status === 'sending'}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-amber-300/80 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending' || isLoading}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {status === 'sending' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-lg">Creating account...</span>
                  </>
                ) : status === 'sent' ? (
                  <>
                    <span className="text-lg">✓ Check your email</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">Create Account</span>
                    <span className="text-sm text-white/80">✨</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </form>

          {/* Success message */}
          {status === 'sent' && statusMessage && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
              <p className="text-center text-sm text-green-200">{statusMessage}</p>
              <p className="text-center text-xs text-green-200/70 mt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="underline hover:text-green-100"
                >
                  Go to Login
                </button>
              </p>
            </div>
          )}

          {/* Error message */}
          {(error || status === 'error') && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
              <p className="text-center text-sm text-red-200">
                {statusMessage || error || 'Something went wrong. Please try again.'}
              </p>
              <button
                onClick={() => {
                  setStatus('idle');
                  clearError?.();
                }}
                className="w-full mt-2 text-xs text-red-200/70 hover:text-red-100 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Info text */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-purple-200/60">
              Only RUET students (24080XX@student.ruet.ac.bd) can access
            </p>
            <p className="text-sm text-purple-200/80">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-amber-300 hover:text-amber-200 underline"
              >
                Log in
              </button>
            </p>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 flex justify-center gap-8 text-amber-400/40">
            <div className="text-center">
              <div className="text-2xl mb-1">🎓</div>
              <div className="text-xs text-purple-300/50">Engineering</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs text-purple-300/50">Magic</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔬</div>
              <div className="text-xs text-purple-300/50">Innovation</div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 text-center text-sm text-purple-200/50">
          <p>By signing up, you agree to the Wizarding Code of Conduct</p>
        </div>
      </div>

      {/* Footer quote */}
      <div className="mt-12 text-center max-w-2xl relative z-10">
        <p className="text-lg text-amber-200/70 font-serif italic">
          "It is our choices that show what we truly are, far more than our abilities."
        </p>
        <p className="text-sm text-purple-300/50 mt-2">— Albus Dumbledore</p>
      </div>
    </div>
  );
}
