"use client";

import type React from "react";

import { useState } from "react";
import {
  Check,
  Filter,
  Lock,
  MoreHorizontal,
  Search,
  Store,
  Trash2,
  UserCog,
  UserPlus,
  X,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/components/ui/avatar";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Switch } from "@/presentation/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/presentation/components/ui/alert-dialog";
import { toast } from "sonner";
import { Header } from "@/presentation/components/common/Header";
// Tipos de datos
type Usuario = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  sucursal: string;
  estado: "activo" | "inactivo";
  ultimoAcceso: string;
  avatar?: string;
};

// Datos de ejemplo
const usuariosData: Usuario[] = [
  {
    id: "USR001",
    nombre: "María",
    apellido: "García",
    email: "maria.garcia@pharmasys.com",
    rol: "Administrador",
    sucursal: "Sucursal Principal",
    estado: "activo",
    ultimoAcceso: "2025-03-15 10:30",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR002",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@pharmasys.com",
    rol: "Vendedor",
    sucursal: "Sucursal Norte",
    estado: "activo",
    ultimoAcceso: "2025-03-16 09:15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR003",
    nombre: "Ana",
    apellido: "Martínez",
    email: "ana.martinez@pharmasys.com",
    rol: "Farmacéutico",
    sucursal: "Sucursal Principal",
    estado: "activo",
    ultimoAcceso: "2025-03-16 14:45",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR004",
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos.rodriguez@pharmasys.com",
    rol: "Vendedor",
    sucursal: "Sucursal Sur",
    estado: "inactivo",
    ultimoAcceso: "2025-03-10 11:20",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR005",
    nombre: "Laura",
    apellido: "Sánchez",
    email: "laura.sanchez@pharmasys.com",
    rol: "Inventario",
    sucursal: "Sucursal Principal",
    estado: "activo",
    ultimoAcceso: "2025-03-15 16:30",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR006",
    nombre: "Roberto",
    apellido: "Gómez",
    email: "roberto.gomez@pharmasys.com",
    rol: "Administrador",
    sucursal: "Sucursal Norte",
    estado: "activo",
    ultimoAcceso: "2025-03-16 08:45",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR007",
    nombre: "Patricia",
    apellido: "López",
    email: "patricia.lopez@pharmasys.com",
    rol: "Farmacéutico",
    sucursal: "Sucursal Sur",
    estado: "inactivo",
    ultimoAcceso: "2025-03-01 10:15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR008",
    nombre: "Miguel",
    apellido: "Torres",
    email: "miguel.torres@pharmasys.com",
    rol: "Vendedor",
    sucursal: "Sucursal Principal",
    estado: "activo",
    ultimoAcceso: "2025-03-16 12:30",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

// Datos para selectores
const roles = [
  "Administrador",
  "Farmacéutico",
  "Vendedor",
  "Inventario",
  "Contador",
];

const sucursales = ["Sucursal Principal", "Sucursal Norte", "Sucursal Sur"];

// Componente para el formulario de nuevo usuario
function NuevoUsuarioForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rol: "",
    sucursal: "",
    generarPassword: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.email ||
      !formData.rol ||
      !formData.sucursal
    ) {
      toast("Error en el formulario", {
        description: "Por favor complete todos los campos obligatorios",
      });
      return;
    }

    // Simulamos la creación del usuario
    toast("Usuario creado", {
      description: `${formData.nombre} ${formData.apellido} ha sido registrado correctamente`,
    });

    // Si se seleccionó generar contraseña, mostramos un mensaje adicional
    if (formData.generarPassword) {
      toast("Contraseña generada", {
        description: "Se ha enviado un correo con las credenciales de acceso",
      });
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            placeholder="Ingrese el nombre"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
            placeholder="Ingrese el apellido"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="correo@ejemplo.com"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rol">Rol</Label>
          <Select
            value={formData.rol}
            onValueChange={(value) => handleChange("rol", value)}
            required
          >
            <SelectTrigger id="rol">
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((rol) => (
                <SelectItem key={rol} value={rol}>
                  {rol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sucursal">Sucursal</Label>
          <Select
            value={formData.sucursal}
            onValueChange={(value) => handleChange("sucursal", value)}
            required
          >
            <SelectTrigger id="sucursal">
              <SelectValue placeholder="Seleccione una sucursal" />
            </SelectTrigger>
            <SelectContent>
              {sucursales.map((sucursal) => (
                <SelectItem key={sucursal} value={sucursal}>
                  {sucursal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="generarPassword"
          checked={formData.generarPassword}
          onCheckedChange={(checked) =>
            handleChange("generarPassword", checked)
          }
        />
        <Label htmlFor="generarPassword">
          Generar contraseña automáticamente y enviar por correo
        </Label>
      </div>

      {!formData.generarPassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Ingrese la contraseña"
            required={!formData.generarPassword}
          />
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Guardar usuario</Button>
      </DialogFooter>
    </form>
  );
}

// Componente principal
export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [userToResetPassword, setUserToResetPassword] =
    useState<Usuario | null>(null);

  // Filtrar usuarios según búsqueda y pestaña seleccionada
  const filteredUsers = usuariosData.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.sucursal.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTab === "todos") return matchesSearch;
    if (selectedTab === "activos")
      return matchesSearch && user.estado === "activo";
    if (selectedTab === "inactivos")
      return matchesSearch && user.estado === "inactivo";

    return matchesSearch;
  });

  // Manejar cambio de estado de usuario
  const handleToggleStatus = (user: Usuario) => {
    toast(`Usuario ${user.estado === "activo" ? "desactivado" : "activado"}`, {
      description: `${user.nombre} ${user.apellido} ha sido ${
        user.estado === "activo" ? "desactivado" : "activado"
      } correctamente`,
    });
  };

  // Manejar eliminación de usuario
  const handleDeleteUser = () => {
    if (!userToDelete) return;

    toast("Usuario eliminado", {
      description: `${userToDelete.nombre} ${userToDelete.apellido} ha sido eliminado correctamente`,
    });

    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  // Manejar reseteo de contraseña
  const handleResetPassword = () => {
    if (!userToResetPassword) return;

    toast("Contraseña restablecida", {
      description: `Se ha enviado un correo a ${userToResetPassword.email} con las instrucciones para restablecer la contraseña`,
    });

    setShowResetPasswordDialog(false);
    setUserToResetPassword(null);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-muted">
      <Header title="Usuarios" subTitle="Gestione los usuarios del sistema" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar usuarios..."
                    className="pl-8 md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Rol: Administrador</DropdownMenuItem>
                    <DropdownMenuItem>Rol: Farmacéutico</DropdownMenuItem>
                    <DropdownMenuItem>Rol: Vendedor</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Sucursal Principal</DropdownMenuItem>
                    <DropdownMenuItem>Sucursal Norte</DropdownMenuItem>
                    <DropdownMenuItem>Sucursal Sur</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-1">
                      <UserPlus className="h-4 w-4" />
                      Agregar Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Nuevo Usuario</DialogTitle>
                      <DialogDescription>
                        Complete el formulario para registrar un nuevo usuario
                        en el sistema
                      </DialogDescription>
                    </DialogHeader>
                    <NuevoUsuarioForm
                      onClose={() =>
                        document
                          .querySelector<HTMLButtonElement>(
                            '[data-state="closed"]'
                          )
                          ?.click()
                      }
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
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
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
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
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
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
                          <Badge
                            variant={
                              user.estado === "activo" ? "success" : "secondary"
                            }
                          >
                            {user.estado === "activo" ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{user.ultimoAcceso}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setUserToResetPassword(user);
                                  setShowResetPasswordDialog(true);
                                }}
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                Restablecer contraseña
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(user)}
                              >
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
                                onClick={() => {
                                  setUserToDelete(user);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar usuario
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Diálogo de confirmación para eliminar usuario */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario{" "}
              {userToDelete?.nombre} {userToDelete?.apellido}. Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación para restablecer contraseña */}
      <AlertDialog
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restablecer contraseña</AlertDialogTitle>
            <AlertDialogDescription>
              Se enviará un correo electrónico a {userToResetPassword?.email}{" "}
              con instrucciones para restablecer la contraseña. ¿Desea
              continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>
              Enviar correo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
