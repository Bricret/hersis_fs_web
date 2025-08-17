import { ReportSalesService } from "@/core/aplication/report-sales.service";
import { ReportSalesApiRepository } from "@/infraestructure/repositories/report-sales.api";
import { HttpAdapter } from "@/infraestructure/adapters/http/http.adapter";
import { ReportSales } from "@/core/domain/entity/report-sales.entity";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";

const reportSalesRepository = new ReportSalesApiRepository(APIFetcher);
const reportSalesService = new ReportSalesService(reportSalesRepository);

export async function getReportSales(
  page?: number,
  limit?: number,
  search?: string
): Promise<ReportSales> {
  const reportSales = await reportSalesService.getReportSales(
    page,
    limit,
    search
  );
  return reportSales;
}
