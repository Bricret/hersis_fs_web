"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  Calendar,
  Check,
  ChevronDown,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  Loader2,
  LockIcon,
  PlusCircle,
  Printer,
  Search,
  UnlockIcon,
  User,
  Eye,
} from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Calendar as CalendarComponent } from "@/presentation/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Separator } from "@/presentation/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import { Textarea } from "@/presentation/components/ui/textarea";
import { toast } from "sonner";
import { Header } from "@/presentation/components/common/Header";
import type { DateRange } from "react-day-picker";

// Tipos de datos
type CashRegisterStatus = "closed" | "open";
type PaymentMethod = "efectivo" | "tarjeta" | "transferencia" | "otro";
type TransactionType = "ingreso" | "egreso";

interface CashRegisterOpening {
  id: string;
  date: string;
  time: string;
  initialAmount: number;
  userId: string;
  userName: string;
  notes?: string;
  branchId: string;
  branchName: string;
}

interface CashRegisterClosing {
  id: string;
  openingId: string;
  date: string;
  time: string;
  finalAmount: number;
  expectedAmount: number;
  difference: number;
  userId: string;
  userName: string;
  notes?: string;
  sales: {
    total: number;
    byMethod: Record<PaymentMethod, number>;
    count: number;
  };
  additionalTransactions: AdditionalTransaction[];
}

interface AdditionalTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  date: string;
  time: string;
  userId: string;
  userName: string;
}

interface Sale {
  id: string;
  date: string;
  time: string;
  total: number;
  paymentMethod: PaymentMethod;
  items: number;
  userId: string;
  userName: string;
}

// Datos de ejemplo
const currentUser = {
  id: "USR001",
  name: "María García",
  role: "Administrador",
};

const branches = [
  { id: "BR001", name: "Sucursal Principal" },
  { id: "BR002", name: "Sucursal Norte" },
  { id: "BR003", name: "Sucursal Sur" },
];

// Función para generar ID único
const generateId = (prefix: string) => {
  return `${prefix}${Date.now().toString().slice(-6)}${Math.floor(
    Math.random() * 1000
  )}`;
};

// Función para formatear fecha
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// Función para formatear hora
const formatTime = (date: Date) => {
  return date.toTimeString().split(" ")[0].substring(0, 5);
};

// Función para formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

// Generar datos de ejemplo para ventas
const generateSampleSales = (): Sale[] => {
  const sales: Sale[] = [];
  const today = new Date();
  const paymentMethods: PaymentMethod[] = [
    "efectivo",
    "tarjeta",
    "transferencia",
    "otro",
  ];

  for (let i = 0; i < 15; i++) {
    const saleDate = new Date(today);
    saleDate.setHours(
      9 + Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 60),
      0,
      0
    );

    sales.push({
      id: generateId("S"),
      date: formatDate(saleDate),
      time: formatTime(saleDate),
      total: Math.round(Math.random() * 1000 + 50) / 1,
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      items: Math.floor(Math.random() * 5) + 1,
      userId: currentUser.id,
      userName: currentUser.name,
    });
  }

  return sales.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });
};

