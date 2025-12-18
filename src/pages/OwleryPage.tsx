import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { usePeopleFromAPI } from '@/hooks/usePeopleFromAPI';
import { BackButton } from '@/components/ui/BackButton';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: Date;
  isGroupMessage?: boolean;
}

interface User {
  id: string;
  name: string;
  roll: string;
  avatar?: string;
  online: boolean;
}

type ChatMode = 'direct' | 'group';

export function OwleryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { people } = usePeopleFromAPI();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>('group');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convert people to User format and merge with online status
  const allUsers: User[] = people.map(p => ({
    id: p.id || p.roll,
    name: p.name,
    roll: p.roll,
    avatar: p.avatar,
    online: onlineUsers.some(ou => ou.id === p.id || ou.roll === p.roll),
  })).filter(u => u.id !== user?.id && u.roll !== user?.roll);

  // Sort: online users first, then alphabetically
  const sortedUsers = [...allUsers].sort((a, b) => {
    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;
    return a.name.localeCompare(b.name);
  });

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, groupMessages]);

  // Socket.IO connection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const newSocket = io(backendUrl, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      // Join global chat room
      newSocket.emit('join-group', { userId: user.id, userName: user.name });
    });

    newSocket.on('online-users', (users: User[]) => {
      setOnlineUsers(users.filter(u => u.id !== user.id));
    });

    newSocket.on('new-message', (message: Message) => {
      if (message.isGroupMessage) {
        setGroupMessages(prev => [...prev, message]);
      } else {
        setMessages(prev => [...prev, message]);
      }
    });

    newSocket.on('message-history', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('group-message-history', (history: Message[]) => {
      setGroupMessages(history);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    if (chatMode === 'group') {
      socket.emit('send-group-message', {
        text: inputMessage,
        userId: user?.id,
        userName: user?.name,
        userAvatar: user?.avatar,
      });
    } else if (selectedUser) {
      socket.emit('send-message', {
        to: selectedUser.id,
        text: inputMessage,
      });
    }
    setInputMessage('');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🦉</div>
          <h1 className="text-3xl font-bold text-white mb-4">The Owlery is Locked</h1>
          <p className="text-gray-300 mb-6">You need to sign in to send magical messages</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const currentMessages = chatMode === 'group' ? groupMessages : messages;

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - User List */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-gray-800 border-r border-gray-700 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton to="/greathall" variant="minimal" />
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                🦉 Owlery
              </h2>
              <p className="text-xs text-gray-400">Magical Messenger</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Chat Mode Toggle */}
        <div className="p-3 border-b border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setChatMode('group');
                setSelectedUser(null);
                setSidebarOpen(false);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${chatMode === 'group'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              🏰 Great Hall
            </button>
            <button
              onClick={() => setChatMode('direct')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${chatMode === 'direct'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              📨 DMs
            </button>
          </div>
        </div>

        {/* Current User Profile */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.avatar || '/default-avatar.svg'}
                alt={user?.name}
                className="w-12 h-12 rounded-full border-2 border-green-500"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.name}</p>
              <p className="text-sm text-gray-400">Roll: {user?.roll}</p>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              All Wizards ({sortedUsers.length}) • {onlineUsers.length} Online
            </p>

            {sortedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-2">🦉</p>
                <p className="text-sm">No other wizards yet...</p>
              </div>
            ) : (
              <div className="space-y-1">
                {sortedUsers.map(listUser => (
                  <button
                    key={listUser.id}
                    onClick={() => {
                      setSelectedUser(listUser);
                      setChatMode('direct');
                      setSidebarOpen(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${selectedUser?.id === listUser.id && chatMode === 'direct'
                      ? 'bg-indigo-600'
                      : 'hover:bg-gray-700'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={listUser.avatar || '/default-avatar.svg'}
                          alt={listUser.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${listUser.online ? 'bg-green-500' : 'bg-gray-500'
                            }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{listUser.name}</p>
                        <p className="text-xs text-gray-400">
                          Roll: {listUser.roll}
                          {listUser.online && (
                            <span className="ml-2 text-green-400">● Online</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {chatMode === 'group' ? (
          <>
            {/* Group Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">
                  🏰
                </div>
                <div>
                  <p className="font-semibold">Great Hall Chat</p>
                  <p className="text-xs text-green-400">
                    {onlineUsers.length + 1} wizards online
                  </p>
                </div>
              </div>
            </div>

            {/* Group Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
              {currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="text-6xl mb-4">🏰</p>
                    <p className="text-lg font-medium">Welcome to the Great Hall!</p>
                    <p className="text-sm mt-2">Start a conversation with all wizards</p>
                  </div>
                </div>
              ) : (
                currentMessages.map(message => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-md ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <img
                          src={message.senderAvatar || '/default-avatar.svg'}
                          alt={message.senderName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          {!isOwn && (
                            <p className="text-xs text-gray-400 mb-1">{message.senderName}</p>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl ${isOwn
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-white'
                              }`}
                          >
                            <p className="break-words">{message.text}</p>
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : ''}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        ) : !selectedUser ? (
          /* No DM selected */
          <div className="flex-1 flex flex-col bg-gray-900">
            {/* Mobile header */}
            <div className="lg:hidden p-4 border-b border-gray-700 bg-gray-800">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="text-8xl mb-4">📨</div>
                <h2 className="text-2xl font-bold text-gray-300 mb-2">Direct Messages</h2>
                <p className="text-gray-500">Select a wizard from the sidebar to start a private chat</p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium"
                >
                  Open Sidebar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* DM Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="relative">
                  <img
                    src={selectedUser.avatar || '/default-avatar.svg'}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${selectedUser.online ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                  />
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className={`text-xs ${selectedUser.online ? 'text-green-400' : 'text-gray-500'}`}>
                    {selectedUser.online ? '● Online' : '○ Offline'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/wizard/${selectedUser.roll}`)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                View Profile
              </button>
            </div>

            {/* DM Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
              {currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="text-4xl mb-2">📜</p>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                currentMessages.map(message => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-md ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <img
                          src={message.senderAvatar || '/default-avatar.svg'}
                          alt={message.senderName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div
                            className={`px-4 py-2 rounded-2xl ${isOwn
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-white'
                              }`}
                          >
                            <p className="break-words">{message.text}</p>
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : ''}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}

        {/* Message Input - Show for group or when user selected */}
        {(chatMode === 'group' || selectedUser) && (
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  chatMode === 'group'
                    ? 'Send a message to the Great Hall...'
                    : `Send a message to ${selectedUser?.name}...`
                }
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                Send 🦉
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
