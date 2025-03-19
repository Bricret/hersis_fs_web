import { Usuario } from "@/infraestructure/interface/users/user.interface";
import { TableCell, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserActions } from "./userActions";
import { Badge } from "../ui/badge";
import { Store } from "lucide-react";

interface UserTableRowProps {
  user: Usuario;
  onDelete: (user: Usuario) => void;
  onResetPassword: (user: Usuario) => void;
  onToggleStatus: (user: Usuario) => void;
}

export function UserTableRow({
  user,
  onDelete,
  onResetPassword,
  onToggleStatus,
}: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user.avatar}
              alt={`${user.nombre} ${user.apellido}`}
            />
            <AvatarFallback>
              {user.nombre.charAt(0)}
              {user.apellido.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {user.nombre} {user.apellido}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{user.rol}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-muted-foreground" />
          <span>{user.sucursal}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge variant={user.estado === "activo" ? "success" : "alert"}>
            {user.estado === "activo" ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>{user.ultimoAcceso}</TableCell>
      <TableCell className="text-right">
        <UserActions
          user={user}
          onDelete={onDelete}
          onResetPassword={onResetPassword}
          onToggleStatus={onToggleStatus}
        />
      </TableCell>
    </TableRow>
  );
}
