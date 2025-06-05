"use server";

import { SaleService } from "@/core/aplication/sale.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { SaleApiRepository } from "@/infraestructure/repositories/sale.api";
import type { Sale } from "@/core/domain/entity/sale.entity";
import type { PaginatedResponse } from "@/core/domain/entity/user.entity";
import type {
  CreateSaleSchema,
  CancelSaleSchema,
  GenerateReportSchema,
  AnalyticsSchema,
} from "@/infraestructure/schema/sale.schema";
import type {
  ISaleResponse,
  ISaleSummaryResponse,
  ISaleReportResponse,
  ISaleAnalyticsResponse,
  ICancelSaleResponse,
} from "@/infraestructure/interface/sale/sale.interface";
import { revalidatePath } from "next/cache";

const saleRepository = new SaleApiRepository(APIFetcher);
const saleService = new SaleService(saleRepository);

export async function createSale(
  data: CreateSaleSchema
): Promise<ISaleResponse> {
  const response = await saleService.createSale(data);
  revalidatePath("/sales");
  return response;
}

export async function getAllSales(): Promise<Sale[]> {
  return await saleService.getAllSales();
}

export async function getSaleById(id: string): Promise<Sale> {
  return await saleService.getSaleById(id);
}

export async function getSalesByCash(
  cashId: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Sale>> {
  return await saleService.getSalesByCash(cashId, page, limit);
}

export async function getSalesByBranch(
  branchId: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Sale>> {
  return await saleService.getSalesByBranch(branchId, page, limit);
}

export async function getSalesByDateRange(
  startDate: string,
  endDate: string,
  branchId?: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Sale>> {
  return await saleService.getSalesByDateRange(
    startDate,
    endDate,
    branchId,
    page,
    limit
  );
}

export async function getSalesSummaryByCash(
  cashId: string
): Promise<ISaleSummaryResponse> {
  return await saleService.getSalesSummaryByCash(cashId);
}

export async function getSalesSummaryByBranch(
  branchId: string
): Promise<ISaleSummaryResponse> {
  return await saleService.getSalesSummaryByBranch(branchId);
}

export async function generateReport(
  data: GenerateReportSchema
): Promise<ISaleReportResponse> {
  return await saleService.generateReport(data);
}

export async function getAnalytics(
  data: AnalyticsSchema
): Promise<ISaleAnalyticsResponse> {
  return await saleService.getAnalytics(data);
}

export async function cancelSale(
  id: string,
  data: CancelSaleSchema
): Promise<ICancelSaleResponse> {
  const response = await saleService.cancelSale(id, data);
  revalidatePath("/sales");
  revalidatePath(`/sales/${id}`);
  return response;
}
