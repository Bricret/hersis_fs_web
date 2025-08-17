import { ReportSales } from "../domain/entity/report-sales.entity";
import { IReportSalesRepository } from "../domain/repository/report-sales.repository";

export class ReportSalesService {
  constructor(private readonly repository: IReportSalesRepository) {}

  async getReportSales(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<ReportSales> {
    const reportSales = await this.repository.getReportSales(
      page,
      limit,
      search
    );
    return reportSales;
  }
}
