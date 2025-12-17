import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { peopleApi } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Person, House, PrivacyLevel, PrivacySettings } from '@/types';
import { DEFAULT_PRIVACY_SETTINGS } from '@/types';

const HOUSES: House[] = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PRIVACY_OPTIONS: { value: PrivacyLevel; label: string; icon: string; description: string }[] = [
  { value: 'public', label: 'Public', icon: '🌍', description: 'Anyone can see' },
  { value: 'authenticated', label: 'Students Only', icon: '🎓', description: 'Only logged-in students' },
  { value: 'private', label: 'Only Me', icon: '🔒', description: 'Hidden from others' },
];

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
  isPublicProfile: boolean;
}

// Privacy selector dropdown component
function PrivacySelector({
  value,
  onChange,
  fieldName,
}: {
  value: PrivacyLevel;
  onChange: (value: PrivacyLevel) => void;
  fieldName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = PRIVACY_OPTIONS.find(opt => opt.value === value) || PRIVACY_OPTIONS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition"
        aria-label={`Privacy setting for ${fieldName}: ${selected.label}`}
      >
        <span>{selected.icon}</span>
        <span className="hidden sm:inline">{selected.label}</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-20 overflow-hidden">
            {PRIVACY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition ${value === option.value ? 'bg-purple-50 dark:bg-purple-900/30' : ''
                  }`}
              >
                <span className="text-lg">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                </div>
                {value === option.value && (
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Form field with privacy selector
function FormFieldWithPrivacy({
  label,
  name,
  value,
  onChange,
  privacy,
  onPrivacyChange,
  type = 'text',
  placeholder,
  required,
  helpText,
  children,
}: {
  label: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  privacy: PrivacyLevel;
  onPrivacyChange: (value: PrivacyLevel) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <PrivacySelector value={privacy} onChange={onPrivacyChange} fieldName={label} />
      </div>
      {children || (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400"
        />
      )}
      {helpText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
  );
}

export function ProfileEditPage() {
  const { user, isAuthenticated, isLoading: authLoading, refetchUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingProfile, setExistingProfile] = useState<Person | null>(null);
  const [activeSection, setActiveSection] = useState<'basic' | 'contact' | 'about' | 'magical'>('basic');

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
    isPublicProfile: true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS);

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
            isPublicProfile: response.data.isPublicProfile !== false,
          });
          // Load existing privacy settings
          if (response.data.privacy) {
            setPrivacy({ ...DEFAULT_PRIVACY_SETTINGS, ...response.data.privacy });
          }
        }
      } catch (err) {
        console.log('No existing profile found');
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

  const handlePrivacyChange = useCallback((field: keyof PrivacySettings, value: PrivacyLevel) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
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
        privacy,
        isPublicProfile: formData.isPublicProfile,
      };

      if (existingProfile) {
        await peopleApi.updateMyProfile(profileData);
        setSuccess(true);
      } else {
        await peopleApi.createMyProfile(profileData);
        setSuccess(true);
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

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: '👤' },
    { id: 'contact', label: 'Contact', icon: '📱' },
    { id: 'about', label: 'About', icon: '📝' },
    { id: 'magical', label: 'Magical', icon: '✨' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with cover photo style */}
        <div className="relative mb-6">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-t-2xl" />
          <div className="absolute -bottom-12 left-6 flex items-end gap-4">
            <div className="relative">
              <img
                src={formData.avatar || '/default-avatar.svg'}
                alt={formData.name || 'Profile'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-gray-200 dark:bg-gray-700"
              />
              <button
                type="button"
                onClick={() => setActiveSection('basic')}
                className="absolute bottom-0 right-0 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className="mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {formData.name || 'Your Name'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">@{user?.roll}</p>
            </div>
          </div>
          {/* Profile visibility toggle */}
          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isPublicProfile: !prev.isPublicProfile }))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${formData.isPublicProfile
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
            >
              {formData.isPublicProfile ? '🌍 Public Profile' : '🔒 Hidden Profile'}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mt-16">
          {/* Section tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-px ${activeSection === section.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
              >
                <span>{section.icon}</span>
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
                <p className="text-green-700 dark:text-green-300 text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Profile saved successfully!
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This information will appear on your public profile card.</p>
                </div>

                {/* Roll Number */}
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
                    Your roll number is set from your email and cannot be changed
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
                    placeholder="Your name"
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
                    Tip: Use your Facebook profile picture URL or any direct image link
                  </p>
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

                {/* Blood Group with Privacy */}
                <FormFieldWithPrivacy
                  label="Blood Group"
                  name="bloodGroup"
                  privacy={privacy.bloodGroup}
                  onPrivacyChange={(v) => handlePrivacyChange('bloodGroup', v)}
                >
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
                </FormFieldWithPrivacy>

                {/* Hometown with Privacy */}
                <FormFieldWithPrivacy
                  label="Hometown"
                  name="hometown"
                  value={formData.hometown}
                  onChange={handleChange}
                  placeholder="Your hometown"
                  privacy={privacy.hometown}
                  onPrivacyChange={(v) => handlePrivacyChange('hometown', v)}
                />
              </div>
            )}

            {/* Contact Section */}
            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Control who can see your contact details using the privacy selector on each field.</p>
                </div>

                {/* Phone with Privacy */}
                <FormFieldWithPrivacy
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  privacy={privacy.phone}
                  onPrivacyChange={(v) => handlePrivacyChange('phone', v)}
                  helpText="Only visible based on your privacy setting"
                />

                {/* Facebook with Privacy */}
                <FormFieldWithPrivacy
                  label="Facebook Profile"
                  name="fb"
                  value={formData.fb}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://facebook.com/yourprofile"
                  privacy={privacy.fb}
                  onPrivacyChange={(v) => handlePrivacyChange('fb', v)}
                />

                {/* Info box about privacy */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex gap-3">
                    <span className="text-xl">💡</span>
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 dark:text-blue-200">Privacy Tip</p>
                      <p className="text-blue-700 dark:text-blue-300 mt-1">
                        Use the privacy dropdown next to each field to control who can see it:
                      </p>
                      <ul className="mt-2 space-y-1 text-blue-600 dark:text-blue-400">
                        <li>🌍 <strong>Public</strong> - Anyone visiting the site</li>
                        <li>🎓 <strong>Students Only</strong> - Only logged-in RUET students</li>
                        <li>🔒 <strong>Only Me</strong> - Hidden from everyone</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Section */}
            {activeSection === 'about' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About You</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tell others about yourself and your interests.</p>
                </div>

                {/* Story/Bio with Privacy */}
                <FormFieldWithPrivacy
                  label="Bio / Story"
                  name="story"
                  privacy={privacy.story}
                  onPrivacyChange={(v) => handlePrivacyChange('story', v)}
                >
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about yourself, your journey, what makes you unique..."
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                  />
                </FormFieldWithPrivacy>

                {/* Skills with Privacy */}
                <FormFieldWithPrivacy
                  label="Skills & Interests"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Python, Arduino, Robotics, Machine Learning"
                  privacy={privacy.skills}
                  onPrivacyChange={(v) => handlePrivacyChange('skills', v)}
                  helpText="Separate multiple skills with commas"
                />

                {/* Skills preview */}
                {formData.skills && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.split(',').map((skill, i) => skill.trim() && (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Magical Section */}
            {activeSection === 'magical' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">✨ Magical Properties</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Have some fun with your wizarding identity!</p>
                </div>

                {/* Patronus with Privacy */}
                <FormFieldWithPrivacy
                  label="Patronus"
                  name="patronus"
                  value={formData.patronus}
                  onChange={handleChange}
                  placeholder="e.g., Phoenix, Stag, Otter, Dragon"
                  privacy={privacy.patronus}
                  onPrivacyChange={(v) => handlePrivacyChange('patronus', v)}
                  helpText="What form does your Patronus take?"
                />

                {/* Wand with Privacy */}
                <FormFieldWithPrivacy
                  label="Wand"
                  name="wand"
                  value={formData.wand}
                  onChange={handleChange}
                  placeholder="e.g., Holly, Phoenix feather, 11 inches"
                  privacy={privacy.wand}
                  onPrivacyChange={(v) => handlePrivacyChange('wand', v)}
                  helpText="Describe your wand's wood, core, and length"
                />

                {/* Fun decoration */}
                <div className="text-center py-8 text-4xl space-x-4 opacity-40">
                  <span>🪄</span>
                  <span>⚡</span>
                  <span>🔮</span>
                  <span>🦉</span>
                  <span>📜</span>
                </div>
              </div>
            )}

            {/* Action buttons - always visible */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
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
                    💾 Save Changes
                  </>
                )}
              </Button>
              {existingProfile && (
                <Button
                  type="button"
                  onClick={() => navigate(`/wizard/${user?.roll}`)}
                  variant="secondary"
                  className="sm:w-auto py-3 rounded-xl"
                >
                  👁️ View Profile
                </Button>
              )}
              <Button
                type="button"
                onClick={() => navigate(-1)}
                variant="ghost"
                className="sm:w-auto py-3 rounded-xl"
              >
                ← Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
