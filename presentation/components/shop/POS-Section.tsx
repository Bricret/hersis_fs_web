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

function adaptInventoryToProductType(inventory: Inventory): ProductType {
  if (!inventory.id) {
    throw new Error("El ID del inventario es requerido");
  }
  
  return {
    id: inventory.id.toString(),
    code: inventory.barCode,
    name: inventory.name,
    category: inventory.type,
    price: inventory.sales_price,
    pricePerUnit: inventory.sales_price / inventory.units_per_box,
    unit: "Unidad",
    unitsPerBox: inventory.units_per_box,
    stock: inventory.initial_quantity,
    popular: false,
    image: "/placeholder.svg?height=80&width=80",
  };
}

export default function PosSection({ products }: { products: Inventory[] }) {
  const [mode, setMode] = useState<"cashier" | "pharmacist">("cashier");
  const { addToCart } = useCart();

  const handleProductSelect = (product: Inventory) => {
    const adaptedProduct = adaptInventoryToProductType(product);

    // Validar stock disponible
    if (product.initial_quantity <= 0) {
      toast.error("Producto sin stock", {
        description: `${product.name} no tiene stock disponible`,
      });
      return;
    }

    addToCart(adaptedProduct);

    toast.success("Producto añadido", {
      description: `${product.name} ha sido añadido al carrito`,
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Header
        title="Punto de Venta"
        subTitle="Maneja tus ventas de manera eficiente"
      >
        <div className="flex items-center gap-2">
          <SalesHistory />
        </div>
      </Header>
      <ModeToggle currentMode={mode} onModeChange={setMode} />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <ProductCatalog
            products={products}
            mode={mode}
            onProductSelect={handleProductSelect}
          />
        </div>
        <div className="w-full md:w-96 border-l">
          <CartPanel />
        </div>
      </div>
    </div>
  );
}
