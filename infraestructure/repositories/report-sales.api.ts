import { ReportSales } from "@/core/domain/entity/report-sales.entity";
import { IReportSalesRepository } from "@/core/domain/repository/report-sales.repository";
import { HttpAdapter } from "../adapters/http/http.adapter";

export class ReportSalesApiRepository implements IReportSalesRepository {
  constructor(private readonly http: HttpAdapter) {}

  async getReportSales(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ReportSales> {
    const response = await this.http.get<ReportSales>(`/sales`);
    return response;
  }
}
