import { Header } from "@/presentation/components/common/Header";
import { getAllNotifications } from "@/presentation/services/server/notification.server";
import { NotificationStatus } from "@/core/domain/entity/notification.entity";
import { NotificationsClientContent } from "./components";

interface NotificationPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    type?: string;
  }>;
}

export default async function NotificationPage({
  searchParams,
}: NotificationPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status as NotificationStatus | undefined;
  const type = params.type;

  try {
    const notificationsData = await getAllNotifications(
      page,
      20, // limit
      status,
      type
    );

    return (
      <div className="flex flex-col flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <Header
          title="Notificaciones"
          subTitle="Gestione y monitoree todas las notificaciones del sistema"
        />

        <NotificationsClientContent
          initialData={notificationsData}
          currentPage={page}
          selectedStatus={status || "all"}
          selectedType={type || "all"}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);

    return (
      <div className="flex flex-col flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <Header
          title="Notificaciones"
          subTitle="Gestione y monitoree todas las notificaciones del sistema"
        />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error al cargar notificaciones
            </h3>
            <p className="text-gray-600">
              Hubo un problema al cargar las notificaciones. Por favor,
              inténtelo de nuevo.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
