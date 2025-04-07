"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Roles } from "@/infraestructure/interface/users/rols.interface";
import { userSchema, UserSchema } from "@/infraestructure/schema/users.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { InputField, SelectField, ButtonSubmit } from "../common/Forms";
import { sucursales } from "@/core/data/sucursales";
import { useUsersFetch } from "@/presentation/hooks/user/useUsersFetch";

export default function NuevoUsuarioForm({ onClose }: { onClose: () => void }) {
  const [generatePassword, setGeneratePassword] = useState(true);

  const { createUser, isLoading } = useUsersFetch();

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

  const onSubmit = (data: UserSchema) => {
    createUser(data, {
      onSuccess: () => {
        toast.success("Usuario creado correctamente");
        onClose();
      },
      onError: (error) => {
        toast.error("Error al crear el usuario", {
          description:
            error instanceof Error ? error.message : "Error desconocido",
        });
      },
    });
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
            error={errors.branch}
            registration={register("branch")}
            placeholder="Seleccione una sucursal"
            options={sucursales.map((sucursal) => sucursal.value)}
          />
          <SelectField
            label="Rol"
            error={errors.role}
            registration={register("role")}
            placeholder="Seleccione un rol"
            options={Object.values(Roles).map((rol) => rol)}
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
          <ButtonSubmit loading={isLoading} />
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
