import { TableCell, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserActions } from "./userActions";
import { Badge } from "../ui/badge";
import { Store } from "lucide-react";
import { User } from "@/core/domain/entity/user.entity";
import { format, parse } from "@formkit/tempo";

interface UserTableRowProps {
  user: User;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  onToggleStatus: (user: User) => void;
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
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{user.role}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-muted-foreground" />
          <span>{user.branch}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge variant={user.isActive === true ? "success" : "alert"}>
            {user.isActive === true ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        {format(new Date(user.lastLogin), { date: "full", time: "short" })}
      </TableCell>
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
