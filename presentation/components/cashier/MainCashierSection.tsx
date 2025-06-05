"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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

import type {
  OpenCashSchema,
  CloseCashSchema,
} from "@/infraestructure/schema/cash.schema";
import type { Cash } from "@/core/domain/entity/cash.entity";
import type { ICashSummary } from "@/infraestructure/interface/cash/cash.interface";

// Componentes
import {
  OpenCashRegisterDialog,
  CloseCashRegisterDialog,
  ClosingDetailsDialog,
} from "./dialogs";
import {
  CashStatusSection,
  CashFiltersSection,
  CashHistorySection,
} from "./sections";

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
            <CashStatusSection
              activeCash={activeCash}
              activeCashSummary={activeCashSummary}
              isPending={isPending}
              onOpenCash={() => setShowOpenDialog(true)}
              onCloseCash={() => setShowCloseDialog(true)}
            />

            {/* Filtros */}
            <CashFiltersSection
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />

            {/* Historial de cierres */}
            <CashHistorySection
              filteredCash={filteredCash}
              isPending={isPending}
              isExporting={isExporting}
              onViewDetails={handleViewClosingDetails}
              onExport={handleExport}
              onClearFilters={() => {
                setSearchTerm("");
                setDateRange({});
              }}
            />
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
