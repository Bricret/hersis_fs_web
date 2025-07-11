"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { ProductState } from "@/infraestructure/schema/inventory.schema";
import { Eye } from "lucide-react";
import { Badge } from "@/presentation/components/ui/badge";
import { DropdownMenuItem } from "@/presentation/components/ui/dropdown-menu";
import { Separator } from "@/presentation/components/ui/separator";

interface ProductDialogProps {
  product: Inventory;
}

export function ProductDialog({ product }: ProductDialogProps) {
  const isMedicine = "active_name" in product;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Ver más</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">Detalles del Producto</span>
            <Badge
              variant="outline"
              className={
                product.type === ProductState.MEDICINE
                  ? "bg-blue-200/50 border border-blue-400 text-blue-700"
                  : "bg-green-200/50 border border-green-400 text-green-700"
              }
            >
              {product.type === ProductState.MEDICINE
                ? "Medicamento"
                : "General"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Información Básica
            </h3>
            <div className="rounded-lg border p-4 space-y-3">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Nombre:</span>
                <span className="col-span-2 font-medium">{product.name}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Código:</span>
                <span className="col-span-2 font-medium">
                  {product.barCode}
                </span>
              </div>
              <Separator />
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Stock:</span>
                <span className="col-span-2 font-medium">
                  {product.initial_quantity}
                </span>
              </div>
            </div>
          </div>

          {/* Información de Precios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Información de Precios
            </h3>
            <div className="rounded-lg border p-4 space-y-3">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Precio Venta:</span>
                <span className="col-span-2 font-medium text-green-600">
                  ${product.sales_price}
                </span>
              </div>
              <Separator />
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">
                  Precio Compra:
                </span>
                <span className="col-span-2 font-medium text-blue-600">
                  ${product.purchase_price}
                </span>
              </div>
            </div>
          </div>

          {/* Información Específica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {isMedicine
                ? "Información del Medicamento"
                : "Información del Producto"}
            </h3>
            <div className="rounded-lg border p-4 space-y-3">
              {isMedicine ? (
                <>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">
                      Ingrediente Activo:
                    </span>
                    <span className="col-span-2 font-medium">
                      {product.active_name}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">Dosis:</span>
                    <span className="col-span-2 font-medium">
                      {product.dosage}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">
                      Laboratorio:
                    </span>
                    <span className="col-span-2 font-medium">
                      {product.laboratory}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">
                      Vía de Administración:
                    </span>
                    <span className="col-span-2 font-medium">
                      {product.administration_route}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">
                      Requiere Receta:
                    </span>
                    <span className="col-span-2 font-medium">
                      {product.prescription ? "Sí" : "No"}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">Marca:</span>
                    <span className="col-span-2 font-medium">
                      {product.brand}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">Modelo:</span>
                    <span className="col-span-2 font-medium">
                      {product.model}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Información de Inventario */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Información de Inventario
            </h3>
            <div className="rounded-lg border p-4 space-y-3">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">
                  Unidades por Caja:
                </span>
                <span className="col-span-2 font-medium">
                  {product.units_per_box}
                </span>
              </div>
              <Separator />
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">
                  Fecha de Expiración:
                </span>
                <span className="col-span-2 font-medium">
                  {product.expiration_date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
