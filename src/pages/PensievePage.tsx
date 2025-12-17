import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

interface Memory {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  date: string;
  postedBy: string;
  postedByAvatar?: string;
  likes: string[];
  createdAt: string;
}

export function PensievePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [filter, setFilter] = useState<'all' | 'mine'>('all');

  // Load memories from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mechowarts-pensieve-memories');
    if (stored) {
      setMemories(JSON.parse(stored));
    } else {
      // Add some sample memories
      const sampleMemories: Memory[] = [
        {
          id: '1',
          imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
          title: 'First Day at Campus',
          description: 'The magical beginning of our journey at RUET 🏛️',
          date: '2024-01-15',
          postedBy: 'MechoWarts Team',
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
          title: 'Lab Session',
          description: 'Working on our first robotics project ⚙️',
          date: '2024-02-20',
          postedBy: 'MechoWarts Team',
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800',
          title: 'Study Group',
          description: 'Late night study session before finals 📚',
          date: '2024-03-10',
          postedBy: 'MechoWarts Team',
          likes: [],
          createdAt: new Date().toISOString(),
        },
      ];
      setMemories(sampleMemories);
    }
  }, []);

  // Save memories to localStorage
  useEffect(() => {
    if (memories.length > 0) {
      localStorage.setItem('mechowarts-pensieve-memories', JSON.stringify(memories));
    }
  }, [memories]);

  const addMemory = (memory: Omit<Memory, 'id' | 'likes' | 'createdAt' | 'postedBy' | 'postedByAvatar'>) => {
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
      postedBy: user?.name || 'Anonymous Wizard',
      postedByAvatar: user?.avatar,
      likes: [],
      createdAt: new Date().toISOString(),
    };
    setMemories(prev => [newMemory, ...prev]);
    setShowUploadModal(false);
  };

  const toggleLike = (memoryId: string) => {
    if (!user?.id) return;
    setMemories(prev =>
      prev.map(m => {
        if (m.id === memoryId) {
          const liked = m.likes.includes(user.id);
          return {
            ...m,
            likes: liked
              ? m.likes.filter(id => id !== user.id)
              : [...m.likes, user.id],
          };
        }
        return m;
      })
    );
  };

  const deleteMemory = (memoryId: string) => {
    setMemories(prev => prev.filter(m => m.id !== memoryId));
    setSelectedMemory(null);
  };

  const filteredMemories = filter === 'mine'
    ? memories.filter(m => m.postedBy === user?.name)
    : memories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/50 to-indigo-900">
      {/* Magical Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  🫧 The Pensieve
                </h1>
                <p className="text-sm text-gray-400">Preserve magical memories forever</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter */}
              {isAuthenticated && (
                <div className="flex bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('mine')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'mine'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    My Memories
                  </button>
                </div>
              )}

              {isAuthenticated && (
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  + Add Memory
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Quote */}
        <div className="text-center mb-10">
          <p className="text-gray-400 italic text-lg">
            "I use the Pensieve. One simply siphons the excess thoughts from one's mind, pours them into the basin, and examines them at one's leisure."
          </p>
          <p className="text-gray-500 mt-2">— Albus Dumbledore</p>
        </div>

        {/* Memory Grid - Masonry-like layout */}
        {filteredMemories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🫧</p>
            <h2 className="text-2xl font-bold text-white mb-2">No Memories Yet</h2>
            <p className="text-gray-400 mb-6">Be the first to add a magical memory!</p>
            {isAuthenticated && (
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Add Your First Memory
              </Button>
            )}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredMemories.map((memory, index) => (
              <div
                key={memory.id}
                onClick={() => setSelectedMemory(memory)}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800';
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">{memory.title}</h3>
                  {memory.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{memory.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={memory.postedByAvatar || '/default-avatar.svg'}
                        alt={memory.postedBy}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-500">{memory.postedBy}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(memory.id);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${user?.id && memory.likes.includes(user.id)
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                      <svg className="w-4 h-4" fill={user?.id && memory.likes.includes(user.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-xs">{memory.likes.length}</span>
                    </button>
                  </div>
                </div>

                {/* Magical shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadMemoryModal
          onClose={() => setShowUploadModal(false)}
          onAdd={addMemory}
        />
      )}

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onDelete={deleteMemory}
          onLike={toggleLike}
          currentUserId={user?.id}
          isOwner={selectedMemory.postedBy === user?.name}
        />
      )}
    </div>
  );
}

// Upload Memory Modal
function UploadMemoryModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (memory: Omit<Memory, 'id' | 'likes' | 'createdAt' | 'postedBy' | 'postedByAvatar'>) => void;
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [previewError, setPreviewError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !title.trim()) return;

    onAdd({
      imageUrl: imageUrl.trim(),
      title: title.trim(),
      description: description.trim() || undefined,
      date,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🫧 Add a Memory
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Image URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://example.com/your-image.jpg"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white placeholder-gray-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use image hosting services like Imgur, Imgbb, or direct social media image links
              </p>
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
                {previewError ? (
                  <div className="h-48 flex items-center justify-center text-gray-500">
                    <p>Unable to load image preview</p>
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={() => setPreviewError(true)}
                  />
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your memory a title"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white placeholder-gray-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description <span className="text-gray-500">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's the story behind this memory?"
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white placeholder-gray-500 resize-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date of Memory
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imageUrl.trim() || !title.trim()}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Memory Detail Modal
function MemoryDetailModal({
  memory,
  onClose,
  onDelete,
  onLike,
  currentUserId,
  isOwner,
}: {
  memory: Memory;
  onClose: () => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  currentUserId?: string;
  isOwner: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="md:w-2/3 bg-black flex items-center justify-center">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-contain max-h-[60vh] md:max-h-[80vh]"
          />
        </div>

        {/* Details */}
        <div className="md:w-1/3 p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={memory.postedByAvatar || '/default-avatar.svg'}
                alt={memory.postedBy}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-white">{memory.postedBy}</p>
                <p className="text-xs text-gray-500">
                  {new Date(memory.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">{memory.title}</h2>
            {memory.description && (
              <p className="text-gray-400">{memory.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
            <button
              onClick={() => onLike(memory.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentUserId && memory.likes.includes(currentUserId)
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              <svg className="w-5 h-5" fill={currentUserId && memory.likes.includes(currentUserId) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{memory.likes.length} likes</span>
            </button>

            {isOwner && (
              <button
                onClick={() => {
                  if (confirm('Delete this memory?')) {
                    onDelete(memory.id);
                  }
                }}
                className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
