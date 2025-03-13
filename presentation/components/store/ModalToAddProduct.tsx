"use client";

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
import { ProductType } from "@/core/data/sales/DataSales";
import { Separator } from "../ui/separator";

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
            src={"/pill.webp"}
            alt={product.name}
            className="h-20 w-20 rounded-md object-fill"
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
          <Separator className="bg-border-main" />
          <div className="space-y-2">
            <Label>Presentación</Label>
            <RadioGroup
              className="gap-4 flex"
              defaultValue="box"
              onValueChange={(value) => setSellByUnit(value === "unit")}
            >
              {/* Radio card #1 */}
              <div className="border-input has-data-[state=checked]:border-ring relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                <RadioGroupItem
                  value="box"
                  id="box"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="grid grow gap-2">
                  <Label htmlFor="box">
                    Caja{" "}
                    <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                      Presentación
                    </span>
                  </Label>
                  <p
                    id={`box-description`}
                    className="text-muted-foreground text-xs"
                  >
                    ({product.unitsPerBox} unidades) - $
                    {product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              {/* Radio card #2 */}
              <div className="border-input has-data-[state=checked]:border-ring relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                <RadioGroupItem
                  value="unit"
                  id="unit"
                  aria-describedby={`unit-description`}
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="grid grow gap-2">
                  <Label htmlFor="unit">
                    Unidad{" "}
                    <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                      Presentación
                    </span>
                  </Label>
                  <p
                    id={`unit-description`}
                    className="text-muted-foreground text-xs"
                  >
                    Unidad - ${product.pricePerUnit.toFixed(2)}
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <PlusMinusInput quantity={quantity} setQuantity={setQuantity} />
          </div>

          <div className="rounded-lg bg-main-background-color p-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-medium">Subtotal:</span>
              <span className="font-bold">
                ${(price * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <Separator className="bg-border-main" />
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
