import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Rental Active',
      message: 'Your Samsung Smart Refrigerator rental (RN-2024-000123) is currently active.',
      time: '15 mins ago',
      read: false,
      type: 'success',
    },
    {
      id: 2,
      title: 'Payment Confirmed',
      message: 'Payment of ₹2,698 was verified. Transaction ref: TXN-APX-0801.',
      time: '2 hours ago',
      read: false,
      type: 'info',
    },
    {
      id: 3,
      title: 'AI Smart Insights',
      message: 'New complementary recommendation available based on your cooling preferences.',
      time: '1 day ago',
      read: true,
      type: 'ai',
    }
  ]);

  const [toasts, setToasts] = useState([]);

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
    setNotifications((prev) => [newNotif, ...prev]);
    addToast(title, type);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
