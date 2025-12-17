import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MagicalBackground } from '../components/ui/MagicalBackground';
import {
  FiCalendar, FiPlus, FiChevronLeft, FiChevronRight, FiClock,
  FiMapPin, FiTrash2, FiEdit2, FiList, FiGrid, FiColumns,
  FiLink, FiRefreshCw, FiCheck, FiExternalLink, FiHome
} from 'react-icons/fi';

// Types
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location?: string;
  description?: string;
  color: string;
  type: 'class' | 'exam' | 'assignment' | 'event' | 'personal';
  notionId?: string; // If synced from Notion
}

interface NotionSettings {
  connected: boolean;
  databaseId?: string;
  lastSync?: string;
  apiKey?: string;
}

type ViewMode = 'month' | 'week' | 'list';

// Color options for events
const EVENT_COLORS = [
  { name: 'Gryffindor Red', value: '#ae0001' },
  { name: 'Slytherin Green', value: '#1a472a' },
  { name: 'Ravenclaw Blue', value: '#0e1a40' },
  { name: 'Hufflepuff Yellow', value: '#eeb939' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
];

const EVENT_TYPES = [
  { label: 'Class', value: 'class' },
  { label: 'Exam', value: 'exam' },
  { label: 'Assignment', value: 'assignment' },
  { label: 'Event', value: 'event' },
  { label: 'Personal', value: 'personal' },
];

// Helper functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const getWeekDates = (date: Date): Date[] => {
  const week: Date[] = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    week.push(d);
  }
  return week;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Notion integration state
  const [notionSettings, setNotionSettings] = useState<NotionSettings>({ connected: false });
  const [isNotionModalOpen, setIsNotionModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: formatDate(new Date()),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    color: EVENT_COLORS[0].value,
    type: 'class' as CalendarEvent['type'],
  });

  // Load events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mechowarts_calendar_events');
    if (saved) {
      setEvents(JSON.parse(saved));
    }

    const notionSaved = localStorage.getItem('mechowarts_notion_settings');
    if (notionSaved) {
      setNotionSettings(JSON.parse(notionSaved));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('mechowarts_calendar_events', JSON.stringify(events));
  }, [events]);

  // Navigation
  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Event handlers
  const handleAddEvent = () => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...formData,
    };
    setEvents([...events, newEvent]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...formData } : e));
    setIsViewModalOpen(false);
    setIsEditing(false);
    setSelectedEvent(null);
    resetForm();
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setIsViewModalOpen(false);
    setSelectedEvent(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: formatDate(new Date()),
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      description: '',
      color: EVENT_COLORS[0].value,
      type: 'class',
    });
  };

  const openAddModal = (date?: string) => {
    resetForm();
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
    setIsAddModalOpen(true);
  };

  const openViewModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location || '',
      description: event.description || '',
      color: event.color,
      type: event.type,
    });
    setIsViewModalOpen(true);
    setIsEditing(false);
  };

  // Notion integration (placeholder)
  const connectNotion = () => {
    // In a real implementation, this would redirect to Notion OAuth
    // For now, we'll simulate a connection
    const apiKey = prompt('Enter your Notion Integration Token (for demo):');
    if (apiKey) {
      const newSettings = {
        connected: true,
        apiKey,
        lastSync: new Date().toISOString(),
      };
      setNotionSettings(newSettings);
      localStorage.setItem('mechowarts_notion_settings', JSON.stringify(newSettings));
    }
    setIsNotionModalOpen(false);
  };

  const disconnectNotion = () => {
    setNotionSettings({ connected: false });
    localStorage.removeItem('mechowarts_notion_settings');
  };

  const syncWithNotion = async () => {
    setIsSyncing(true);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setNotionSettings(prev => ({ ...prev, lastSync: new Date().toISOString() }));
    localStorage.setItem('mechowarts_notion_settings', JSON.stringify({
      ...notionSettings,
      lastSync: new Date().toISOString(),
    }));
    setIsSyncing(false);
  };

  // Get events for a specific date
  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => e.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Filter events for list view
  const listViewEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      })
      .slice(0, 50); // Show next 50 events
  }, [events]);

  // Render month view
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const today = new Date();
    const isToday = (day: number) =>
      day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    return (
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(day => (
          <div
            key={day}
            className={`text-center py-2 font-medium text-sm ${isDark ? 'text-amber-400' : 'text-amber-700'
              }`}
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
          const dayEvents = day ? getEventsForDate(dateStr) : [];

          return (
            <div
              key={index}
              onClick={() => day && openAddModal(dateStr)}
              className={`min-h-[100px] p-1 border rounded-lg cursor-pointer transition-all ${day ? 'hover:shadow-lg' : ''
                } ${isDark
                  ? 'border-amber-900/30 hover:border-amber-600/50'
                  : 'border-amber-200 hover:border-amber-400'
                } ${isToday(day!)
                  ? isDark
                    ? 'bg-amber-900/30 ring-2 ring-amber-500'
                    : 'bg-amber-100 ring-2 ring-amber-400'
                  : isDark
                    ? 'bg-stone-800/50'
                    : 'bg-white'
                }`}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${isToday(day)
                    ? 'text-amber-500'
                    : isDark ? 'text-stone-300' : 'text-stone-700'
                    }`}>
                    {day}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        onClick={(e) => { e.stopPropagation(); openViewModal(event); }}
                        className="text-xs px-1.5 py-0.5 rounded truncate text-white cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    const today = formatDate(new Date());

    return (
      <div className="flex flex-col h-[calc(100vh-300px)] overflow-hidden">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b sticky top-0 z-10" style={{
          borderColor: isDark ? 'rgb(120 53 15 / 0.3)' : 'rgb(254 243 199)'
        }}>
          <div className={`p-2 text-center text-sm font-medium ${isDark ? 'bg-stone-800 text-stone-400' : 'bg-amber-50 text-stone-500'
            }`}>
            Time
          </div>
          {weekDates.map((date, i) => {
            const dateStr = formatDate(date);
            const isToday = dateStr === today;
            return (
              <div
                key={i}
                className={`p-2 text-center ${isToday
                  ? isDark ? 'bg-amber-900/30' : 'bg-amber-100'
                  : isDark ? 'bg-stone-800' : 'bg-amber-50'
                  }`}
              >
                <div className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {DAYS[i]}
                </div>
                <div className={`text-lg font-bold ${isToday
                  ? 'text-amber-500'
                  : isDark ? 'text-stone-200' : 'text-stone-700'
                  }`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8">
            {/* Time column */}
            <div className="sticky left-0 z-10">
              {HOURS.map(hour => (
                <div
                  key={hour}
                  className={`h-16 border-b px-2 py-1 text-xs text-right ${isDark
                    ? 'bg-stone-800 border-stone-700 text-stone-400'
                    : 'bg-amber-50 border-amber-100 text-stone-500'
                    }`}
                >
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDates.map((date, dayIndex) => {
              const dateStr = formatDate(date);
              const dayEvents = getEventsForDate(dateStr);
              const isToday = dateStr === today;

              return (
                <div key={dayIndex} className={`relative ${isToday ? isDark ? 'bg-amber-900/10' : 'bg-amber-50/50' : ''
                  }`}>
                  {HOURS.map(hour => (
                    <div
                      key={hour}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          date: dateStr,
                          startTime: `${String(hour).padStart(2, '0')}:00`,
                          endTime: `${String(hour + 1).padStart(2, '0')}:00`,
                        }));
                        setIsAddModalOpen(true);
                      }}
                      className={`h-16 border-b border-l cursor-pointer transition-colors ${isDark
                        ? 'border-stone-700 hover:bg-stone-700/50'
                        : 'border-amber-100 hover:bg-amber-100/50'
                        }`}
                    />
                  ))}

                  {/* Render events */}
                  {dayEvents.map(event => {
                    const [startHour, startMin] = event.startTime.split(':').map(Number);
                    const [endHour, endMin] = event.endTime.split(':').map(Number);
                    const startOffset = startHour * 64 + (startMin / 60) * 64;
                    const duration = ((endHour - startHour) * 60 + (endMin - startMin)) / 60 * 64;

                    return (
                      <div
                        key={event.id}
                        onClick={(e) => { e.stopPropagation(); openViewModal(event); }}
                        className="absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-xs text-white cursor-pointer hover:opacity-90 overflow-hidden"
                        style={{
                          backgroundColor: event.color,
                          top: `${startOffset}px`,
                          height: `${Math.max(duration, 24)}px`,
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        {duration >= 40 && (
                          <div className="opacity-80 truncate">
                            {formatTime(event.startTime)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    if (listViewEvents.length === 0) {
      return (
        <div className={`text-center py-16 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          <FiCalendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No upcoming events</p>
          <p className="text-sm">Click the + button to add an event</p>
        </div>
      );
    }

    // Group events by date
    const groupedEvents: Record<string, CalendarEvent[]> = {};
    listViewEvents.forEach(event => {
      if (!groupedEvents[event.date]) {
        groupedEvents[event.date] = [];
      }
      groupedEvents[event.date].push(event);
    });

    return (
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([dateStr, dateEvents]) => {
          const date = new Date(dateStr);
          const isToday = formatDate(new Date()) === dateStr;
          const isTomorrow = formatDate(new Date(Date.now() + 86400000)) === dateStr;

          let dateLabel = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          });
          if (isToday) dateLabel = `Today, ${dateLabel}`;
          else if (isTomorrow) dateLabel = `Tomorrow, ${dateLabel}`;

          return (
            <div key={dateStr}>
              <h3 className={`text-sm font-semibold mb-3 pb-2 border-b ${isDark
                ? 'text-amber-400 border-amber-900/30'
                : 'text-amber-700 border-amber-200'
                }`}>
                {dateLabel}
              </h3>
              <div className="space-y-2">
                {dateEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => openViewModal(event)}
                    className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${isDark
                      ? 'bg-stone-800/50 hover:bg-stone-800'
                      : 'bg-white hover:bg-amber-50'
                      }`}
                  >
                    <div
                      className="w-1 self-stretch rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                        {event.title}
                      </h4>
                      <div className={`flex items-center gap-4 mt-1 text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'
                        }`}>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3.5 h-3.5" />
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className={`mt-2 text-sm line-clamp-2 ${isDark ? 'text-stone-400' : 'text-stone-500'
                          }`}>
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${isDark ? 'bg-stone-700 text-stone-300' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {event.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Event form component
  const EventForm = () => (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'
          }`}>
          Title *
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Event title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'
            }`}>
            Date *
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'
            }`}>
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as CalendarEvent['type'] })}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${isDark
              ? 'bg-stone-800 border-stone-600 text-stone-100'
              : 'bg-white border-stone-300 text-stone-800'
              }`}
          >
            {EVENT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'
            }`}>
            Start Time *
          </label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'
            }`}>
            End Time *
          </label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'
          }`}>
          Location
        </label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Room 101, Great Hall"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'
          }`}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add notes or details..."
          rows={3}
          className={`w-full px-3 py-2 rounded-lg border transition-colors resize-none ${isDark
            ? 'bg-stone-800 border-stone-600 text-stone-100 placeholder-stone-500'
            : 'bg-white border-stone-300 text-stone-800 placeholder-stone-400'
            }`}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'
          }`}>
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {EVENT_COLORS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: color.value })}
              className={`w-8 h-8 rounded-full transition-transform ${formData.color === color.value ? 'ring-2 ring-offset-2 scale-110' : ''
                } ${isDark ? 'ring-offset-stone-900' : 'ring-offset-white'}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Magical Background */}
      <MagicalBackground />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Home Button */}
              <Link
                to="/"
                className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
                title="Go Home"
              >
                <FiHome className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  📅 Time-Turner Calendar
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Manage your magical schedule
                </p>
              </div>
            </div>

            {/* View controls */}
            <div className="flex items-center gap-2">
              {/* Notion integration button */}
              <button
                onClick={() => setIsNotionModalOpen(true)}
                className={`p-2 rounded-lg transition-colors ${notionSettings.connected
                  ? isDark
                    ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                  : isDark
                    ? 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                    : 'bg-white text-stone-600 hover:bg-stone-100'
                  }`}
                title="Notion Integration"
              >
                <FiLink className="w-5 h-5" />
              </button>

              {/* View mode toggle */}
              <div className={`flex rounded-lg p-1 ${isDark ? 'bg-stone-800' : 'bg-white'
                }`}>
                <button
                  onClick={() => setViewMode('month')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'month'
                    ? isDark
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-500 text-white'
                    : isDark
                      ? 'text-stone-400 hover:text-stone-200'
                      : 'text-stone-600 hover:text-stone-800'
                    }`}
                  title="Month view"
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'week'
                    ? isDark
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-500 text-white'
                    : isDark
                      ? 'text-stone-400 hover:text-stone-200'
                      : 'text-stone-600 hover:text-stone-800'
                    }`}
                  title="Week view"
                >
                  <FiColumns className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                    ? isDark
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-500 text-white'
                    : isDark
                      ? 'text-stone-400 hover:text-stone-200'
                      : 'text-stone-600 hover:text-stone-800'
                    }`}
                  title="List view"
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>

              <Button onClick={() => openAddModal()}>
                <FiPlus className="w-5 h-5 mr-1" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Navigation */}
          {viewMode !== 'list' && (
            <div className={`flex items-center justify-between mb-6 p-4 rounded-xl ${isDark ? 'bg-stone-800/50' : 'bg-white'
              }`}>
              <button
                onClick={navigatePrev}
                className={`p-2 rounded-lg transition-colors ${isDark
                  ? 'hover:bg-stone-700 text-stone-300'
                  : 'hover:bg-amber-100 text-stone-600'
                  }`}
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-stone-100' : 'text-stone-800'
                  }`}>
                  {viewMode === 'month'
                    ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : `Week of ${getWeekDates(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  }
                </h2>
                <button
                  onClick={goToToday}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${isDark
                    ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                >
                  Today
                </button>
              </div>

              <button
                onClick={navigateNext}
                className={`p-2 rounded-lg transition-colors ${isDark
                  ? 'hover:bg-stone-700 text-stone-300'
                  : 'hover:bg-amber-100 text-stone-600'
                  }`}
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Calendar content */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-stone-800/30' : 'bg-white shadow-sm'
            }`}>
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'list' && renderListView()}
          </div>

          {/* Add Event Modal */}
          <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="md" title="Add New Event">
            <ModalBody>
              <EventForm />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent} disabled={!formData.title || !formData.date}>
                Add Event
              </Button>
            </ModalFooter>
          </Modal>

          {/* View/Edit Event Modal */}
          <Modal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); setIsEditing(false); }} size="md" title={isEditing ? 'Edit Event' : selectedEvent?.title}>
            <ModalBody>
              {isEditing ? (
                <EventForm />
              ) : selectedEvent && (
                <div className="space-y-4">
                  <div className={`flex items-center gap-2 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    <FiCalendar className="w-4 h-4" />
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className={`flex items-center gap-2 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    <FiClock className="w-4 h-4" />
                    {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                  </div>
                  {selectedEvent.location && (
                    <div className={`flex items-center gap-2 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      <FiMapPin className="w-4 h-4" />
                      {selectedEvent.location}
                    </div>
                  )}
                  {selectedEvent.description && (
                    <p className={`pt-2 border-t ${isDark ? 'text-stone-400 border-stone-700' : 'text-stone-500 border-stone-200'}`}>
                      {selectedEvent.description}
                    </p>
                  )}
                  <div className={`inline-block text-xs px-2 py-1 rounded-full capitalize ${isDark ? 'bg-stone-700 text-stone-300' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {selectedEvent.type}
                  </div>

                  {/* Edit/Delete buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-stone-200 dark:border-stone-700">
                    <Button variant="ghost" onClick={() => setIsEditing(true)} className="flex-1">
                      <FiEdit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </ModalBody>
            {isEditing && (
              <ModalFooter>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateEvent} disabled={!formData.title || !formData.date}>
                  Save Changes
                </Button>
              </ModalFooter>
            )}
          </Modal>

          {/* Notion Integration Modal */}
          <Modal isOpen={isNotionModalOpen} onClose={() => setIsNotionModalOpen(false)} size="md" title="Notion Integration">
            <ModalBody>
              {notionSettings.connected ? (
                <div className="space-y-4">
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'
                    }`}>
                    <FiCheck className="w-5 h-5" />
                    <span>Connected to Notion</span>
                  </div>

                  {notionSettings.lastSync && (
                    <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      Last synced: {new Date(notionSettings.lastSync).toLocaleString()}
                    </p>
                  )}

                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-amber-50 border-amber-200'
                    }`}>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
                      How it works
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      <li>• Events from your Notion calendar database will appear here</li>
                      <li>• Changes sync automatically every hour</li>
                      <li>• Click sync button to manually refresh</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={syncWithNotion}
                      disabled={isSyncing}
                      className="flex-1"
                    >
                      <FiRefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={disconnectNotion}
                      className="text-red-500 hover:text-red-600"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className={isDark ? 'text-stone-300' : 'text-stone-600'}>
                    Connect your Notion workspace to sync calendar events automatically.
                  </p>

                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-amber-50 border-amber-200'
                    }`}>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
                      Setup Instructions
                    </h4>
                    <ol className={`text-sm space-y-2 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      <li>1. Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline inline-flex items-center gap-1">
                        Notion Integrations <FiExternalLink className="w-3 h-3" />
                      </a></li>
                      <li>2. Create a new integration for MechoWarts</li>
                      <li>3. Copy the Internal Integration Token</li>
                      <li>4. Share your calendar database with the integration</li>
                      <li>5. Paste the token below to connect</li>
                    </ol>
                  </div>

                  <Button onClick={connectNotion} className="w-full">
                    <FiLink className="w-4 h-4 mr-2" />
                    Connect Notion
                  </Button>

                  <p className={`text-xs text-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                    Your token is stored locally and never sent to our servers.
                  </p>
                </div>
              )}
            </ModalBody>
          </Modal>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
