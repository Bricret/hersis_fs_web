"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  Notification,
  NotificationStatus,
} from "@/core/domain/entity/notification.entity";
import { useWebSocketNotifications } from "@/presentation/hooks/notifications/useWebSocketNotifications";
import { usePushNotifications } from "@/presentation/hooks/notifications/usePushNotifications";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAsDismissed: (id: string) => void;
  markAsArchived: (id: string) => void;
  clearAll: () => void;
  isWebSocketConnected: boolean;
  requestPushPermission: () => Promise<void>;
  pushPermission: NotificationPermission;
  isPushSupported: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const {
    isConnected: isWebSocketConnected,
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
  } = useWebSocketNotifications({
    onNotificationReceived: handleNewNotification,
    autoConnect: false,
  });

  const {
    permission: pushPermission,
    isSupported: isPushSupported,
    requestPermission: requestPushPermission,
    showNotification,
  } = usePushNotifications();

  // Función para manejar nuevas notificaciones recibidas
  function handleNewNotification(notification: Notification) {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Mostrar notificación push si está habilitada
    if (pushPermission === "granted") {
      showNotification(notification.title, {
        body: notification.message,
        icon: "/onlylogo.png",
        badge: "/onlylogo.png",
        tag: `notification-${notification.id}`,
        data: {
          route: getNotificationRoute(notification),
          type: notification.type,
          id: notification.id,
        },
      });
    }

    // Mostrar toast de notificación
    toast.success(`Nueva notificación: ${notification.title}`, {
      description: notification.message,
      duration: 5000,
    });
  }

  // Función para obtener la ruta de navegación basada en el tipo de notificación
  function getNotificationRoute(notification: Notification): string {
    switch (notification.type) {
      case "low_stock":
      case "expiration_warning":
      case "inventory_alert":
        return "/inventory";
      case "sale_reminder":
        return "/transactions";
      case "system_alert":
        return "/notifications";
      default:
        return "/notifications";
    }
  }

  // Función para agregar una notificación manualmente
  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (notification.status === NotificationStatus.UNREAD) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  // Función para marcar como leída
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: NotificationStatus.READ } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Función para marcar como descartada
  const markAsDismissed = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: NotificationStatus.DISMISSED } : n
        )
      );
      if (
        notifications.find((n) => n.id === id)?.status ===
        NotificationStatus.UNREAD
      ) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    },
    [notifications]
  );

  // Función para marcar como archivada
  const markAsArchived = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: NotificationStatus.ARCHIVED } : n
        )
      );
      if (
        notifications.find((n) => n.id === id)?.status ===
        NotificationStatus.UNREAD
      ) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    },
    [notifications]
  );

  // Función para limpiar todas las notificaciones
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Función para solicitar permiso de notificaciones push
  const handleRequestPushPermission = useCallback(async () => {
    try {
      await requestPushPermission();
      toast.success("Permiso de notificaciones concedido");
    } catch (error) {
      toast.error("Error al solicitar permiso de notificaciones");
    }
  }, [requestPushPermission]);

  // Efecto para conectar WebSocket cuando el componente se monta
  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  // Efecto para actualizar el contador de no leídas
  useEffect(() => {
    const count = notifications.filter(
      (n) => n.status === NotificationStatus.UNREAD
    ).length;
    setUnreadCount(count);
  }, [notifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAsDismissed,
    markAsArchived,
    clearAll,
    isWebSocketConnected,
    requestPushPermission: handleRequestPushPermission,
    pushPermission,
    isPushSupported,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext debe ser usado dentro de NotificationProvider"
    );
  }
  return context;
}
