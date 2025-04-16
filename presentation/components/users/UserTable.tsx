import { User } from "@/core/domain/entity/user.entity";
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
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  // Asegurarnos de que users sea un array
  const validUsers = Array.isArray(users) ? users : [];

  return (
    <div className="rounded-lg border border-blue-100 bg-white shadow-sm">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="bg-tertiary-background-color hover:bg-tertiary-background-color/90">
            <TableHead className="text-border-strong font-semibold">
              Usuario
            </TableHead>
            <TableHead className="text-border-strong font-semibold">
              Rol
            </TableHead>
            <TableHead className="text-border-strong font-semibold">
              Sucursal
            </TableHead>
            <TableHead className="text-border-strong font-semibold">
              Estado
            </TableHead>
            <TableHead className="text-border-strong font-semibold">
              Último acceso
            </TableHead>
            <TableHead className="text-border-strong font-semibold text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validUsers.length === 0 ? (
            <TableRow className="hover:bg-blue-50/30">
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No se encontraron usuarios
              </TableCell>
            </TableRow>
          ) : (
            validUsers.map((user, index) => (
              <UserTableRow key={user.id} user={user} index={index} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
