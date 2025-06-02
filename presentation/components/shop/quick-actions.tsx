"use client";

import { useState } from "react";
import {
  Scan,
  ShoppingCart,
  Search,
  Calculator,
  History,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { motion } from "framer-motion";
import { useIsMobile } from "@/presentation/hooks/use-mobile";
import { useCart } from "@/presentation/store/useCart";

interface QuickActionsProps {
  onCartClick: () => void;
  isCartOpen: boolean;
}

export default function QuickActions({
  onCartClick,
  isCartOpen,
}: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { cart } = useCart();
  const isMobile = useIsMobile();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Only show on mobile
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
      {isExpanded && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              setIsExpanded(false);
              // Add history action
            }}
          >
            <History className="h-5 w-5" />
            <span className="sr-only">Historial</span>
          </Button>

          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-purple-500 hover:bg-purple-600"
            onClick={() => {
              setIsExpanded(false);
              // Add calculator action
            }}
          >
            <Calculator className="h-5 w-5" />
            <span className="sr-only">Calculadora</span>
          </Button>

          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-amber-500 hover:bg-amber-600"
            onClick={() => {
              setIsExpanded(false);
              // Add search action
            }}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
        </motion.div>
      )}

      <div className="flex gap-2">
        {!isCartOpen && (
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Carrito</span>
          </Button>
        )}

        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-gray-800 hover:bg-gray-900"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
          <span className="sr-only">Más acciones</span>
        </Button>
      </div>
    </div>
  );
}
