"use client";

import { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, X, CreditCard } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import { useCart } from "@/presentation/store/cart-context";
import { useIsMobile } from "@/presentation/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import PaymentDialog from "./payment-dialog";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const isMobile = useIsMobile();

  // Calculate cart totals
  const subtotal = cart.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.07; // 7% tax rate
  const total = subtotal + tax;

  // Handle successful payment
  const handlePaymentComplete = () => {
    clearCart();
    setIsPaymentOpen(false);
    if (isMobile) onClose();
  };

  if (!isOpen && !isMobile) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`bg-white border-l border-gray-200 flex flex-col ${
              isMobile ? "absolute inset-0 z-20" : "w-1/3"
            }`}
            initial={{ x: isMobile ? "100%" : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? "100%" : 0, opacity: isMobile ? 0 : 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-emerald-600" />
                Carrito de Compra
              </h2>
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-2 text-gray-300" />
                <p>El carrito está vacío</p>
                <p className="text-sm">Agrega productos para comenzar</p>
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (7%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => clearCart()}
                  disabled={cart.length === 0}
                  className="text-base"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
                <Button
                  onClick={() => setIsPaymentOpen(true)}
                  disabled={cart.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 text-base"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={total}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
}

interface CartItemProps {
  item: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  // Track swipe state
  const [isSwiping, setIsSwiping] = useState(false);

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="relative overflow-hidden"
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsSwiping(true)}
        onDragEnd={(e, info) => {
          setIsSwiping(false);
          if (info.offset.x < -100) {
            onRemove(item.id);
          }
        }}
        className="touch-pan-y"
      >
        <Card
          className={`transition-transform ${isSwiping ? "shadow-md" : ""}`}
        >
          <CardContent className="p-3">
            <div className="flex justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <div className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} c/u
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Eliminar
              </Button>
              <span className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="absolute right-0 top-0 bottom-0 bg-red-500 text-white flex items-center px-4 rounded-r-md opacity-0">
        Eliminar
      </div>
    </motion.div>
  );
}
