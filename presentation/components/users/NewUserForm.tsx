"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { roles } from "@/infraestructure/interface/users/rols.interface";
import {
  inititalRegisterUser,
  RegisterUserForm,
} from "@/infraestructure/interface/users/RegisterUserForm.interface";

const sucursales = [
  {
    id: 1,
    nombre: "Sucursal 1",
  },
  {
    id: 2,
    nombre: "Sucursal 2",
  },
  {
    id: 3,
    nombre: "Sucursal 3",
  },
];

// Componente para el formulario de nuevo usuario
export default function NuevoUsuarioForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] =
    useState<RegisterUserForm>(inititalRegisterUser);

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
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.rol ||
      !formData.sucursal
    ) {
      toast("Error en el formulario", {
        description: "Por favor complete todos los campos obligatorios",
      });
      return;
    }
    // Si se seleccionó generar contraseña, mostramos un mensaje adicional
    if (formData.generatePassword) {
      toast("Contraseña generada", {
        description: "Se ha enviado un correo con las credenciales de acceso",
      });
      const passwordGenerated = `${formData.username}${new Date()
        .getTime()
        .toString()
        .slice(2, 6)}`;
      console.log({ password: passwordGenerated });
    } else {
      //TODO: Enviar contraseña al backend
      console.log("se esta imprimiendo esto");
      console.log(formData.password);
    }

    // onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ingrese el nombre"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Ingrese el usuario"
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
                <SelectItem key={sucursal.id} value={sucursal.nombre}>
                  {sucursal.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="generatePassword"
          checked={formData.generatePassword}
          onCheckedChange={(checked) =>
            handleChange("generatePassword", checked)
          }
        />
        <Label htmlFor="generatePassword">
          Generar contraseña automáticamente y enviar por correo
        </Label>
      </div>

      {!formData.generatePassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Ingrese la contraseña"
            required={!formData.generatePassword}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
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
