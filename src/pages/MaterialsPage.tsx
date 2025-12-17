import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MagicalBackground } from '@/components/ui/MagicalBackground';
import { Button } from '@/components/ui/Button';

interface Material {
  id: string;
  title: string;
  description: string;
  type: 'notes' | 'assignment' | 'book' | 'video' | 'link' | 'other';
  subject: string;
  fileUrl?: string;
  link?: string;
  uploadedBy: {
    id: string;
    name: string;
    roll: string;
    avatar?: string;
  };
  uploadedAt: Date;
  likes: number;
  downloads: number;
}

const SUBJECTS = [
  'All Subjects',
  'Engineering Mathematics',
  'Engineering Mechanics',
  'Electronics',
  'Control Systems',
  'Robotics',
  'Programming',
  'Machine Learning',
  'CAD/CAM',
  'Thermodynamics',
  'Other',
];

const MATERIAL_TYPES = [
  { value: 'notes', label: '📝 Notes', icon: '📝' },
  { value: 'assignment', label: '📋 Assignment', icon: '📋' },
  { value: 'book', label: '📚 Book/PDF', icon: '📚' },
  { value: 'video', label: '🎥 Video', icon: '🎥' },
  { value: 'link', label: '🔗 Link', icon: '🔗' },
  { value: 'other', label: '📦 Other', icon: '📦' },
];

export function MaterialsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'notes' as Material['type'],
    subject: 'Other',
    link: '',
  });

  // Load materials from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mechowarts_materials');
    if (stored) {
      setMaterials(JSON.parse(stored));
    } else {
      // Add some sample materials
      const sampleMaterials: Material[] = [
        {
          id: '1',
          title: 'Engineering Mathematics - Chapter 1 Notes',
          description: 'Comprehensive notes on differential equations and linear algebra',
          type: 'notes',
          subject: 'Engineering Mathematics',
          link: '#',
          uploadedBy: { id: '1', name: 'Harry Potter', roll: '2408001', avatar: '' },
          uploadedAt: new Date(),
          likes: 12,
          downloads: 45,
        },
        {
          id: '2',
          title: 'Robotics Lab Assignment 3',
          description: 'PID controller implementation for robotic arm',
          type: 'assignment',
          subject: 'Robotics',
          link: '#',
          uploadedBy: { id: '2', name: 'Hermione Granger', roll: '2408002', avatar: '' },
          uploadedAt: new Date(Date.now() - 86400000),
          likes: 8,
          downloads: 23,
        },
        {
          id: '3',
          title: 'Control Systems Video Tutorial',
          description: 'YouTube playlist covering Bode plots and Nyquist diagrams',
          type: 'video',
          subject: 'Control Systems',
          link: 'https://youtube.com',
          uploadedBy: { id: '3', name: 'Ron Weasley', roll: '2408003', avatar: '' },
          uploadedAt: new Date(Date.now() - 172800000),
          likes: 25,
          downloads: 0,
        },
      ];
      setMaterials(sampleMaterials);
      localStorage.setItem('mechowarts_materials', JSON.stringify(sampleMaterials));
    }
  }, []);

  // Filter materials
  const filteredMaterials = materials.filter(m => {
    const matchesSubject = selectedSubject === 'All Subjects' || m.subject === selectedSubject;
    const matchesType = !selectedType || m.type === selectedType;
    const matchesQuery = !query ||
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase());
    return matchesSubject && matchesType && matchesQuery;
  });

  const handleUpload = () => {
    if (!formData.title || !formData.description) return;

    const newMaterial: Material = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      subject: formData.subject,
      link: formData.link || '#',
      uploadedBy: {
        id: user?.id || 'anonymous',
        name: user?.name || 'Anonymous Wizard',
        roll: user?.roll || '0000000',
        avatar: user?.avatar,
      },
      uploadedAt: new Date(),
      likes: 0,
      downloads: 0,
    };

    const updated = [newMaterial, ...materials];
    setMaterials(updated);
    localStorage.setItem('mechowarts_materials', JSON.stringify(updated));
    setShowUploadModal(false);
    setFormData({ title: '', description: '', type: 'notes', subject: 'Other', link: '' });
  };

  const handleLike = (id: string) => {
    const updated = materials.map(m =>
      m.id === id ? { ...m, likes: m.likes + 1 } : m
    );
    setMaterials(updated);
    localStorage.setItem('mechowarts_materials', JSON.stringify(updated));
  };

  const getTypeIcon = (type: Material['type']) => {
    return MATERIAL_TYPES.find(t => t.value === type)?.icon || '📦';
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <MagicalBackground />
      <Header query={query} setQuery={setQuery} />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                📚 Library of Magic
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Share and discover study materials with fellow wizards
              </p>
            </div>
            {isAuthenticated && (
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              >
                ✨ Share Material
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mb-8">
            <div className="flex flex-wrap gap-4">
              {/* Subject Filter */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                {SUBJECTS.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              {/* Type Filter */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedType('')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedType
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  All Types
                </button>
                {MATERIAL_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === type.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {type.icon} {type.label.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Materials Grid */}
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                No materials found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isAuthenticated
                  ? 'Be the first to share study materials!'
                  : 'Sign in to share materials with fellow wizards'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map(material => (
                <div
                  key={material.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{getTypeIcon(material.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                          {material.title}
                        </h3>
                        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                          {material.subject}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {material.description}
                    </p>

                    {/* Uploader Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src={material.uploadedBy.avatar || '/default-avatar.svg'}
                        alt={material.uploadedBy.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {material.uploadedBy.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {new Date(material.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button
                          onClick={() => handleLike(material.id)}
                          className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                          ❤️ {material.likes}
                        </button>
                        <span className="flex items-center gap-1">
                          ⬇️ {material.downloads}
                        </span>
                      </div>
                      {material.link && (
                        <a
                          href={material.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          View →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ✨ Share Material
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Control Systems Chapter 5 Notes"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the material..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Material['type'] })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {MATERIAL_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {SUBJECTS.filter(s => s !== 'All Subjects').map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Link (Google Drive, YouTube, etc.)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowUploadModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!formData.title || !formData.description}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  >
                    Share ✨
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
