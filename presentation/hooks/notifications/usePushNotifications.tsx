import { useState, useEffect, useCallback } from "react";
import { BrowserPushNotificationService } from "@/core/aplication/push-notification.service";

export function usePushNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const [service] = useState(() => new BrowserPushNotificationService());

  useEffect(() => {
    setIsSupported(service.isSupported());
    setPermission(service.getPermission());
  }, [service]);

  const requestPermission = useCallback(async () => {
    try {
      const newPermission = await service.requestPermission();
      setPermission(newPermission);
      return newPermission;
    } catch (error) {
      console.error("Error al solicitar permiso:", error);
      throw error;
    }
  }, [service]);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission === "granted") {
        service.showNotification(title, options);
      } else {
        console.warn("Permiso de notificaciones no concedido");
      }
    },
    [service, permission]
  );

  const showLowStockNotification = useCallback(
    (productName: string, currentStock: number) => {
      if (permission === "granted") {
        service.showLowStockNotification(productName, currentStock);
      }
    },
    [service, permission]
  );

  const showExpirationNotification = useCallback(
    (productName: string, expirationDate: string) => {
      if (permission === "granted") {
        service.showExpirationNotification(productName, expirationDate);
      }
    },
    [service, permission]
  );

  const showSaleNotification = useCallback(
    (amount: number, location: string) => {
      if (permission === "granted") {
        service.showSaleNotification(amount, location);
      }
    },
    [service, permission]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showLowStockNotification,
    showExpirationNotification,
    showSaleNotification,
  };
}
