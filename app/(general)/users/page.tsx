import { Header } from "@/presentation/components/common/Header";
import { UserList } from "@/presentation/components/users/UserList";
import { getUsers } from "@/presentation/services/server/users.server";
import { RouteGuard } from "@/presentation/components/common/RouteGuard";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <RouteGuard requiredRole="admin">
      <div className="flex flex-col flex-1 overflow-hidden bg-white">
        <Header title="Usuarios" subTitle="Gestione los usuarios del sistema" />

        <div className="flex flex-col flex-1 overflow-hidden">
          <UserList Users={users} />
        </div>
      </div>
    </RouteGuard>
  );
}
