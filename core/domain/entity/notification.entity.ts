export enum NotificationType {
  LOW_STOCK = "low_stock",
  EXPIRATION_WARNING = "expiration_warning",
  SALE_REMINDER = "sale_reminder",
  SYSTEM_ALERT = "system_alert",
  INVENTORY_ALERT = "inventory_alert",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum NotificationStatus {
  UNREAD = "unread",
  READ = "read",
  DISMISSED = "dismissed",
  ARCHIVED = "archived",
}

export interface NotificationsBody {
  notifications: Notification[];
  total: number;
  limit: number;
  offset: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  metadata: Metadata;
  entity_type?: string | null;
  entity_id?: string | null;
  user_id?: string | null;
  branch_id?: string | null;
  expires_at?: Date | null;
  is_active?: boolean | null;
  created_at: Date;
  updated_at: Date;
}

export enum EntityType {
  Product = "product",
}

export interface Metadata {
  product_name: string;
  expiration_date?: Date;
  days_until_expiration?: number;
  min_stock?: number;
  current_stock?: number;
}

export enum Priority {
  Critical = "critical",
  High = "high",
  Medium = "medium",
}

export enum Status {
  Unread = "unread",
}

export enum Title {
  ProductoPróximoAVencer = "Producto próximo a vencer",
  ProductoVencido = "Producto vencido",
  StockBajo = "Stock Bajo",
}

export enum Type {
  ExpirationWarning = "expiration_warning",
  LowStock = "low_stock",
}
