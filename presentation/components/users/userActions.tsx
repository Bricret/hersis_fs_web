import { Usuario } from "@/infraestructure/interface/users/user.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Check, Lock, MoreHorizontal, Trash2, UserCog, X } from "lucide-react";

interface UserActionsProps {
  user: Usuario;
  onDelete: (user: Usuario) => void;
  onResetPassword: (user: Usuario) => void;
  onToggleStatus: (user: Usuario) => void;
}

export function UserActions({
  user,
  onDelete,
  onResetPassword,
  onToggleStatus,
}: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserCog className="mr-2 h-4 w-4" />
          Editar usuario
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onResetPassword(user)}>
          <Lock className="mr-2 h-4 w-4" />
          Restablecer contraseña
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleStatus(user)}>
          {user.estado === "activo" ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Desactivar usuario
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Activar usuario
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(user)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar usuario
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
