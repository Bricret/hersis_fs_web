import { Usuario } from "@/infraestructure/interface/users/user.interface";

// Hook para las acciones de usuarios
export function useUserActions() {
  const handleToggleStatus = (user: Usuario) => {
    // Lógica para cambiar estado
  };

  const handleDeleteUser = (user: Usuario) => {
    // Lógica para eliminar
  };

  const handleResetPassword = (user: Usuario) => {
    // Lógica para resetear contraseña
  };

  return {
    handleToggleStatus,
    handleDeleteUser,
    handleResetPassword,
  };
}
