import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <p className="font-semibold">{user?.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
      </div>
      <Button onClick={logout} variant="secondary" size="sm">
        Logout
      </Button>
    </div>
  );
}
