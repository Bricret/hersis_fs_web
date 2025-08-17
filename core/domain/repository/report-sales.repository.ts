import { ReportSales } from "../entity/report-sales.entity";

export interface IReportSalesRepository {
  getReportSales(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<ReportSales>;
}
