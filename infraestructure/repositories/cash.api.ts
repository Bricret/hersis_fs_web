import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { ICashRepository } from "@/core/domain/repository/cash.repository";
import type { Cash } from "@/core/domain/entity/cash.entity";
import type { PaginatedResponse } from "@/core/domain/entity/user.entity";
import type {
  OpenCashSchema,
  CloseCashSchema,
  UpdateCashSchema,
} from "../schema/cash.schema";
import type {
  ICashResponse,
  ICashSummary,
  ICashSalesResponse,
} from "../interface/cash/cash.interface";
import Cookies from "js-cookie";

export class CashApiRepository implements ICashRepository {
  constructor(private readonly http: HttpAdapter) {}

  private getToken(): string {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    return token;
  }

  async getAllCash(): Promise<Cash[]> {
    const response = await this.http.get<Cash[]>(`/cash`);
    return response;
  }

  async getCashByBranch(
    branchId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Cash>> {
    const queryParams = new URLSearchParams({
      branch_id: branchId,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await this.http.get<PaginatedResponse<Cash>>(
      `/cash?${queryParams}`
    );
    return response;
  }

  async getActiveCash(branchId: string): Promise<Cash> {
    const response = await this.http.get<Cash>(`/cash/active/${branchId}`);
    return response;
  }

  async getCashById(id: string): Promise<ICashResponse> {
    const response = await this.http.get<ICashResponse>(`/cash/${id}`);
    return response;
  }

  async getCashSummary(id: string): Promise<ICashSummary> {
    const response = await this.http.get<ICashSummary>(`/cash/${id}/summary`);
    return response;
  }

  async getCashSales(
    id: string,
    page = 1,
    limit = 10
  ): Promise<ICashSalesResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await this.http.get<ICashSalesResponse>(
      `/cash/${id}/sales?${queryParams}`
    );
    return response;
  }

  async openCash(data: OpenCashSchema): Promise<ICashResponse> {
    const response = await this.http.post<ICashResponse>(
      "/cash",
      data,
      undefined
    );
    return response;
  }

  async closeCash(id: string, data: CloseCashSchema): Promise<ICashResponse> {
    const response = await this.http.post<ICashResponse>(
      `/cash/${id}/close`,
      data,
      undefined
    );
    return response;
  }

  async updateCash(id: string, data: UpdateCashSchema): Promise<ICashResponse> {
    const token = this.getToken();
    const response = await this.http.patch<ICashResponse>(`/cash/${id}`, data);
    return response;
  }

  async deleteCash(id: string): Promise<{ message: string }> {
    const token = this.getToken();
    const response = await this.http.delete<{ message: string }>(
      `/cash/${id}`,
      undefined,
      token
    );
    return response;
  }
}
