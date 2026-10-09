import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Notification } from '@skillbridge/shared';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  unreadNotifCount: number;
  refreshNotifications: () => Promise<void>;
  markNotifRead: (id: string) => Promise<void>;
  markAllNotifsRead: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect();
      setSocket(null);
      setNotifications([]);
      return;
    }

    refreshNotifications();

    const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_user', user.id);
    });

    newSocket.on('new_notification', (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id]);

  const markNotifRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotifsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadNotifCount,
        refreshNotifications,
        markNotifRead,
        markAllNotifsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
