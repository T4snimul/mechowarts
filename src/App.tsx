import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppDataProvider } from '@/contexts/AppDataContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { CommandPalette, useCommandPalette } from '@/components/ui/CommandPalette';
import { FloatingControls } from '@/components/ui/FloatingControls';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('@/pages/LandingPage').then(module => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('@/pages/SignupPage').then(module => ({ default: module.SignupPage })));
const GreatHallPage = lazy(() => import('@/pages/GreatHallPage').then(module => ({ default: module.GreatHallPage })));
const EnhancedUserDetailPage = lazy(() => import('@/pages/EnhancedUserDetailPage').then(module => ({ default: module.EnhancedUserDetailPage })));
const OwleryPage = lazy(() => import('@/pages/OwleryPage').then(module => ({ default: module.OwleryPage })));
const PomodoroPage = lazy(() => import('@/pages/PomodoroPage').then(module => ({ default: module.PomodoroPage })));
const MaterialsPage = lazy(() => import('@/pages/MaterialsPage').then(module => ({ default: module.MaterialsPage })));
const ProfileEditPage = lazy(() => import('@/pages/ProfileEditPage').then(module => ({ default: module.ProfileEditPage })));
const CalendarPage = lazy(() => import('@/pages/CalendarPage').then(module => ({ default: module.CalendarPage })));
const PensievePage = lazy(() => import('@/pages/PensievePage').then(module => ({ default: module.PensievePage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const AuthSuccessPage = lazy(() => import('@/pages/AuthPages').then(module => ({ default: module.AuthSuccessPage })));
const AuthFailedPage = lazy(() => import('@/pages/AuthPages').then(module => ({ default: module.AuthFailedPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <LoadingSpinner />
    </div>
  );
}

// Inner component that uses hooks (needs to be inside Router)
function AppContent() {
  const commandPalette = useCommandPalette();

  return (
    <>
      <ScrollToTop />
      <CommandPalette isOpen={commandPalette.isOpen} onClose={commandPalette.close} />
      <FloatingControls onOpenCommandPalette={commandPalette.open} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth-success" element={<AuthSuccessPage />} />
          <Route path="/login-failed" element={<AuthFailedPage />} />

          {/* Main Routes */}
          <Route path="/greathall" element={<GreatHallPage />} />
          <Route path="/wizard/:roll" element={<EnhancedUserDetailPage />} />
          <Route path="/owlery" element={<OwleryPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/library" element={<MaterialsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/pensieve" element={<PensievePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfileEditPage />} />

          {/* Legacy redirects */}
          <Route path="/explore" element={<Navigate to="/greathall" replace />} />
          <Route path="/chat" element={<Navigate to="/owlery" replace />} />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppDataProvider>
                <AppContent />
              </AppDataProvider>
            </NotificationProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
