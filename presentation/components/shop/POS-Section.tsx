"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/presentation/store/cart-context";
import CartPanel from "./cart-panel";
import { useIsMobile } from "@/presentation/hooks/use-mobile";
import { toast } from "sonner";
import ModeToggle from "./mode-toggle";
import QuickActions from "./quick-actions";
import ProductCatalog from "./product-catalog";
import { Header } from "../common/Header";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { ProductType } from "@/core/data/sales/DataSales";

function adaptInventoryToProductType(inventory: Inventory): ProductType {
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

  return (
    <div className="flex flex-col h-full w-full">
      <Header
        title="Punto de Venta"
        subTitle="Maneja tus ventas de manera eficiente"
      />
      <ModeToggle currentMode={mode} onModeChange={setMode} />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <ProductCatalog
            products={products}
            mode={mode}
            onProductSelect={(product) => {
              const adaptedProduct = adaptInventoryToProductType(product);
              addToCart(adaptedProduct);
              toast("Producto añadido", {
                description: `${product.name} ha sido añadido al carrito`,
              });
            }}
          />
        </div>
        <div className="w-full md:w-96 border-l">
          <CartPanel />
        </div>
      </div>
    </div>
  );
}
