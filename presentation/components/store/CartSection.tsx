import { ShoppingCart, Package, X, Trash2, CreditCard } from "lucide-react";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import { Separator } from "@/presentation/components/ui/separator";
import { CardBackgroundShine } from "@/presentation/components/ui/CardShine";
import PlusMinusInput from "@/presentation/components/common/PlusMinusInput";
import type { CartItem } from "@/core/data/sales/DataSales";

interface CartSectionProps {
  cart: CartItem[];
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  calculateTotal: () => number;
}

export const CartSection = ({
  cart,
  onRemove,
  onUpdateQuantity,
  onClear,
  onCheckout,
  calculateTotal,
}: CartSectionProps) => {
  const total = calculateTotal();
  const iva = total * 0.16;
  const totalWithTax = total + iva;

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5" />
          Carrito de Compra
          {cart.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {cart.reduce((total, item) => total + item.quantity, 0)} items
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ScrollArea className="h-[400px] pr-4">
          {cart.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-center">
              <Package className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm font-medium">El carrito está vacío</div>
              <div className="text-xs text-muted-foreground">
                Agregue productos para comenzar una venta
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <CardBackgroundShine key={`${item.id}-${index}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{item.name}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => onRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.sellByUnit
                        ? `Unidad - $${item.price.toFixed(2)}`
                        : `Caja (${
                            item.unitsPerBox
                          } unidades) - $${item.price.toFixed(2)}`}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <PlusMinusInput
                        quantity={item.quantity}
                        setQuantity={(quantity: number) =>
                          onUpdateQuantity(index, quantity)
                        }
                      />
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardBackgroundShine>
              ))}
            </div>
          )}
        </ScrollArea>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">IVA (16%)</span>
            <span>${iva.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span className="text-xl">${totalWithTax.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          className="w-1/2 gap-1"
          onClick={onClear}
          disabled={cart.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Limpiar
        </Button>
        <Button
          className="w-1/2 gap-1"
          disabled={cart.length === 0}
          onClick={onCheckout}
        >
          <CreditCard className="h-4 w-4" />
          Procesar Pago
        </Button>
      </CardFooter>
    </Card>
  );
};
