import { NotificationService } from "@/core/aplication/notification.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { NotificationApiRepository } from "@/infraestructure/repositories/notification.api";
import type {
  Notification,
  NotificationsBody,
  NotificationStatus,
} from "@/core/domain/entity/notification.entity";

const notificationRepository = new NotificationApiRepository(APIFetcher);
const notificationService = new NotificationService(notificationRepository);

export async function getAllNotifications(
  page = 1,
  limit = 10,
  status?: NotificationStatus,
  type?: string
): Promise<NotificationsBody> {
  return await notificationService.getAllNotifications(
    page,
    limit,
    status,
    type
  );
}

export async function getNotificationById(id: string): Promise<Notification> {
  return await notificationService.getNotificationById(id);
}

export async function markNotificationAsRead(
  id: string
): Promise<Notification> {
  return await notificationService.markAsRead(id);
}

export async function markNotificationAsDismissed(
  id: string
): Promise<Notification> {
  return await notificationService.markAsDismissed(id);
}

export async function markNotificationAsArchived(
  id: string
): Promise<Notification> {
  return await notificationService.markAsArchived(id);
}

export async function deleteNotification(id: string): Promise<void> {
  return await notificationService.deleteNotification(id);
}
