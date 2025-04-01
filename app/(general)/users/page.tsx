import { Header } from "@/presentation/components/common/Header";
import { UserList } from "@/presentation/hooks/user/UserList";
import { getUsers } from "@/presentation/services/server/users.server";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header title="Usuarios" subTitle="Gestione los usuarios del sistema" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <UserList Users={users} />
      </div>
    </div>
  );
}
