import type {
  Notification,
  NotificationsBody,
  NotificationStatus,
} from "../entity/notification.entity";

export interface INotificationRepository {
  getAllNotifications(
    page?: number,
    limit?: number,
    status?: NotificationStatus,
    type?: string
  ): Promise<NotificationsBody>;

  getNotificationById(id: string): Promise<Notification>;

  markAsRead(id: string): Promise<Notification>;

  markAsDismissed(id: string): Promise<Notification>;

  markAsArchived(id: string): Promise<Notification>;

  deleteNotification(id: string): Promise<void>;
}
