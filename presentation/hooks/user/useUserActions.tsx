import { User } from "@/core/domain/entity/user.entity";
import { useUsersFetch } from "./useUsersFetch";
import { toast } from "sonner";
import { UserSchema } from "@/infraestructure/schema/users.schema";

// Hook para las acciones de usuarios
export function useUserActions() {
  const { updateUser, deleteUser, createUser, isLoading } = useUsersFetch();

  const handleToggleStatus = async (user: User) => {
    try {
      await updateUser({ ...user, isActive: !user.isActive });
      toast.success("Estado del usuario actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el estado del usuario");
      throw error;
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await deleteUser(user);
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el usuario");
      throw error;
    }
  };

  const handleResetPassword = async (user: User) => {
    try {
      // Aquí implementarías la lógica específica para resetear la contraseña
      // Por ejemplo, llamar a un endpoint específico
      toast.success("Contraseña reseteada correctamente");
    } catch (error) {
      toast.error("Error al resetear la contraseña");
      throw error;
    }
  };

  return {
    handleToggleStatus,
    handleDeleteUser,
    handleResetPassword,
    isLoading,
  };
}
