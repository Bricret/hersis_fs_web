import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Check, Lock, MoreHorizontal, UserCog, X, Trash2 } from "lucide-react";
import { User } from "@/core/domain/entity/user.entity";
import { toast } from "sonner";
import { useUsers } from "@/presentation/hooks/user/useUsers";
import { useState } from "react";
import Banner from "../common/Banner";

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const { disableUser, resetPassword } = useUsers();
  const [showBanner, setShowBanner] = useState(false);
  const [newPassword, setNewPassword] = useState("");

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
        setNewPassword(data.newPassword);
        setShowBanner(true);
        toast.success("Contraseña restablecida correctamente");
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

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    toast.success("Contraseña copiada al portapapeles");
  };

  return (
    <>
      {showBanner && (
        <Banner
          title="Contraseña restablecida"
          description="La contraseña ha sido restablecida correctamente. Por favor, copie la nueva contraseña y compártala con el usuario de forma segura."
          buttonText="Copiar contraseña"
          buttonAction={handleCopyPassword}
        />
      )}
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
          <DropdownMenuItem className="focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
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
    </>
  );
}
