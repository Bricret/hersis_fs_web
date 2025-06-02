"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/presentation/store/cart-context";
import { CartProvider } from "@/presentation/store/cart-context";
import CartPanel from "./cart-panel";
import { useIsMobile } from "@/presentation/hooks/use-mobile";
import { toast } from "sonner";
import ModeToggle from "./mode-toggle";
import QuickActions from "./quick-actions";
import Header from "./headerPOS";
import ProductCatalog from "./product-catalog";

export default function PosSection() {
  return (
    <CartProvider>
      <PosContent />
    </CartProvider>
  );
}

function PosContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mode, setMode] = useState<"cashier" | "pharmacist">("cashier");
  const isMobile = useIsMobile();
  const { cart, addToCart } = useCart();

  // Toggle cart visibility based on screen size
  useEffect(() => {
    if (!isMobile) {
      setIsCartOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex flex-col h-screen">
      <Header
        cartCount={cart.reduce(
          (sum: any, item: { quantity: any }) => sum + item.quantity,
          0
        )}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        isCartOpen={isCartOpen}
      />

      <ModeToggle currentMode={mode} onModeChange={setMode} />

      <div className="flex flex-1 relative overflow-hidden">
        <div
          className={`flex-1 ${isCartOpen && isMobile ? "hidden" : "block"}`}
        >
          <ProductCatalog
            mode={mode}
            onProductSelect={(product) => {
              addToCart(product);
              toast("Producto añadido", {
                description: `${product.name} ha sido añadido al carrito`,
              });
            }}
          />
        </div>

        <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>

      <QuickActions
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        isCartOpen={isCartOpen}
      />
    </div>
  );
}
