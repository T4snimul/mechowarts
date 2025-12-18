import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { isAdmin, ROLE_NAMES } from '@/utils/permissions';

export function DashboardPage() {
  const { isAuthenticated, user, isLoading: authLoading, logout, updatePassword, deleteAccount, error: authError } = useAuth();
  const { theme } = useTheme();
  const { enableAnimations } = useSettings();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  type TabType = 'overview' | 'activity' | 'settings';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <LoadingSpinner />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleChangePwd = async () => {
    if (!newPwd || newPwd.length < 6) {
      setPwdMsg('Password must be at least 6 characters');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg('Passwords do not match');
      return;
    }

    const success = await updatePassword(newPwd);
    if (success) {
      setPwdMsg('✓ Password updated successfully');
      setNewPwd('');
      setConfirmPwd('');
      setTimeout(() => {
        setShowChangePwd(false);
        setPwdMsg(null);
      }, 2000);
    } else {
      setPwdMsg(authError || 'Failed to update password');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - GitHub Style */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Left: Profile Card */}
          <div className={`lg:w-80 flex-shrink-0`}>
            <div className={`sticky top-24 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden`}>
              <div className="relative h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-full border-4 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg dark:border-gray-800 border-white">
                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                </div>
              </div>
              <div className="pt-14 px-6 pb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {user?.name || 'Unknown Wizard'}
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  {user?.email}
                </p>
                {user?.role && user.role !== 'user' && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {ROLE_NAMES[user.role]}
                    </span>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Focus sessions</span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Memories</span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>8</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Events</span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>5</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    to="/greathall"
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                  >
                    Edit profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Main Content */}
          <div className="flex-1">
            {/* Welcome Message */}
            <div className="mb-6">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                {greeting()}, {user?.name?.split(' ')[0] || 'Wizard'}!
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome to your dashboard. Here's what's happening with your magical journey.
              </p>
            </div>

            {/* Tabs */}
            <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
              <nav className="flex space-x-8">
                {(['overview', 'activity', 'settings'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                        ? `border-purple-600 ${isDark ? 'text-purple-400' : 'text-purple-600'}`
                        : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Admin Panel */}
                {isAdmin(user) && (
                  <motion.div
                    initial={enableAnimations ? { opacity: 0, y: 20 } : {}}
                    animate={enableAnimations ? { opacity: 1, y: 0 } : {}}
                    className={`rounded-xl border p-6 ${isDark ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/50' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-600/20">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Administrator Access
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          You have full administrative privileges
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <Link to="/admin/users" className={`flex items-center gap-3 p-4 rounded-lg transition-all ${isDark ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700' : 'bg-white hover:shadow-md border border-gray-200'}`}>
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>User Management</p>
                        </div>
                      </Link>
                      <button className={`flex items-center gap-3 p-4 rounded-lg transition-all ${isDark ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700' : 'bg-white hover:shadow-md border border-gray-200'}`}>
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</p>
                        </div>
                      </button>
                      <button className={`flex items-center gap-3 p-4 rounded-lg transition-all ${isDark ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700' : 'bg-white hover:shadow-md border border-gray-200'}`}>
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Activity Feed */}
                <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: '🎯', text: 'Completed a 25-minute focus session', time: '2 hours ago' },
                      { icon: '📚', text: 'Added 3 new materials to Library', time: '1 day ago' },
                      { icon: '✨', text: 'Saved a new memory to Pensieve', time: '2 days ago' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-2xl">{activity.icon}</span>
                        <div className="flex-1">
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{activity.text}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Great Hall', icon: '🏰', link: '/greathall', color: 'from-indigo-500 to-purple-600' },
                    { title: 'Owlery', icon: '🦉', link: '/owlery', color: 'from-amber-500 to-orange-600' },
                    { title: 'Library', icon: '📚', link: '/materials', color: 'from-emerald-500 to-teal-600' },
                    { title: 'Focus Mode', icon: '⏱️', link: '/pomodoro', color: 'from-rose-500 to-pink-600' },
                    { title: 'Calendar', icon: '📅', link: '/calendar', color: 'from-blue-500 to-cyan-600' },
                    { title: 'Pensieve', icon: '🔮', link: '/pensieve', color: 'from-violet-500 to-purple-600' },
                  ].map((item) => (
                    <Link
                      key={item.title}
                      to={item.link}
                      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${item.color} p-6 text-white transition-transform hover:scale-105`}
                    >
                      <div className="relative z-10">
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                      </div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 -mb-8 -mr-8 rounded-full bg-white/10 transition-transform group-hover:scale-150" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  All Activity
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your complete activity history will appear here.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Change Password */}
                <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Change Password
                  </h3>
                  {!showChangePwd ? (
                    <button
                      onClick={() => setShowChangePwd(true)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    >
                      Update Password
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="New password (min 6 characters)"
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                      {pwdMsg && (
                        <p className={`text-sm ${pwdMsg.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
                          {pwdMsg}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleChangePwd}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Save Password
                        </button>
                        <button
                          onClick={() => {
                            setShowChangePwd(false);
                            setNewPwd('');
                            setConfirmPwd('');
                            setPwdMsg(null);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Danger Zone */}
                <div className={`rounded-xl border border-red-200 dark:border-red-900/50 p-6 ${isDark ? 'bg-red-900/10' : 'bg-red-50'}`}>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-red-400' : 'text-red-900'}`}>
                    Danger Zone
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-red-300/70' : 'text-red-700'}`}>
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-900'}`}>
                        Are you absolutely sure? This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            const success = await deleteAccount();
                            if (success) {
                              navigate('/');
                            }
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Yes, Delete My Account
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
