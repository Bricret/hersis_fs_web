import type { ICashRepository } from "../domain/repository/cash.repository";
import type { Cash } from "../domain/entity/cash.entity";
import type { PaginatedResponse } from "../domain/entity/user.entity";
import type {
  OpenCashSchema,
  CloseCashSchema,
  UpdateCashSchema,
} from "@/infraestructure/schema/cash.schema";
import type {
  ICashResponse,
  ICashSummary,
  ICashSalesResponse,
} from "@/infraestructure/interface/cash/cash.interface";

export class CashService {
  constructor(private readonly repository: ICashRepository) {}

  async getAllCash(): Promise<Cash[]> {
    try {
      const response = await this.repository.getAllCash();
      return response;
    } catch (error) {
      console.error("Error en CashService.getAllCash:", error);
      if (error instanceof Error) {
        throw new Error(`Error al obtener las cajas: ${error.message}`);
      }
      throw new Error("Error desconocido al obtener las cajas");
    }
  }

  async getCashByBranch(
    branchId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Cash>> {
    try {
      const response = await this.repository.getCashByBranch(
        branchId,
        page,
        limit
      );
      return response;
    } catch (error) {
      console.error("Error en CashService.getCashByBranch:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener las cajas de la sucursal: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener las cajas de la sucursal");
    }
  }

  async getActiveCash(branchId: string): Promise<Cash> {
    try {
      const response = await this.repository.getActiveCash(branchId);
      return response;
    } catch (error) {
      console.error("Error en CashService.getActiveCash:", error);
      if (error instanceof Error) {
        throw new Error(`Error al obtener la caja activa: ${error.message}`);
      }
      throw new Error("Error desconocido al obtener la caja activa");
    }
  }

  async getCashById(id: string): Promise<ICashResponse> {
    try {
      const response = await this.repository.getCashById(id);
      return response;
    } catch (error) {
      console.error("Error en CashService.getCashById:", error);
      if (error instanceof Error) {
        throw new Error(`Error al obtener la caja: ${error.message}`);
      }
      throw new Error("Error desconocido al obtener la caja");
    }
  }

  async getCashSummary(id: string): Promise<ICashSummary> {
    try {
      const response = await this.repository.getCashSummary(id);
      return response;
    } catch (error) {
      console.error("Error en CashService.getCashSummary:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener el resumen de la caja: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener el resumen de la caja");
    }
  }

  async getCashSales(
    id: string,
    page = 1,
    limit = 10
  ): Promise<ICashSalesResponse> {
    try {
      const response = await this.repository.getCashSales(id, page, limit);
      return response;
    } catch (error) {
      console.error("Error en CashService.getCashSales:", error);
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener las ventas de la caja: ${error.message}`
        );
      }
      throw new Error("Error desconocido al obtener las ventas de la caja");
    }
  }

  async openCash(data: OpenCashSchema): Promise<ICashResponse> {
    try {
      // Validaciones adicionales si es necesario
      if (data.monto_inicial < 0) {
        throw new Error("El monto inicial no puede ser negativo");
      }

      const response = await this.repository.openCash(data);
      return response;
    } catch (error) {
      console.error("Error en CashService.openCash:", error);
      if (error instanceof Error) {
        throw new Error(`Error al abrir la caja: ${error.message}`);
      }
      throw new Error("Error desconocido al abrir la caja");
    }
  }

  async closeCash(id: string, data: CloseCashSchema): Promise<ICashResponse> {
    try {
      // Validaciones adicionales si es necesario
      if (data.monto_final < 0) {
        throw new Error("El monto final no puede ser negativo");
      }

      const response = await this.repository.closeCash(id, data);
      return response;
    } catch (error) {
      console.error("Error en CashService.closeCash:", error);
      if (error instanceof Error) {
        throw new Error(`Error al cerrar la caja: ${error.message}`);
      }
      throw new Error("Error desconocido al cerrar la caja");
    }
  }

  async updateCash(id: string, data: UpdateCashSchema): Promise<ICashResponse> {
    try {
      // Validaciones adicionales si es necesario
      if (data.monto_inicial && data.monto_inicial < 0) {
        throw new Error("El monto inicial no puede ser negativo");
      }

      const response = await this.repository.updateCash(id, data);
      return response;
    } catch (error) {
      console.error("Error en CashService.updateCash:", error);
      if (error instanceof Error) {
        throw new Error(`Error al actualizar la caja: ${error.message}`);
      }
      throw new Error("Error desconocido al actualizar la caja");
    }
  }

  async deleteCash(id: string): Promise<{ message: string }> {
    try {
      const response = await this.repository.deleteCash(id);
      return response;
    } catch (error) {
      console.error("Error en CashService.deleteCash:", error);
      if (error instanceof Error) {
        throw new Error(`Error al eliminar la caja: ${error.message}`);
      }
      throw new Error("Error desconocido al eliminar la caja");
    }
  }
}