// Generar datos de ejemplo para aperturas y cierres
const generateSampleOpeningsAndClosings = () => {
  const openings: CashRegisterOpening[] = [];
  const closings: CashRegisterClosing[] = [];

  // Últimos 10 días
  const today = new Date();

  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const openingDate = new Date(date);
    openingDate.setHours(8, 30, 0, 0);

    const closingDate = new Date(date);
    closingDate.setHours(18, 45, 0, 0);

    const openingId = generateId("O");
    const initialAmount = 2000;

    // Crear apertura
    openings.push({
      id: openingId,
      date: formatDate(openingDate),
      time: formatTime(openingDate),
      initialAmount,
      userId: currentUser.id,
      userName: currentUser.name,
      branchId: "BR001",
      branchName: "Sucursal Principal",
    });

    // Generar transacciones adicionales
    const additionalTransactions: AdditionalTransaction[] = [];
    const numTransactions = Math.floor(Math.random() * 3);

    for (let j = 0; j < numTransactions; j++) {
      const transactionDate = new Date(date);
      transactionDate.setHours(
        10 + Math.floor(Math.random() * 7),
        Math.floor(Math.random() * 60),
        0,
        0
      );

      additionalTransactions.push({
        id: generateId("T"),
        type: Math.random() > 0.7 ? "ingreso" : "egreso",
        amount: Math.round(Math.random() * 500 + 50) / 1,
        description:
          Math.random() > 0.7
            ? "Pago de proveedor"
            : Math.random() > 0.5
            ? "Compra de suministros"
            : "Reembolso a cliente",
        paymentMethod: "efectivo",
        date: formatDate(transactionDate),
        time: formatTime(transactionDate),
        userId: currentUser.id,
        userName: currentUser.name,
      });
    }

    // Calcular ventas del día
    const totalSales = Math.round(Math.random() * 8000 + 2000) / 1;
    const cashSales = Math.round(totalSales * (0.3 + Math.random() * 0.2)) / 1;
    const cardSales = Math.round(totalSales * (0.3 + Math.random() * 0.2)) / 1;
    const transferSales =
      Math.round(totalSales * (0.1 + Math.random() * 0.1)) / 1;
    const otherSales =
      Math.round(totalSales - cashSales - cardSales - transferSales) / 1;

    // Calcular gastos en efectivo
    const cashExpenses = additionalTransactions
      .filter((t) => t.type === "egreso" && t.paymentMethod === "efectivo")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calcular ingresos adicionales en efectivo
    const cashIncomes = additionalTransactions
      .filter((t) => t.type === "ingreso" && t.paymentMethod === "efectivo")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calcular monto esperado en caja
    const expectedAmount =
      initialAmount + cashSales - cashExpenses + cashIncomes;

    // Simular diferencia ocasional
    const hasDifference = Math.random() > 0.8;
    const difference = hasDifference
      ? Math.round((Math.random() * 100 - 50) * 10) / 10
      : 0;
    const finalAmount = expectedAmount + difference;

    // Crear cierre
    closings.push({
      id: generateId("C"),
      openingId,
      date: formatDate(closingDate),
      time: formatTime(closingDate),
      finalAmount,
      expectedAmount,
      difference,
      userId: currentUser.id,
      userName: currentUser.name,
      sales: {
        total: totalSales,
        byMethod: {
          efectivo: cashSales,
          tarjeta: cardSales,
          transferencia: transferSales,
          otro: otherSales,
        },
        count: Math.floor(Math.random() * 30) + 10,
      },
      additionalTransactions,
    });
  }

  return { openings, closings };
};

// Generar datos de ejemplo
const sampleSales = generateSampleSales();
const { openings: sampleOpenings, closings: sampleClosings } =
  generateSampleOpeningsAndClosings();

