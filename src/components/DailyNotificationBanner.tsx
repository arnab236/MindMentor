import React, { useEffect, useState } from 'react';
import { NotificationItem } from '../types';
import { Bell, Sparkles, X, Check, ArrowRight } from 'lucide-react';

interface DailyNotificationBannerProps {
  onSelectPhilosophy?: (philosophy: string) => void;
}

export const DailyNotificationBanner: React.FC<DailyNotificationBannerProps> = ({ onSelectPhilosophy }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          if (data.notifications) {
            setNotifications(data.notifications);
          }
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const activeNotices = notifications.filter(n => !dismissedIds[n.id]);

  if (activeNotices.length === 0) return null;

  const current = activeNotices[0];

  return (
    <div className="bg-brand-50 text-[#1A1A1A] px-4 py-2 flex items-center justify-between gap-3 text-xs border-b border-brand-100">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B7B7A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B7B7A]"></span>
        </span>
        <div className="p-1 rounded bg-white text-[#5B7B7A] shrink-0 border border-brand-100">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="truncate">
          <span className="font-bold text-[#5B7B7A] mr-2">[{current.title}]</span>
          <span className="text-gray-700">{current.message}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onSelectPhilosophy && current.philosophy && (
          <button
            onClick={() => onSelectPhilosophy(current.philosophy)}
            className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-white bg-[#5B7B7A] hover:bg-[#4A6463] px-2.5 py-1 rounded-md transition-colors"
          >
            <span>Explore {current.philosophy}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
        <button
          onClick={() => setDismissedIds(prev => ({ ...prev, [current.id]: true }))}
          className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-brand-100/50 transition-colors"
          title="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
