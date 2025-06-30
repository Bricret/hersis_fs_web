"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  X,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import { useCart } from "@/presentation/store/cart-context";
import { useIsMobile } from "@/presentation/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { toast } from "sonner";
import { createSale } from "@/presentation/services/server/sale.server";
import type { CreateSaleSchema } from "@/infraestructure/schema/sale.schema";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: number;
  product_type: "medicine" | "general";
  subtotal: number;
}

export default function CartPanel() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal } =
    useCart();
  const isMobile = useIsMobile();

  // Calculate cart total
  const total = getTotal();

  // Calculate change
  const change = Number(receivedAmount) - total;

  // Handle successful payment
  const handlePaymentComplete = async () => {
    if (paymentMethod === "cash" && Number(receivedAmount) < total) {
      toast.error("El monto recibido es insuficiente");
      return;
    }

    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    setIsProcessing(true);

    try {
      // Validar que todos los productos tengan precios válidos
      const invalidProducts = cart.filter(
        (item) => !item.price || item.price <= 0 || isNaN(item.price)
      );

      if (invalidProducts.length > 0) {
        toast.error("Error en los precios", {
          description: "Algunos productos no tienen precios válidos",
        });
        return;
      }

      // Preparar los datos para la venta
      const saleData: CreateSaleSchema = {
        branch_id: "dcdfcc7a-b5fa-444f-b6c1-bcff84365f64", // ID de sucursal hardcodeado
        total: Number(total.toFixed(2)), // Asegurar que sea un número con 2 decimales
        saleDetails: cart.map((item) => ({
          quantity: Number(item.quantity),
          unit_price: Number(item.price.toFixed(2)), // Asegurar que sea un número con 2 decimales
          productId: Number(item.productId),
          product_type: item.product_type,
        })),
      };

      console.log("saleData", saleData);
      // Crear la venta usando el servicio del servidor
      const response = await createSale(saleData);

      // Limpiar carrito y cerrar diálogo
      clearCart();
      setIsPaymentDialogOpen(false);
      setReceivedAmount("");
      setPaymentMethod("cash");

      toast.success("Venta registrada exitosamente", {
        description: `Venta #${response.id} por $${total.toFixed(2)}`,
        duration: 5000,
      });

      // Mostrar información del cambio si es pago en efectivo
      if (paymentMethod === "cash" && change > 0) {
        toast.info(`Cambio a entregar: $${change.toFixed(2)}`, {
          duration: 8000,
        });
      }

      console.log("Venta creada:", response);
    } catch (error) {
      console.error("Error al crear la venta:", error);
      toast.error("Error al procesar la venta", {
        description:
          error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-emerald-600" />
          Carrito de Compra
        </h2>
        {cart.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} productos
          </p>
        )}
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
                <CartItemComponent
                  key={`${item.id}-${index}`}
                  item={item}
                  onUpdateQuantity={(quantity) =>
                    updateQuantity(item.id, quantity)
                  }
                  onRemove={() => removeFromCart(item.id)}
                  formatCurrency={formatCurrency}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t p-4 space-y-4 bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Completar Venta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Método de pago</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Total a cobrar</Label>
              <Input
                type="text"
                value={formatCurrency(total)}
                readOnly
                className="text-right font-semibold text-lg"
              />
            </div>

            {paymentMethod === "cash" && (
              <>
                <div className="space-y-2">
                  <Label>Monto recibido</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="text-right"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                {Number(receivedAmount) > 0 && (
                  <div className="space-y-2">
                    <Label>Cambio</Label>
                    <Input
                      type="text"
                      value={
                        change >= 0 ? formatCurrency(change) : formatCurrency(0)
                      }
                      readOnly
                      className={`text-right font-semibold ${
                        change < 0 ? "text-red-500" : "text-green-600"
                      }`}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsPaymentDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handlePaymentComplete}
                disabled={
                  isProcessing ||
                  (paymentMethod === "cash" && Number(receivedAmount) < total)
                }
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Completar Venta"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
  formatCurrency,
}: {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  formatCurrency: (amount: number) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col p-3 border rounded-lg bg-white shadow-sm"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">
              {formatCurrency(item.price)} × {item.quantity}
            </span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {item.product_type === "medicine" ? "Medicina" : "General"}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="font-semibold text-emerald-600">
          {formatCurrency(item.subtotal)}
        </div>
      </div>
    </motion.div>
  );
}
