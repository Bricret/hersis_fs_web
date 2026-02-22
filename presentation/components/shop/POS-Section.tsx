"use client";

import { useState } from "react";
import { useCart } from "@/presentation/store/cart-context";
import CartPanel from "./cart-panel";
import { toast } from "sonner";
import ModeToggle from "./mode-toggle";
import ProductCatalog from "./product-catalog";
import { Header } from "../common/Header";
import SalesHistory from "./sales-history";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { ProductType } from "@/core/data/sales/DataSales";
import ProductSelectionDialog from "./product-selection-dialog";

function adaptInventoryToProductType(inventory: Inventory): ProductType {
  if (!inventory.id) {
    throw new Error("El ID del inventario es requerido");
  }

  // Asegurar que los precios sean números válidos con 2 decimales
  const salesPrice = Number(inventory.sales_price) || 0;
  const unitsPerBox = Number(inventory.units_per_box) || 1;
  const pricePerUnit = Number(salesPrice.toFixed(2));
  const pricePerBox = Number((salesPrice * unitsPerBox).toFixed(2));

  return {
    id: inventory.id.toString(),
    code: inventory.barCode,
    name: inventory.name,
    category: inventory.type,
    price: pricePerBox, // Precio por caja
    pricePerUnit: pricePerUnit, // Precio por unidad
    unit: "Unidad",
    unitsPerBox: unitsPerBox,
    stock: inventory.initial_quantity,
    popular: false,
    image: "/placeholder.svg?height=80&width=80",
  };
}

export default function PosSection({
  products,
  totalPages,
  currentPage,
  totalItems,
  initialSearch = "",
}: {
  products: Inventory[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  initialSearch?: string;
}) {
  const [mode, setMode] = useState<"cashier" | "pharmacist">("cashier");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const { addToCart } = useCart();

  // Ordenar productos del más nuevo al más viejo
  const sortedProducts = [...products].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB.getTime() - dateA.getTime(); // Orden descendente
  });

  const handleProductSelect = (product: Inventory) => {
    const adaptedProduct = adaptInventoryToProductType(product);

    // Validar stock disponible
    if (product.initial_quantity <= 0) {
      toast.error("Producto sin stock", {
        description: `${product.name} no tiene stock disponible`,
      });
      return;
    }

    // Validar que el producto tenga un precio válido
    if (
      !adaptedProduct.price ||
      adaptedProduct.price <= 0 ||
      isNaN(adaptedProduct.price)
    ) {
      toast.error("Precio inválido", {
        description: `${product.name} no tiene un precio válido`,
        position: "top-right",
      });
      return;
    }

    // Abrir diálogo de selección
    setSelectedProduct(adaptedProduct);
    setIsSelectionDialogOpen(true);
  };

  const handleProductConfirm = (sellByUnit: boolean, quantity: number) => {
    if (!selectedProduct) return;

    // Agregar al carrito con la opción seleccionada
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct, sellByUnit);
    }

    const unitText = sellByUnit ? "unidades" : "cajas";
    const totalUnits = sellByUnit
      ? quantity
      : quantity * selectedProduct.unitsPerBox;

    toast.success("Producto añadido", {
      description: `${quantity} ${unitText} de ${selectedProduct.name} (${totalUnits} unidades total)`,
      duration: 3000,
      position: "top-right",
    });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header fijo */}
      <div className="flex-shrink-0">
        <Header
          title="Punto de Venta"
          subTitle="Maneja tus ventas de manera eficiente"
        >
          <div className="flex items-center gap-2">
            <SalesHistory />
          </div>
        </Header>
        <ModeToggle currentMode={mode} onModeChange={setMode} />
      </div>

      {/* Contenido principal con scroll solo en productos */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <ProductCatalog
            products={sortedProducts}
            mode={mode}
            onProductSelect={handleProductSelect}
            totalPages={totalPages}
            currentPage={currentPage}
            totalItems={totalItems}
            initialSearch={initialSearch}
          />
        </div>
        <div className="w-full md:w-96 border-l flex-shrink-0">
          <CartPanel />
        </div>
      </div>

      {/* Diálogo de selección de producto */}
      <ProductSelectionDialog
        isOpen={isSelectionDialogOpen}
        onClose={() => setIsSelectionDialogOpen(false)}
        product={selectedProduct}
        onConfirm={handleProductConfirm}
      />
    </div>
  );
}
