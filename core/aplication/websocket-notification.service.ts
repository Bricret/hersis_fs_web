import { WebSocketAdapter } from "@/infraestructure/adapters/websocket.adapter";
import { Notification } from "@/core/domain/entity/notification.entity";

export interface WebSocketNotificationService {
  connect(): Promise<void>;
  disconnect(): void;
  subscribeToNotifications(
    callback: (notification: Notification) => void
  ): void;
  unsubscribeFromNotifications(
    callback: (notification: Notification) => void
  ): void;
  isConnected(): boolean;
}

export class SocketIONotificationService
  implements WebSocketNotificationService
{
  private websocketAdapter: WebSocketAdapter;
  private notificationCallbacks: Set<(notification: Notification) => void> =
    new Set();

  constructor(websocketAdapter: WebSocketAdapter) {
    this.websocketAdapter = websocketAdapter;
    this.setupNotificationListener();
  }

  private setupNotificationListener(): void {
    this.websocketAdapter.on("notification", (data: Notification) => {
      console.log("Nueva notificación recibida:", data);
      this.notificationCallbacks.forEach((callback) => callback(data));
    });
  }

  async connect(): Promise<void> {
    try {
      await this.websocketAdapter.connect();
      console.log("Servicio de notificaciones WebSocket conectado");
    } catch (error) {
      console.error("Error al conectar el servicio de notificaciones:", error);
      throw error;
    }
  }

  disconnect(): void {
    this.websocketAdapter.disconnect();
    console.log("Servicio de notificaciones WebSocket desconectado");
  }

  subscribeToNotifications(
    callback: (notification: Notification) => void
  ): void {
    this.notificationCallbacks.add(callback);
  }

  unsubscribeFromNotifications(
    callback: (notification: Notification) => void
  ): void {
    this.notificationCallbacks.delete(callback);
  }

  isConnected(): boolean {
    return this.websocketAdapter.isConnected();
  }
}
