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

// AI Assistant knowledge base for website help
const getAIResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();

  // Greetings
  if (lowerInput.match(/^(hi|hello|hey|howdy|greetings)/)) {
    return "Hello! 👋 I'm the MechoWarts Assistant. How can I help you today? You can ask me about navigating the site, features, or anything else!";
  }

  // Help requests
  if (lowerInput.match(/help|what can you do|what do you do|how to use/)) {
    return `I can help you with:

🏰 **Great Hall** - Browse all student profiles sorted by house
📚 **Library** - Access shared materials and study resources
🦉 **Owlery** - Send messages to other students
📅 **Calendar** - View upcoming events and deadlines
🫧 **Pensieve** - Share and view memories/photos
⏱️ **Pomodoro** - Focus timer for productive study sessions

Just ask me about any feature and I'll explain how to use it!`;
  }

  // Great Hall
  if (lowerInput.match(/great hall|hall|students|profiles|browse|search people/)) {
    return `🏰 **The Great Hall** is where you can:

• Browse all MechoWarts students sorted by their Hogwarts houses
• Filter by house (Gryffindor, Hufflepuff, Ravenclaw, Slytherin)
• Filter by blood group or series
• Search for specific students by name or roll number
• Click on any profile card to view detailed information

Navigate there using the "Great Hall" link in the header!`;
  }

  // Library/Materials
  if (lowerInput.match(/library|materials|study|resources|files|folders|documents/)) {
    return `📚 **The Library** (Materials Page) lets you:

• Create folders to organize your resources
• Add links to Google Drive, Dropbox, or any external resource
• Move or copy items between folders
• Search through your materials
• Color-code folders for easy identification

Access it from the "Library" link in the navigation!`;
  }

  // Owlery/Chat
  if (lowerInput.match(/owlery|chat|message|dm|direct message|talk|communicate/)) {
    return `🦉 **The Owlery** is the messaging center:

• Send messages to the Great Hall (group chat)
• Start direct messages (DMs) with specific students
• See who's currently online
• Real-time messaging with other students

Navigate to "Owlery" to start chatting!`;
  }

  // Calendar
  if (lowerInput.match(/calendar|events|schedule|dates|deadline/)) {
    return `📅 **The Calendar** helps you:

• View upcoming events and deadlines
• Add your own events (teachers/CR can add class events)
• Color-coded by category
• Navigate between months
• Never miss an important date!

Check the "Calendar" link in the navigation.`;
  }

  // Pensieve/Memories
  if (lowerInput.match(/pensieve|memories|photos|gallery|pictures|images/)) {
    return `🫧 **The Pensieve** is where memories live:

• Upload and share photos from events
• View memories from all students
• Filter to see just your memories
• Like and comment on photos
• Capture magical moments!

Visit "Memories" in the navigation to explore.`;
  }

  // Pomodoro/Focus
  if (lowerInput.match(/pomodoro|focus|timer|productivity|study timer/)) {
    return `⏱️ **Pomodoro Timer** helps you study effectively:

• 25-minute work sessions followed by 5-minute breaks
• Long breaks after 4 pomodoros
• Customizable timer durations
• Task list to track what you're working on
• Visual progress tracking

Access it via "Focus" in the navigation!`;
  }

  // Profile/Account
  if (lowerInput.match(/profile|account|edit|settings|my info|my data/)) {
    return `👤 **Your Profile** can be managed by:

• Clicking on your avatar in the header
• Going to "Edit Profile" to update your info
• Setting privacy levels for each field
• Uploading a profile picture
• Adding your patronus, wand, and magical details!

Access profile settings from the user menu.`;
  }

  // Theme/Dark mode
  if (lowerInput.match(/theme|dark mode|light mode|colors|appearance/)) {
    return `🎨 **Theme Settings**:

• Click the sun/moon icon in the header to toggle dark/light mode
• Your preference is saved automatically
• Background effects and animations can be toggled in the menu
• High contrast mode available for accessibility

The theme toggle is in the top navigation bar!`;
  }

  // Houses
  if (lowerInput.match(/house|gryffindor|hufflepuff|ravenclaw|slytherin|sorting/)) {
    return `🏠 **Hogwarts Houses** at MechoWarts:

🦁 **Gryffindor** - Brave and courageous
🦡 **Hufflepuff** - Loyal and hardworking
🦅 **Ravenclaw** - Wise and creative
🐍 **Slytherin** - Ambitious and resourceful

Students are sorted based on their personality traits and achievements!`;
  }

  // Technical issues
  if (lowerInput.match(/bug|error|problem|not working|broken|issue|crash/)) {
    return `🔧 **Having Technical Issues?**

Here are some steps to try:
1. Refresh the page (Ctrl+R or Cmd+R)
2. Clear your browser cache
3. Try a different browser
4. Check your internet connection
5. Make sure you're logged in if the feature requires it

If the issue persists, contact the development team!`;
  }

  // Thanks
  if (lowerInput.match(/thank|thanks|thx|appreciate/)) {
    return "You're welcome! ✨ Happy to help! Is there anything else you'd like to know about MechoWarts?";
  }

  // Goodbye
  if (lowerInput.match(/bye|goodbye|see you|later|gtg/)) {
    return "Goodbye! 👋 May your studies be magical! Feel free to come back anytime you need help. 🧙‍♂️";
  }

  // Default response
  return `I'm not quite sure about that, but here's what I can help you with:

• **Navigation** - How to get around the site
• **Great Hall** - Student profiles and search
• **Library** - Materials and resources
• **Owlery** - Messaging features
• **Calendar** - Events and schedules
• **Pensieve** - Photo memories
• **Pomodoro** - Focus timer
• **Profile** - Account settings

Try asking about any of these topics! 🪄`;
};

export function ChatPage() {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to the Wizarding Portal! 🧙‍♂️ I'm your MechoWarts Assistant. I can help you navigate the site, explain features, or answer questions. Try asking me about the Great Hall, Library, Owlery, or any other feature!",
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

    // Get AI response with slight delay for natural feel
    setTimeout(() => {
      const response = getAIResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 600 + Math.random() * 400); // Random delay between 600-1000ms for natural feel
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              🪄 Wizarding Assistant
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Hello {user?.name || 'Wizard'}! I'm here to help you navigate MechoWarts and learn about its features.
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
