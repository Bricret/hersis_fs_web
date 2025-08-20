export interface PushNotificationService {
  requestPermission(): Promise<NotificationPermission>;
  showNotification(title: string, options?: NotificationOptions): void;
  isSupported(): boolean;
  getPermission(): NotificationPermission;
}

export class BrowserPushNotificationService implements PushNotificationService {
  isSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator;
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) {
      return "denied";
    }
    return Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error(
        "Las notificaciones push no están soportadas en este navegador"
      );
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Error al solicitar permiso de notificaciones:", error);
      throw error;
    }
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if (!this.isSupported()) {
      console.warn("Las notificaciones push no están soportadas");
      return;
    }

    if (Notification.permission !== "granted") {
      console.warn("Permiso de notificaciones no concedido");
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: "/onlylogo.png", // Logo de la aplicación
        badge: "/onlylogo.png",
        tag: "hersis-notification",
        requireInteraction: false,
        silent: false,
        ...options,
      });

      // Manejar clic en la notificación
      notification.onclick = () => {
        window.focus();
        notification.close();

        // Aquí puedes agregar lógica para navegar a la página correspondiente
        if (options?.data?.route) {
          window.location.href = options.data.route;
        }
      };

      // Auto-cerrar la notificación después de 5 segundos
      setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (error) {
      console.error("Error al mostrar notificación:", error);
    }
  }

  // Método para mostrar notificación de stock bajo
  showLowStockNotification(productName: string, currentStock: number): void {
    this.showNotification("Stock Bajo", {
      body: `El producto ${productName} tiene stock bajo (${currentStock} unidades)`,
      icon: "/onlylogo.png",
      badge: "/onlylogo.png",
      tag: "low-stock",
      data: {
        route: "/inventory",
        type: "low-stock",
      },
    });
  }

  // Método para mostrar notificación de expiración
  showExpirationNotification(
    productName: string,
    expirationDate: string
  ): void {
    this.showNotification("Producto Próximo a Vencer", {
      body: `El producto ${productName} vence el ${expirationDate}`,
      icon: "/onlylogo.png",
      badge: "/onlylogo.png",
      tag: "expiration",
      data: {
        route: "/inventory",
        type: "expiration",
      },
    });
  }

  // Método para mostrar notificación de venta
  showSaleNotification(amount: number, location: string): void {
    this.showNotification("Venta Realizada", {
      body: `Venta de $${amount} en ${location}`,
      icon: "/onlylogo.png",
      badge: "/onlylogo.png",
      tag: "sale",
      data: {
        route: "/transactions",
        type: "sale",
      },
    });
  }
}
