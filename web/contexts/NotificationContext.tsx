import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: "order" | "promo" | "system";
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  hasPermission: boolean;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  requestPermissions: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_STORAGE_KEY = "@notifications";
const PERMISSIONS_STORAGE_KEY = "@notification_permissions";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    loadNotifications();
    checkPermissions();
    setupNotificationListeners();
  }, []);

  useEffect(() => {
    saveNotifications();
    updateBadgeCount();
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erreur chargement notifications:", error);
    }
  };

  const saveNotifications = async () => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error("Erreur sauvegarde notifications:", error);
    }
  };

  const checkPermissions = async () => {
    try {
      const stored = await AsyncStorage.getItem(PERMISSIONS_STORAGE_KEY);
      if (stored) {
        setHasPermission(JSON.parse(stored));
      } else {
        const { status } = await Notifications.getPermissionsAsync();
        const granted = status === "granted";
        setHasPermission(granted);
        await AsyncStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(granted));
      }
    } catch (error) {
      console.error("Erreur vérification permissions:", error);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (!Device.isDevice) {
        console.warn("Les notifications push ne fonctionnent que sur un appareil physique");
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const granted = finalStatus === "granted";
      setHasPermission(granted);
      await AsyncStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(granted));

      return granted;
    } catch (error) {
      console.error("Erreur demande permissions:", error);
      return false;
    }
  };

  const setupNotificationListeners = () => {
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      const newNotif: Notification = {
        id: Date.now().toString(),
        title: notification.request.content.title || "Notification",
        body: notification.request.content.body || "",
        timestamp: Date.now(),
        read: false,
        type: "system",
      };
      addNotification(newNotif);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  };

  const addNotification = (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateBadgeCount = async () => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    try {
      await Notifications.setBadgeCountAsync(unreadCount);
    } catch (error) {
      console.error("Erreur mise à jour badge:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    hasPermission,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    requestPermissions,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
