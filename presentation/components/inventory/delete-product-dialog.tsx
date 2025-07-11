"use client";

import { useState } from "react";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { DropdownMenuItem } from "@/presentation/components/ui/dropdown-menu";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { deleteProduct } from "@/presentation/services/server/inventory.server";
import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";

interface DeleteProductDialogProps {
  product: Inventory;
}

export function DeleteProductDialog({ product }: DeleteProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { getUserAuth } = useAuthFetch();

  const handleDelete = async () => {
    try {
      const user = getUserAuth();
      console.log("user", user);
      if (!user) {
        toast.error("Usuario no autenticado");
        return;
      }

      setIsDeleting(true);

      await deleteProduct(product.id?.toString() || "", product.type, user.sub);

      toast.success("Producto eliminado exitosamente", {
        description: `El producto "${product.name}" ha sido eliminado permanentemente.`,
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("Error al eliminar producto", {
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar producto
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <DialogTitle>Eliminar Producto</DialogTitle>
          </div>
          <DialogDescription className="space-y-2">
            <p>
              ¿Estás seguro de que deseas eliminar permanentemente el producto{" "}
              <strong>"{product.name}"</strong>?
            </p>
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer. El
              producto será eliminado permanentemente del sistema.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="mb-2 sm:mb-0"
          >
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
