import type { INotificationRepository } from "../domain/repository/notification.repository";
import type {
  Notification,
  NotificationsBody,
  NotificationStatus,
} from "../domain/entity/notification.entity";

export class NotificationService {
  constructor(private readonly repository: INotificationRepository) {}

  async getAllNotifications(
    page = 1,
    limit = 10,
    status?: NotificationStatus,
    type?: string
  ): Promise<NotificationsBody> {
    try {
      const notifications = await this.repository.getAllNotifications(
        page,
        limit,
        status,
        type
      );
      return notifications;
    } catch (error) {
      console.error("Error en NotificationService.getAllNotifications:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener las notificaciones: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener las notificaciones");
    }
  }

  async getNotificationById(id: string): Promise<Notification> {
    try {
      const notification = await this.repository.getNotificationById(id);
      return notification;
    } catch (error) {
      console.error("Error en NotificationService.getNotificationById:", error);
      if (error instanceof Error) {
        throw new Error(`Error al obtener la notificación: ${error.message}`);
      }
      throw new Error("Error desconocido al obtener la notificación");
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      const notification = await this.repository.markAsRead(id);
      return notification;
    } catch (error) {
      console.error("Error en NotificationService.markAsRead:", error);
      if (error instanceof Error) {
        throw new Error(`Error al marcar como leída: ${error.message}`);
      }
      throw new Error("Error desconocido al marcar como leída");
    }
  }

  async markAsDismissed(id: string): Promise<Notification> {
    try {
      const notification = await this.repository.markAsDismissed(id);
      return notification;
    } catch (error) {
      console.error("Error en NotificationService.markAsDismissed:", error);
      if (error instanceof Error) {
        throw new Error(`Error al descartar notificación: ${error.message}`);
      }
      throw new Error("Error desconocido al descartar notificación");
    }
  }

  async markAsArchived(id: string): Promise<Notification> {
    try {
      const notification = await this.repository.markAsArchived(id);
      return notification;
    } catch (error) {
      console.error("Error en NotificationService.markAsArchived:", error);
      if (error instanceof Error) {
        throw new Error(`Error al archivar notificación: ${error.message}`);
      }
      throw new Error("Error desconocido al archivar notificación");
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await this.repository.deleteNotification(id);
    } catch (error) {
      console.error("Error en NotificationService.deleteNotification:", error);
      if (error instanceof Error) {
        throw new Error(`Error al eliminar la notificación: ${error.message}`);
      }
      throw new Error("Error desconocido al eliminar la notificación");
    }
  }
}
