import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { supabase } from '@/utils/supabaseClient';
import { authApi, setAuthToken } from '@/utils/api';
import { isValidRuetEmail, isDevelopment } from '@/utils';
import type { AuthUser } from '@/types';

// ============================================
// Types
// ============================================

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  sendMagicLink: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  clearError: () => void;
}

// ============================================
// Context
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user data from the API
   */
  const fetchUser = useCallback(async () => {
    try {
      const data = await authApi.getMe();
      setUser(data.user);
    } catch (err) {
      console.error('[Auth] Fetch user failed:', err);
      setUser(null);
    }
  }, []);

  /**
   * Handle authentication code exchange from URL
   */
  const handleAuthCallback = useCallback(async (): Promise<boolean> => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) return false;

    try {
      await supabase.auth.exchangeCodeForSession(code);
      // Clean the URL after successful exchange
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    } catch (err) {
      console.error('[Auth] Exchange code failed:', err);
      return false;
    }
  }, []);

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setIsLoading(true);

      // Handle magic-link callback
      await handleAuthCallback();

      // Get current session
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('[Auth] Session check failed:', sessionError.message);
      }

      const token = data.session?.access_token ?? null;
      setAuthToken(token);

      if (token) {
        await fetchUser();
      } else {
        setUser(null);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    init();

    // Subscribe to auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const token = session?.access_token ?? null;
        setAuthToken(token);

        if (token) {
          await fetchUser();
        } else {
          setUser(null);
        }

        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, [fetchUser, handleAuthCallback]);

  /**
   * Send magic link email for authentication
   */
  const sendMagicLink = useCallback(async (email: string): Promise<boolean> => {
    setError(null);

    if (!isValidRuetEmail(email)) {
      const errorMsg = isDevelopment()
        ? 'Please enter a valid email address'
        : 'Use your RUET email (24080xx@student.ruet.ac.bd)';
      setError(errorMsg);
      return false;
    }

    setIsLoading(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (otpError) {
      console.error('[Auth] Magic link error:', otpError.message);
      setError(otpError.message);
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return true;
  }, []);

  /**
   * Log out the current user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('[Auth] Logout failed:', signOutError.message);
      setError(signOutError.message);
    }

    setAuthToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  /**
   * Refetch user data
   */
  const refetchUser = useCallback(async () => {
    setIsLoading(true);
    await fetchUser();
    setIsLoading(false);
  }, [fetchUser]);

  /**
   * Clear any authentication errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      error,
      sendMagicLink,
      logout,
      refetchUser,
      clearError,
    }),
    [user, isLoading, error, sendMagicLink, logout, refetchUser, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// Hook
// ============================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
