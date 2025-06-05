"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  Calendar,
  ChevronDown,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  Loader2,
  LockIcon,
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

// Server actions
import {
  getActiveCash,
  getCashSummary,
  openCash,
  closeCash,
} from "@/presentation/services/server/cash.server";

import { useAuthStore } from "@/presentation/store/auth.store";
import type {
  OpenCashSchema,
  CloseCashSchema,
} from "@/infraestructure/schema/cash.schema";
import type { Cash } from "@/core/domain/entity/cash.entity";
import { CashStatus } from "@/core/domain/entity/cash.entity";
import type { ICashSummary } from "@/infraestructure/interface/cash/cash.interface";

// Función para formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(amount);
};

// Función para formatear fecha y hora
const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

// Función helper para convertir montos a número
const parseAmount = (amount: any): number => {
  if (typeof amount === "number") return amount;
  return parseFloat(amount || "0");
};

// Componente para apertura de caja
function OpenCashRegisterDialog({
  open,
  onClose,
  onOpenCashRegister,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCashRegister: (data: OpenCashSchema) => void;
}) {
  const [initialAmount, setInitialAmount] = useState("2000.00");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const resetForm = () => {
    setInitialAmount("2000.00");
    setNotes("");
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = () => {
    const amount = Number.parseFloat(initialAmount);
    if (Number.isNaN(amount) || amount < 0) {
      toast.error("El monto inicial debe ser un número positivo");
      return;
    }

    if (!user?.sub) {
      toast.error("Usuario no autenticado");
      return;
    }

    setIsSubmitting(true);

    const openingData: OpenCashSchema = {
      monto_inicial: amount,
      branch_id: "dcdfcc7a-b5fa-444f-b6c1-bcff84365f64",
      observaciones: notes.trim() || undefined,
      user_apertura_id: user.sub,
    };

    onOpenCashRegister(openingData);
    setIsSubmitting(false);
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

// Componente para cierre de caja
function CloseCashRegisterDialog({
  open,
  onClose,
  onCloseCashRegister,
  activeCash,
  cashSummary,
}: {
  open: boolean;
  onClose: () => void;
  onCloseCashRegister: (id: string, data: CloseCashSchema) => void;
  activeCash: Cash | null;
  cashSummary: ICashSummary | null;
}) {
  const [finalAmount, setFinalAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (open && cashSummary) {
      const montoEsperado = parseAmount(cashSummary.monto_esperado);
      setFinalAmount(montoEsperado.toFixed(2) || "0.00");
      setNotes("");
    }
  }, [open, cashSummary]);

  const handleSubmit = () => {
    if (!activeCash) return;

    const parsedFinalAmount = Number.parseFloat(finalAmount);
    if (Number.isNaN(parsedFinalAmount) || parsedFinalAmount < 0) {
      toast.error("El monto final debe ser un número positivo o cero");
      return;
    }

    setIsSubmitting(true);

    const closingData: CloseCashSchema = {
      user_cierre_id: user?.sub || "",
      monto_final: parsedFinalAmount,
      observaciones: notes.trim() || undefined,
    };

    onCloseCashRegister(activeCash.id, closingData);
    setIsSubmitting(false);
  };

  if (!activeCash || !cashSummary) return null;

  const montoEsperadoNumerico = parseAmount(cashSummary.monto_esperado);
  const difference = Number.parseFloat(finalAmount) - montoEsperadoNumerico;

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
                  {formatCurrency(activeCash.monto_inicial)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ventas totales:</span>
                <span className="font-medium">
                  {formatCurrency(parseAmount(cashSummary.ventas_totales))}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-medium">
                <span>Monto esperado en caja:</span>
                <span>{formatCurrency(montoEsperadoNumerico)}</span>
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
                    difference === 0
                      ? "outline"
                      : difference > 0
                      ? "default"
                      : "destructive"
                  }
                >
                  {difference === 0
                    ? "Sin diferencia"
                    : difference > 0
                    ? `Sobrante: ${formatCurrency(difference)}`
                    : `Faltante: ${formatCurrency(Math.abs(difference))}`}
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
  summary,
}: {
  open: boolean;
  onClose: () => void;
  closing: Cash | null;
  summary: ICashSummary | null;
}) {
  if (!closing) return null;

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
                {formatDateTime(closing.fecha_cierre || closing.created_at)}
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
                    <span className="font-medium">{closing.branch.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Usuario apertura:
                    </span>
                    <span className="font-medium">
                      {closing.user_apertura.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Usuario cierre:
                    </span>
                    <span className="font-medium">
                      {closing.user_cierre?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className="font-medium">
                      <Badge
                        variant={
                          closing.estado === CashStatus.CERRADA
                            ? "outline"
                            : "default"
                        }
                      >
                        {closing.estado === CashStatus.CERRADA
                          ? "Cerrada"
                          : "Abierta"}
                      </Badge>
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
                      {formatCurrency(closing.monto_inicial)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Ventas totales:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(parseAmount(closing.ventas_totales))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monto esperado:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(parseAmount(closing.monto_esperado))}
                    </span>
                  </div>
                  {closing.monto_final !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monto final:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(closing.monto_final)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diferencia:</span>
                    <span
                      className={`font-medium ${
                        closing.diferencia === 0
                          ? ""
                          : closing.diferencia > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {closing.diferencia === 0
                        ? "Sin diferencia"
                        : closing.diferencia > 0
                        ? `Sobrante: ${formatCurrency(closing.diferencia)}`
                        : `Faltante: ${formatCurrency(
                            Math.abs(closing.diferencia)
                          )}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {summary && (
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
                          {formatCurrency(
                            summary.ventas_por_metodo?.efectivo || 0
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-500" />
                          <span>Tarjeta</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(
                            summary.ventas_por_metodo?.tarjeta || 0
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ArrowDown className="h-4 w-4 text-purple-500" />
                          <span>Transferencia</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(
                            summary.ventas_por_metodo?.transferencia || 0
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>Otros</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(summary.ventas_por_metodo?.otro || 0)}
                        </span>
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
                        <span className="font-medium">
                          {summary.estadisticas?.numero_ventas || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Promedio por venta:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            summary.estadisticas?.promedio_venta || 0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {closing.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle>Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{closing.observaciones}</p>
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
export default function MainCashierSection({
  cash,
  initialActiveCash,
  initialSummary,
}: {
  cash: Cash[];
  initialActiveCash: Cash | null;
  initialSummary: ICashSummary | null;
}) {
  const branchId = "dcdfcc7a-b5fa-444f-b6c1-bcff84365f64";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Estados para diálogos
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [selectedClosing, setSelectedClosing] = useState<Cash | null>(null);
  const [showClosingDetails, setShowClosingDetails] = useState(false);
  const [selectedClosingSummary, setSelectedClosingSummary] =
    useState<ICashSummary | null>(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isExporting, setIsExporting] = useState(false);

  // Estados para datos
  const [activeCash, setActiveCash] = useState<Cash | null>(initialActiveCash);
  const [activeCashSummary, setActiveCashSummary] =
    useState<ICashSummary | null>(initialSummary);
  const [isLoadingActive, setIsLoadingActive] = useState(false);

  // Refrescar datos de la caja activa
  const refreshActiveCash = async () => {
    setIsLoadingActive(true);
    try {
      const [newActiveCash, newSummary] = await Promise.all([
        getActiveCash(branchId).catch(() => null),
        activeCash?.id
          ? getCashSummary(activeCash.id).catch(() => null)
          : Promise.resolve(null),
      ]);
      setActiveCash(newActiveCash);
      setActiveCashSummary(newSummary);
    } catch (error) {
      console.error("Error al refrescar datos de caja:", error);
    } finally {
      setIsLoadingActive(false);
    }
  };

  // Manejar apertura de caja
  const handleOpenCashRegister = async (data: OpenCashSchema) => {
    startTransition(async () => {
      try {
        await openCash(data);
        toast.success("Caja abierta correctamente");
        setShowOpenDialog(false);
        await refreshActiveCash();
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al abrir la caja"
        );
      }
    });
  };

  // Manejar cierre de caja
  const handleCloseCashRegister = async (id: string, data: CloseCashSchema) => {
    startTransition(async () => {
      try {
        await closeCash(id, data);
        toast.success("Caja cerrada correctamente");
        setShowCloseDialog(false);
        await refreshActiveCash();
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al cerrar la caja"
        );
      }
    });
  };

  // Ver detalles de cierre
  const handleViewClosingDetails = async (cash: Cash) => {
    setSelectedClosing(cash);
    setSelectedClosingSummary(null);
    setShowClosingDetails(true);

    // Cargar el summary para este cierre
    if (cash.id) {
      try {
        const summary = await getCashSummary(cash.id);
        setSelectedClosingSummary(summary);
      } catch (error) {
        console.error("Error al cargar resumen:", error);
      }
    }
  };

  // Exportar reportes
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Reporte exportado correctamente");
    }, 1500);
  };

  // Filtrar cierres
  const filteredCash = cash.filter((cashItem) => {
    const matchesSearch =
      searchTerm === "" ||
      cashItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashItem.user_apertura.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const cashDate = new Date(cashItem.fecha_apertura);
    const matchesDateFrom = !dateRange.from || cashDate >= dateRange.from;
    const matchesDateTo =
      !dateRange.to ||
      cashDate <= new Date(dateRange.to.setHours(23, 59, 59, 999));

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  if (isLoadingActive && !activeCash) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-2 text-sm text-muted-foreground">
          Cargando estado de caja...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Caja" subTitle="Gestione las operaciones de caja" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-6">
            {/* Estado actual de la caja */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Estado de Caja
                  <Badge
                    variant={
                      activeCash?.estado === CashStatus.CERRADA
                        ? "default"
                        : "success"
                    }
                  >
                    {activeCash?.estado === CashStatus.CERRADA
                      ? "Cerrada"
                      : "Abierta"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {activeCash?.estado === CashStatus.CERRADA
                    ? "La caja está cerrada. Abra la caja para comenzar a registrar operaciones"
                    : "La caja está actualmente abierta y lista para registrar operaciones"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!activeCash || activeCash.estado === CashStatus.CERRADA ? (
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
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UnlockIcon className="h-4 w-4" />
                      )}
                      Abrir Caja
                    </Button>
                  </div>
                ) : (
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
                              {formatDateTime(activeCash?.fecha_apertura || "")}
                            </div>
                            <div className="text-muted-foreground">
                              Usuario:
                            </div>
                            <div className="font-medium">
                              {activeCash?.user_apertura.name}
                            </div>
                            <div className="text-muted-foreground">
                              Sucursal:
                            </div>
                            <div className="font-medium">
                              {activeCash?.branch.name}
                            </div>
                            <div className="text-muted-foreground">
                              Monto inicial:
                            </div>
                            <div className="font-medium">
                              {formatCurrency(activeCash?.monto_inicial || 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Resumen del Día</h3>
                        <div className="mt-1 rounded-lg border p-3">
                          <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Ventas totales:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  parseAmount(activeCashSummary?.ventas_totales)
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Monto esperado:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  parseAmount(activeCashSummary?.monto_esperado)
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Número de ventas:
                              </span>
                              <span className="font-medium">
                                {activeCashSummary?.estadisticas
                                  ?.numero_ventas || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowCloseDialog(true)}
                        className="w-full gap-2"
                        variant="destructive"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LockIcon className="h-4 w-4" />
                        )}
                        Cerrar Caja
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historial de cierres */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">
                  Historial de Caja
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
                    <CardTitle>Lista de Caja</CardTitle>
                    <CardDescription>
                      {filteredCash.length} registros encontrados
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
                          <TableHead>Estado</TableHead>
                          <TableHead>Monto Final</TableHead>
                          <TableHead>Diferencia</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isPending ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                            </TableCell>
                          </TableRow>
                        ) : filteredCash.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No se encontraron registros con los filtros
                              seleccionados
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCash.map((cashItem) => (
                            <TableRow key={cashItem.id}>
                              <TableCell className="font-medium">
                                {cashItem.id}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(cashItem.fecha_apertura)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span>{cashItem.user_apertura.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    cashItem.estado === CashStatus.CERRADA
                                      ? "outline"
                                      : "default"
                                  }
                                >
                                  {cashItem.estado === CashStatus.CERRADA
                                    ? "Cerrada"
                                    : "Abierta"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {cashItem.monto_final !== undefined
                                  ? formatCurrency(cashItem.monto_final)
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                {cashItem.diferencia === 0 ? (
                                  <Badge variant="outline">
                                    Sin diferencia
                                  </Badge>
                                ) : cashItem.diferencia > 0 ? (
                                  <Badge variant="default">
                                    Sobrante:{" "}
                                    {formatCurrency(cashItem.diferencia)}
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">
                                    Faltante:{" "}
                                    {formatCurrency(
                                      Math.abs(cashItem.diferencia)
                                    )}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleViewClosingDetails(cashItem)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
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

      <CloseCashRegisterDialog
        open={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        onCloseCashRegister={handleCloseCashRegister}
        activeCash={activeCash}
        cashSummary={activeCashSummary}
      />

      <ClosingDetailsDialog
        open={showClosingDetails}
        onClose={() => setShowClosingDetails(false)}
        closing={selectedClosing}
        summary={selectedClosingSummary}
      />
    </div>
  );
}
