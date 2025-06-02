"use client";

import { useState } from "react";
import { CreditCard, DollarSign, Receipt, CheckCircle2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";
import { Label } from "@/presentation/components/ui/label";
import { useIsMobile } from "@/presentation/hooks/use-mobile";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: () => void;
}

export default function PaymentDialog({
  isOpen,
  onClose,
  total,
  onPaymentComplete,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountTendered, setAmountTendered] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const isMobile = useIsMobile();
  // Calculate change if paying with cash
  const change =
    Number.parseFloat(amountTendered || "0") - total > 0
      ? Number.parseFloat(amountTendered) - total
      : 0;

  // Reset form when dialog opens/closes
  const resetForm = () => {
    setPaymentMethod("cash");
    setAmountTendered("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setIsProcessing(false);
    setIsComplete(false);
  };

  // Handle payment submission
  const handleSubmitPayment = () => {
    // Validate inputs
    if (
      paymentMethod === "cash" &&
      (Number.parseFloat(amountTendered || "0") < total || !amountTendered)
    ) {
      return; // Not enough cash
    }

    if (paymentMethod === "card" && (!cardNumber || !expiryDate || !cvv)) {
      return; // Missing card details
    }

    // Simulate payment processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      // After showing success, close and reset
      setTimeout(() => {
        onPaymentComplete();
        resetForm();
      }, 1500);
    }, 1500);
  };

  // Handle dialog close
  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      resetForm();
    }
  };

  // Custom numeric keypad for cash payments
  const NumericKeypad = () => {
    const handleKeyPress = (value: string) => {
      if (value === "clear") {
        setAmountTendered("");
      } else if (value === "backspace") {
        setAmountTendered((prev) => prev.slice(0, -1));
      } else {
        setAmountTendered((prev) => {
          // Handle decimal point
          if (value === "." && prev.includes(".")) return prev;
          return prev + value;
        });
      }
    };

    const keys = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      "0",
      "backspace",
    ];

    // Quick amount buttons
    const quickAmounts = [
      { label: "Exacto", value: total.toFixed(2) },
      { label: "$50", value: "50.00" },
      { label: "$100", value: "100.00" },
      { label: "$200", value: "200.00" },
    ];

    return (
      <div className="mt-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {quickAmounts.map((amount, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => setAmountTendered(amount.value)}
              className="text-sm"
            >
              {amount.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {keys.map((key, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-12 text-lg font-medium"
              onClick={() => handleKeyPress(key)}
            >
              {key === "backspace" ? <X className="h-5 w-5" /> : key}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-2 h-12 text-lg font-medium"
          onClick={() => handleKeyPress("clear")}
        >
          Limpiar
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`${isMobile ? "sm:max-w-full" : "sm:max-w-md"} p-0`}
      >
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Pago</DialogTitle>
        </DialogHeader>

        {isComplete ? (
          <div className="py-10 flex flex-col items-center justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Pago Completado</h2>
            <p className="text-gray-500">
              La transacción ha sido procesada exitosamente
            </p>
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-medium">Total a Pagar</h3>
              <div className="text-3xl font-bold">${total.toFixed(2)}</div>
            </div>

            <Tabs
              defaultValue="cash"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="cash" className="text-base py-3">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Efectivo
                </TabsTrigger>
                <TabsTrigger value="card" className="text-base py-3">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Tarjeta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cash" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount-tendered">Monto Recibido</Label>
                  <Input
                    id="amount-tendered"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amountTendered}
                    onChange={(e) => setAmountTendered(e.target.value)}
                    className="text-lg text-right"
                    autoFocus
                  />
                </div>

                {isMobile && <NumericKeypad />}

                {Number.parseFloat(amountTendered || "0") >= total && (
                  <div className="p-3 bg-green-50 rounded-md border border-green-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Cambio</span>
                      <span className="text-lg font-bold text-green-700">
                        ${change.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="card" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Número de Tarjeta</Label>
                  <Input
                    id="card-number"
                    placeholder="•••• •••• •••• ••••"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="text-lg"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Fecha de Expiración</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmitPayment}
                disabled={
                  isProcessing ||
                  (paymentMethod === "cash" &&
                    Number.parseFloat(amountTendered || "0") < total) ||
                  (paymentMethod === "card" &&
                    (!cardNumber || !expiryDate || !cvv))
                }
                className="bg-emerald-600 hover:bg-emerald-700 flex-1"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-opacity-50 border-t-white rounded-full"></div>
                    Procesando...
                  </div>
                ) : (
                  <>
                    <Receipt className="h-4 w-4 mr-2" />
                    Completar Pago
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
