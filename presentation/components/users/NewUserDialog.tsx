import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import NuevoUsuarioForm from "./NewUserForm";

export const NewUserDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1 cursor-pointer">
          <UserPlus className="h-4 w-4" />
          Agregar Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Complete el formulario para registrar un nuevo usuario en el sistema
          </DialogDescription>
        </DialogHeader>
        <NuevoUsuarioForm
          onClose={() =>
            document
              .querySelector<HTMLButtonElement>('[data-state="closed"]')
              ?.click()
          }
        />
      </DialogContent>
    </Dialog>
  );
};
