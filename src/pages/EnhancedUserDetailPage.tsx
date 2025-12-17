import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { peopleApi } from '@/utils/api';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import type { Person } from '@/types';

// Extended person interface for engineering-specific fields
interface EnhancedPerson extends Person {
  cgpa?: number;
  semester?: number;
  projects?: string[];
  internships?: string[];
  achievements?: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export function EnhancedUserDetailPage() {
  const { roll } = useParams<{ roll: string }>();
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [person, setPerson] = useState<EnhancedPerson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = isAuthenticated && user?.roll === roll;
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        if (!roll) return;
        const response = await peopleApi.getByRoll(roll);
        if (response.data) {
          setPerson(response.data as EnhancedPerson);
        }
      } catch (error) {
        console.error('Failed to fetch person:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerson();
  }, [roll]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Student Not Found
          </h2>
          <Button onClick={() => navigate(-1)}>
            ← Go Back
          </Button>
        </div>
      </div>
    );
  }

  const houseColors = {
    gryffindor: 'from-red-600 to-yellow-600',
    slytherin: 'from-green-600 to-gray-700',
    ravenclaw: 'from-blue-600 to-gray-600',
    hufflepuff: 'from-yellow-600 to-gray-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="pt-6 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className={`relative bg-gradient-to-r ${houseColors[person.house as keyof typeof houseColors]} rounded-2xl p-8 mb-8 shadow-2xl`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={person.avatar || '/default-avatar.svg'}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                  {person.house.toUpperCase()}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{person.name}</h1>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-medium">
                    🎓 Roll: {person.roll}
                  </span>
                  <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-medium">
                    🏠 House Roll: {person.houseRoll}
                  </span>
                  {person.bloodGroup && (
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-medium">
                      🩸 {person.bloodGroup}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              {isOwnProfile && (
                <div>
                  <Button
                    onClick={() => navigate('/profile')}
                    className={`${isDark
                        ? 'bg-white/90 text-gray-900 hover:bg-white'
                        : 'bg-gray-900/90 text-white hover:bg-gray-900'
                      } shadow-lg font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105`}
                  >
                    ✏️ Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📞 Contact Information
                </h2>
                <div className="space-y-3">
                  {person.phone && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Phone</label>
                      <p className="text-gray-900 dark:text-white font-medium">{person.phone}</p>
                    </div>
                  )}
                  {person.hometown && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Hometown</label>
                      <p className="text-gray-900 dark:text-white font-medium">{person.hometown}</p>
                    </div>
                  )}
                  {person.fb && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Facebook</label>
                      <a href={person.fb} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🎯 Academic Performance
                </h2>
                <div className="space-y-3">
                  {person.cgpa && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">CGPA</label>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{person.cgpa.toFixed(2)}</p>
                    </div>
                  )}
                  {person.semester && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Current Semester</label>
                      <p className="text-gray-900 dark:text-white font-medium">Semester {person.semester}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Magical Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  ✨ Magical Properties
                </h2>
                <div className="space-y-3">
                  {person.patronus && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Patronus</label>
                      <p className="text-gray-900 dark:text-white font-medium">{person.patronus}</p>
                    </div>
                  )}
                  {person.wand && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Wand</label>
                      <p className="text-gray-900 dark:text-white font-medium text-sm">{person.wand}</p>
                    </div>
                  )}
                  {person.houseRole && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">House Role</label>
                      <p className="text-gray-900 dark:text-white font-medium">{person.houseRole}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Professional Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About/Story */}
              {person.story && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    📖 About Me
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{person.story}</p>
                </div>
              )}

              {/* Technical Skills */}
              {person.skills && person.skills.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    🛠️ Technical Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {person.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {person.projects && person.projects.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    🚀 Projects
                  </h2>
                  <ul className="space-y-2">
                    {person.projects.map((project, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">▸</span>
                        <span className="text-gray-700 dark:text-gray-300">{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {person.achievements && person.achievements.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    🏆 Achievements
                  </h2>
                  <ul className="space-y-2">
                    {person.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500 dark:text-amber-400 mt-1">★</span>
                        <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Internships */}
              {person.internships && person.internships.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    💼 Internships & Experience
                  </h2>
                  <ul className="space-y-2">
                    {person.internships.map((internship, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{internship}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🔗 Professional Links
                </h2>
                <div className="flex flex-wrap gap-3">
                  {person.github && (
                    <a
                      href={person.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {person.linkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {person.portfolio && (
                    <a
                      href={person.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      🌐 Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate(-1)}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
            >
              ← Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
