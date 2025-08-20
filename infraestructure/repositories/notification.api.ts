import type { INotificationRepository } from "@/core/domain/repository/notification.repository";
import type { HttpAdapter } from "../adapters/http/http.adapter";
import type {
  Notification,
  NotificationsBody,
  NotificationStatus,
} from "@/core/domain/entity/notification.entity";
import Cookies from "js-cookie";

export class NotificationApiRepository implements INotificationRepository {
  constructor(private readonly http: HttpAdapter) {}

  private getToken(): string {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    return token;
  }

  async getAllNotifications(
    page = 1,
    limit = 10,
    status?: NotificationStatus,
    type?: string
  ): Promise<NotificationsBody> {
    const params = new URLSearchParams({
      offset: ((page - 1) * limit).toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    if (type) {
      params.append("type", type);
    }

    const response = await this.http.get<NotificationsBody>(
      `/notifications?${params.toString()}`
    );
    return response;
  }

  async getNotificationById(id: string): Promise<Notification> {
    const response = await this.http.get<Notification>(`/notifications/${id}`);
    return response;
  }

  async markAsRead(id: string): Promise<Notification> {
    const response = await this.http.patch<Notification>(
      `/notifications/${id}/read`,
      {}
    );
    return response;
  }

  async markAsDismissed(id: string): Promise<Notification> {
    const token = this.getToken();
    const response = await this.http.patch<Notification>(
      `/notifications/${id}/dismiss`,
      { Authorization: `Bearer ${token}` }
    );
    return response;
  }

  async markAsArchived(id: string): Promise<Notification> {
    const token = this.getToken();
    const response = await this.http.patch<Notification>(
      `/notifications/${id}/archive`,
      { Authorization: `Bearer ${token}` }
    );
    return response;
  }

  async deleteNotification(id: string): Promise<void> {
    await this.http.delete<void>(`/notifications/${id}`, {});
  }

  // Nuevos métodos para verificar stock bajo y productos próximos a vencer
  async checkLowStock(): Promise<void> {
    await this.http.post<void>(`/notifications/check-low-stock`, {});
  }

  async checkExpiring(): Promise<void> {
    await this.http.post<void>(`/notifications/check-expiring`, {});
  }
}
