import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { MagicalBackground } from '@/components/ui/MagicalBackground';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatPage() {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to the Wizarding Portal! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I received your message: "${input}". This is a demo response. The chat system is currently in development.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <MagicalBackground />
        <Header query="" setQuery={() => { }} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sign In Required</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">You need to be signed in to access the chat.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Magical Background */}
      <MagicalBackground />

      {/* Header */}
      <Header query="" setQuery={() => { }} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 pt-20 pb-8">
        <div className="max-w-4xl mx-auto w-full h-full flex flex-col px-4 sm:px-6 lg:px-8">
          {/* Chat header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Wizarding Assistant
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Hello {user?.name || 'Wizard'}! Ask me anything about the wizarding world.
            </p>
          </div>

          {/* Messages container */}
          <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 space-y-4 mb-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  'flex',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                    message.sender === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg rounded-bl-none px-4 py-3 flex gap-2">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating action buttons */}
      <ScrollToTop />
    </div>
  );
}
