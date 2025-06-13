"use client";

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
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { useState } from "react";
import { toast } from "sonner";
import { PackagePlus } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { refillProduct } from "@/presentation/services/server/inventory.server";

interface RefillDialogProps {
  product: Inventory;
}

export function RefillDialog({ product }: RefillDialogProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const handleRefill = async () => {
    console.log({
      refill: quantity,
      type: product.type,
      id: product.id,
    });
    try {
      toast.promise(
        refillProduct(product.id as bigint, {
          refill: quantity,
          type: product.type,
        }),
        {
          loading: "Actualizando stock...",
          success: (res) => res.message,
          error: "Error al actualizar el stock",
        }
      );
      setOpen(false);
    } catch (error) {
      toast.error("Error al actualizar el stock");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PackagePlus className="mr-2 h-4 w-4" />
          Reabastecer
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reabastecer Stock</DialogTitle>
          <DialogDescription>
            Ingrese la cantidad a agregar al stock actual de {product.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-stock" className="text-right">
              Stock Actual
            </Label>
            <div className="col-span-3">
              <Input
                id="current-stock"
                value={product.initial_quantity}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Cantidad
            </Label>
            <div className="col-span-3">
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Ingrese la cantidad a agregar"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleRefill}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
