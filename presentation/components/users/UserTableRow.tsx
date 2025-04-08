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
  index: number;
}

export function UserTableRow({
  user,
  onDelete,
  onResetPassword,
  onToggleStatus,
  index,
}: UserTableRowProps) {
  return (
    <TableRow
      className={`hover:bg-blue-50/30 transition-colors ${
        index % 2 === 0 ? "bg-white" : "bg-blue-50/10"
      }`}
    >
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Avatar className="border-2 border-blue-100">
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-800">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-blue-50 border-blue-200">
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          <span className="text-gray-700">{user.branch}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge
            variant={user.isActive === true ? "success" : "alert"}
            className={
              user.isActive === true
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }
          >
            {user.isActive === true ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-gray-600">
        {user.lastLogin
          ? format(new Date(user.lastLogin), { date: "full", time: "short" })
          : "Nunca ha iniciado sesión"}
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
