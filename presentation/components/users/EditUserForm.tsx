"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Roles } from "@/infraestructure/interface/users/rols.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { InputField, SelectField } from "../common/Forms";
import { sucursales } from "@/core/data/sucursales";
import { useUsers } from "@/presentation/hooks/user/useUsers";
import { User, UserRole } from "@/core/domain/entity/user.entity";
import {
  editUserSchema,
  EditUserSchema,
} from "@/infraestructure/schema/users.schema";

interface EditUserFormProps {
  user: User;
  onClose: () => void;
}

export default function EditUserForm({ user, onClose }: EditUserFormProps) {
  const { updateUser, isLoading } = useUsers();

  const methods = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: EditUserSchema) => {
    updateUser(
      { user: data, id: user.id },
      {
        onSuccess: () => {
          toast.success("Usuario actualizado correctamente");
          onClose();
        },
        onError: (error) => {
          console.error("Error en EditUserForm.onSubmit:", error);
          toast.error("Error al actualizar el usuario", {
            description:
              error instanceof Error ? error.message : "Error desconocido",
          });
        },
      }
    );
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
          {/* <SelectField
            label="Sucursal"
            error={errors.branch}
            registration={register("branch")}
            placeholder="Seleccione una sucursal"
            options={sucursales.map((sucursal) => sucursal.value)}
          /> */}
          <SelectField
            label="Rol"
            error={errors.role}
            registration={register("role")}
            placeholder="Seleccione un rol"
            options={Object.values(Roles).map((rol) => rol)}
          />
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
