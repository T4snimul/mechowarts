import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: Date;
}

interface User {
  id: string;
  name: string;
  roll: string;
  avatar?: string;
  online: boolean;
}

export function OwleryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Socket.IO connection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const newSocket = io(backendUrl, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to Owlery');
    });

    newSocket.on('online-users', (users: User[]) => {
      setOnlineUsers(users.filter(u => u.id !== user.id));
    });

    newSocket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('message-history', (history: Message[]) => {
      setMessages(history);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !selectedUser) return;

    const message = {
      to: selectedUser.id,
      text: inputMessage,
    };

    socket.emit('send-message', message);
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

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Sidebar - User List */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/greathall')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Back to Great Hall"
            >
              ←
            </button>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                🦉 Owlery
              </h2>
              <p className="text-xs text-gray-400">Magical Messenger</p>
            </div>
          </div>
        </div>

        {/* Current User Profile */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.avatar || '/default-avatar.png'}
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

        {/* Online Users List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Online Wizards ({onlineUsers.length})
            </p>

            {onlineUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-2">🦉</p>
                <p className="text-sm">No owls in sight...</p>
                <p className="text-xs mt-1">Waiting for other students</p>
              </div>
            ) : (
              <div className="space-y-1">
                {onlineUsers.map(onlineUser => (
                  <button
                    key={onlineUser.id}
                    onClick={() => setSelectedUser(onlineUser)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${selectedUser?.id === onlineUser.id
                      ? 'bg-indigo-600'
                      : 'hover:bg-gray-700'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={onlineUser.avatar || '/default-avatar.png'}
                          alt={onlineUser.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{onlineUser.name}</p>
                        <p className="text-xs text-gray-400">Roll: {onlineUser.roll}</p>
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
      <div className="flex-1 flex flex-col">
        {!selectedUser ? (
          /* No chat selected */
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="text-8xl mb-4">🦉</div>
              <h2 className="text-2xl font-bold text-gray-300 mb-2">Welcome to the Owlery</h2>
              <p className="text-gray-500">Select a wizard from the sidebar to start sending messages</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedUser.avatar || '/default-avatar.png'}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-xs text-green-400">● Online</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/wizard/${selectedUser.roll}`)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                View Profile
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="text-4xl mb-2">📜</p>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map(message => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-md ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <img
                          src={message.senderAvatar || '/default-avatar.png'}
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
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
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
          </>
        )}
      </div>
    </div>
  );
}
