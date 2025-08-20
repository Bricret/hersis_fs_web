"use client";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import {
  BellIcon,
  Settings,
  Wifi,
  WifiOff,
  CheckCircle,
  Archive,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotificationContext } from "@/presentation/providers/NotificationProvider";
import { formatTime } from "@/presentation/components/common/NotificationPopover.utils";

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationPopover() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsDismissed,
    markAsArchived,
    clearAll,
    isWebSocketConnected,
    requestPushPermission,
    pushPermission,
    isPushSupported,
  } = useNotificationContext();

  const handleMarkAllAsRead = () => {
    notifications
      .filter((n) => n.status === "unread")
      .forEach((n) => markAsRead(n.id));
  };

  const handleNotificationClick = (notification: any) => {
    // Marcar como leída si no lo está
    if (notification.status === "unread") {
      markAsRead(notification.id);
    }

    // Navegar a la ruta correspondiente
    const route = getNotificationRoute(notification);
    if (route) {
      router.push(route);
    }
  };

  const getNotificationRoute = (notification: any) => {
    switch (notification.type) {
      case "low_stock":
      case "expiration_warning":
      case "inventory_alert":
        return "/inventory";
      case "sale_reminder":
        return "/transactions";
      case "system_alert":
        return "/notifications";
      default:
        return "/notifications";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return "📦";
      case "expiration_warning":
        return "⏰";
      case "sale_reminder":
        return "💰";
      case "system_alert":
        return "⚠️";
      case "inventory_alert":
        return "🔔";
      default:
        return "📢";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-blue-600";
      case "low":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="relative"
          aria-label="Abrir notificaciones"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          {/* Indicador de estado de WebSocket */}
          <div className="absolute -bottom-1 -right-1">
            {isWebSocketConnected ? (
              <Wifi className="w-3 h-3 text-green-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-500" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-1 max-h-[80vh] overflow-y-auto">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notificaciones</div>
          <div className="flex items-center gap-2">
            {isPushSupported && pushPermission !== "granted" && (
              <Button
                size="sm"
                variant="outline"
                onClick={requestPushPermission}
                className="h-6 px-2 text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                Activar Push
              </Button>
            )}
            {unreadCount > 0 && (
              <button
                className="text-xs font-medium hover:underline"
                onClick={handleMarkAllAsRead}
              >
                Marcar todo como leído
              </button>
            )}
          </div>
        </div>

        {/* Estado de conexión WebSocket */}
        <div className="px-3 py-1">
          <div
            className={`text-xs flex items-center gap-1 ${
              isWebSocketConnected ? "text-green-600" : "text-red-600"
            }`}
          >
            {isWebSocketConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                Conectado en tiempo real
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                Desconectado
              </>
            )}
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>

        {notifications.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No hay notificaciones
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors ${
                  notification.status === "unread" ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="relative flex items-start pe-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <span
                        className={`text-xs font-medium ${getPriorityColor(
                          notification.priority
                        )}`}
                      >
                        {notification.priority}
                      </span>
                    </div>

                    <button
                      className="text-foreground/80 text-left after:absolute after:inset-0 w-full"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="font-medium text-foreground hover:underline mb-1">
                        {notification.title}
                      </div>
                      <div className="text-muted-foreground text-xs line-clamp-2">
                        {notification.message}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {formatTime(notification.created_at)}
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    {notification.status === "unread" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsDismissed(notification.id)}
                      className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-700"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsArchived(notification.id)}
                      className="h-6 w-6 p-0 text-gray-600 hover:text-gray-700"
                    >
                      <Archive className="w-3 h-3" />
                    </Button>
                  </div>

                  {notification.status === "unread" && (
                    <div className="absolute end-0 self-center">
                      <span className="sr-only">No leída</span>
                      <Dot className="text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {notifications.length > 10 && (
              <div className="px-3 py-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/notifications")}
                  className="w-full"
                >
                  Ver todas las notificaciones
                </Button>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
