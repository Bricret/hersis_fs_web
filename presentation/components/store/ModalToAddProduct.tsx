"use client";

import { ProductType } from "@/app/(general)/shop/page";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import PlusMinusInput from "../common/PlusMinusInput";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductSelectionDialogProps {
  product: ProductType | null;
  open: boolean;
  onClose: () => void;
  onAdd: (product: ProductType, sellByUnit: boolean, quantity: number) => void;
}

export default function ModalToAddProduct({
  product,
  open,
  onClose,
  onAdd,
}: ProductSelectionDialogProps) {
  const [sellByUnit, setSellByUnit] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) {
      setSellByUnit(false);
      setQuantity(1);
    }
  }, [open]);

  if (!product) return null;

  const handleAdd = () => {
    onAdd(product, sellByUnit, quantity);
    onClose();
  };

  const price = sellByUnit ? product.pricePerUnit : product.price;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar producto</DialogTitle>
          <DialogDescription>
            Seleccione la presentación y cantidad del producto
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-4 py-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-20 w-20 rounded-md object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              Código: {product.code}
            </p>
            <p className="text-sm text-muted-foreground">
              Categoría: {product.category}
            </p>
            <p className="text-sm text-muted-foreground">
              Stock: {product.stock} {product.unit}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Presentación</Label>
            <RadioGroup
              defaultValue="box"
              value={sellByUnit ? "unit" : "box"}
              onValueChange={(value) => setSellByUnit(value === "unit")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="box" id="box" />
                <Label htmlFor="box" className="cursor-pointer">
                  Caja ({product.unitsPerBox} unidades) - $
                  {product.price.toFixed(2)}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unit" id="unit" />
                <Label htmlFor="unit" className="cursor-pointer">
                  Unidad - ${product.pricePerUnit.toFixed(2)}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <PlusMinusInput quantity={quantity} setQuantity={setQuantity} />
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Subtotal:</span>
              <span className="font-bold">
                ${(price * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Agregar al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
