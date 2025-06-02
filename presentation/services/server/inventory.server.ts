import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import type { PaginatedResponse } from "@/core/domain/entity/user.entity";
import {
  GeneralInventory,
  Inventory,
  MedicineInventory,
  RegisterInventoryRes,
} from "@/core/domain/entity/inventory.entity";
import { InventoryService } from "@/core/aplication/inventory.service";
import { InventoryApiRepository } from "@/infraestructure/repositories/inventory.api";

const inventoryRepository = new InventoryApiRepository(APIFetcher);
const inventoryService = new InventoryService(inventoryRepository);

export async function getInventory(
  page = 1,
  limit = 5
): Promise<PaginatedResponse<Inventory>> {
  return await inventoryService.getAllInventory(page, limit);
}

export async function getUserById(id: string): Promise<Inventory> {
  return await inventoryRepository.getInventoryById(id);
}

export async function createInventory(
  inventory: MedicineInventory[] | GeneralInventory[]
): Promise<RegisterInventoryRes> {
  return await inventoryService.createInventory(inventory);
}
