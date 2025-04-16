import { InventoryService } from "@/core/aplication/inventory.service";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { InventoryApiRepository } from "@/infraestructure/repositories/inventory.api";
import { useQuery } from "@tanstack/react-query";

const inventoryRepository = new InventoryApiRepository(APIFetcher);
const inventoryService = new InventoryService(inventoryRepository);

//TODO: Crear los metodos y hooks para manejar el inventario.
export function useInventory({
  initialInventory,
}: {
  initialInventory: Inventory[];
}) {
  return {};
}
