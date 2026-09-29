import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const getDefaultNotificationsForRole = (role) => {
  if (role === 'admin') {
    return [
      {
        id: 'adm_1',
        title: 'New Rental Pending Approval',
        message: 'Order RN-2026-849102 submitted by customer Priya Sharma is awaiting operational verification.',
        time: '10 mins ago',
        read: false,
        type: 'info',
      },
      {
        id: 'adm_2',
        title: 'AI Demand Alert',
        message: 'Cooling fleet (Air Conditioners & Coolers) projected +28% demand spike for upcoming season.',
        time: '1 hour ago',
        read: false,
        type: 'ai',
      },
      {
        id: 'adm_3',
        title: 'Safety Stock Warning',
        message: 'LG Double Door Refrigerator fleet reached minimum safety buffer in Indiranagar warehouse.',
        time: '4 hours ago',
        read: true,
        type: 'warning',
      }
    ];
  }

  if (role === 'support') {
    return [
      {
        id: 'sup_1',
        title: 'New Support Ticket #1049',
        message: 'Customer submitted installation inquiry for Voltas 1.5 Ton Split AC.',
        time: '20 mins ago',
        read: false,
        type: 'info',
      },
      {
        id: 'sup_2',
        title: 'Complaint Escalation',
        message: 'Customer complaint CMP-2026-081 assigned for technician dispatch.',
        time: '2 hours ago',
        read: false,
        type: 'warning',
      },
      {
        id: 'sup_3',
        title: 'Review Moderation Pending',
        message: 'A new 5-star customer review for Samsung Front Load Washing Machine awaits moderation.',
        time: '5 hours ago',
        read: true,
        type: 'success',
      }
    ];
  }

  // Customer or Guest
  return [
    {
      id: 'cust_1',
      title: 'Rental Active',
      message: 'Your appliance subscription is active and covered with free replacement & maintenance.',
      time: '15 mins ago',
      read: false,
      type: 'success',
    },
    {
      id: 'cust_2',
      title: 'Payment Confirmed',
      message: 'Monthly subscription payment verified. Ref: TXN-APX-0801.',
      time: '2 hours ago',
      read: false,
      type: 'info',
    },
    {
      id: 'cust_3',
      title: 'AI Home Insights',
      message: 'New smart home bundles recommended to optimize your energy efficiency.',
      time: '1 day ago',
      read: true,
      type: 'ai',
    }
  ];
};

export const NotificationProvider = ({ children }) => {
  const { user, role } = useAuth();

  const getNotifKey = () => {
    if (!user) return 'applinex_notifications_guest';
    return `applinex_notifications_${user.role}_${user.id}`;
  };

  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Sync notifications whenever user / role changes
  useEffect(() => {
    const key = getNotifKey();
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        const defaults = getDefaultNotificationsForRole(role);
        setNotifications(defaults);
        localStorage.setItem(key, JSON.stringify(defaults));
      }
    } catch {
      setNotifications(getDefaultNotificationsForRole(role));
    }
  }, [user?.id, role]);

  // Persist notifications to active user key
  const saveNotifications = (updated) => {
    setNotifications(updated);
    try {
      localStorage.setItem(getNotifKey(), JSON.stringify(updated));
    } catch {}
  };

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: 'Just now',
      read: false,
      type,
    };
    saveNotifications([newNotif, ...notifications]);
    addToast(title, type);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
