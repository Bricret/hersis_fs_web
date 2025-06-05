import type { ISaleDetailRepository } from "../domain/repository/sale_detail.repository";
import type { SaleDetail } from "../domain/entity/sale_detail.entity";
import type { UpdateSaleDetailSchema } from "@/infraestructure/schema/sale.schema";
import type {
  ISaleDetailResponse,
  ISaleDetailUpdateResponse,
  ISaleDetailDeleteResponse,
} from "@/infraestructure/interface/sale_detail/sale_detail.interface";
import type { IProductInfoResponse } from "@/infraestructure/interface/sale/sale.interface";

export class SaleDetailService {
  constructor(private readonly repository: ISaleDetailRepository) {}

  async getAllSaleDetails(): Promise<SaleDetail[]> {
    try {
      const response = await this.repository.getAllSaleDetails();
      return response;
    } catch (error) {
      console.error("Error en SaleDetailService.getAllSaleDetails:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener los detalles de ventas: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener los detalles de ventas");
    }
  }

  async getSaleDetailById(id: string): Promise<ISaleDetailResponse> {
    try {
      const response = await this.repository.getSaleDetailById(id);
      return response;
    } catch (error) {
      console.error("Error en SaleDetailService.getSaleDetailById:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener el detalle de venta: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener el detalle de venta");
    }
  }

  async getSaleDetailsBySale(saleId: string): Promise<SaleDetail[]> {
    try {
      const response = await this.repository.getSaleDetailsBySale(saleId);
      return response;
    } catch (error) {
      console.error("Error en SaleDetailService.getSaleDetailsBySale:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener los detalles por venta: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener los detalles por venta");
    }
  }

  async getProductInfo(
    productId: string,
    type: "medicine" | "general"
  ): Promise<IProductInfoResponse> {
    try {
      const response = await this.repository.getProductInfo(productId, type);
      return response;
    } catch (error) {
      console.error("Error en SaleDetailService.getProductInfo:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener información del producto: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener información del producto");
    }
  }

  async updateSaleDetail(
    id: string,
    data: UpdateSaleDetailSchema
  ): Promise<ISaleDetailUpdateResponse> {
    try {
      // Validaciones adicionales
      if (data.quantity && data.quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }
      if (data.unit_price && data.unit_price < 0) {
        throw new Error("El precio unitario debe ser mayor o igual a 0");
      }

      const response = await this.repository.updateSaleDetail(id, data);
      return response;
    } catch (error) {
      console.error("Error en SaleDetailService.updateSaleDetail:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al actualizar el detalle de venta: ${error.message}`
        );
      }
      throw new Error("Error desconocido al actualizar el detalle de venta");
    }
  }

  async deleteSaleDetail(id: string): Promise<ISaleDetailDeleteResponse> {
    try {
      const response = await this.repository.deleteSaleDetail(id);
      return response;
    } catch (error) {
      console.error("Error en SaleDetailService.deleteSaleDetail:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al eliminar el detalle de venta: ${error.message}`
        );
      }
      throw new Error("Error desconocido al eliminar el detalle de venta");
    }
  }
}
