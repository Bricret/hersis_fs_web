"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Switch } from "@/presentation/components/ui/switch";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { ProductState } from "@/infraestructure/schema/inventory.schema";
import { DropdownMenuItem } from "@/presentation/components/ui/dropdown-menu";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateInventoryProduct } from "@/presentation/services/server/inventory.server";
import { refreshInventoryData } from "@/presentation/utils/clientRevalidation";
import type { Category } from "@/core/domain/entity/categories.entity";

interface EditProductDialogProps {
  product: Inventory;
  categories: Category[];
}

export function EditProductDialog({
  product,
  categories,
}: EditProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // Función para obtener el category_id basado en el nombre de la categoría del producto
  const getCategoryIdFromProduct = (
    product: Inventory,
    categories: Category[]
  ) => {
    if (product.type === ProductState.MEDICINE) {
      const medicineProduct = product as any;
      const categoryName = medicineProduct.category;
      const category = categories.find((c) => c.name === categoryName);
      return category?.id?.toString() || categories[0]?.id?.toString() || "";
    }
    return categories[0]?.id?.toString() || "";
  };

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    sales_price: product.sales_price,
    purchase_price: product.purchase_price,
    barCode: product.barCode,
    units_per_box: product.units_per_box,
    lot_number: product.lot_number,
    expiration_date: formatDate(product.expiration_date),
    category_id: getCategoryIdFromProduct(product, categories),
    // Campos específicos de medicina
    ...(product.type === ProductState.MEDICINE && {
      active_name: (product as any).active_name || "",
      dosage: (product as any).dosage || "",
      prescription: (product as any).prescription || false,
      laboratory: (product as any).laboratory || "",
      administration_route: (product as any).administration_route || "",
      presentation: (product as any).presentation || "",
      pharmaceutical_form: (product as any).pharmaceutical_form || "",
    }),
    // Campos específicos de producto general
    ...(product.type === ProductState.GENERAL && {
      brand: (product as any).brand || "",
      model: (product as any).model || "",
    }),
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let updateData: any;
      // Validar y preparar los campos
      const baseData = {
        name: formData.name,
        description: formData.description,
        sales_price: Number(formData.sales_price),
        purchase_price: Number(formData.purchase_price),
        barCode: formData.barCode,
        units_per_box: formData.units_per_box,
        lot_number: formData.lot_number || undefined,
        expiration_date: formData.expiration_date
          ? new Date(formData.expiration_date)
          : undefined,
        initial_quantity: product.initial_quantity,
        type: product.type,
        category_id: Number(formData.category_id),
      };

      if (product.type === ProductState.MEDICINE) {
        updateData = {
          ...baseData,
          active_name: formData.active_name,
          dosage: formData.dosage,
          prescription: formData.prescription,
          laboratory: formData.laboratory,
          administration_route: formData.administration_route,
        };
      } else {
        updateData = {
          ...baseData,
          brand: formData.brand,
          model: formData.model,
        };
      }

      // expiration_date como string ISO si existe
      if (
        updateData.expiration_date instanceof Date &&
        !isNaN(updateData.expiration_date)
      ) {
        updateData.expiration_date = updateData.expiration_date.toISOString();
      }

      // Eliminar campos undefined
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      await updateInventoryProduct(product.id?.toString() || "", updateData);

      toast.success("Producto actualizado correctamente");
      setIsOpen(false);
      await refreshInventoryData();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      toast.error("Error al actualizar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const isMedicine = product.type === ProductState.MEDICINE;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Editar Producto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barCode">Código de Barras *</Label>
                <Input
                  id="barCode"
                  value={formData.barCode}
                  onChange={(e) => handleInputChange("barCode", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sales_price">Precio de Venta *</Label>
                <Input
                  id="sales_price"
                  type="number"
                  step="0.01"
                  value={formData.sales_price}
                  onChange={(e) =>
                    handleInputChange("sales_price", parseFloat(e.target.value))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_price">Precio de Compra *</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) =>
                    handleInputChange(
                      "purchase_price",
                      parseFloat(e.target.value)
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="units_per_box">Unidades por Caja *</Label>
                <Input
                  id="units_per_box"
                  type="number"
                  value={formData.units_per_box}
                  onChange={(e) =>
                    handleInputChange("units_per_box", parseInt(e.target.value))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration_date">Fecha de Expiración *</Label>
                <Input
                  id="expiration_date"
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) =>
                    handleInputChange("expiration_date", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Información Específica */}
          {isMedicine ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Información del Medicamento
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="active_name">Ingrediente Activo *</Label>
                  <Input
                    id="active_name"
                    value={formData.active_name}
                    onChange={(e) =>
                      handleInputChange("active_name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosis *</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) =>
                      handleInputChange("dosage", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="laboratory">Laboratorio *</Label>
                  <Input
                    id="laboratory"
                    value={formData.laboratory}
                    onChange={(e) =>
                      handleInputChange("laboratory", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="administration_route">
                    Vía de Administración *
                  </Label>
                  <Select
                    value={formData.administration_route}
                    onValueChange={(value) =>
                      handleInputChange("administration_route", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar vía" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oral">Oral</SelectItem>
                      <SelectItem value="Intravenosa">Intravenosa</SelectItem>
                      <SelectItem value="Intramuscular">
                        Intramuscular
                      </SelectItem>
                      <SelectItem value="Subcutánea">Subcutánea</SelectItem>
                      <SelectItem value="Tópica">Tópica</SelectItem>
                      <SelectItem value="Inhalatoria">Inhalatoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      handleInputChange("category_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="prescription"
                    checked={formData.prescription}
                    onCheckedChange={(checked) =>
                      handleInputChange("prescription", checked)
                    }
                  />
                  <Label htmlFor="prescription">Requiere Receta</Label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Información del Producto General
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    handleInputChange("category_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar Producto"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
