"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  Archive,
  Filter,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Calendar,
  Package,
  ShoppingCart,
  AlertCircle,
  Info,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationsBody,
} from "@/core/domain/entity/notification.entity";
import {
  markNotificationAsRead,
  markNotificationAsDismissed,
  markNotificationAsArchived,
  deleteNotification,
} from "@/presentation/services/server/notification.server";
import { toast } from "sonner";
import { useNotificationContext } from "@/presentation/providers/NotificationProvider";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.LOW_STOCK:
      return <Package className="w-4 h-4" />;
    case NotificationType.EXPIRATION_WARNING:
      return <Calendar className="w-4 h-4" />;
    case NotificationType.SALE_REMINDER:
      return <ShoppingCart className="w-4 h-4" />;
    case NotificationType.SYSTEM_ALERT:
      return <AlertCircle className="w-4 h-4" />;
    case NotificationType.INVENTORY_ALERT:
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case NotificationPriority.CRITICAL:
      return "destructive";
    case NotificationPriority.HIGH:
      return "alert";
    case NotificationPriority.MEDIUM:
      return "default";
    case NotificationPriority.LOW:
      return "secondary";
    default:
      return "outline";
  }
};

const getPriorityLabel = (priority: NotificationPriority) => {
  switch (priority) {
    case NotificationPriority.CRITICAL:
      return "Crítica";
    case NotificationPriority.HIGH:
      return "Alta";
    case NotificationPriority.MEDIUM:
      return "Media";
    case NotificationPriority.LOW:
      return "Baja";
    default:
      return "Sin prioridad";
  }
};

const getTypeLabel = (type: NotificationType) => {
  switch (type) {
    case NotificationType.LOW_STOCK:
      return "Stock Bajo";
    case NotificationType.EXPIRATION_WARNING:
      return "Próximo a Vencer";
    case NotificationType.SALE_REMINDER:
      return "Recordatorio de Venta";
    case NotificationType.SYSTEM_ALERT:
      return "Alerta del Sistema";
    case NotificationType.INVENTORY_ALERT:
      return "Alerta de Inventario";
    default:
      return "Notificación";
  }
};

const getStatusIcon = (status: NotificationStatus) => {
  switch (status) {
    case NotificationStatus.UNREAD:
      return <Eye className="w-4 h-4" />;
    case NotificationStatus.READ:
      return <EyeOff className="w-4 h-4" />;
    case NotificationStatus.DISMISSED:
      return <CheckCircle className="w-4 h-4" />;
    case NotificationStatus.ARCHIVED:
      return <Archive className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) {
    return `hace ${minutes} min`;
  } else if (hours < 24) {
    return `hace ${hours}h`;
  } else {
    return `hace ${days}d`;
  }
};

interface NotificationsClientContentProps {
  initialData: NotificationsBody;
  currentPage: number;
  selectedStatus: string;
  selectedType: string;
}

