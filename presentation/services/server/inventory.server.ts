"use server";

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
import { revalidatePath } from "next/cache";

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
  const res = await inventoryService.createInventory(inventory);
  revalidatePath("/inventory");
  return res;
}

export async function refillProduct(
  id: bigint,
  body: { refill: number; type: string }
): Promise<{ message: string }> {
  const response = await inventoryService.refillProduct(id, body);
  revalidatePath("/inventory");
  return response;
}

export async function updatePriceProduct(
  id: bigint,
  body: { newPrice: number; type: string }
): Promise<{ message: string }> {
  const response = await inventoryService.updatePriceProduct(id, body);
  revalidatePath("/inventory");
  return response;
}
