import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { PaginatedResponse } from "@/core/domain/entity/user.entity";
import Cookies from "js-cookie";
import { IInventoryRepository } from "@/core/domain/repository/inventory.repository";
import {
  GeneralInventory,
  MedicineInventory,
} from "@/core/domain/entity/inventory.entity";
import {
  GeneralInventorySchema,
  MedicineInventorySchema,
} from "../schema/inventory.schema";
import { IGenericResponse } from "../interface/users/resMethod.interface";

export class InventoryApiRepository implements IInventoryRepository {
  constructor(private readonly http: HttpAdapter) {}

  private inventoryRecord: Record<string, unknown> = {};

  private getToken(): string {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    return token;
  }

  async createMedicineInventory(
    medicineInventory: MedicineInventorySchema
  ): Promise<MedicineInventory> {
    const response = await this.http.post<MedicineInventory>(
      "/products",
      medicineInventory
    );
    return response;
  }

  async createGeneralInventory(
    generalInventory: GeneralInventorySchema
  ): Promise<GeneralInventory> {
    const response = await this.http.post<GeneralInventory>(
      "/products",
      generalInventory
    );
    return response;
  }

  async updateInventory(
    inventory: MedicineInventorySchema | GeneralInventorySchema,
    id: string
  ): Promise<IGenericResponse> {
    const response = await this.http.patch<IGenericResponse>(
      `/products/${id}`,
      inventory
    );
    return response;
  }

  async deleteInventory(id: string): Promise<IGenericResponse> {
    const response = await this.http.delete<IGenericResponse>(
      `/products/${id}`
    );
    return response;
  }

  async getInventoryById(
    id: string
  ): Promise<MedicineInventory | GeneralInventory> {
    const response = await this.http.get<MedicineInventory | GeneralInventory>(
      `/products/${id}`
    );
    return response;
  }

  async getAllInventory(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponse<MedicineInventory | GeneralInventory>> {
    const response = await this.http.get<
      PaginatedResponse<MedicineInventory | GeneralInventory>
    >(`/products?page=${page}&limit=${limit}&search=${search}`);
    return response;
  }
}
