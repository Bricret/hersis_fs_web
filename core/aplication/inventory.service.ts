import type { IUserRepository } from "../domain/repository/user.repository";
import type { User, PaginatedResponse } from "../domain/entity/user.entity";
import {
  EditUserSchema,
  UserSchema,
} from "@/infraestructure/schema/users.schema";
import {
  IGenericResponse,
  IResetPasswordResponse,
} from "@/infraestructure/interface/users/resMethod.interface";
import { IInventoryRepository } from "../domain/repository/inventory.repository";
import { Inventory } from "../domain/entity/inventory.entity";
import {
  GeneralInventorySchema,
  MedicineInventorySchema,
  ProductState,
} from "@/infraestructure/schema/inventory.schema";

export class InventoryService {
  constructor(private readonly repository: IInventoryRepository) {}

  async getAllInventory(
    page = 1,
    limit = 5,
    search = ""
  ): Promise<PaginatedResponse<Inventory>> {
    const inventory = await this.repository.getAllInventory(
      page,
      limit,
      search
    );
    return inventory;
  }

  async createInventory(
    inventory: MedicineInventorySchema | GeneralInventorySchema
  ): Promise<Inventory> {
    if (inventory.type === ProductState.MEDICINE) {
      const medicineInventory = await this.repository.createMedicineInventory(
        inventory as MedicineInventorySchema
      );
      return medicineInventory;
    } else {
      const generalInventory = await this.repository.createGeneralInventory(
        inventory as GeneralInventorySchema
      );
      return generalInventory;
    }
  }

  async updateInventory({
    inventory,
    id,
  }: {
    inventory: MedicineInventorySchema | GeneralInventorySchema;
    id: string;
  }): Promise<IGenericResponse> {
    try {
      const updatedInventory = await this.repository.updateInventory(
        inventory,
        id
      );
      return updatedInventory;
    } catch (error) {
      console.error("Error en UserService.updateUser:", error);
      if (error instanceof Error) {
        throw new Error(`Error al actualizar el inventario: ${error.message}`);
      }
      throw new Error("Error desconocido al actualizar el inventario");
    }
  }

  async disableInventory(id: string): Promise<IGenericResponse> {
    try {
      const response = await this.repository.deleteInventory(id);
      return response;
    } catch (error) {
      console.error("Error en InventoryService.disableInventory:", error);
      if (error instanceof Error) {
        throw new Error(`Error al desactivar el inventario: ${error.message}`);
      }
      throw new Error("Error desconocido al desactivar el inventario");
    }
  }
}