// Componente para apertura de caja
function OpenCashRegisterDialog({
  open,
  onClose,
  onOpenCashRegister,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCashRegister: (
    opening: Omit<
      CashRegisterOpening,
      "id" | "date" | "time" | "userId" | "userName"
    >
  ) => void;
}) {
  const [initialAmount, setInitialAmount] = useState("2000.00");
  const [selectedBranch, setSelectedBranch] = useState(branches[0].id);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setInitialAmount("2000.00");
    setSelectedBranch(branches[0].id);
    setNotes("");
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = () => {
    // Validar monto inicial
    const amount = Number.parseFloat(initialAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast("Error", {
        description: "El monto inicial debe ser un número positivo",
      });
      return;
    }

    // Validar sucursal
    if (!selectedBranch) {
      toast("Error", {
        description: "Debe seleccionar una sucursal",
      });
      return;
    }

    setIsSubmitting(true);

    // Crear objeto de apertura
    const branch = branches.find((b) => b.id === selectedBranch);
    if (!branch) {
      toast("Error", {
        description: "Sucursal no encontrada",
      });
      setIsSubmitting(false);
      return;
    }

    const opening: Omit<
      CashRegisterOpening,
      "id" | "date" | "time" | "userId" | "userName"
    > = {
      initialAmount: amount,
      branchId: branch.id,
      branchName: branch.name,
      notes: notes.trim() || undefined,
    };

    // Simular proceso de apertura
    setTimeout(() => {
      onOpenCashRegister(opening);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apertura de Caja</DialogTitle>
          <DialogDescription>
            Registre el monto inicial con el que inicia operaciones
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="initial-amount">Monto Inicial</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                $
              </span>
              <Input
                id="initial-amount"
                type="number"
                min="0"
                step="0.01"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Sucursal</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger id="branch">
                <SelectValue placeholder="Seleccionar sucursal" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Observaciones o comentarios adicionales"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <UnlockIcon className="mr-2 h-4 w-4" />
                Abrir Caja
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente para registro de transacción adicional
function AddTransactionDialog({
  open,
  onClose,
  onAddTransaction,
}: {
  open: boolean;
  onClose: () => void;
  onAddTransaction: (
    transaction: Omit<
      AdditionalTransaction,
      "id" | "date" | "time" | "userId" | "userName"
    >
  ) => void;
}) {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("egreso");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTransactionType("egreso");
    setAmount("");
    setDescription("");
    setPaymentMethod("efectivo");
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = () => {
    // Validar monto
    const parsedAmount = Number.parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast("Error", {
        description: "El monto debe ser un número positivo",
      });
      return;
    }

    // Validar descripción
    if (!description.trim()) {
      toast("Error", {
        description: "Debe ingresar una descripción",
      });
      return;
    }

    setIsSubmitting(true);

    // Crear objeto de transacción
    const transaction: Omit<
      AdditionalTransaction,
      "id" | "date" | "time" | "userId" | "userName"
    > = {
      type: transactionType,
      amount: parsedAmount,
      description: description.trim(),
      paymentMethod,
    };

    // Simular proceso de registro
    setTimeout(() => {
      onAddTransaction(transaction);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Transacción</DialogTitle>
          <DialogDescription>
            Registre ingresos o egresos adicionales de caja
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Transacción</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="expense"
                  checked={transactionType === "egreso"}
                  onChange={() => setTransactionType("egreso")}
                  className="h-4 w-4"
                />
                <Label htmlFor="expense" className="cursor-pointer">
                  Egreso (Gasto)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="income"
                  checked={transactionType === "ingreso"}
                  onChange={() => setTransactionType("ingreso")}
                  className="h-4 w-4"
                />
                <Label htmlFor="income" className="cursor-pointer">
                  Ingreso
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              placeholder="Motivo de la transacción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Método de Pago</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
            >
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Registrar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente para cierre de caja
function CloseCashRegisterDialog({
  open,
  onClose,
  onCloseCashRegister,
  currentOpening,
  sales,
  additionalTransactions,
}: {
  open: boolean;
  onClose: () => void;
  onCloseCashRegister: (
    closing: Omit<
      CashRegisterClosing,
      "id" | "date" | "time" | "userId" | "userName"
    >
  ) => void;
  currentOpening: CashRegisterOpening | null;
  sales: Sale[];
  additionalTransactions: AdditionalTransaction[];
}) {
  const [finalAmount, setFinalAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedData, setCalculatedData] = useState({
    totalSales: 0,
    byMethod: {
      efectivo: 0,
      tarjeta: 0,
      transferencia: 0,
      otro: 0,
    },
    expectedAmount: 0,
    difference: 0,
  });

  // Calcular montos cuando cambian las dependencias
  useEffect(() => {
    if (currentOpening) {
      // Calcular ventas por método de pago
      const salesByMethod: Record<PaymentMethod, number> = {
        efectivo: 0,
        tarjeta: 0,
        transferencia: 0,
        otro: 0,
      };

      for (const sale of sales) {
        salesByMethod[sale.paymentMethod] += sale.total;
      }

      const totalSales = Object.values(salesByMethod).reduce(
        (sum, amount) => sum + amount,
        0
      );

      // Calcular gastos en efectivo
      const cashExpenses = additionalTransactions
        .filter((t) => t.type === "egreso" && t.paymentMethod === "efectivo")
        .reduce((sum, t) => sum + t.amount, 0);

      // Calcular ingresos adicionales en efectivo
      const cashIncomes = additionalTransactions
        .filter((t) => t.type === "ingreso" && t.paymentMethod === "efectivo")
        .reduce((sum, t) => sum + t.amount, 0);

      // Calcular monto esperado en caja
      const expectedAmount =
        currentOpening.initialAmount +
        salesByMethod.efectivo -
        cashExpenses +
        cashIncomes;

      // Calcular diferencia
      const parsedFinalAmount = Number.parseFloat(finalAmount) || 0;
      const difference = parsedFinalAmount - expectedAmount;

      setCalculatedData({
        totalSales,
        byMethod: salesByMethod,
        expectedAmount,
        difference,
      });

      // Si el monto final está vacío, establecerlo al monto esperado
      if (finalAmount === "" && open) {
        setFinalAmount(expectedAmount.toFixed(2));
      }
    }
  }, [currentOpening, sales, additionalTransactions, finalAmount, open]);

  // Resetear el formulario cuando se abre el diálogo
  useEffect(() => {
    if (open && currentOpening) {
      setNotes("");
      // No reseteamos finalAmount aquí, se maneja en el efecto anterior
    }
  }, [open, currentOpening]);

  const handleSubmit = () => {
    if (!currentOpening) return;

    // Validar monto final
    const parsedFinalAmount = Number.parseFloat(finalAmount);
    if (Number.isNaN(parsedFinalAmount) || parsedFinalAmount < 0) {
      toast("Error", {
        description: "El monto final debe ser un número positivo o cero",
      });
      return;
    }

    setIsSubmitting(true);

    // Crear objeto de cierre
    const closing: Omit<
      CashRegisterClosing,
      "id" | "date" | "time" | "userId" | "userName"
    > = {
      openingId: currentOpening.id,
      finalAmount: parsedFinalAmount,
      expectedAmount: calculatedData.expectedAmount,
      difference: calculatedData.difference,
      sales: {
        total: calculatedData.totalSales,
        byMethod: calculatedData.byMethod,
        count: sales.length,
      },
      additionalTransactions,
      notes: notes.trim() || undefined,
    };

    // Simular proceso de cierre
    setTimeout(() => {
      onCloseCashRegister(closing);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  if (!currentOpening) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cierre de Caja</DialogTitle>
          <DialogDescription>
            Registre el monto final y genere el reporte de cierre
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Resumen de Operaciones</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto inicial:</span>
                <span className="font-medium">
                  {formatCurrency(currentOpening.initialAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Ventas en efectivo:
                </span>
                <span className="font-medium">
                  {formatCurrency(calculatedData.byMethod.efectivo)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Ventas con tarjeta:
                </span>
                <span className="font-medium">
                  {formatCurrency(calculatedData.byMethod.tarjeta)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Ventas por transferencia:
                </span>
                <span className="font-medium">
                  {formatCurrency(calculatedData.byMethod.transferencia)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Otros métodos de pago:
                </span>
                <span className="font-medium">
                  {formatCurrency(calculatedData.byMethod.otro)}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total ventas:</span>
                <span className="font-medium">
                  {formatCurrency(calculatedData.totalSales)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Número de ventas:</span>
                <span className="font-medium">{sales.length}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Gastos en efectivo:
                </span>
                <span className="font-medium text-red-500">
                  {formatCurrency(
                    additionalTransactions
                      .filter(
                        (t) =>
                          t.type === "egreso" && t.paymentMethod === "efectivo"
                      )
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Ingresos adicionales en efectivo:
                </span>
                <span className="font-medium text-green-500">
                  {formatCurrency(
                    additionalTransactions
                      .filter(
                        (t) =>
                          t.type === "ingreso" && t.paymentMethod === "efectivo"
                      )
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-medium">
                <span>Monto esperado en caja:</span>
                <span>{formatCurrency(calculatedData.expectedAmount)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="final-amount">Monto Final en Caja</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                $
              </span>
              <Input
                id="final-amount"
                type="number"
                min="0"
                step="0.01"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="pl-7"
              />
            </div>

            {Number.parseFloat(finalAmount) !== 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm">Diferencia:</span>
                <Badge
                  variant={
                    calculatedData.difference === 0
                      ? "outline"
                      : calculatedData.difference > 0
                      ? "success"
                      : "destructive"
                  }
                >
                  {calculatedData.difference === 0
                    ? "Sin diferencia"
                    : calculatedData.difference > 0
                    ? `Sobrante: ${formatCurrency(calculatedData.difference)}`
                    : `Faltante: ${formatCurrency(
                        Math.abs(calculatedData.difference)
                      )}`}
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Observaciones o comentarios adicionales"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <LockIcon className="mr-2 h-4 w-4" />
                Cerrar Caja
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente para ver detalles de cierre
function ClosingDetailsDialog({
  open,
  onClose,
  closing,
  opening,
}: {
  open: boolean;
  onClose: () => void;
  closing: CashRegisterClosing | null;
  opening: CashRegisterOpening | null;
}) {
  if (!closing || !opening) return null;

  const formatDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toLocaleString("es-MX", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles de Cierre de Caja</DialogTitle>
          <DialogDescription>
            Reporte completo del cierre de caja #{closing.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium">Cierre #{closing.id}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(closing.date, closing.time)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sucursal:</span>
                    <span className="font-medium">{opening.branchName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usuario:</span>
                    <span className="font-medium">{closing.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Apertura:</span>
                    <span className="font-medium">
                      {formatDateTime(opening.date, opening.time)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cierre:</span>
                    <span className="font-medium">
                      {formatDateTime(closing.date, closing.time)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monto inicial:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(opening.initialAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Ventas totales:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(closing.sales.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monto esperado:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(closing.expectedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto final:</span>
                    <span className="font-medium">
                      {formatCurrency(closing.finalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diferencia:</span>
                    <span
                      className={`font-medium ${
                        closing.difference === 0
                          ? ""
                          : closing.difference > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {closing.difference === 0
                        ? "Sin diferencia"
                        : closing.difference > 0
                        ? `Sobrante: ${formatCurrency(closing.difference)}`
                        : `Faltante: ${formatCurrency(
                            Math.abs(closing.difference)
                          )}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desglose de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-medium">
                    Por Método de Pago
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span>Efectivo</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(closing.sales.byMethod.efectivo)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        <span>Tarjeta</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(closing.sales.byMethod.tarjeta)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4 text-purple-500" />
                        <span>Transferencia</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(closing.sales.byMethod.transferencia)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span>Otros</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(closing.sales.byMethod.otro)}
                      </span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(closing.sales.total)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Estadísticas</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Número de ventas:
                      </span>
                      <span className="font-medium">{closing.sales.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Promedio por venta:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          closing.sales.count > 0
                            ? closing.sales.total / closing.sales.count
                            : 0
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">% Efectivo:</span>
                      <span className="font-medium">
                        {closing.sales.total > 0
                          ? `${Math.round(
                              (closing.sales.byMethod.efectivo /
                                closing.sales.total) *
                                100
                            )}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        % Electrónico:
                      </span>
                      <span className="font-medium">
                        {closing.sales.total > 0
                          ? `${Math.round(
                              ((closing.sales.byMethod.tarjeta +
                                closing.sales.byMethod.transferencia +
                                closing.sales.byMethod.otro) /
                                closing.sales.total) *
                                100
                            )}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {closing.additionalTransactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Transacciones Adicionales</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {closing.additionalTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.type === "ingreso"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {transaction.type === "ingreso"
                              ? "Ingreso"
                              : "Egreso"}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {transaction.paymentMethod === "efectivo"
                            ? "Efectivo"
                            : transaction.paymentMethod === "tarjeta"
                            ? "Tarjeta"
                            : transaction.paymentMethod === "transferencia"
                            ? "Transferencia"
                            : "Otro"}
                        </TableCell>
                        <TableCell>{transaction.time}</TableCell>
                        <TableCell className="text-right font-medium">
                          <span
                            className={
                              transaction.type === "ingreso"
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {transaction.type === "ingreso" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {closing.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{closing.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente principal
export default function CashRegisterPage() {
  const [cashRegisterStatus, setCashRegisterStatus] =
    useState<CashRegisterStatus>("closed");
  const [currentOpening, setCurrentOpening] =
    useState<CashRegisterOpening | null>(null);
  const [openings, setOpenings] =
    useState<CashRegisterOpening[]>(sampleOpenings);
  const [closings, setClosings] =
    useState<CashRegisterClosing[]>(sampleClosings);
  const [todaySales, setTodaySales] = useState<Sale[]>(sampleSales);
  const [additionalTransactions, setAdditionalTransactions] = useState<
    AdditionalTransaction[]
  >([]);

  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showAddTransactionDialog, setShowAddTransactionDialog] =
    useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const [selectedClosing, setSelectedClosing] =
    useState<CashRegisterClosing | null>(null);
  const [showClosingDetails, setShowClosingDetails] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isExporting, setIsExporting] = useState(false);

  // Abrir caja
  const handleOpenCashRegister = (
    opening: Omit<
      CashRegisterOpening,
      "id" | "date" | "time" | "userId" | "userName"
    >
  ) => {
    const now = new Date();
    const newOpening: CashRegisterOpening = {
      id: generateId("O"),
      date: formatDate(now),
      time: formatTime(now),
      userId: currentUser.id,
      userName: currentUser.name,
      ...opening,
    };

    setOpenings([newOpening, ...openings]);
    setCurrentOpening(newOpening);
    setCashRegisterStatus("open");
    setAdditionalTransactions([]);

    toast("Caja abierta", {
      description: `La caja ha sido abierta con un monto inicial de ${formatCurrency(
        opening.initialAmount
      )}`,
    });
  };

  // Agregar transacción adicional
  const handleAddTransaction = (
    transaction: Omit<
      AdditionalTransaction,
      "id" | "date" | "time" | "userId" | "userName"
    >
  ) => {
    const now = new Date();
    const newTransaction: AdditionalTransaction = {
      id: generateId("T"),
      date: formatDate(now),
      time: formatTime(now),
      userId: currentUser.id,
      userName: currentUser.name,
      ...transaction,
    };

    setAdditionalTransactions([...additionalTransactions, newTransaction]);

    toast(
      transaction.type === "ingreso"
        ? "Ingreso registrado"
        : "Egreso registrado",
      {
        description: `Se ha registrado un ${
          transaction.type
        } de ${formatCurrency(transaction.amount)}`,
      }
    );
  };

  // Cerrar caja
  const handleCloseCashRegister = (
    closing: Omit<
      CashRegisterClosing,
      "id" | "date" | "time" | "userId" | "userName"
    >
  ) => {
    const now = new Date();
    const newClosing: CashRegisterClosing = {
      id: generateId("C"),
      date: formatDate(now),
      time: formatTime(now),
      userId: currentUser.id,
      userName: currentUser.name,
      ...closing,
    };

    setClosings([newClosing, ...closings]);
    setCashRegisterStatus("closed");
    setCurrentOpening(null);

    toast("Caja cerrada", {
      description: "La caja ha sido cerrada correctamente",
    });
  };

  // Ver detalles de cierre
  const handleViewClosingDetails = (closingId: string) => {
    const closing = closings.find((c) => c.id === closingId);
    if (!closing) return;

    const opening = openings.find((o) => o.id === closing.openingId);
    if (!opening) return;

    setSelectedClosing(closing);
    setShowClosingDetails(true);
  };

  // Exportar reportes
  const handleExport = () => {
    setIsExporting(true);

    // Simulamos la exportación
    setTimeout(() => {
      setIsExporting(false);
      toast("Reporte exportado", {
        description: "El reporte ha sido exportado correctamente",
      });
    }, 1500);
  };

  // Filtrar cierres según los criterios seleccionados
  const filteredClosings = closings.filter((closing) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      searchTerm === "" ||
      closing.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      closing.userName.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por rango de fechas
    const closingDate = new Date(closing.date);
    const matchesDateFrom = !dateRange.from || closingDate >= dateRange.from;
    const matchesDateTo =
      !dateRange.to ||
      closingDate <= new Date(dateRange.to.setHours(23, 59, 59, 999));

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  // Calcular totales para el resumen
  const calculateTotals = () => {
    // Ventas de hoy
    const todaySalesTotal = todaySales.reduce(
      (sum, sale) => sum + sale.total,
      0
    );

    // Ventas en efectivo de hoy
    const todayCashSales = todaySales
      .filter((sale) => sale.paymentMethod === "efectivo")
      .reduce((sum, sale) => sum + sale.total, 0);

    // Ventas con tarjeta de hoy
    const todayCardSales = todaySales
      .filter((sale) => sale.paymentMethod === "tarjeta")
      .reduce((sum, sale) => sum + sale.total, 0);

    // Gastos en efectivo de hoy
    const todayCashExpenses = additionalTransactions
      .filter((t) => t.type === "egreso" && t.paymentMethod === "efectivo")
      .reduce((sum, t) => sum + t.amount, 0);

    // Ingresos adicionales en efectivo de hoy
    const todayCashIncomes = additionalTransactions
      .filter((t) => t.type === "ingreso" && t.paymentMethod === "efectivo")
      .reduce((sum, t) => sum + t.amount, 0);

    // Monto esperado en caja
    const expectedAmount = currentOpening
      ? currentOpening.initialAmount +
        todayCashSales -
        todayCashExpenses +
        todayCashIncomes
      : 0;

    return {
      todaySalesTotal,
      todayCashSales,
      todayCardSales,
      todayCashExpenses,
      todayCashIncomes,
      expectedAmount,
    };
  };

  const {
    todaySalesTotal,
    todayCashSales,
    todayCardSales,
    todayCashExpenses,
    todayCashIncomes,
    expectedAmount,
  } = calculateTotals();

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Caja" subTitle="Gestione las operaciones de caja" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="grid gap-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  Gestión de Caja
                </h1>
                <p className="text-muted-foreground">
                  Administre las operaciones de apertura y cierre de caja
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {cashRegisterStatus === "closed" ? (
                  <Button
                    onClick={() => setShowOpenDialog(true)}
                    className="gap-2"
                  >
                    <UnlockIcon className="h-4 w-4" />
                    Abrir Caja
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddTransactionDialog(true)}
                      className="gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Registrar Transacción
                    </Button>
                    <Button
                      onClick={() => setShowCloseDialog(true)}
                      className="gap-2"
                    >
                      <LockIcon className="h-4 w-4" />
                      Cerrar Caja
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Estado actual de la caja */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Estado de Caja
                  <Badge
                    variant={
                      cashRegisterStatus === "open" ? "success" : "secondary"
                    }
                  >
                    {cashRegisterStatus === "open" ? "Abierta" : "Cerrada"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {cashRegisterStatus === "open"
                    ? "La caja está actualmente abierta y lista para registrar operaciones"
                    : "La caja está cerrada. Abra la caja para comenzar a registrar operaciones"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cashRegisterStatus === "open" && currentOpening ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">
                          Información de Apertura
                        </h3>
                        <div className="mt-1 rounded-lg border p-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">
                              Fecha de apertura:
                            </div>
                            <div className="font-medium">
                              {currentOpening.date} {currentOpening.time}
                            </div>
                            <div className="text-muted-foreground">
                              Usuario:
                            </div>
                            <div className="font-medium">
                              {currentOpening.userName}
                            </div>
                            <div className="text-muted-foreground">
                              Sucursal:
                            </div>
                            <div className="font-medium">
                              {currentOpening.branchName}
                            </div>
                            <div className="text-muted-foreground">
                              Monto inicial:
                            </div>
                            <div className="font-medium">
                              {formatCurrency(currentOpening.initialAmount)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium">
                          Transacciones Adicionales
                        </h3>
                        {additionalTransactions.length === 0 ? (
                          <div className="mt-1 rounded-lg border border-dashed p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                              No hay transacciones adicionales registradas
                            </p>
                          </div>
                        ) : (
                          <div className="mt-1 max-h-[200px] overflow-y-auto rounded-lg border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Tipo</TableHead>
                                  <TableHead>Descripción</TableHead>
                                  <TableHead className="text-right">
                                    Monto
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {additionalTransactions.map((transaction) => (
                                  <TableRow key={transaction.id}>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          transaction.type === "ingreso"
                                            ? "success"
                                            : "destructive"
                                        }
                                      >
                                        {transaction.type === "ingreso"
                                          ? "Ingreso"
                                          : "Egreso"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {transaction.description}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      <span
                                        className={
                                          transaction.type === "ingreso"
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }
                                      >
                                        {transaction.type === "ingreso"
                                          ? "+"
                                          : "-"}
                                        {formatCurrency(transaction.amount)}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">
                          Resumen de Ventas del Día
                        </h3>
                        <div className="mt-1 rounded-lg border p-3">
                          <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Ventas totales:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(todaySalesTotal)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Ventas en efectivo:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(todayCashSales)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Ventas con tarjeta:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(todayCardSales)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Número de ventas:
                              </span>
                              <span className="font-medium">
                                {todaySales.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium">Balance de Caja</h3>
                        <div className="mt-1 rounded-lg border p-3">
                          <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Monto inicial:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(currentOpening.initialAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Ventas en efectivo:
                              </span>
                              <span className="font-medium text-green-500">
                                +{formatCurrency(todayCashSales)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Gastos en efectivo:
                              </span>
                              <span className="font-medium text-red-500">
                                -{formatCurrency(todayCashExpenses)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Ingresos adicionales:
                              </span>
                              <span className="font-medium text-green-500">
                                +{formatCurrency(todayCashIncomes)}
                              </span>
                            </div>
                            <Separator className="my-1" />
                            <div className="flex justify-between font-medium">
                              <span>Monto esperado en caja:</span>
                              <span>{formatCurrency(expectedAmount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                    <LockIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Caja Cerrada</h3>
                    <p className="mt-1 text-center text-sm text-muted-foreground">
                      La caja está actualmente cerrada. Haga clic en "Abrir
                      Caja" para iniciar operaciones.
                    </p>
                    <Button
                      onClick={() => setShowOpenDialog(true)}
                      className="mt-4 gap-2"
                    >
                      <UnlockIcon className="h-4 w-4" />
                      Abrir Caja
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historial de cierres */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">
                  Historial de Cierres
                </h2>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Exportar Reportes
                    </>
                  )}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Filtros</CardTitle>
                  <CardDescription>
                    Utilice los filtros para encontrar cierres específicos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="search">Buscar</Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          type="search"
                          placeholder="Buscar por ID o usuario..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Rango de fechas</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {dateRange.from ? (
                                dateRange.to ? (
                                  <>
                                    {dateRange.from.toLocaleDateString()} -{" "}
                                    {dateRange.to.toLocaleDateString()}
                                  </>
                                ) : (
                                  dateRange.from.toLocaleDateString()
                                )
                              ) : (
                                "Seleccionar fechas"
                              )}
                            </div>
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="range"
                            selected={dateRange as DateRange}
                            onSelect={(range) =>
                              setDateRange(range as DateRange)
                            }
                            numberOfMonths={2}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Lista de Cierres</CardTitle>
                    <CardDescription>
                      {filteredClosings.length} cierres encontrados
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setDateRange({});
                    }}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Limpiar filtros
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Ventas</TableHead>
                          <TableHead>Monto Final</TableHead>
                          <TableHead>Diferencia</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClosings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No se encontraron cierres con los filtros
                              seleccionados
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredClosings.map((closing) => {
                            const opening = openings.find(
                              (o) => o.id === closing.openingId
                            );

                            return (
                              <TableRow key={closing.id}>
                                <TableCell className="font-medium">
                                  {closing.id}
                                </TableCell>
                                <TableCell>
                                  {closing.date} {closing.time}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{closing.userName}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span>
                                      {formatCurrency(closing.sales.total)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {closing.sales.count} ventas
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(closing.finalAmount)}
                                </TableCell>
                                <TableCell>
                                  {closing.difference === 0 ? (
                                    <Badge variant="outline">
                                      Sin diferencia
                                    </Badge>
                                  ) : closing.difference > 0 ? (
                                    <Badge variant="success">
                                      Sobrante:{" "}
                                      {formatCurrency(closing.difference)}
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">
                                      Faltante:{" "}
                                      {formatCurrency(
                                        Math.abs(closing.difference)
                                      )}
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleViewClosingDetails(closing.id)
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      {/* Diálogos */}
      <OpenCashRegisterDialog
        open={showOpenDialog}
        onClose={() => setShowOpenDialog(false)}
        onOpenCashRegister={handleOpenCashRegister}
      />

      <AddTransactionDialog
        open={showAddTransactionDialog}
        onClose={() => setShowAddTransactionDialog(false)}
        onAddTransaction={handleAddTransaction}
      />

      <CloseCashRegisterDialog
        open={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        onCloseCashRegister={handleCloseCashRegister}
        currentOpening={currentOpening}
        sales={todaySales}
        additionalTransactions={additionalTransactions}
      />

      <ClosingDetailsDialog
        open={showClosingDetails}
        onClose={() => setShowClosingDetails(false)}
        closing={selectedClosing}
        opening={
          selectedClosing
            ? openings.find((o) => o.id === selectedClosing.openingId) || null
            : null
        }
      />
    </div>
  );
}
