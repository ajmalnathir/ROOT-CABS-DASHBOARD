import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CheckCircle, User } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Mock drivers list to simulate activity
const mockDrivers = [
  { id: 'RC001', name: 'Rajesh' },
  { id: 'RC002', name: 'Amit' },
  { id: 'RC003', name: 'Suresh' },
  { id: 'RC004', name: 'Vikram' },
  { id: 'RC005', name: 'Arjun' }
];

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Unread count
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  // Simulate driver activity: add a new notification every 12-20 seconds
  useEffect(() => {
    const makeNotification = () => {
      const driver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
      const id = `${driver.id}-${Date.now()}`;
      setNotifications(prev => [
        {
          id,
          title: 'Driver Active',
          message: `${driver.name} (${driver.id}) is now active and ready for rides`,
          timestamp: new Date(),
          read: false
        },
        ...prev
      ].slice(0, 20)); // keep latest 20
    };

    // first one shortly after mount so users see it
    const firstTimer = setTimeout(makeNotification, 3000);
    // subsequent random intervals
    let interval = setInterval(makeNotification, 15000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    return `${h}h ago`;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        className={`relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${
          unreadCount > 0 ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''
        }`}
        aria-label="Notifications"
        onClick={() => setOpen(o => !o)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] leading-5 text-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
            <div className="text-sm font-medium text-gray-900">Notifications</div>
            <button
              className="text-xs text-orange-600 hover:text-orange-700"
              onClick={markAllRead}
            >
              Mark all as read
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No notifications</div>
          ) : (
            <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-3 flex items-start space-x-3 ${n.read ? 'bg-white' : 'bg-orange-50'}`}
                  onMouseEnter={() => markRead(n.id)}
                >
                  <div className={`mt-0.5 w-8 h-8 rounded-md flex items-center justify-center ${n.read ? 'bg-gray-100' : 'bg-orange-100'}`}>
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-600 truncate">{n.message}</p>
                    <div className="mt-1 text-[10px] text-gray-400">{timeAgo(n.timestamp)}</div>
                  </div>
                  {!n.read && <CheckCircle className="w-4 h-4 text-green-500" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
