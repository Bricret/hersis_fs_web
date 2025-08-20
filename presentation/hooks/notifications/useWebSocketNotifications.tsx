import { useEffect, useRef, useCallback } from "react";
import { SocketIONotificationService } from "@/core/aplication/websocket-notification.service";
import { SocketIOAdapter } from "@/infraestructure/adapters/websocket.adapter";
import { Notification } from "@/core/domain/entity/notification.entity";
import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";
import { WEBSOCKET_CONFIG } from "@/infraestructure/config/websocket.config";
import Cookies from "js-cookie";

interface UseWebSocketNotificationsOptions {
  onNotificationReceived?: (notification: Notification) => void;
  autoConnect?: boolean;
}

export function useWebSocketNotifications(
  options: UseWebSocketNotificationsOptions = {}
) {
  const { onNotificationReceived, autoConnect = true } = options;
  const { getUserAuth } = useAuthFetch();
  const serviceRef = useRef<SocketIONotificationService | null>(null);
  const isConnectingRef = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para obtener la URL del WebSocket desde la configuración
  const getWebSocketUrl = () => {
    return WEBSOCKET_CONFIG.SERVER_URL;
  };

  // Función para obtener el token desde las cookies
  const getAuthToken = (): string | undefined => {
    return Cookies.get("token");
  };

  // Función para conectar al WebSocket
  const connect = useCallback(async () => {
    if (isConnectingRef.current || serviceRef.current?.isConnected()) {
      return;
    }

    try {
      isConnectingRef.current = true;
      const token = getAuthToken();

      if (!token) {
        console.warn("No hay token de autenticación disponible");
        return;
      }

      const websocketAdapter = new SocketIOAdapter(getWebSocketUrl(), token);
      const notificationService = new SocketIONotificationService(
        websocketAdapter
      );

      serviceRef.current = notificationService;

      await notificationService.connect();

      // Suscribirse a las notificaciones
      if (onNotificationReceived) {
        notificationService.subscribeToNotifications(onNotificationReceived);
      }

      console.log("WebSocket de notificaciones conectado exitosamente");
    } catch (error) {
      console.error("Error al conectar WebSocket de notificaciones:", error);

      // Programar reconexión automática
      if (WEBSOCKET_CONFIG.RECONNECTION.ENABLED) {
        scheduleReconnect();
      }
    } finally {
      isConnectingRef.current = false;
    }
  }, [onNotificationReceived]);

  // Función para programar reconexión
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      if (!serviceRef.current?.isConnected()) {
        console.log("Intentando reconexión automática...");
        connect();
      }
    }, WEBSOCKET_CONFIG.RECONNECTION.DELAY);
  }, [connect]);

  // Función para desconectar
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (serviceRef.current) {
      serviceRef.current.disconnect();
      serviceRef.current = null;
    }
  }, []);

  // Función para reconectar manualmente
  const reconnect = useCallback(async () => {
    try {
      disconnect();
      await connect();
    } catch (error) {
      console.error("Error en reconexión manual:", error);
      throw error;
    }
  }, [connect, disconnect]);

  // Función para suscribirse a notificaciones
  const subscribeToNotifications = useCallback(
    (callback: (notification: Notification) => void) => {
      if (serviceRef.current) {
        serviceRef.current.subscribeToNotifications(callback);
      }
    },
    []
  );

  // Función para desuscribirse de notificaciones
  const unsubscribeFromNotifications = useCallback(
    (callback: (notification: Notification) => void) => {
      if (serviceRef.current) {
        serviceRef.current.unsubscribeFromNotifications(callback);
      }
    },
    []
  );

  // Efecto para conectar automáticamente
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup al desmontar
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Efecto para manejar cambios en la autenticación
  useEffect(() => {
    const token = getAuthToken();
    if (token && !serviceRef.current?.isConnected()) {
      connect();
    } else if (!token && serviceRef.current?.isConnected()) {
      disconnect();
    }
  }, [connect, disconnect]);

  // Efecto para limpiar timeout de reconexión
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    connect,
    disconnect,
    reconnect,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    isConnected: serviceRef.current?.isConnected() || false,
  };
}
