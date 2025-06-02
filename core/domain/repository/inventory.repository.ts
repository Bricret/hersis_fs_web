import type { PaginatedResponse } from "../entity/user.entity";
import {
  GeneralInventory,
  MedicineInventory,
  RegisterInventoryRes,
} from "../entity/inventory.entity";
import {
  GeneralInventorySchema,
  MedicineInventorySchema,
} from "@/infraestructure/schema/inventory.schema";
import { IGenericResponse } from "@/infraestructure/interface/users/resMethod.interface";

export interface IInventoryRepository {
  createInventory(
    inventory: MedicineInventory[] | GeneralInventory[]
  ): Promise<RegisterInventoryRes>;

  deleteInventory(id: string): Promise<IGenericResponse>;

  getInventoryById(id: string): Promise<MedicineInventory | GeneralInventory>;

  getAllInventory(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponse<MedicineInventory | GeneralInventory>>;

  updateInventory(
    inventory: MedicineInventorySchema | GeneralInventorySchema,
    id: string
  ): Promise<IGenericResponse>;

  refillProduct(
    id: bigint,
    body: {
      refill: number;
      type: string;
    }
  ): Promise<{ message: string }>;

  updatePriceProduct(
    id: bigint,
    body: {
      newPrice: number;
      type: string;
    }
  ): Promise<{ message: string }>;
}
