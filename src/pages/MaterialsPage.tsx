import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Header } from '../components/Header';
import {
  FiFolderPlus, FiFile, FiTrash2,
  FiChevronRight, FiHome, FiSearch, FiMoreVertical, FiEdit2,
  FiFileText, FiImage, FiVideo, FiMusic, FiCode, FiArchive,
  FiArrowLeft, FiGrid, FiList, FiCheck, FiLink, FiCopy, FiMove
} from 'react-icons/fi';
import { IoFolder } from 'react-icons/io5';

// Types
interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  parentId: string | null;
  createdAt: string;
  color?: string;
}

interface FileItem {
  id: string;
  name: string;
  type: 'file';
  parentId: string | null;
  fileType: string; // pdf, doc, image, video, etc.
  size: number; // in bytes (can be 0 for links)
  url?: string; // Link URL (Google Drive, etc.)
  createdAt: string;
  uploadedBy?: string;
  description?: string;
  isLink?: boolean; // Flag to indicate this is a link, not an uploaded file
}

type LibraryItem = FolderItem | FileItem;

// Folder colors - high contrast with darker shades for better visibility
const FOLDER_COLORS = [
  { name: 'Gold', value: '#d97706' },
  { name: 'Gryffindor Red', value: '#b91c1c' },
  { name: 'Slytherin Green', value: '#15803d' },
  { name: 'Ravenclaw Blue', value: '#1d4ed8' },
  { name: 'Hufflepuff Amber', value: '#b45309' },
  { name: 'Royal Purple', value: '#7c3aed' },
  { name: 'Ocean Teal', value: '#0d9488' },
  { name: 'Rose Pink', value: '#db2777' },
  { name: 'Crimson', value: '#dc2626' },
  { name: 'Forest', value: '#166534' },
];

// File type icons
const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx'].includes(type)) return FiFileText;
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(type)) return FiImage;
  if (['mp4', 'avi', 'mov', 'mkv'].includes(type)) return FiVideo;
  if (['mp3', 'wav', 'ogg', 'flac'].includes(type)) return FiMusic;
  if (['js', 'ts', 'py', 'java', 'cpp', 'c', 'html', 'css'].includes(type)) return FiCode;
  if (['zip', 'rar', '7z', 'tar'].includes(type)) return FiArchive;
  return FiFile;
};

// Format file size
const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Sample data for demo
const SAMPLE_DATA: LibraryItem[] = [
  { id: '1', name: 'Semester 1', type: 'folder', parentId: null, createdAt: '2024-01-01', color: '#ae0001' },
  { id: '2', name: 'Semester 2', type: 'folder', parentId: null, createdAt: '2024-01-01', color: '#1a472a' },
  { id: '3', name: 'Semester 3', type: 'folder', parentId: null, createdAt: '2024-01-01', color: '#0e1a40' },
  { id: '4', name: 'Mathematics', type: 'folder', parentId: '1', createdAt: '2024-01-02', color: '#7c3aed' },
  { id: '5', name: 'Physics', type: 'folder', parentId: '1', createdAt: '2024-01-02', color: '#14b8a6' },
  { id: '6', name: 'Lectures', type: 'folder', parentId: '4', createdAt: '2024-01-03' },
  { id: '7', name: 'Assignments', type: 'folder', parentId: '4', createdAt: '2024-01-03' },
  { id: '8', name: 'Notes', type: 'folder', parentId: '4', createdAt: '2024-01-03' },
  { id: '9', name: 'Dr. Khan Lectures', type: 'folder', parentId: '6', createdAt: '2024-01-04' },
  { id: '10', name: 'Calculus I - Lecture 1.pdf', type: 'file', parentId: '9', fileType: 'pdf', size: 2500000, createdAt: '2024-01-05' },
  { id: '11', name: 'Calculus I - Lecture 2.pdf', type: 'file', parentId: '9', fileType: 'pdf', size: 3200000, createdAt: '2024-01-06' },
  { id: '12', name: 'Assignment 1.pdf', type: 'file', parentId: '7', fileType: 'pdf', size: 500000, createdAt: '2024-01-07' },
  { id: '13', name: 'Course Syllabus.pdf', type: 'file', parentId: '4', fileType: 'pdf', size: 150000, createdAt: '2024-01-01' },
];

