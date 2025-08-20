"use server";

import { NotificationService } from "@/core/aplication/notification.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { NotificationApiRepository } from "@/infraestructure/repositories/notification.api";
import type {
  Notification,
  NotificationsBody,
  NotificationStatus,
} from "@/core/domain/entity/notification.entity";
import { revalidatePath } from "next/cache";

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

export async function deleteNotification(id: string): Promise<void> {
  return await notificationService.deleteNotification(id);
}

// Nuevos métodos para verificar stock bajo y productos próximos a vencer
export async function checkLowStock(): Promise<void> {
  return await notificationService.checkLowStock();
}

export async function checkExpiring(): Promise<void> {
  return await notificationService.checkExpiring();
}

// Función que ejecuta ambos endpoints y revalida la ruta de notificaciones
export async function refreshNotifications(): Promise<void> {
  try {
    // Ejecutar ambos endpoints en paralelo
    await Promise.all([
      notificationService.checkLowStock(),
      notificationService.checkExpiring(),
    ]);

    // Revalidar la ruta de notificaciones para mostrar las nuevas notificaciones
    revalidatePath("/notifications");
  } catch (error) {
    console.error("Error al refrescar notificaciones:", error);
    throw error;
  }
}

export async function getNewNotifications() {}
