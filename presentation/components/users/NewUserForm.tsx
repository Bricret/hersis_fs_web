"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { roles } from "@/infraestructure/interface/users/rols.interface";
import { userSchema, UserSchema } from "@/infraestructure/schema/users.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { InputField, SelectField, ButtonSubmit } from "../common/Forms";
import { sucursales } from "@/core/data/sucursales";

export default function NuevoUsuarioForm({ onClose }: { onClose: () => void }) {
  const [generatePassword, setGeneratePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const methods = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = methods;
  const username = watch("username");

  useEffect(() => {
    if (generatePassword && username) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = String(now.getFullYear()).slice(-2);
      const dateStr = `${day}${month}${year}`;

      const generatedPassword = `${username}${dateStr}`;
      setValue("password", generatedPassword);
    }
  }, [username, generatePassword, setValue]);

  const onSubmit = async (data: UserSchema) => {
    setLoading(true);
    console.log("Datos validados:", data);
    setLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Nombre y apellido"
            type="text"
            error={errors.name}
            registration={register("name")}
            placeholder="Ingrese el nombre del usuario"
          />
          <InputField
            label="Nombre de usuario"
            type="text"
            error={errors.username}
            registration={register("username")}
            placeholder="Ingrese el nombre para acceder"
          />
        </div>
        <InputField
          label="Correo electrónico"
          type="email"
          error={errors.email}
          registration={register("email")}
          className="w-full"
          placeholder="Ingrese el correo electrónico"
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Sucursal"
            error={errors.sucursal}
            registration={register("sucursal")}
            placeholder="Seleccione una sucursal"
            options={sucursales.map((sucursal) => sucursal.nombre)}
          />
          <SelectField
            label="Rol"
            error={errors.rol}
            registration={register("rol")}
            placeholder="Seleccione un rol"
            options={roles.map((rol) => rol)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="generatePassword"
            checked={generatePassword}
            onCheckedChange={(checked) => setGeneratePassword(checked)}
          />
          <Label htmlFor="generatePassword">
            Generar contraseña automáticamente y enviar por correo
          </Label>
        </div>

        {!generatePassword && (
          <InputField
            label="Contraseña"
            type="password"
            error={errors.password}
            registration={register("password", {
              required: !generatePassword
                ? "La contraseña es obligatoria"
                : false,
            })}
            required={!generatePassword}
            placeholder="Ingrese la contraseña"
          />
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <ButtonSubmit loading={loading} />
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
