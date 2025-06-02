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
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPanel() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState("");
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const isMobile = useIsMobile();

  // Calculate cart total
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate change
  const change = Number(receivedAmount) - total;

  // Handle successful payment
  const handlePaymentComplete = () => {
    if (Number(receivedAmount) < total) {
      toast.error("El monto recibido es insuficiente");
      return;
    }
    clearCart();
    setIsPaymentDialogOpen(false);
    setReceivedAmount("");
    toast.success("Venta completada exitosamente");

    // Dispatch custom event to notify sale completion
    const event = new CustomEvent("saleCompleted");
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-emerald-600" />
          Carrito de Compra
        </h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-2 text-gray-300" />
                <p>El carrito está vacío</p>
                <p className="text-sm">Agrega productos para comenzar</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <CartItem
                  key={`${item.id}-${index}`}
                  item={item}
                  onUpdateQuantity={(quantity) =>
                    updateQuantity(item.id, quantity)
                  }
                  onRemove={() => removeFromCart(item.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t p-4 space-y-4 bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setIsPaymentDialogOpen(true)}
          disabled={cart.length === 0}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Proceder al pago
        </Button>
      </div>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completar pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Monto a pagar</Label>
              <Input
                type="number"
                value={total.toFixed(2)}
                readOnly
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label>Monto recibido</Label>
              <Input
                type="number"
                placeholder="0.00"
                className="text-right"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
              />
            </div>
            {Number(receivedAmount) > 0 && (
              <div className="space-y-2">
                <Label>Cambio</Label>
                <Input
                  type="number"
                  value={change >= 0 ? change.toFixed(2) : "0.00"}
                  readOnly
                  className={`text-right ${
                    change < 0 ? "text-red-500" : "text-green-500"
                  }`}
                />
              </div>
            )}
            <Button
              className="w-full"
              onClick={handlePaymentComplete}
              disabled={Number(receivedAmount) < total}
            >
              Completar venta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-lg bg-white">
      <div className="flex-1">
        <h4 className="font-medium">{item.name}</h4>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
