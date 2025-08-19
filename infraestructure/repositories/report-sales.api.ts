import { ReportSales } from "@/core/domain/entity/report-sales.entity";
import { IReportSalesRepository } from "@/core/domain/repository/report-sales.repository";
import { HttpAdapter } from "../adapters/http/http.adapter";
import { normalizeText } from "../lib/utils";

export class ReportSalesApiRepository implements IReportSalesRepository {
  constructor(private readonly http: HttpAdapter) {}

  async getReportSales(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ReportSales> {
    // Construir los query parameters
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (search && search.trim()) {
      // Normalizar el término de búsqueda antes de enviarlo al servidor
      const normalizedSearch = normalizeText(search.trim());
      params.append("search", normalizedSearch);
    }

    const url = `/sales?${params.toString()}`;

    const response = await this.http.get<ReportSales>(url);
    return response;
  }
}
