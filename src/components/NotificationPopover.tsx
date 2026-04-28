"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, Check, Calendar, Info, AlertCircle, MessageSquare } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'appointment' | 'system' | 'message';
  read: boolean;
}

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Appointment Request",
      message: "Dr. Rajan has a new booking for April 30th.",
      time: "2 mins ago",
      type: "appointment",
      read: false
    },
    {
      id: "2",
      title: "Profile Verified",
      message: "Your professional profile has been verified by MediCare.",
      time: "1 hour ago",
      type: "system",
      read: false
    },
    {
      id: "3",
      title: "System Update",
      message: "Check out the new schedule management features!",
      time: "5 hours ago",
      type: "system",
      read: true
    }
  ]);

  const popoverRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full border transition-all duration-200 ${
          isOpen ? "bg-primary/10 border-primary text-primary" : "border-gray-100 hover:bg-gray-50 text-gray-600 shadow-sm"
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 z-[100] animate-in slide-in-from-top-2 duration-200">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-t-[1.5rem]">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <p className="text-sm text-gray-500">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors flex gap-4 cursor-pointer relative ${!notif.read ? "bg-blue-50/30" : ""}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    {!notif.read && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"></div>}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === 'appointment' ? 'bg-blue-50 text-blue-500' : 
                      notif.type === 'message' ? 'bg-green-50 text-green-500' : 'bg-purple-50 text-purple-500'
                    }`}>
                      {notif.type === 'appointment' ? <Calendar size={18} /> : 
                       notif.type === 'message' ? <MessageSquare size={18} /> : <Info size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold ${notif.read ? "text-gray-900" : "text-primary"}`}>{notif.title}</h4>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-50 text-center">
            <button className="text-xs font-bold text-gray-500 hover:text-primary transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
