import type { PaginatedResponse } from "../entity/user.entity";
import {
  GeneralInventory,
  MedicineInventory,
} from "../entity/inventory.entity";
import {
  GeneralInventorySchema,
  MedicineInventorySchema,
} from "@/infraestructure/schema/inventory.schema";

export interface IInventoryRepository {
  createMedicineInventory(
    medicineInventory: MedicineInventorySchema
  ): Promise<MedicineInventory>;

  createGeneralInventory(
    generalInventory: GeneralInventorySchema
  ): Promise<GeneralInventory>;
  deleteInventory(id: string): Promise<void>;

  getInventoryById(id: string): Promise<MedicineInventory | GeneralInventory>;

  getAllInventory(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponse<MedicineInventory | GeneralInventory>>;
}
