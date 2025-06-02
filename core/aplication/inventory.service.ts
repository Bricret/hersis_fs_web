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
import {
  GeneralInventory,
  Inventory,
  MedicineInventory,
  RegisterInventoryRes,
} from "../domain/entity/inventory.entity";
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
    inventory: MedicineInventory[] | GeneralInventory[]
  ): Promise<RegisterInventoryRes> {
    try {
      const response = await this.repository.createInventory(inventory);
      return response;
    } catch (error) {
      console.error("Error en InventoryService.createInventory:", error);
      throw new Error("Error desconocido al crear el inventario");
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

  async refillProduct(
    id: bigint,
    body: {
      refill: number;
      type: string;
    }
  ): Promise<{ message: string }> {
    try {
      const res = await this.repository.refillProduct(id, body);
      return res;
    } catch (error) {
      console.error("Error en UserService.refillProduct:", error);
      if (error instanceof Error) {
        throw new Error(`Error al actualizar el stock: ${error.message}`);
      }
      throw new Error("Error desconocido al actualizar el stock");
    }
  }

  async updatePriceProduct(
    id: bigint,
    body: {
      newPrice: number;
      type: string;
    }
  ): Promise<{ message: string }> {
    try {
      const res = await this.repository.updatePriceProduct(id, body);
      return res;
    } catch (error) {
      console.error("Error en UserService.updatePriceProduct:", error);
      if (error instanceof Error) {
        throw new Error(`Error al actualizar el precio: ${error.message}`);
      }
      throw new Error("Error desconocido al actualizar el precio");
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
