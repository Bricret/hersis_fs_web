import { useUsersFetch } from "@/presentation/hooks/user/useUsersFetch";
import type { User } from "@/core/domain/entity/user.entity";

export function UsersList() {
  const { users, isLoading, error, createUser, updateUser, deleteUser } =
    useUsersFetch();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los usuarios</div>;

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <div>
        {users?.map((user: User) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <button onClick={() => deleteUser(user)} type="button">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
