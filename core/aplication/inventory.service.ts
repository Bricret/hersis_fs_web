import type { PaginatedResponse } from "../domain/entity/user.entity";
import type { IGenericResponse } from "@/infraestructure/interface/users/resMethod.interface";
import { IInventoryRepository } from "../domain/repository/inventory.repository";
import {
  GeneralInventory,
  Inventory,
  MedicineInventory,
  RegisterInventoryRes,
} from "../domain/entity/inventory.entity";
import {
  GeneralInventoryUpdateSchema,
  MedicineInventoryUpdateSchema,
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
    inventory: MedicineInventoryUpdateSchema | GeneralInventoryUpdateSchema;
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

  async disableInventory(id: bigint, type: string): Promise<IGenericResponse> {
    try {
      const response = await this.repository.disableProduct(id, type);
      return response;
    } catch (error) {
      console.error("Error en InventoryService.disableInventory:", error);
      if (error instanceof Error) {
        throw new Error(`Error al desactivar el producto: ${error.message}`);
      }
      throw new Error("Error desconocido al desactivar el producto");
    }
  }

  async deleteProduct(
    id: string,
    body: {
      type: string;
      user_delete: string;
    }
  ): Promise<{ message: string }> {
    try {
      const response = await this.repository.deleteProduct(id, body);
      return response;
    } catch (error) {
      console.error("Error en InventoryService.deleteProduct:", error);
      if (error instanceof Error) {
        throw new Error(`Error al eliminar el producto: ${error.message}`);
      }
      throw new Error("Error desconocido al eliminar el producto");
    }
  }

  async deleteBulkProducts(
    userId: string,
    body: {
      products: Array<{
        id: string;
        type: string;
      }>;
    }
  ): Promise<{ message: string }> {
    try {
      const response = await this.repository.deleteBulkProducts(userId, body);
      return response;
    } catch (error) {
      console.error("Error en InventoryService.deleteBulkProducts:", error);
      if (error instanceof Error) {
        throw new Error(`Error al eliminar los productos: ${error.message}`);
      }
      throw new Error("Error desconocido al eliminar los productos");
    }
  }
}
