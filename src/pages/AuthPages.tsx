import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function AuthSuccessPage() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  useEffect(() => {
    const handleSuccess = async () => {
      await refetchUser();
      // Redirect to Great Hall after successful login
      setTimeout(() => {
        navigate('/greathall', { replace: true });
      }, 1000);
    };

    handleSuccess();
  }, [refetchUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          ✨ Authenticating your magical credentials...
        </p>
      </div>
    </div>
  );
}

export function AuthFailedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Authentication Failed
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Unable to authenticate. Please make sure you're using a valid RUET student email (24080XX@student.ruet.ac.bd).
        </p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
