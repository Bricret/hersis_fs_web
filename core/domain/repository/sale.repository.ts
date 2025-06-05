import { Sale } from "../entity/sale.entity";
import { PaginatedResponse } from "../entity/user.entity";
import {
  CreateSaleSchema,
  CancelSaleSchema,
  GenerateReportSchema,
  AnalyticsSchema,
} from "@/infraestructure/schema/sale.schema";
import {
  ISaleResponse,
  ISaleListResponse,
  ISaleSummaryResponse,
  ISaleReportResponse,
  ISaleAnalyticsResponse,
  ICancelSaleResponse,
} from "@/infraestructure/interface/sale/sale.interface";

export interface ISaleRepository {
  // POST /sales - Crear Venta Completa
  createSale(data: CreateSaleSchema): Promise<ISaleResponse>;

  // GET /sales - Listar Todas las Ventas
  getAllSales(): Promise<Sale[]>;

  // GET /sales/:id - Obtener Venta Específica
  getSaleById(id: string): Promise<Sale>;

  // GET /sales/by-cash/:cashId - Ventas por Caja
  getSalesByCash(
    cashId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Sale>>;

  // GET /sales/by-branch/:branchId - Ventas por Sucursal
  getSalesByBranch(
    branchId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Sale>>;

  // GET /sales/by-date-range - Ventas por Rango de Fechas
  getSalesByDateRange(
    startDate: string,
    endDate: string,
    branchId?: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Sale>>;

  // GET /sales/summary/by-cash/:cashId - Resumen de Ventas por Caja
  getSalesSummaryByCash(cashId: string): Promise<ISaleSummaryResponse>;

  // GET /sales/summary/by-branch/:branchId - Resumen por Sucursal
  getSalesSummaryByBranch(branchId: string): Promise<ISaleSummaryResponse>;

  // POST /sales/generate-report - Generar Reporte Detallado
  generateReport(data: GenerateReportSchema): Promise<ISaleReportResponse>;

  // POST /sales/analytics - Análisis Avanzado
  getAnalytics(data: AnalyticsSchema): Promise<ISaleAnalyticsResponse>;

  // DELETE /sales/cancel/:id - Cancelar Venta
  cancelSale(id: string, data: CancelSaleSchema): Promise<ICancelSaleResponse>;
}
