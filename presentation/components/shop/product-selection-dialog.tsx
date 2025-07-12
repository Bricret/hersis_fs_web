"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Package, PackageOpen } from "lucide-react";
import { ProductType } from "@/core/data/sales/DataSales";

interface ProductSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductType | null;
  onConfirm: (sellByUnit: boolean, quantity: number) => void;
}

export default function ProductSelectionDialog({
  isOpen,
  onClose,
  product,
  onConfirm,
}: ProductSelectionDialogProps) {
  const [sellByUnit, setSellByUnit] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    if (product && quantity > 0) {
      onConfirm(sellByUnit, quantity);
      onClose();
      // Reset state
      setSellByUnit(true);
      setQuantity(1);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setSellByUnit(true);
    setQuantity(1);
  };

  if (!product) return null;

  const maxQuantity = sellByUnit
    ? product.stock
    : Math.floor(product.stock / product.unitsPerBox);

  const totalUnits = sellByUnit ? quantity : quantity * product.unitsPerBox;
  const totalPrice = sellByUnit
    ? quantity * product.pricePerUnit
    : quantity * product.price;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Producto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del producto */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Código:</span>
                <p className="font-medium">{product.code}</p>
              </div>
              <div>
                <span className="text-gray-600">Stock disponible:</span>
                <p className="font-medium">{product.stock} unidades</p>
              </div>
              <div>
                <span className="text-gray-600">Unidades por caja:</span>
                <p className="font-medium">{product.unitsPerBox}</p>
              </div>
              <div>
                <span className="text-gray-600">Precio por caja:</span>
                <p className="font-medium">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Opciones de venta */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              ¿Cómo deseas vender?
            </Label>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={sellByUnit ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${
                  sellByUnit ? "bg-blue-600 hover:bg-blue-700" : ""
                }`}
                onClick={() => setSellByUnit(true)}
              >
                <PackageOpen className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Por Unidad</div>
                  <div className="text-xs opacity-80">
                    ${product.pricePerUnit.toFixed(2)} c/u
                  </div>
                </div>
              </Button>

              <Button
                variant={!sellByUnit ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${
                  !sellByUnit ? "bg-blue-600 hover:bg-blue-700" : ""
                }`}
                onClick={() => setSellByUnit(false)}
              >
                <Package className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Por Caja</div>
                  <div className="text-xs opacity-80">
                    ${product.price.toFixed(2)} caja
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Cantidad */}
          <div className="space-y-2">
            <Label>Cantidad de {sellByUnit ? "unidades" : "cajas"}</Label>
            <Input
              type="number"
              min="0"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setQuantity(Math.max(0, Math.min(value, maxQuantity)));
              }}
              className="text-center text-lg font-medium"
            />
            <p className="text-xs text-gray-500 text-center">
              Máximo: {maxQuantity} {sellByUnit ? "unidades" : "cajas"}
            </p>
          </div>

          {/* Resumen */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total de unidades:</span>
              <span className="font-bold">{totalUnits}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Precio total:</span>
              <span className="font-bold text-lg text-blue-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleConfirm}
              disabled={quantity <= 0 || quantity > maxQuantity}
            >
              Agregar al Carrito
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
