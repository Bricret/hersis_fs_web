import { Cash } from "../entity/cash.entity";
import { Sale } from "../entity/sale.entity";
import {
  OpenCashSchema,
  CloseCashSchema,
  UpdateCashSchema,
} from "@/infraestructure/schema/cash.schema";
import {
  ICashResponse,
  ICashListResponse,
  ICashSummary,
  ICashSalesResponse,
} from "@/infraestructure/interface/cash/cash.interface";
import { PaginatedResponse } from "../entity/user.entity";

export interface ICashRepository {
  // GET /cash - Listar todas las cajas
  getAllCash(): Promise<Cash[]>;

  // GET /cash?branch_id={id} - Cajas por sucursal
  getCashByBranch(
    branchId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Cash>>;

  // GET /cash/active/{branchId} - Caja activa de una sucursal
  getActiveCash(branchId: string): Promise<ICashResponse>;

  // GET /cash/{id} - Detalle de una caja
  getCashById(id: string): Promise<ICashResponse>;

  // GET /cash/{id}/summary - Resumen completo de caja
  getCashSummary(id: string): Promise<ICashSummary>;

  // GET /cash/{id}/sales - Ventas de una caja específica
  getCashSales(
    id: string,
    page?: number,
    limit?: number
  ): Promise<ICashSalesResponse>;

  // POST /cash - Abrir nueva caja
  openCash(data: OpenCashSchema): Promise<ICashResponse>;

  // POST /cash/{id}/close - Cerrar caja
  closeCash(id: string, data: CloseCashSchema): Promise<ICashResponse>;

  // PATCH /cash/{id} - Actualizar caja
  updateCash(id: string, data: UpdateCashSchema): Promise<ICashResponse>;

  // DELETE /cash/{id} - Eliminar caja cerrada
  deleteCash(id: string): Promise<{ message: string }>;
}
