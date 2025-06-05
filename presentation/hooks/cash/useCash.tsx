import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { CashService } from "@/core/aplication/cash.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { CashApiRepository } from "@/infraestructure/repositories/cash.api";
import type { Cash } from "@/core/domain/entity/cash.entity";
import type { PaginatedResponse } from "@/core/domain/entity/user.entity";
import type {
  OpenCashSchema,
  CloseCashSchema,
  UpdateCashSchema,
} from "@/infraestructure/schema/cash.schema";
import type {
  ICashResponse,
  ICashSummary,
} from "@/infraestructure/interface/cash/cash.interface";

const cashRepository = new CashApiRepository(APIFetcher);
const cashService = new CashService(cashRepository);

const ITEMS_PER_PAGE = 10;

export function useCash({
  initialCash,
  branchId,
}: {
  initialCash?: Cash[] | PaginatedResponse<Cash>;
  branchId?: string;
} = {}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const urlSearchTerm = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

  useEffect(() => {
    setSearchTerm(urlSearchTerm);
    setCurrentPage(1);
  }, [urlSearchTerm]);

  // Query para obtener todas las cajas o cajas por sucursal
  const {
    data: serverCash,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cash", searchTerm, currentPage, branchId],
    queryFn: async () => {
      if (branchId) {
        const response = await cashService.getCashByBranch(
          branchId,
          currentPage,
          ITEMS_PER_PAGE
        );
        return response;
      } else {
        const response = await cashService.getAllCash();
        return response;
      }
    },
    staleTime: 0,
    initialData: initialCash,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: true,
  });

  // Asegurarnos de que siempre tengamos un array de cajas
  const cash = Array.isArray(serverCash)
    ? serverCash
    : Array.isArray(serverCash?.data)
    ? serverCash.data
    : [];

  const meta = !Array.isArray(serverCash) ? serverCash?.meta : null;

  // Mutación para abrir caja
  const openCashMutation = useMutation({
    mutationFn: async (data: OpenCashSchema): Promise<ICashResponse> =>
      await cashService.openCash(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash"] });
      queryClient.invalidateQueries({ queryKey: ["activeCash"] });
    },
    onError: (error) => {
      console.error("Error al abrir la caja:", error);
      throw error;
    },
  });

  // Mutación para cerrar caja
  const closeCashMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CloseCashSchema;
    }): Promise<ICashResponse> => await cashService.closeCash(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash"] });
      queryClient.invalidateQueries({ queryKey: ["activeCash"] });
    },
    onError: (error) => {
      console.error("Error al cerrar la caja:", error);
      throw error;
    },
  });

  // Mutación para actualizar caja
  const updateCashMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCashSchema;
    }): Promise<ICashResponse> => await cashService.updateCash(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash"] });
    },
    onError: (error) => {
      console.error("Error al actualizar la caja:", error);
      throw error;
    },
  });

  // Mutación para eliminar caja
  const deleteCashMutation = useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> =>
      await cashService.deleteCash(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash"] });
    },
    onError: (error) => {
      console.error("Error al eliminar la caja:", error);
      throw error;
    },
  });

  return {
    cash,
    meta,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    openCashMutation,
    closeCashMutation,
    updateCashMutation,
    deleteCashMutation,
  };
}

// Hook específico para obtener caja activa
export function useActiveCash(branchId: string) {
  const {
    data: activeCash,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["activeCash", branchId],
    queryFn: async () => {
      try {
        const response = await cashService.getActiveCash(branchId);
        return response;
      } catch (error) {
        // Si no hay caja activa, retornamos null en lugar de error
        if (error instanceof Error && error.message.includes("404")) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
    enabled: !!branchId,
  });

  return {
    activeCash: activeCash,
    isLoading,
    error,
    refetch,
  };
}

// Hook específico para obtener resumen de caja
export function useCashSummary(cashId: string, enabled = true) {
  const {
    data: summary,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cashSummary", cashId],
    queryFn: async (): Promise<ICashSummary> =>
      await cashService.getCashSummary(cashId),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: enabled && !!cashId,
  });

  return {
    summary,
    isLoading,
    error,
  };
}

// Hook específico para obtener ventas de una caja
export function useCashSales(cashId: string, page = 1, enabled = true) {
  const {
    data: salesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cashSales", cashId, page],
    queryFn: async () =>
      await cashService.getCashSales(cashId, page, ITEMS_PER_PAGE),
    staleTime: 1 * 60 * 1000, // 1 minuto
    enabled: enabled && !!cashId,
  });

  return {
    sales: salesData?.data || [],
    meta: salesData?.meta,
    isLoading,
    error,
  };
}
