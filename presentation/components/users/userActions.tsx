import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Check, Lock, MoreHorizontal, UserCog, X } from "lucide-react";
import { User } from "@/core/domain/entity/user.entity";
import { toast } from "sonner";
import { useUsers } from "@/presentation/hooks/user/useUsers";
import { useState } from "react";
import { EditUserDialog } from "./EditUserDialog";

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const { disableUser, resetPassword } = useUsers();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSwitchStatusUser = () => {
    try {
      disableUser(user.id);
      toast.success("Usuario desactivado correctamente");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(`Error al desactivar el usuario: ${error.message}`);
      } else {
        toast.error("Error al desactivar el usuario: Error desconocido");
      }
    }
  };

  const handleResetPassword = () => {
    resetPassword(user.id, {
      onSuccess: (data) => {
        navigator.clipboard.writeText(data.newPassword);
        toast.success("Contraseña restablecida y copiada al portapapeles");
      },
      onError: (error) => {
        console.error(error);
        if (error instanceof Error) {
          toast.error(`Error al restablecer la contraseña: ${error.message}`);
        } else {
          toast.error("Error al restablecer la contraseña: Error desconocido");
        }
      },
    });
  };

  const handleEditUser = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 border-blue-100 shadow-md"
        >
          <DropdownMenuLabel className="text-blue-800 font-medium">
            Acciones
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-blue-100" />
          <DropdownMenuItem
            onClick={handleEditUser}
            className="focus:bg-blue-50 focus:text-blue-700 cursor-pointer"
          >
            <UserCog className="mr-2 h-4 w-4 text-blue-600" />
            Editar usuario
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleResetPassword}
            className="focus:bg-blue-50 focus:text-blue-700 cursor-pointer"
          >
            <Lock className="mr-2 h-4 w-4 text-blue-600" />
            Restablecer contraseña
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSwitchStatusUser()}
            className="focus:bg-blue-50 focus:text-blue-700 cursor-pointer"
          >
            {user.isActive ? (
              <>
                <X className="mr-2 h-4 w-4 text-red-500" />
                Desactivar usuario
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Activar usuario
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        user={user}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
}
