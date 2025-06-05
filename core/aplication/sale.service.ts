import type { ISaleRepository } from "../domain/repository/sale.repository";
import type { Sale } from "../domain/entity/sale.entity";
import type { PaginatedResponse } from "../domain/entity/user.entity";
import type {
  CreateSaleSchema,
  CancelSaleSchema,
  GenerateReportSchema,
  AnalyticsSchema,
} from "@/infraestructure/schema/sale.schema";
import type {
  ISaleResponse,
  ISaleSummaryResponse,
  ISaleReportResponse,
  ISaleAnalyticsResponse,
  ICancelSaleResponse,
} from "@/infraestructure/interface/sale/sale.interface";

export class SaleService {
  constructor(private readonly repository: ISaleRepository) {}

  async createSale(data: CreateSaleSchema): Promise<ISaleResponse> {
    try {
      // Validaciones adicionales
      if (data.saleDetails.length === 0) {
        throw new Error("Debe incluir al menos un detalle de venta");
      }

      // Calcular total automáticamente si no se proporciona
      if (!data.total) {
        data.total = data.saleDetails.reduce(
          (total, detail) => total + detail.quantity * detail.unit_price,
          0
        );
      }

      const response = await this.repository.createSale(data);
      return response;
    } catch (error) {
      console.error("Error en SaleService.createSale:", error);
      if (error instanceof Error) {
        throw new Error(`Error al crear la venta: ${error.message}`);
      }
      throw new Error("Error desconocido al crear la venta");
    }
  }

  async getAllSales(): Promise<Sale[]> {
    try {
      const response = await this.repository.getAllSales();
      return response;
    } catch (error) {
      console.error("Error en SaleService.getAllSales:", error);
      if (error instanceof Error) {
        throw new Error(`Error al obtener las ventas: ${error.message}`);
      }
      throw new Error("Error desconocido al obtener las ventas");
    }
  }

  async getSaleById(id: string): Promise<Sale> {
    try {
      const response = await this.repository.getSaleById(id);
      return response;
    } catch (error) {
      console.error("Error en SaleService.getSaleById:", error);
      if (error instanceof Error) {
        throw new Error(`Error al obtener la venta: ${error.message}`);
      }
      throw new Error("Error desconocido al obtener la venta");
    }
  }

  async getSalesByCash(
    cashId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Sale>> {
    try {
      const response = await this.repository.getSalesByCash(
        cashId,
        page,
        limit
      );
      return response;
    } catch (error) {
      console.error("Error en SaleService.getSalesByCash:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener las ventas por caja: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener las ventas por caja");
    }
  }

  async getSalesByBranch(
    branchId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Sale>> {
    try {
      const response = await this.repository.getSalesByBranch(
        branchId,
        page,
        limit
      );
      return response;
    } catch (error) {
      console.error("Error en SaleService.getSalesByBranch:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener las ventas por sucursal: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener las ventas por sucursal");
    }
  }

  async getSalesByDateRange(
    startDate: string,
    endDate: string,
    branchId?: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Sale>> {
    try {
      const response = await this.repository.getSalesByDateRange(
        startDate,
        endDate,
        branchId,
        page,
        limit
      );
      return response;
    } catch (error) {
      console.error("Error en SaleService.getSalesByDateRange:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener las ventas por rango de fechas: ${error.message}`
        );
      }
      throw new Error(
        "Error desconocido al obtener las ventas por rango de fechas"
      );
    }
  }

  async getSalesSummaryByCash(cashId: string): Promise<ISaleSummaryResponse> {
    try {
      const response = await this.repository.getSalesSummaryByCash(cashId);
      return response;
    } catch (error) {
      console.error("Error en SaleService.getSalesSummaryByCash:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener el resumen de ventas por caja: ${error.message}`
        );
      }
      throw new Error(
        "Error desconocido al obtener el resumen de ventas por caja"
      );
    }
  }

  async getSalesSummaryByBranch(
    branchId: string
  ): Promise<ISaleSummaryResponse> {
    try {
      const response = await this.repository.getSalesSummaryByBranch(branchId);
      return response;
    } catch (error) {
      console.error("Error en SaleService.getSalesSummaryByBranch:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener el resumen de ventas por sucursal: ${error.message}`
        );
      }
      throw new Error(
        "Error desconocido al obtener el resumen de ventas por sucursal"
      );
    }
  }

  async generateReport(
    data: GenerateReportSchema
  ): Promise<ISaleReportResponse> {
    try {
      const response = await this.repository.generateReport(data);
      return response;
    } catch (error) {
      console.error("Error en SaleService.generateReport:", error);
      if (error instanceof Error) {
        throw new Error(`Error al generar el reporte: ${error.message}`);
      }
      throw new Error("Error desconocido al generar el reporte");
    }
  }

  async getAnalytics(data: AnalyticsSchema): Promise<ISaleAnalyticsResponse> {
    try {
      const response = await this.repository.getAnalytics(data);
      return response;
    } catch (error) {
      console.error("Error en SaleService.getAnalytics:", error);
      if (error instanceof Error) {
        throw new Error(`Error al obtener los análisis: ${error.message}`);
      }
      throw new Error("Error desconocido al obtener los análisis");
    }
  }

  async cancelSale(
    id: string,
    data: CancelSaleSchema
  ): Promise<ICancelSaleResponse> {
    try {
      const response = await this.repository.cancelSale(id, data);
      return response;
    } catch (error) {
      console.error("Error en SaleService.cancelSale:", error);
      if (error instanceof Error) {
        throw new Error(`Error al cancelar la venta: ${error.message}`);
      }
      throw new Error("Error desconocido al cancelar la venta");
    }
  }
}
