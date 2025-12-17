import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isValidRuetEmail, isDevelopment } from '@/utils';
import { BackButton } from '@/components/ui/BackButton';

const RETRY_COOLDOWN_SECONDS = 60;

type LoginMethod = 'magic' | 'password';

export function LoginPage() {
  const { sendMagicLink, signInWithPassword, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(RETRY_COOLDOWN_SECONDS);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleRetry = useCallback(() => {
    if (countdown > 0) return;
    setStatus('idle');
    clearError?.();
  }, [countdown, clearError]);

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

    // Password validation for password login
    if (loginMethod === 'password' && !password) {
      setStatus('error');
      setStatusMessage('Please enter your password');
      return;
    }

    setStatus('sending');
    setStatusMessage(null);
    clearError?.();

    if (loginMethod === 'magic') {
      const ok = await sendMagicLink(email.trim());
      if (ok) {
        setStatus('sent');
        setStatusMessage('✨ Magic link sent! Check your email inbox and click the link to sign in.');
        startCountdown(); // Start countdown after successful send
      } else {
        setStatus('error');
        setStatusMessage(error || 'Failed to send magic link. Please try again.');
      }
    } else {
      const ok = await signInWithPassword(email.trim(), password);
      if (ok) {
        setStatus('sent');
        setStatusMessage('🔐 Login successful! Redirecting...');
        // Navigation handled by useEffect
      } else {
        setStatus('error');
        setStatusMessage(error || 'Invalid email or password. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/greathall');
    }
  }, [isAuthenticated, navigate]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Magical symbols floating */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-amber-400/30 text-6xl animate-float">✨</div>
        <div className="absolute top-40 right-20 text-purple-400/30 text-5xl animate-float" style={{ animationDelay: '1s' }}>🔮</div>
        <div className="absolute bottom-32 left-1/4 text-indigo-400/30 text-4xl animate-float" style={{ animationDelay: '2s' }}>⚡</div>
        <div className="absolute bottom-20 right-1/3 text-amber-400/30 text-5xl animate-float" style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Back to Home link */}
        <div className="absolute top-4 left-4">
          <BackButton to="/" variant="light" />
        </div>
        {/* Logo/Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 mb-2 tracking-wider drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
            MECHOWARTS
          </h1>
          <p className="text-xl md:text-2xl text-amber-200/90 font-serif tracking-wide">
            School of Mechatronics & Wizardry
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-purple-300/70">
            <span className="text-2xl">⚙️</span>
            <span className="text-sm uppercase tracking-widest">Est. 2024</span>
            <span className="text-2xl">🪄</span>
          </div>
        </div>

        {/* Login card */}
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl shadow-purple-900/50 animate-slide-up">
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-gradient-to-br from-amber-400/20 to-purple-500/20 rounded-full mb-4">
                <svg className="w-16 h-16 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back, Wizard
              </h2>
              <p className="text-purple-200/80">
                Sign in with your RUET magical credentials
              </p>
            </div>

            {/* Login method tabs */}
            <div className="flex mb-6 bg-white/5 rounded-xl p-1">
              <button
                type="button"
                onClick={() => { setLoginMethod('magic'); setStatus('idle'); clearError?.(); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${loginMethod === 'magic'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-purple-200/70 hover:text-white'
                  }`}
              >
                ✨ Magic Link
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('password'); setStatus('idle'); clearError?.(); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${loginMethod === 'password'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-purple-200/70 hover:text-white'
                  }`}
              >
                🔑 Password
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200/90 text-left mb-1">
                  RUET Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="24080xx@student.ruet.ac.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'sending'}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-amber-300/80 disabled:opacity-50"
                />
              </div>

              {loginMethod === 'password' && (
                <div>
                  <label className="block text-sm font-medium text-purple-200/90 text-left mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={status === 'sending'}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-amber-300/80 disabled:opacity-50"
                  />
                </div>
              )}

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
                      <span className="text-lg">{loginMethod === 'magic' ? 'Sending magic link...' : 'Signing in...'}</span>
                    </>
                  ) : status === 'sent' && loginMethod === 'magic' ? (
                    <>
                      <span className="text-lg">✓ Check your email</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">{loginMethod === 'magic' ? 'Send magic link' : 'Sign in'}</span>
                      <span className="text-sm text-white/80">{loginMethod === 'magic' ? '✉️' : '🔓'}</span>
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
                {loginMethod === 'magic' && (
                  <p className="text-center text-xs text-green-200/70 mt-2">
                    Didn't receive it? Check spam folder or{' '}
                    {countdown > 0 ? (
                      <span className="text-amber-300">
                        wait {countdown}s to try again
                      </span>
                    ) : (
                      <button
                        onClick={handleRetry}
                        className="underline hover:text-green-100"
                      >
                        try again
                      </button>
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Error message */}
            {(error || status === 'error') && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                <p className="text-center text-sm text-red-200">
                  {statusMessage || error || 'Something went wrong. Please try again.'}
                </p>
                {countdown > 0 ? (
                  <p className="w-full mt-2 text-xs text-amber-300 text-center">
                    Wait {countdown}s before trying again
                  </p>
                ) : (
                  <button
                    onClick={handleRetry}
                    className="w-full mt-2 text-xs text-red-200/70 hover:text-red-100 underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            )}

            {/* Info text */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-purple-200/60">
                Only RUET students (24080XX@student.ruet.ac.bd) can access
              </p>
              {loginMethod === 'password' && (
                <p className="text-sm text-purple-200/80">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-amber-300 hover:text-amber-200 underline"
                  >
                    Sign up
                  </button>
                </p>
              )}
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
            <p>By signing in, you agree to the Wizarding Code of Conduct</p>
          </div>
        </div>

        {/* Footer quote */}
        <div className="mt-12 text-center max-w-2xl">
          <p className="text-lg text-amber-200/70 font-serif italic">
            "It matters not what someone is born, but what they grow to be."
          </p>
          <p className="text-sm text-purple-300/50 mt-2">— Albus Dumbledore</p>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
