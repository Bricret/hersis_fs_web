"use server";

import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import type { PaginatedResponse } from "@/core/domain/entity/user.entity";
import {
  GeneralInventory,
  Inventory,
  MedicineInventory,
  RegisterInventoryRes,
} from "@/core/domain/entity/inventory.entity";
import {
  MedicineInventoryUpdateSchema,
  GeneralInventoryUpdateSchema,
} from "@/infraestructure/schema/inventory.schema";
import { InventoryService } from "@/core/aplication/inventory.service";
import { InventoryApiRepository } from "@/infraestructure/repositories/inventory.api";
import { IGenericResponse } from "@/infraestructure/interface/users/resMethod.interface";
import {
  revalidateAfterInventoryCreation,
  revalidateAfterInventoryUpdate,
} from "@/infraestructure/utils/revalidateCache";

const inventoryRepository = new InventoryApiRepository(APIFetcher);
const inventoryService = new InventoryService(inventoryRepository);

export async function getInventory(
  page = 1,
  limit = 5000,
  search = ""
): Promise<PaginatedResponse<Inventory>> {
  const result = await inventoryService.getAllInventory(page, limit, search);

  return result;
}

// Función para obtener inventario fresco sin cache (para después de crear productos)
export async function getFreshInventory(
  page = 1,
  limit = 100,
  search = ""
): Promise<PaginatedResponse<Inventory>> {
  // Forzamos una nueva consulta sin cache
  const freshData = await inventoryService.getAllInventory(page, limit, search);
  return freshData;
}

export async function getUserById(id: string): Promise<Inventory> {
  return await inventoryRepository.getInventoryById(id);
}

export async function createInventory(
  inventory: MedicineInventory[] | GeneralInventory[]
): Promise<RegisterInventoryRes> {
  const res = await inventoryService.createInventory(inventory);

  // Usar la nueva utilidad de revalidación
  await revalidateAfterInventoryCreation();

  return res;
}

export async function refillProduct(
  id: bigint,
  body: { refill: number; type: string }
): Promise<{ message: string }> {
  const response = await inventoryService.refillProduct(id, body);

  // Usar la nueva utilidad de revalidación
  await revalidateAfterInventoryUpdate();

  return response;
}

export async function updatePriceProduct(
  id: bigint,
  body: { newPrice: number; type: string }
): Promise<{ message: string }> {
  const response = await inventoryService.updatePriceProduct(id, body);

  // Usar la nueva utilidad de revalidación
  await revalidateAfterInventoryUpdate();

  return response;
}

export async function disableProduct(
  id: bigint,
  type: string
): Promise<IGenericResponse> {
  const res = await inventoryRepository.disableProduct(id, type);

  // Usar la nueva utilidad de revalidación
  await revalidateAfterInventoryUpdate();

  return res;
}

export async function updateInventoryProduct(
  id: string,
  inventory: MedicineInventoryUpdateSchema | GeneralInventoryUpdateSchema
): Promise<IGenericResponse> {
  const response = await inventoryService.updateInventory({
    inventory,
    id,
  });

  // Usar la nueva utilidad de revalidación
  await revalidateAfterInventoryUpdate();

  return response;
}

export async function deleteProduct(
  productId: string,
  productType: string,
  userId: string
): Promise<{ message: string }> {
  const response = await inventoryService.deleteProduct(productId, {
    type: productType,
    user_delete: userId,
  });

  // Usar la nueva utilidad de revalidación
  await revalidateAfterInventoryUpdate();

  return response;
}

export async function deleteBulkProducts(
  userId: string,
  products: Array<{ id: string; type: string }>
): Promise<{ message: string }> {
  const response = await inventoryService.deleteBulkProducts(userId, {
    products,
  });

  // Usar la nueva utilidad de revalidación
  await revalidateAfterInventoryUpdate();

  return response;
}
