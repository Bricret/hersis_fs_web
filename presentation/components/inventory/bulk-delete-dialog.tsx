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
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { deleteBulkProducts } from "@/presentation/services/server/inventory.server";
import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";

interface BulkDeleteDialogProps {
  selectedProducts: Inventory[];
  onDeleteComplete?: () => void;
  trigger?: React.ReactNode;
}

export function BulkDeleteDialog({
  selectedProducts,
  onDeleteComplete,
  trigger,
}: BulkDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { getUserAuth } = useAuthFetch();

  const handleBulkDelete = async () => {
    try {
      const currentUser = getUserAuth();
      if (!currentUser) {
        toast.error("Usuario no autenticado");
        return;
      }

      if (selectedProducts.length === 0) {
        toast.error("No hay productos seleccionados");
        return;
      }

      setIsDeleting(true);

      // Preparar los productos para eliminación
      const productsToDelete = selectedProducts.map((product) => ({
        id: product.id?.toString() || "",
        type: product.type,
      }));

      await deleteBulkProducts(currentUser.sub, productsToDelete);

      toast.success("Productos eliminados exitosamente", {
        description: `Se eliminaron ${selectedProducts.length} productos permanentemente.`,
      });

      setOpen(false);
      onDeleteComplete?.();
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar productos:", error);
      toast.error("Error al eliminar productos", {
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm" className="ml-2">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar Seleccionados ({selectedProducts.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <DialogTitle>Eliminar Productos Seleccionados</DialogTitle>
          </div>
          <DialogDescription className="space-y-3">
            <p>
              ¿Estás seguro de que deseas eliminar permanentemente{" "}
              <strong>{selectedProducts.length}</strong> producto
              {selectedProducts.length > 1 ? "s" : ""} seleccionado
              {selectedProducts.length > 1 ? "s" : ""}?
            </p>

            <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-sm">
              <p className="font-semibold mb-1">Productos a eliminar:</p>
              <ul className="space-y-1">
                {selectedProducts.map((product) => (
                  <li key={product.id?.toString()} className="text-gray-700">
                    • {product.name}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer.
              Los productos serán eliminados permanentemente del sistema.
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
            onClick={handleBulkDelete}
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
                Eliminar {selectedProducts.length} Producto
                {selectedProducts.length > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
