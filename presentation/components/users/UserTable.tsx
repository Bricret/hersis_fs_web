import { Usuario } from "@/infraestructure/interface/users/user.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { UserTableRow } from "./UserTableRow";

interface UserTableProps {
  users: Usuario[];
  onDeleteUser: (user: Usuario) => void;
  onResetPassword: (user: Usuario) => void;
  onToggleStatus: (user: Usuario) => void;
}

export function UserTable({
  users,
  onDeleteUser,
  onResetPassword,
  onToggleStatus,
}: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Sucursal</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Último acceso</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No se encontraron usuarios
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onDelete={onDeleteUser}
              onResetPassword={onResetPassword}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}
