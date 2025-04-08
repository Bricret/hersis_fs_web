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

interface UserActionsProps {
  user: User;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  onToggleStatus: (user: User) => void;
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
          onClick={() => onResetPassword(user)}
          className="focus:bg-blue-50 focus:text-blue-700 cursor-pointer"
        >
          <Lock className="mr-2 h-4 w-4 text-blue-600" />
          Restablecer contraseña
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onToggleStatus(user)}
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
        <DropdownMenuSeparator className="bg-blue-100" />
        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className="focus:bg-red-50 focus:text-red-700 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          Eliminar usuario
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
