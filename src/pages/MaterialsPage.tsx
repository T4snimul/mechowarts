import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  FiFolderPlus, FiFile, FiUpload, FiTrash2,
  FiChevronRight, FiHome, FiSearch, FiMoreVertical, FiEdit2,
  FiFileText, FiImage, FiVideo, FiMusic, FiCode, FiArchive,
  FiArrowLeft, FiGrid, FiList, FiX, FiCheck
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
  size: number; // in bytes
  url?: string;
  createdAt: string;
  uploadedBy?: string;
  description?: string;
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
  const isDark = theme === 'dark';

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
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);

  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0].value);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

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

  // Upload files
  const handleUpload = () => {
    if (uploadFiles.length === 0) return;

    const newFiles: FileItem[] = uploadFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: 'file',
      parentId: currentFolderId,
      fileType: file.name.split('.').pop() || 'unknown',
      size: file.size,
      createdAt: new Date().toISOString(),
    }));

    setItems([...items, ...newFiles]);
    setIsUploadModalOpen(false);
    setUploadFiles([]);
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
      // For files, you would typically open a preview or download
      alert(`Opening file: ${item.name}`);
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
              ? 'bg-amber-900/30 ring-2 ring-amber-500'
              : 'bg-amber-100 ring-2 ring-amber-400'
            : isDark
              ? 'bg-stone-800/50 hover:bg-stone-800'
              : 'bg-white hover:bg-amber-50 hover:shadow-md'
            }`}
        >
          {/* Selection checkbox */}
          <div
            onClick={(e) => toggleSelection(item.id, e)}
            className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
              ? 'bg-amber-500 border-amber-500 text-white'
              : isDark
                ? 'border-stone-600 group-hover:border-stone-500'
                : 'border-stone-300 group-hover:border-stone-400'
              } ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            {isSelected && <FiCheck className="w-3 h-3" />}
          </div>

          {/* More button */}
          <button
            onClick={(e) => openContextMenu(item.id, e)}
            className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'hover:bg-stone-700 text-stone-400' : 'hover:bg-stone-100 text-stone-500'
              }`}
          >
            <FiMoreVertical className="w-4 h-4" />
          </button>

          {/* Context menu */}
          {contextMenuId === item.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-10 right-2 z-50 w-40 py-1 rounded-lg shadow-xl ${isDark ? 'bg-stone-800 border border-stone-700' : 'bg-white border border-stone-200'
                }`}
            >
              <button
                onClick={() => startRename(item)}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-stone-700 text-stone-300' : 'hover:bg-stone-100 text-stone-600'
                  }`}
              >
                <FiEdit2 className="w-4 h-4" />
                Rename
              </button>
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
              <FileIcon className={`w-16 h-16 ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
            )}
          </div>

          {/* Name */}
          <p className={`text-center text-sm font-medium truncate ${isDark ? 'text-stone-200' : 'text-stone-700'
            }`}>
            {item.name}
          </p>

          {/* File size */}
          {item.type === 'file' && (
            <p className={`text-center text-xs mt-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
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
            ? 'bg-amber-900/30 ring-2 ring-amber-500'
            : 'bg-amber-100 ring-2 ring-amber-400'
          : isDark
            ? 'hover:bg-stone-800'
            : 'hover:bg-amber-50'
          }`}
      >
        {/* Selection checkbox */}
        <div
          onClick={(e) => toggleSelection(item.id, e)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected
            ? 'bg-amber-500 border-amber-500 text-white'
            : isDark
              ? 'border-stone-600 hover:border-stone-500'
              : 'border-stone-300 hover:border-stone-400'
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
          <FileIcon className={`w-8 h-8 flex-shrink-0 ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
        )}

        {/* Name */}
        <span className={`flex-1 truncate ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
          {item.name}
        </span>

        {/* File size */}
        {item.type === 'file' && (
          <span className={`text-sm ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
            {formatSize((item as FileItem).size)}
          </span>
        )}

        {/* Date */}
        <span className={`text-sm ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
          {new Date(item.createdAt).toLocaleDateString()}
        </span>

        {/* More button */}
        <button
          onClick={(e) => openContextMenu(item.id, e)}
          className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-stone-700 text-stone-400' : 'hover:bg-stone-100 text-stone-500'
            }`}
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>

        {/* Context menu */}
        {contextMenuId === item.id && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-full right-0 z-50 w-40 py-1 rounded-lg shadow-xl ${isDark ? 'bg-stone-800 border border-stone-700' : 'bg-white border border-stone-200'
              }`}
          >
            <button
              onClick={() => startRename(item)}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-stone-700 text-stone-300' : 'hover:bg-stone-100 text-stone-600'
                }`}
            >
              <FiEdit2 className="w-4 h-4" />
              Rename
            </button>
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

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 to-orange-50'
      }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
              📚 Restricted Section Library
            </h1>
            <p className={`mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              Study materials and resources
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500' : 'text-stone-400'
                }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className={`pl-10 pr-4 py-2 rounded-lg border transition-colors ${isDark
                  ? 'bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500'
                  : 'bg-white border-stone-300 text-stone-800 placeholder-stone-400'
                  }`}
              />
            </div>

            {/* View toggle */}
            <div className={`flex rounded-lg p-1 ${isDark ? 'bg-stone-800' : 'bg-white'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? isDark ? 'bg-amber-600 text-white' : 'bg-amber-500 text-white'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-800'
                  }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? isDark ? 'bg-amber-600 text-white' : 'bg-amber-500 text-white'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-800'
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
              <FiUpload className="w-5 h-5 mr-1" />
              Upload
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg overflow-x-auto ${isDark ? 'bg-stone-800/50' : 'bg-white'
          }`}>
          {currentFolderId && (
            <button
              onClick={navigateUp}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDark ? 'hover:bg-stone-700 text-stone-400' : 'hover:bg-stone-100 text-stone-500'
                }`}
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => navigateToFolder(null)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors flex-shrink-0 ${currentFolderId === null
              ? isDark ? 'text-amber-400' : 'text-amber-600'
              : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-500 hover:text-stone-700'
              }`}
          >
            <FiHome className="w-4 h-4" />
            <span>Library</span>
          </button>

          {breadcrumbs.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <FiChevronRight className={`flex-shrink-0 ${isDark ? 'text-stone-600' : 'text-stone-400'}`} />
              <button
                onClick={() => navigateToFolder(folder.id)}
                className={`px-2 py-1 rounded-lg transition-colors truncate max-w-[150px] ${index === breadcrumbs.length - 1
                  ? isDark ? 'text-amber-400' : 'text-amber-600'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-500 hover:text-stone-700'
                  }`}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Selection toolbar */}
        {selectedItems.size > 0 && (
          <div className={`flex items-center justify-between p-3 mb-4 rounded-lg ${isDark ? 'bg-amber-900/30' : 'bg-amber-100'
            }`}>
            <span className={isDark ? 'text-amber-400' : 'text-amber-700'}>
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
          <div className={`text-center py-16 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
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
          <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-stone-800/30' : 'bg-white shadow-sm'
            }`}>
            <div className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-3 border-b text-sm font-medium ${isDark ? 'border-stone-700 text-stone-400' : 'border-stone-200 text-stone-500'
              }`}>
              <span className="w-5"></span>
              <span></span>
              <span>Name</span>
              <span>Size</span>
              <span>Date</span>
              <span className="w-8"></span>
            </div>
            <div className="divide-y divide-stone-200 dark:divide-stone-700">
              {currentItems.map(renderItem)}
            </div>
          </div>
        )}

        {/* New Folder Modal */}
        <Modal isOpen={isNewFolderModalOpen} onClose={() => setIsNewFolderModalOpen(false)} size="sm" title="Create New Folder">
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'
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
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'
                  }`}>
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {FOLDER_COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setNewFolderColor(color.value)}
                      className={`w-8 h-8 rounded-lg transition-transform ${newFolderColor === color.value ? 'ring-2 ring-offset-2 scale-110' : ''
                        } ${isDark ? 'ring-offset-stone-900' : 'ring-offset-white'}`}
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

        {/* Upload Modal */}
        <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} size="md" title="Upload Files">
          <ModalBody>
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDark
                  ? 'border-stone-700 hover:border-amber-600'
                  : 'border-stone-300 hover:border-amber-400'
                  }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FiUpload className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-stone-500' : 'text-stone-400'
                    }`} />
                  <p className={isDark ? 'text-stone-300' : 'text-stone-600'}>
                    Click to select files or drag and drop
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                    Maximum file size: 50MB
                  </p>
                </label>
              </div>

              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <p className={`text-sm font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    Selected files:
                  </p>
                  {uploadFiles.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-stone-800' : 'bg-stone-100'
                        }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FiFile className={`flex-shrink-0 ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
                        <span className={`truncate ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                          {file.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                          {formatSize(file.size)}
                        </span>
                        <button
                          onClick={() => setUploadFiles(uploadFiles.filter((_, i) => i !== index))}
                          className={`p-1 rounded ${isDark ? 'hover:bg-stone-700 text-stone-400' : 'hover:bg-stone-200 text-stone-500'
                            }`}
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => { setIsUploadModalOpen(false); setUploadFiles([]); }}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploadFiles.length === 0}>
              Upload {uploadFiles.length > 0 ? `(${uploadFiles.length})` : ''}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Rename Modal */}
        <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} size="sm" title={`Rename ${editingItem?.type === 'folder' ? 'Folder' : 'File'}`}>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'
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
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'
                    }`}>
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FOLDER_COLORS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setNewFolderColor(color.value)}
                        className={`w-8 h-8 rounded-lg transition-transform ${newFolderColor === color.value ? 'ring-2 ring-offset-2 scale-110' : ''
                          } ${isDark ? 'ring-offset-stone-900' : 'ring-offset-white'}`}
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
            <p className={isDark ? 'text-stone-300' : 'text-stone-600'}>
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
      </div>
    </div>
  );
}
