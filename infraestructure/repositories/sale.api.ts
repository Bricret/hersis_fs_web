import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { ISaleRepository } from "@/core/domain/repository/sale.repository";
import type { Sale } from "@/core/domain/entity/sale.entity";
import type { PaginatedResponse } from "@/core/domain/entity/user.entity";
import type {
  CreateSaleSchema,
  CancelSaleSchema,
  GenerateReportSchema,
  AnalyticsSchema,
} from "../schema/sale.schema";
import type {
  ISaleResponse,
  ISaleSummaryResponse,
  ISaleReportResponse,
  ISaleAnalyticsResponse,
  ICancelSaleResponse,
} from "../interface/sale/sale.interface";
import Cookies from "js-cookie";

export class SaleApiRepository implements ISaleRepository {
  constructor(private readonly http: HttpAdapter) {}

  private getToken(): string | undefined {
    return Cookies.get("authToken");
  }

  async createSale(data: CreateSaleSchema): Promise<ISaleResponse> {
    const response = await this.http.post<ISaleResponse>(
      "/sales",
      data,
      undefined
    );
    return response;
  }

  async getAllSales(): Promise<Sale[]> {
    const response = await this.http.get<Sale[]>("/sales");
    return response;
  }

  async getSaleById(id: string): Promise<Sale> {
    const response = await this.http.get<Sale>(`/sales/${id}`);
    return response;
  }

  async getSalesByCash(
    cashId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Sale>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await this.http.get<PaginatedResponse<Sale>>(
      `/sales/by-cash/${cashId}?${queryParams}`
    );
    return response;
  }

  async getSalesByBranch(
    branchId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Sale>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await this.http.get<PaginatedResponse<Sale>>(
      `/sales/by-branch/${branchId}?${queryParams}`
    );
    return response;
  }

  async getSalesByDateRange(
    startDate: string,
    endDate: string,
    branchId?: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Sale>> {
    const queryParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (branchId) {
      queryParams.append("branch_id", branchId);
    }

    const response = await this.http.get<PaginatedResponse<Sale>>(
      `/sales/by-date-range?${queryParams}`
    );
    return response;
  }

  async getSalesSummaryByCash(cashId: string): Promise<ISaleSummaryResponse> {
    const response = await this.http.get<ISaleSummaryResponse>(
      `/sales/summary/by-cash/${cashId}`
    );
    return response;
  }

  async getSalesSummaryByBranch(
    branchId: string
  ): Promise<ISaleSummaryResponse> {
    const response = await this.http.get<ISaleSummaryResponse>(
      `/sales/summary/by-branch/${branchId}`
    );
    return response;
  }

  async generateReport(
    data: GenerateReportSchema
  ): Promise<ISaleReportResponse> {
    const response = await this.http.post<ISaleReportResponse>(
      "/sales/generate-report",
      data,
      undefined
    );
    return response;
  }

  async getAnalytics(data: AnalyticsSchema): Promise<ISaleAnalyticsResponse> {
    const response = await this.http.post<ISaleAnalyticsResponse>(
      "/sales/analytics",
      data,
      undefined
    );
    return response;
  }

  async cancelSale(
    id: string,
    data: CancelSaleSchema
  ): Promise<ICancelSaleResponse> {
    const response = await this.http.delete<ICancelSaleResponse>(
      `/sales/cancel/${id}`,
      { body: data }
    );
    return response;
  }
}
