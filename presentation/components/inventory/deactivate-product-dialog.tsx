import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/presentation/components/ui/alert-dialog";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { disableProduct } from "@/presentation/services/server/inventory.server";

interface DeactivateProductDialogProps {
  product: Inventory;
}

export function DeactivateProductDialog({
  product,
}: DeactivateProductDialogProps) {
  const handleDeactivate = async () => {
    console.log(product.id, product.type);
    try {
      toast.promise(disableProduct(product.id, product.type), {
        loading: "Desactivando producto...",
        success: (res) => res.message,
        error: "Error al desactivar el producto",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error al desactivar el producto");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          variant="destructive"
        >
          Desactivar
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de desactivar este producto?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción desactivará el producto "{product.name}". No podrás
            vender este producto hasta que lo reactives.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeactivate}
            className="bg-destructive-foreground hover:bg-destructive/80"
          >
            Desactivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