export function NotificationsClientContent({
  initialData,
  currentPage,
  selectedStatus: initialStatus,
  selectedType: initialType,
}: NotificationsClientContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isWebSocketConnected,
    requestPushPermission,
    pushPermission,
    isPushSupported,
  } = useNotificationContext();

  const [notifications, setNotifications] = useState(initialData.notifications);
  const [selectedPriority, setSelectedPriority] = useState<
    NotificationPriority | "all"
  >("all");
  const [isLoading, setIsLoading] = useState(false);

  // Get notification counts by status
  const notificationCounts = useMemo(() => {
    return {
      total: initialData.total,
      unread: notifications.filter(
        (n) => n.status === NotificationStatus.UNREAD
      ).length,
      read: notifications.filter((n) => n.status === NotificationStatus.READ)
        .length,
      dismissed: notifications.filter(
        (n) => n.status === NotificationStatus.DISMISSED
      ).length,
      archived: notifications.filter(
        (n) => n.status === NotificationStatus.ARCHIVED
      ).length,
    };
  }, [notifications, initialData.total]);

  // Filter notifications based on selected filters
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const typeMatch =
        initialType === "all" || notification.type === initialType;
      const priorityMatch =
        selectedPriority === "all" ||
        notification.priority === selectedPriority;
      const statusMatch =
        initialStatus === "all" || notification.status === initialStatus;

      return typeMatch && priorityMatch && statusMatch;
    });
  }, [notifications, initialType, selectedPriority, initialStatus]);

  // Update URL parameters
  const updateUrlParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === "all" || value === "" || value === "1") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    router.push(newUrl);
  };

  // Action handlers
  const handleMarkAsRead = async (id: string) => {
    try {
      setIsLoading(true);
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: NotificationStatus.READ } : n
        )
      );
      toast.success("Notificación marcada como leída");
    } catch (error) {
      toast.error("Error al marcar como leída");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      setIsLoading(true);
      await markNotificationAsDismissed(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: NotificationStatus.DISMISSED } : n
        )
      );
      toast.success("Notificación descartada");
    } catch (error) {
      toast.error("Error al descartar notificación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      setIsLoading(true);
      await markNotificationAsArchived(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: NotificationStatus.ARCHIVED } : n
        )
      );
      toast.success("Notificación archivada");
    } catch (error) {
      toast.error("Error al archivar notificación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsLoading(true);
      const unreadNotifications = notifications.filter(
        (n) => n.status === NotificationStatus.UNREAD
      );

      // Execute all mark as read operations
      await Promise.all(
        unreadNotifications.map((n) => markNotificationAsRead(n.id))
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.status === NotificationStatus.UNREAD
            ? { ...n, status: NotificationStatus.READ }
            : n
        )
      );
      toast.success("Todas las notificaciones marcadas como leídas");
    } catch (error) {
      toast.error("Error al marcar todas como leídas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    router.refresh();
    toast.success("Notificaciones actualizadas");
  };

  const handleStatusChange = (status: string) => {
    updateUrlParams({ status, page: "1" });
  };

  const handleTypeChange = (type: string) => {
    updateUrlParams({ type, page: "1" });
  };

  const handlePageChange = (page: number) => {
    updateUrlParams({ page: page.toString() });
  };

  // Función para solicitar permiso de notificaciones push
  const handleRequestPushPermission = async () => {
    try {
      await requestPushPermission();
      toast.success("Permiso de notificaciones push concedido");
    } catch (error) {
      toast.error("Error al solicitar permiso de notificaciones push");
    }
  };

  // Pagination info
  const totalPages = Math.ceil(initialData.total / initialData.limit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Main Dashboard Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* WebSocket Status Card - Left Side */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {isWebSocketConnected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              Estado de Conexión
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 ${
                    isWebSocketConnected ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isWebSocketConnected ? (
                    <>
                      <Wifi className="w-4 h-4" />
                      <span className="font-medium">Conectado</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4" />
                      <span className="font-medium">Desconectado</span>
                    </>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {isWebSocketConnected
                    ? "Recibiendo notificaciones en tiempo real"
                    : "No se pueden recibir notificaciones en tiempo real"}
                </span>
              </div>

              {isPushSupported && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Notificaciones Push:{" "}
                    {pushPermission === "granted"
                      ? "Activadas"
                      : "Desactivadas"}
                  </span>
                  {pushPermission !== "granted" && (
                    <Button
                      onClick={handleRequestPushPermission}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Activar Push
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards - Right Side */}
        <div className="grid grid-cols-3 gap-4 flex-1">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-blue-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-blue-800">
                  {notificationCounts.total}
                </p>
                <Bell className="h-6 w-6 text-blue-500 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-red-600 mb-1">
                  Sin Leer
                </p>
                <p className="text-2xl font-bold text-red-800">
                  {notificationCounts.unread}
                </p>
                <Eye className="h-6 w-6 text-red-500 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-green-600 mb-1">
                  Leídas
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {notificationCounts.read}
                </p>
                <EyeOff className="h-6 w-6 text-green-500 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros y Acciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={initialType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {Object.values(NotificationType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Prioridad</label>
                <Select
                  value={selectedPriority}
                  onValueChange={(value) =>
                    setSelectedPriority(value as NotificationPriority | "all")
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {Object.values(NotificationPriority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {getPriorityLabel(priority)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={initialStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value={NotificationStatus.UNREAD}>
                      Sin leer
                    </SelectItem>
                    <SelectItem value={NotificationStatus.READ}>
                      Leídas
                    </SelectItem>
                    <SelectItem value={NotificationStatus.DISMISSED}>
                      Descartadas
                    </SelectItem>
                    <SelectItem value={NotificationStatus.ARCHIVED}>
                      Archivadas
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurar Tipos
              </Button>

              {notificationCounts.unread > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="default"
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <CheckCircle className="w-4 h-4" />
                  Marcar Todo como Leído
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="py-12">
              <div className="text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-gray-500">
                  No se encontraron notificaciones con los filtros seleccionados
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all duration-200 hover:shadow-md border-l-4 ${
                notification.status === NotificationStatus.UNREAD
                  ? "border-l-blue-500 bg-blue-50/30"
                  : "border-l-gray-200 bg-white"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        notification.priority === NotificationPriority.CRITICAL
                          ? "bg-red-100 text-red-600"
                          : notification.priority === NotificationPriority.HIGH
                          ? "bg-orange-100 text-orange-600"
                          : notification.priority ===
                            NotificationPriority.MEDIUM
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <Badge
                          variant={
                            getPriorityColor(notification.priority) as any
                          }
                        >
                          {getPriorityLabel(notification.priority)}
                        </Badge>
                        <Badge variant="outline">
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(notification.created_at)}
                        </span>

                        {notification.entity_type && (
                          <span>• {notification.entity_type}</span>
                        )}

                        <span className="flex items-center gap-1">
                          {getStatusIcon(notification.status)}
                          {notification.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {notification.status === NotificationStatus.UNREAD && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(notification.id)}
                      className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700"
                      disabled={isLoading}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArchive(notification.id)}
                      className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {initialData.total > 10 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Mostrando {initialData.offset + 1} -{" "}
              {Math.min(
                initialData.offset + initialData.limit,
                initialData.total
              )}{" "}
              de {initialData.total} notificaciones
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevPage}
              className="gap-2"
            >
              ← Anterior
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;

                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="gap-2"
            >
              Siguiente →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
