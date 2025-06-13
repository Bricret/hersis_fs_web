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
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { PiggyBank } from "lucide-react";
import { updatePriceProduct } from "@/presentation/services/server/inventory.server";

interface UpdatePriceDialogProps {
  product: Inventory;
}

export function UpdatePriceDialog({ product }: UpdatePriceDialogProps) {
  const [open, setOpen] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState(
    product.purchase_price.toString()
  );
  const [salesPrice, setSalesPrice] = useState(
    product.sales_price?.toString() || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const purchasePriceNum = parseFloat(purchasePrice);
    const salesPriceNum = parseFloat(salesPrice);

    if (isNaN(purchasePriceNum) || isNaN(salesPriceNum)) {
      toast.error("Por favor ingrese valores numéricos válidos");
      return;
    }

    if (purchasePriceNum >= salesPriceNum) {
      toast.error("El precio de compra debe ser menor que el precio de venta");
      return;
    }

    try {
      toast.promise(
        updatePriceProduct(product.id as bigint, {
          newPrice: salesPriceNum,
          type: product.type,
        }),
        {
          loading: "Actualizando el precio...",
          success: (res) => res.message,
          error: "Error al actualizar el precio",
        }
      );
      toast.success("Precio actualizado correctamente");
      setOpen(false);
    } catch (error) {
      toast.error("Error al actualizar el precio");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PiggyBank className="mr-2 h-4 w-4" />
          Cambiar Precio
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Actualizar Precio de venta</DialogTitle>
            <DialogDescription>
              Actualiza el precio del producto {product.name}. El precio de
              compra debe ser menor que el precio de venta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchase_price" className="text-right">
                Precio de Compra
              </Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                min="0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sales_price" className="text-right">
                Precio de Venta
              </Label>
              <Input
                id="sales_price"
                type="number"
                step="0.01"
                min="0"
                value={salesPrice}
                onChange={(e) => setSalesPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
