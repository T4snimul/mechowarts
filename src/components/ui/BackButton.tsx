import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

interface BackButtonProps {
  to?: string;
  label?: string;
  variant?: 'default' | 'light' | 'dark';
  showHomeIcon?: boolean;
  className?: string;
}

export function BackButton({
  to,
  label = 'Back',
  variant = 'default',
  showHomeIcon = false,
  className = '',
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const variantClasses = {
    default:
      'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50',
    light:
      'bg-white/10 text-white/90 hover:bg-white/20 border border-white/20',
    dark:
      'bg-gray-900/80 text-white hover:bg-gray-900 border border-gray-700/50',
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium backdrop-blur-sm shadow-sm transition-all hover:scale-105 ${variantClasses[variant]} ${className}`}
      aria-label={to === '/' || showHomeIcon ? 'Go to home' : label}
    >
      {showHomeIcon || to === '/' ? (
        <FiHome className="w-4 h-4" />
      ) : (
        <FiArrowLeft className="w-4 h-4" />
      )}
      <span>{to === '/' ? 'Home' : label}</span>
    </button>
  );
}
