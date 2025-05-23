import { InventoryService } from "@/core/aplication/inventory.service";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import {
  ITEMS_PER_PAGE,
  PaginatedResponse,
} from "@/core/domain/entity/user.entity";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { InventoryApiRepository } from "@/infraestructure/repositories/inventory.api";
import {
  GeneralInventorySchema,
  MedicineInventorySchema,
} from "@/infraestructure/schema/inventory.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const inventoryRepository = new InventoryApiRepository(APIFetcher);
const inventoryService = new InventoryService(inventoryRepository);

//TODO: Crear los metodos y hooks para manejar el inventario.
export function useInventory({
  initialInventory,
}: {
  initialInventory: Inventory[] | PaginatedResponse<Inventory>;
}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const urlSearchTerm = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

  useEffect(() => {
    setSearchTerm(urlSearchTerm);
    setCurrentPage(1);
  }, [urlSearchTerm]);

  const {
    data: serverInventory,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inventory", searchTerm, currentPage],
    queryFn: async () => {
      const response = await inventoryService.getAllInventory(
        currentPage,
        ITEMS_PER_PAGE,
        searchTerm
      );
      return response;
    },
    staleTime: 0,
    initialData: initialInventory,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: true,
  });

  const inventory = Array.isArray(serverInventory)
    ? serverInventory
    : Array.isArray(serverInventory?.data)
    ? serverInventory.data
    : [];

  const meta = !Array.isArray(serverInventory) ? serverInventory?.meta : null;

  // Mutaciones para crear, actualizar y desactivar inventario
  const createInventoryMutation = useMutation({
    mutationFn: async (
      inventory: MedicineInventorySchema | GeneralInventorySchema
    ): Promise<Inventory> => await inventoryService.createInventory(inventory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (error) => {
      console.log("Error al crear el inventario", error);
    },
  });

  return {
    inventory,
    meta,
    isLoading,
    error,
    createInventoryMutation,
  };
}
