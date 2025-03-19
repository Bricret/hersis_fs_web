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
import { sucursales } from "@/core/data/users/users";
import { Switch } from "../ui/switch";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { roles } from "@/infraestructure/interface/users/rols.interface";

// Componente para el formulario de nuevo usuario
export default function NuevoUsuarioForm({ onClose }: { onClose: () => void }) {
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
