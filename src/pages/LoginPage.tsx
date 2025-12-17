import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function LoginPage() {
  const { sendMagicLink, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const ok = await sendMagicLink(email.trim());
    if (ok) {
      setStatus('Magic link sent. Check your RUET inbox and click the link, then return here.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/greathall');
    }
  }, [isAuthenticated, navigate]);

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
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/90 hover:bg-white/20 backdrop-blur-sm transition"
            aria-label="Back to Home"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Home
          </a>
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
            <div className="text-center mb-8">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-purple-200/90 text-left">
                RUET Email
              </label>
              <input
                type="email"
                required
                placeholder="24080xx@student.ruet.ac.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-amber-300/80"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98]"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-lg">Send magic link</span>
                  <span className="text-sm text-white/80">(check email)</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>
            </form>

            {status && (
              <p className="mt-4 text-center text-sm text-amber-200/80">{status}</p>
            )}
            {error && (
              <p className="mt-2 text-center text-sm text-red-200/90">{error}</p>
            )}

            {/* Info text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-purple-200/60">
                Only RUET students (24080XX@student.ruet.ac.bd) can access
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
