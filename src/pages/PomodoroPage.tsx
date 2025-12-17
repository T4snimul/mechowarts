import { useState, useEffect, useCallback } from 'react';
import { Modal, ModalBody } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  pomodoros: number;
  estimatedPomodoros: number;
}

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

const DEFAULT_SETTINGS: TimerSettings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

// Updated to match MechoWarts theme
const MODE_BG: Record<TimerMode, string> = {
  work: 'from-purple-600 via-purple-700 to-indigo-800',
  shortBreak: 'from-emerald-500 via-teal-600 to-cyan-700',
  longBreak: 'from-indigo-500 via-blue-600 to-purple-700',
};

export function PomodoroPage() {
  // Timer state
  const [mode, setMode] = useState<TimerMode>('work');
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Todo state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [activeTodoId, setActiveTodoId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem('pomodoroSettings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setSettings(parsed);
      setTimeLeft(parsed.work * 60);
    }

    const storedTodos = localStorage.getItem('pomodoroTodos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }

    const storedSessions = localStorage.getItem('pomodoroSessionsToday');
    if (storedSessions) {
      const { count, date } = JSON.parse(storedSessions);
      if (date === new Date().toDateString()) {
        setSessions(count);
      }
    }

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroTodos', JSON.stringify(todos));
  }, [todos]);

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Update document title with timer
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.title = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} - ${mode === 'work' ? 'Focus' : 'Break'}`;

    return () => {
      document.title = 'MechoWarts';
    };
  }, [timeLeft, mode]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    // Play notification sound
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch { }

    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification(mode === 'work' ? '🍅 Time for a break!' : '💪 Back to work!', {
        body: mode === 'work' ? 'Great job! Take a short break.' : 'Ready to focus again?',
        icon: '/logo.png',
      });
    }

    if (mode === 'work') {
      // Update active todo pomodoro count
      if (activeTodoId) {
        setTodos(prev => prev.map(t =>
          t.id === activeTodoId ? { ...t, pomodoros: t.pomodoros + 1 } : t
        ));
      }

      const newCount = sessionsCompleted + 1;
      setSessions(newCount);
      localStorage.setItem('pomodoroSessionsToday', JSON.stringify({
        count: newCount,
        date: new Date().toDateString(),
      }));

      // Switch to break
      if (newCount % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreak * 60);
        if (settings.autoStartBreaks) setIsRunning(true);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
        if (settings.autoStartBreaks) setIsRunning(true);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.work * 60);
      if (settings.autoStartPomodoros) setIsRunning(true);
    }
  }, [mode, sessionsCompleted, settings, activeTodoId]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(settings[mode] * 60);
    setIsRunning(false);
  };

  const handleSettingsSave = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    setTimeLeft(newSettings[mode] * 60);
    setShowSettings(false);
  };

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      pomodoros: 0,
      estimatedPomodoros: 1,
    };
    setTodos(prev => [...prev, newTodo]);
    setNewTodoText('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    if (activeTodoId === id) setActiveTodoId(null);
  };

  const clearFinishedTodos = () => {
    setTodos(prev => prev.filter(t => !t.completed));
  };

  const progress = ((settings[mode] * 60 - timeLeft) / (settings[mode] * 60)) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${MODE_BG[mode]} transition-colors duration-500`}>
      {/* Simple header */}
      <header className="p-4 flex items-center justify-between">
        <BackButton to="/greathall" label="Back" variant="light" />
        <h1 className="text-white font-bold text-lg">MechoWarts Pomodoro</h1>
        <button
          onClick={() => setShowSettings(true)}
          className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Settings"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      <main className="max-w-xl mx-auto px-4 pb-8">
        {/* Mode Selector */}
        <div className="flex justify-center gap-2 mb-6">
          {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-4 py-2 rounded-md font-medium transition-all ${mode === m
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              {m === 'work' ? 'Pomodoro' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-6">
          <div className="text-center">
            <div className="text-[8rem] font-bold text-white leading-none font-mono tracking-tight">
              {formatTime(timeLeft)}
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-white/20 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-1000 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-12 py-4 bg-white text-gray-800 font-bold text-xl rounded-md shadow-lg hover:shadow-xl transition-all active:scale-95 uppercase tracking-wider"
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              {(isRunning || timeLeft !== settings[mode] * 60) && (
                <button
                  onClick={handleReset}
                  className="p-4 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  title="Reset"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Session counter */}
        <div className="text-center text-white/80 mb-6">
          #{sessionsCompleted + 1} {sessionsCompleted >= 4 && `(Set ${Math.floor(sessionsCompleted / 4) + 1})`}
        </div>

        {/* Todos Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Tasks</h2>
            {todos.some(t => t.completed) && (
              <button
                onClick={clearFinishedTodos}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Clear finished
              </button>
            )}
          </div>

          {/* Todo list */}
          <div className="space-y-2 mb-4">
            {todos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeTodoId === todo.id
                  ? 'bg-white/20 border-2 border-white/40'
                  : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                  }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${todo.completed
                    ? 'bg-white border-white text-gray-800'
                    : 'border-white/50 hover:border-white'
                    }`}
                >
                  {todo.completed && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => !todo.completed && setActiveTodoId(activeTodoId === todo.id ? null : todo.id)}
                  className={`flex-1 text-left ${todo.completed ? 'line-through text-white/50' : 'text-white'}`}
                >
                  {todo.text}
                </button>

                <span className="text-white/60 text-sm">
                  {todo.pomodoros}/{todo.estimatedPomodoros}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-white/40 hover:text-white/80 p-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add todo */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What are you working on?"
              className="flex-1 bg-white/10 border-2 border-dashed border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
            />
            <button
              onClick={addTodo}
              disabled={!newTodoText.trim()}
              className="px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Stats mini */}
        <div className="flex justify-center gap-8 mt-6 text-white/70 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{sessionsCompleted}</div>
            <div>Pomodoros</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{Math.round(sessionsCompleted * settings.work)}</div>
            <div>Minutes</div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

// Settings Modal Component
function SettingsModal({
  settings,
  onSave,
  onClose
}: {
  settings: TimerSettings;
  onSave: (s: TimerSettings) => void;
  onClose: () => void;
}) {
  const [localSettings, setLocalSettings] = useState(settings);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Timer Settings"
      size="md"
    >
      <ModalBody>
        <div className="space-y-6">
          {/* Time settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Time (minutes)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Pomodoro</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={localSettings.work}
                  onChange={(e) => setLocalSettings(s => ({ ...s, work: parseInt(e.target.value) || 25 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Short Break</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={localSettings.shortBreak}
                  onChange={(e) => setLocalSettings(s => ({ ...s, shortBreak: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Long Break</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={localSettings.longBreak}
                  onChange={(e) => setLocalSettings(s => ({ ...s, longBreak: parseInt(e.target.value) || 15 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                />
              </div>
            </div>
          </div>

          {/* Auto start settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Auto Start
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoStartBreaks}
                  onChange={(e) => setLocalSettings(s => ({ ...s, autoStartBreaks: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Auto start breaks</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoStartPomodoros}
                  onChange={(e) => setLocalSettings(s => ({ ...s, autoStartPomodoros: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Auto start pomodoros</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(localSettings)}
            className="flex-1"
          >
            Save
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}
