import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { NotificationService } from "@/core/aplication/notification.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { NotificationApiRepository } from "@/infraestructure/repositories/notification.api";
import type {
  Notification,
  NotificationsBody,
  NotificationStatus,
  NotificationType,
} from "@/core/domain/entity/notification.entity";

const notificationRepository = new NotificationApiRepository(APIFetcher);
const notificationService = new NotificationService(notificationRepository);

const ITEMS_PER_PAGE = 10;

export function useNotifications({
  initialNotifications,
}: {
  initialNotifications?: NotificationsBody;
} = {}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<
    NotificationStatus | "all"
  >("all");
  const [selectedType, setSelectedType] = useState<NotificationType | "all">(
    "all"
  );

  const {
    data: serverNotifications,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications", currentPage, selectedStatus, selectedType],
    queryFn: async () => {
      const response = await notificationService.getAllNotifications(
        currentPage,
        ITEMS_PER_PAGE,
        selectedStatus === "all" ? undefined : selectedStatus,
        selectedType === "all" ? undefined : selectedType
      );
      return response;
    },
    staleTime: 30000, // 30 seconds
    initialData: initialNotifications,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: true,
  });

  // Extract notifications array and metadata
  const notifications = serverNotifications?.notifications || [];
  const total = serverNotifications?.total || 0;
  const limit = serverNotifications?.limit || ITEMS_PER_PAGE;
  const offset = serverNotifications?.offset || 0;

  // Mutation for marking notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string): Promise<Notification> =>
      await notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error al marcar como leída:", error);
      throw new Error("Error al marcar la notificación como leída");
    },
  });

  // Mutation for marking notification as dismissed
  const markAsDismissedMutation = useMutation({
    mutationFn: async (id: string): Promise<Notification> =>
      await notificationService.markAsDismissed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error al descartar notificación:", error);
      throw new Error("Error al descartar la notificación");
    },
  });

  // Mutation for marking notification as archived
  const markAsArchivedMutation = useMutation({
    mutationFn: async (id: string): Promise<Notification> =>
      await notificationService.markAsArchived(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error al archivar notificación:", error);
      throw new Error("Error al archivar la notificación");
    },
  });

  // Mutation for deleting notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) =>
      await notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error al eliminar notificación:", error);
      throw new Error("Error al eliminar la notificación");
    },
  });

  // Handlers for filter changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    queryClient.invalidateQueries({
      queryKey: ["notifications", page, selectedStatus, selectedType],
    });
  };

  const handleStatusChange = (status: NotificationStatus | "all") => {
    setSelectedStatus(status);
    setCurrentPage(1);
    queryClient.invalidateQueries({
      queryKey: ["notifications", 1, status, selectedType],
    });
  };

  const handleTypeChange = (type: NotificationType | "all") => {
    setSelectedType(type);
    setCurrentPage(1);
    queryClient.invalidateQueries({
      queryKey: ["notifications", 1, selectedStatus, type],
    });
  };

  // Calculate pagination info
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Get unread count
  const unreadCount = notifications.filter(
    (notification) => notification.status === "unread"
  ).length;

  return {
    // Data and state
    notifications: isLoading ? [] : notifications,
    total,
    unreadCount,
    isLoading,
    error,
    refetch,

    // Pagination
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setCurrentPage: handlePageChange,

    // Filters
    selectedStatus,
    setSelectedStatus: handleStatusChange,
    selectedType,
    setSelectedType: handleTypeChange,

    // Actions
    markAsRead: markAsReadMutation.mutate,
    markAsDismissed: markAsDismissedMutation.mutate,
    markAsArchived: markAsArchivedMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,

    // Mutation states
    isMarkingAsRead: markAsReadMutation.isPending,
    isDismissing: markAsDismissedMutation.isPending,
    isArchiving: markAsArchivedMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
  };
}
