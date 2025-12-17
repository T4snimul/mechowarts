import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { peopleApi } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Person, House } from '@/types';

const HOUSES: House[] = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface ProfileFormData {
  name: string;
  bloodGroup: string;
  hometown: string;
  phone: string;
  fb: string;
  avatar: string;
  house: House;
  story: string;
  skills: string;
  patronus: string;
  wand: string;
}

export function ProfileEditPage() {
  const { user, isAuthenticated, isLoading: authLoading, refetchUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingProfile, setExistingProfile] = useState<Person | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bloodGroup: '',
    hometown: '',
    phone: '',
    fb: '',
    avatar: '',
    house: 'gryffindor',
    story: '',
    skills: '',
    patronus: '',
    wand: '',
  });

  // Check if user has existing profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user?.roll) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await peopleApi.getByRoll(user.roll);
        if (response.data) {
          setExistingProfile(response.data);
          // Pre-fill form with existing data
          setFormData({
            name: response.data.name || '',
            bloodGroup: response.data.bloodGroup || '',
            hometown: response.data.hometown || '',
            phone: response.data.phone || '',
            fb: response.data.fb || '',
            avatar: response.data.avatar || '',
            house: response.data.house || 'gryffindor',
            story: response.data.story || '',
            skills: response.data.skills?.join(', ') || '',
            patronus: response.data.patronus || '',
            wand: response.data.wand || '',
          });
        }
      } catch (err) {
        // No existing profile - that's okay, user can create one
        console.log('No existing profile found');
        // Pre-fill with user info if available
        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.name || '',
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      checkExistingProfile();
    } else if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [user, authLoading, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare data for API
      const profileData: Partial<Person> = {
        name: formData.name.trim(),
        bloodGroup: formData.bloodGroup,
        hometown: formData.hometown.trim(),
        phone: formData.phone.trim(),
        fb: formData.fb.trim(),
        avatar: formData.avatar.trim(),
        house: formData.house,
        story: formData.story.trim(),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        patronus: formData.patronus.trim(),
        wand: formData.wand.trim(),
      };

      if (existingProfile) {
        // Update existing profile
        await peopleApi.updateMyProfile(profileData);
        setSuccess(true);
      } else {
        // Create new profile - need to call create endpoint
        await peopleApi.createMyProfile(profileData);
        setSuccess(true);
        // Refetch user to get updated profile
        await refetchUser();
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {existingProfile ? '✏️ Edit Your Profile' : '✨ Create Your Profile'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {existingProfile
              ? 'Update your information to appear in the Great Hall'
              : 'Complete your profile to join the Great Hall and connect with fellow wizards'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
              <p className="text-green-700 dark:text-green-300 text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Profile saved successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Roll Number (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Roll Number
            </label>
            <input
              type="text"
              value={user?.roll || ''}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your roll number is automatically set from your email
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your magical name"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          {/* House Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              House <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {HOUSES.map((house) => (
                <button
                  key={house}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, house }))}
                  className={`px-4 py-3 rounded-xl border-2 font-medium capitalize transition-all ${formData.house === house
                      ? house === 'gryffindor'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : house === 'slytherin'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : house === 'ravenclaw'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  {house === 'gryffindor' && '🦁 '}
                  {house === 'slytherin' && '🐍 '}
                  {house === 'ravenclaw' && '🦅 '}
                  {house === 'hufflepuff' && '🦡 '}
                  {house}
                </button>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white"
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Hometown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Hometown
              </label>
              <input
                type="text"
                name="hometown"
                value={formData.hometown}
                onChange={handleChange}
                placeholder="Your hometown"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+880 1XXX-XXXXXX"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Facebook Profile URL
            </label>
            <input
              type="url"
              name="fb"
              value={formData.fb}
              onChange={handleChange}
              placeholder="https://facebook.com/yourprofile"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Profile Picture URL
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tip: You can use your Facebook profile picture URL
            </p>
          </div>

          {/* Story/Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              About You
            </label>
            <textarea
              name="story"
              value={formData.story}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about yourself, your interests, what makes you magical..."
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Skills / Interests
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Python, Arduino, Robotics, Machine Learning (comma separated)"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Magical Properties */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              ✨ Magical Properties <span className="text-xs font-normal text-gray-500">(Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patronus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Patronus
                </label>
                <input
                  type="text"
                  name="patronus"
                  value={formData.patronus}
                  onChange={handleChange}
                  placeholder="e.g., Phoenix, Stag, Otter"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              {/* Wand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Wand
                </label>
                <input
                  type="text"
                  name="wand"
                  value={formData.wand}
                  onChange={handleChange}
                  placeholder="e.g., Holly, Phoenix feather, 11 inches"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSaving || !formData.name.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  💾 {existingProfile ? 'Save Changes' : 'Create Profile'}
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={() => navigate(-1)}
              variant="secondary"
              className="sm:w-auto py-3 rounded-xl"
            >
              ← Go Back
            </Button>
          </div>
        </form>

        {/* View Profile Link */}
        {existingProfile && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(`/wizard/${user?.roll}`)}
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              View your public profile →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