export function MaterialsPage() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // State
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Modal states
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [movingItem, setMovingItem] = useState<LibraryItem | null>(null);
  const [isCopying, setIsCopying] = useState(false); // true = copy, false = move
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);

  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0].value);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');

  // Load items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mechowarts_library_items');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // Initialize with sample data
      setItems(SAMPLE_DATA);
      localStorage.setItem('mechowarts_library_items', JSON.stringify(SAMPLE_DATA));
    }
  }, []);

  // Save items to localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('mechowarts_library_items', JSON.stringify(items));
    }
  }, [items]);

  // Get breadcrumb path
  const breadcrumbs = useMemo(() => {
    const path: FolderItem[] = [];
    let folderId = currentFolderId;

    while (folderId) {
      const folder = items.find(i => i.id === folderId && i.type === 'folder') as FolderItem | undefined;
      if (folder) {
        path.unshift(folder);
        folderId = folder.parentId;
      } else {
        break;
      }
    }

    return path;
  }, [currentFolderId, items]);

  // Get current folder items
  const currentItems = useMemo(() => {
    let filtered = items.filter(i => i.parentId === currentFolderId);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = items.filter(i =>
        i.name.toLowerCase().includes(query)
      );
    }

    // Sort: folders first, then files, alphabetically
    return filtered.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [items, currentFolderId, searchQuery]);

  // Navigation
  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSearchQuery('');
    setSelectedItems(new Set());
  };

  const navigateUp = () => {
    if (breadcrumbs.length > 0) {
      const parentId = breadcrumbs[breadcrumbs.length - 1].parentId;
      navigateToFolder(parentId);
    } else {
      navigateToFolder(null);
    }
  };

  // Create folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: FolderItem = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      type: 'folder',
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
      color: newFolderColor,
    };

    setItems([...items, newFolder]);
    setIsNewFolderModalOpen(false);
    setNewFolderName('');
    setNewFolderColor(FOLDER_COLORS[0].value);
  };

  // Add a link (replaces file upload)
  const handleAddLink = () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) return;

    // Detect file type from URL or name
    const extension = newLinkName.split('.').pop()?.toLowerCase() ||
      newLinkUrl.split('.').pop()?.split('?')[0]?.toLowerCase() ||
      'link';

    const newFile: FileItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: newLinkName.trim(),
      type: 'file',
      parentId: currentFolderId,
      fileType: extension,
      size: 0,
      url: newLinkUrl.trim(),
      description: newLinkDescription.trim() || undefined,
      createdAt: new Date().toISOString(),
      isLink: true,
    };

    setItems([...items, newFile]);
    setIsUploadModalOpen(false);
    setNewLinkName('');
    setNewLinkUrl('');
    setNewLinkDescription('');
  };

  // Rename item
  const handleRename = () => {
    if (!editingItem || !newFolderName.trim()) return;

    setItems(items.map(i =>
      i.id === editingItem.id
        ? { ...i, name: newFolderName.trim(), ...(i.type === 'folder' ? { color: newFolderColor } : {}) }
        : i
    ));
    setIsRenameModalOpen(false);
    setEditingItem(null);
    setNewFolderName('');
  };

  // Delete items
  const handleDelete = () => {
    const idsToDelete = new Set(selectedItems);

    // Also delete all children recursively
    const getAllChildIds = (parentIds: Set<string>): Set<string> => {
      const childIds = new Set<string>();
      items.forEach(item => {
        if (item.parentId && parentIds.has(item.parentId)) {
          childIds.add(item.id);
        }
      });
      if (childIds.size > 0) {
        const nestedChildIds = getAllChildIds(childIds);
        nestedChildIds.forEach(id => childIds.add(id));
      }
      return childIds;
    };

    const allIdsToDelete = new Set([...idsToDelete, ...getAllChildIds(idsToDelete)]);
    setItems(items.filter(i => !allIdsToDelete.has(i.id)));
    setSelectedItems(new Set());
    setIsDeleteModalOpen(false);
  };

  // Toggle selection
  const toggleSelection = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  // Open item
  const openItem = (item: LibraryItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    } else {
      // For links, open in a new tab that looks like opening a file
      const fileItem = item as FileItem;
      if (fileItem.url) {
        // Open the link (Google Drive, etc.)
        window.open(fileItem.url, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback for files without URLs
        alert(`This file doesn't have a link associated: ${item.name}`);
      }
    }
  };

  // Context menu
  const openContextMenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuId(contextMenuId === id ? null : id);
  };

  // Start rename
  const startRename = (item: LibraryItem) => {
    setEditingItem(item);
    setNewFolderName(item.name);
    if (item.type === 'folder') {
      setNewFolderColor(item.color || FOLDER_COLORS[0].value);
    }
    setIsRenameModalOpen(true);
    setContextMenuId(null);
  };

  // Start delete
  const startDelete = (id: string) => {
    setSelectedItems(new Set([id]));
    setIsDeleteModalOpen(true);
    setContextMenuId(null);
  };

  // Start copy
  const startCopy = (item: LibraryItem) => {
    setMovingItem(item);
    setIsCopying(true);
    setIsMoveModalOpen(true);
    setContextMenuId(null);
  };

  // Start move
  const startMove = (item: LibraryItem) => {
    setMovingItem(item);
    setIsCopying(false);
    setIsMoveModalOpen(true);
    setContextMenuId(null);
  };

  // Execute copy/move to target folder
  const handleCopyMove = (targetFolderId: string | null) => {
    if (!movingItem) return;

    if (isCopying) {
      // Copy - create a duplicate with new ID
      const generateId = () => Math.random().toString(36).substring(2, 15);

      const copyItem = (item: LibraryItem, newParentId: string | null): LibraryItem[] => {
        const newId = generateId();
        const copiedItem: LibraryItem = {
          ...item,
          id: newId,
          name: item.id === movingItem.id ? `${item.name} (Copy)` : item.name,
          parentId: newParentId,
          createdAt: new Date().toISOString(),
        };

        // If it's a folder, also copy all children
        if (item.type === 'folder') {
          const children = items.filter(i => i.parentId === item.id);
          const copiedChildren = children.flatMap(child => copyItem(child, newId));
          return [copiedItem, ...copiedChildren];
        }

        return [copiedItem];
      };

      const copiedItems = copyItem(movingItem, targetFolderId);
      setItems([...items, ...copiedItems]);
    } else {
      // Move - update parentId
      setItems(items.map(i =>
        i.id === movingItem.id ? { ...i, parentId: targetFolderId } : i
      ));
    }

    setIsMoveModalOpen(false);
    setMovingItem(null);
  };

  // Get all folders for the move/copy modal (excluding the item being moved and its children)
  const getAvailableFolders = (): FolderItem[] => {
    if (!movingItem) return items.filter(i => i.type === 'folder') as FolderItem[];

    // Get all descendant folder IDs to exclude
    const getDescendantIds = (parentId: string): Set<string> => {
      const descendants = new Set<string>();
      items.forEach(item => {
        if (item.parentId === parentId) {
          descendants.add(item.id);
          if (item.type === 'folder') {
            getDescendantIds(item.id).forEach(id => descendants.add(id));
          }
        }
      });
      return descendants;
    };

    const excludeIds = new Set([movingItem.id, ...getDescendantIds(movingItem.id)]);
    return items.filter(i => i.type === 'folder' && !excludeIds.has(i.id)) as FolderItem[];
  };

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Render folder/file item
  const renderItem = (item: LibraryItem) => {
    const isSelected = selectedItems.has(item.id);
    const FileIcon = item.type === 'file' ? getFileIcon((item as FileItem).fileType) : IoFolder;

    if (viewMode === 'grid') {
      return (
        <div
          key={item.id}
          onClick={() => openItem(item)}
          onContextMenu={(e) => openContextMenu(item.id, e)}
          className={`relative group p-4 rounded-xl cursor-pointer transition-all ${isSelected
            ? isDark
              ? 'bg-purple-900/30 ring-2 ring-purple-500'
              : 'bg-purple-100 ring-2 ring-purple-400'
            : isDark
              ? 'bg-gray-800/50 hover:bg-gray-800'
              : 'bg-white hover:bg-purple-50 hover:shadow-md'
            }`}
        >
          {/* Selection checkbox */}
          <div
            onClick={(e) => toggleSelection(item.id, e)}
            className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
              ? 'bg-purple-500 border-purple-500 text-white'
              : isDark
                ? 'border-gray-600 group-hover:border-gray-500'
                : 'border-gray-300 group-hover:border-gray-400'
              } ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            {isSelected && <FiCheck className="w-3 h-3" />}
          </div>

          {/* More button */}
          <button
            onClick={(e) => openContextMenu(item.id, e)}
            className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
          >
            <FiMoreVertical className="w-4 h-4" />
          </button>

          {/* Context menu */}
          {contextMenuId === item.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-10 right-2 z-50 w-40 py-1 rounded-lg shadow-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
            >
              <button
                onClick={() => startRename(item)}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <FiEdit2 className="w-4 h-4" />
                Rename
              </button>
              <button
                onClick={() => startCopy(item)}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <FiCopy className="w-4 h-4" />
                Copy to...
              </button>
              <button
                onClick={() => startMove(item)}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <FiMove className="w-4 h-4" />
                Move to...
              </button>
              <div className={`my-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <button
                onClick={() => startDelete(item.id)}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                  }`}
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}

          {/* Icon */}
          <div className="flex justify-center mb-3">
            {item.type === 'folder' ? (
              <IoFolder
                className="w-16 h-16"
                style={{ color: (item as FolderItem).color || FOLDER_COLORS[0].value }}
              />
            ) : (
              <FileIcon className={`w-16 h-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </div>

          {/* Name */}
          <p className={`text-center text-sm font-medium truncate ${isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
            {item.name}
          </p>

          {/* File size */}
          {item.type === 'file' && (
            <p className={`text-center text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatSize((item as FileItem).size)}
            </p>
          )}
        </div>
      );
    }

    // List view
    return (
      <div
        key={item.id}
        onClick={() => openItem(item)}
        onContextMenu={(e) => openContextMenu(item.id, e)}
        className={`relative flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${isSelected
          ? isDark
            ? 'bg-purple-900/30 ring-2 ring-purple-500'
            : 'bg-purple-100 ring-2 ring-purple-400'
          : isDark
            ? 'hover:bg-gray-800'
            : 'hover:bg-purple-50'
          }`}
      >
        {/* Selection checkbox */}
        <div
          onClick={(e) => toggleSelection(item.id, e)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected
            ? 'bg-purple-500 border-purple-500 text-white'
            : isDark
              ? 'border-gray-600 hover:border-gray-500'
              : 'border-gray-300 hover:border-gray-400'
            }`}
        >
          {isSelected && <FiCheck className="w-3 h-3" />}
        </div>

        {/* Icon */}
        {item.type === 'folder' ? (
          <IoFolder
            className="w-8 h-8 flex-shrink-0"
            style={{ color: (item as FolderItem).color || FOLDER_COLORS[0].value }}
          />
        ) : (
          <FileIcon className={`w-8 h-8 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        )}

        {/* Name */}
        <span className={`flex-1 truncate ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {item.name}
        </span>

        {/* File size */}
        {item.type === 'file' && (
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {formatSize((item as FileItem).size)}
          </span>
        )}

        {/* Date */}
        <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {new Date(item.createdAt).toLocaleDateString()}
        </span>

        {/* More button */}
        <button
          onClick={(e) => openContextMenu(item.id, e)}
          className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>

        {/* Context menu */}
        {contextMenuId === item.id && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-full right-0 z-50 w-40 py-1 rounded-lg shadow-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
          >
            <button
              onClick={() => startRename(item)}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              <FiEdit2 className="w-4 h-4" />
              Rename
            </button>
            <button
              onClick={() => startCopy(item)}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              <FiCopy className="w-4 h-4" />
              Copy to...
            </button>
            <button
              onClick={() => startMove(item)}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              <FiMove className="w-4 h-4" />
              Move to...
            </button>
            <div className={`my-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <button
              onClick={() => startDelete(item.id)}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                }`}
            >
              <FiTrash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-50/50 via-white to-gray-50'}`}>
        <LoadingSpinner />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-50/50 via-white to-gray-50'}`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-800'}`}>
              📚 Restricted Section Library
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Study materials and resources
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className={`pl-10 pr-4 py-2 rounded-lg border transition-colors ${isDark
                  ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                  }`}
              />
            </div>

            {/* View toggle */}
            <div className={`flex rounded-lg p-1 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-200'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? isDark ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                  : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? isDark ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                  : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>

            {/* Action buttons */}
            <Button onClick={() => setIsNewFolderModalOpen(true)} variant="ghost">
              <FiFolderPlus className="w-5 h-5" />
            </Button>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <FiLink className="w-5 h-5 mr-1" />
              Add Link
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg overflow-x-auto ${isDark ? 'bg-gray-800/50' : 'bg-white'
          }`}>
          {currentFolderId && (
            <button
              onClick={navigateUp}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => navigateToFolder(null)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors flex-shrink-0 ${currentFolderId === null
              ? isDark ? 'text-purple-400' : 'text-purple-600'
              : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiHome className="w-4 h-4" />
            <span>Library</span>
          </button>

          {breadcrumbs.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <FiChevronRight className={`flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <button
                onClick={() => navigateToFolder(folder.id)}
                className={`px-2 py-1 rounded-lg transition-colors truncate max-w-[150px] ${index === breadcrumbs.length - 1
                  ? isDark ? 'text-purple-400' : 'text-purple-600'
                  : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Selection toolbar */}
        {selectedItems.size > 0 && (
          <div className={`flex items-center justify-between p-3 mb-4 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'
            }`}>
            <span className={isDark ? 'text-purple-400' : 'text-purple-700'}>
              {selectedItems.size} item(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItems(new Set())}
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-500 hover:text-red-600"
              >
                <FiTrash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        {currentItems.length === 0 ? (
          <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {searchQuery ? (
              <>
                <FiSearch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No results found</p>
                <p className="text-sm">Try a different search term</p>
              </>
            ) : (
              <>
                <IoFolder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">This folder is empty</p>
                <p className="text-sm">Create a folder or upload files to get started</p>
              </>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {currentItems.map(renderItem)}
          </div>
        ) : (
          <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-gray-800/30' : 'bg-white shadow-sm'
            }`}>
            <div className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-3 border-b text-sm font-medium ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
              }`}>
              <span className="w-5"></span>
              <span></span>
              <span>Name</span>
              <span>Size</span>
              <span>Date</span>
              <span className="w-8"></span>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map(renderItem)}
            </div>
          </div>
        )}

        {/* New Folder Modal */}
        <Modal isOpen={isNewFolderModalOpen} onClose={() => setIsNewFolderModalOpen(false)} size="sm" title="Create New Folder">
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Folder Name
                </label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  autoFocus
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {FOLDER_COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewFolderColor(color.value)}
                      className={`w-8 h-8 rounded-lg transition-transform ${newFolderColor === color.value ? 'ring-2 ring-offset-2 scale-110' : ''
                        } ${isDark ? 'ring-offset-gray-900' : 'ring-offset-white'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsNewFolderModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create Folder
            </Button>
          </ModalFooter>
        </Modal>

        {/* Add Link Modal (replaces Upload Modal) */}
        <Modal isOpen={isUploadModalOpen} onClose={() => { setIsUploadModalOpen(false); setNewLinkName(''); setNewLinkUrl(''); setNewLinkDescription(''); }} size="md" title="Add Resource Link">
          <ModalBody>
            <div className="space-y-4">
              {/* Info banner */}
              <div className={`p-3 rounded-lg flex items-start gap-3 ${isDark ? 'bg-purple-900/30 text-purple-200' : 'bg-purple-50 text-purple-800'}`}>
                <span className="text-xl">💡</span>
                <p className="text-sm">
                  Add links to Google Drive, Dropbox, or any file hosting service.
                  Links will open in a new tab when clicked.
                </p>
              </div>

              {/* Link Name */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Display Name *
                </label>
                <Input
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  placeholder="e.g., Calculus Lecture Notes.pdf"
                  autoFocus
                />
              </div>

              {/* Link URL */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Link URL *
                </label>
                <Input
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/..."
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Paste a Google Drive, Dropbox, or direct file link
                </p>
              </div>

              {/* Description (optional) */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description (optional)
                </label>
                <Input
                  value={newLinkDescription}
                  onChange={(e) => setNewLinkDescription(e.target.value)}
                  placeholder="Brief description of this resource"
                />
              </div>

              {/* Preview */}
              {newLinkName && newLinkUrl && (
                <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                  <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Preview:</p>
                  <div className="flex items-center gap-3">
                    <FiFile className={`w-8 h-8 ${isDark ? 'text-purple-500' : 'text-purple-600'}`} />
                    <div>
                      <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{newLinkName}</p>
                      {newLinkDescription && (
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{newLinkDescription}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => { setIsUploadModalOpen(false); setNewLinkName(''); setNewLinkUrl(''); setNewLinkDescription(''); }}>
              Cancel
            </Button>
            <Button onClick={handleAddLink} disabled={!newLinkName.trim() || !newLinkUrl.trim()}>
              Add Link
            </Button>
          </ModalFooter>
        </Modal>

        {/* Rename Modal */}
        <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} size="sm" title={`Rename ${editingItem?.type === 'folder' ? 'Folder' : 'File'}`}>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Name
                </label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter new name"
                  autoFocus
                />
              </div>
              {editingItem?.type === 'folder' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FOLDER_COLORS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewFolderColor(color.value)}
                        className={`w-8 h-8 rounded-lg transition-transform ${newFolderColor === color.value ? 'ring-2 ring-offset-2 scale-110' : ''
                          } ${isDark ? 'ring-offset-gray-900' : 'ring-offset-white'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsRenameModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!newFolderName.trim()}>
              Save
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm" title="Confirm Delete">
          <ModalBody>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Are you sure you want to delete {selectedItems.size} item(s)?
              {Array.from(selectedItems).some(id => items.find(i => i.id === id)?.type === 'folder') && (
                <span className="block mt-2 text-sm text-red-500">
                  Warning: Deleting folders will also delete all contents inside them.
                </span>
              )}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>

        {/* Copy/Move Modal */}
        <Modal
          isOpen={isMoveModalOpen}
          onClose={() => { setIsMoveModalOpen(false); setMovingItem(null); }}
          size="md"
          title={isCopying ? 'Copy to Folder' : 'Move to Folder'}
        >
          <ModalBody>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {isCopying ? 'Select a destination folder to copy' : 'Select a destination folder to move'}{' '}
              <span className="font-medium">{movingItem?.name}</span>
            </p>
            <div className={`border rounded-lg max-h-64 overflow-y-auto ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Root folder option */}
              <button
                onClick={() => handleCopyMove(null)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 ${isDark
                  ? 'hover:bg-gray-700/50 border-b border-gray-700'
                  : 'hover:bg-gray-50 border-b border-gray-100'
                  }`}
              >
                <FiHome className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  📁 Root (My Library)
                </span>
              </button>

              {/* Available folders */}
              {getAvailableFolders().length === 0 ? (
                <div className={`px-4 py-6 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  No other folders available
                </div>
              ) : (
                getAvailableFolders().map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => handleCopyMove(folder.id)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 ${isDark
                      ? 'hover:bg-gray-700/50 border-b border-gray-700 last:border-b-0'
                      : 'hover:bg-gray-50 border-b border-gray-100 last:border-b-0'
                      }`}
                  >
                    <IoFolder
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: folder.color || FOLDER_COLORS[0].value }}
                    />
                    <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {folder.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => { setIsMoveModalOpen(false); setMovingItem(null); }}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
