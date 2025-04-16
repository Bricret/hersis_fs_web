import type { PaginatedResponse } from "../entity/user.entity";
import {
  GeneralInventory,
  MedicineInventory,
} from "../entity/inventory.entity";
import {
  GeneralInventorySchema,
  MedicineInventorySchema,
} from "@/infraestructure/schema/inventory.schema";
import { IGenericResponse } from "@/infraestructure/interface/users/resMethod.interface";

export interface IInventoryRepository {
  createMedicineInventory(
    medicineInventory: MedicineInventorySchema
  ): Promise<MedicineInventory>;

  createGeneralInventory(
    generalInventory: GeneralInventorySchema
  ): Promise<GeneralInventory>;
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
}
