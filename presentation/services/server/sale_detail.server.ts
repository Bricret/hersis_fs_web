"use server";

import { SaleDetailService } from "@/core/aplication/sale_detail.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { SaleDetailApiRepository } from "@/infraestructure/repositories/sale_detail.api";
import type { SaleDetail } from "@/core/domain/entity/sale_detail.entity";
import type { UpdateSaleDetailSchema } from "@/infraestructure/schema/sale.schema";
import type {
  ISaleDetailResponse,
  ISaleDetailUpdateResponse,
  ISaleDetailDeleteResponse,
} from "@/infraestructure/interface/sale_detail/sale_detail.interface";
import type { IProductInfoResponse } from "@/infraestructure/interface/sale/sale.interface";
import { revalidatePath } from "next/cache";

const saleDetailRepository = new SaleDetailApiRepository(APIFetcher);
const saleDetailService = new SaleDetailService(saleDetailRepository);

export async function getAllSaleDetails(): Promise<SaleDetail[]> {
  return await saleDetailService.getAllSaleDetails();
}

export async function getSaleDetailById(
  id: string
): Promise<ISaleDetailResponse> {
  return await saleDetailService.getSaleDetailById(id);
}

export async function getSaleDetailsBySale(
  saleId: string
): Promise<SaleDetail[]> {
  return await saleDetailService.getSaleDetailsBySale(saleId);
}

export async function getProductInfo(
  productId: string,
  type: "medicine" | "general"
): Promise<IProductInfoResponse> {
  return await saleDetailService.getProductInfo(productId, type);
}

export async function updateSaleDetail(
  id: string,
  data: UpdateSaleDetailSchema
): Promise<ISaleDetailUpdateResponse> {
  const response = await saleDetailService.updateSaleDetail(id, data);
  revalidatePath("/sale-detail");
  revalidatePath(`/sale-detail/${id}`);
  revalidatePath("/cashier");
  revalidatePath("/shop");
  revalidatePath("/sales");
  return response;
}

export async function deleteSaleDetail(
  id: string
): Promise<ISaleDetailDeleteResponse> {
  const response = await saleDetailService.deleteSaleDetail(id);
  revalidatePath("/sale-detail");
  revalidatePath("/cashier");
  revalidatePath("/shop");
  revalidatePath("/sales");
  return response;
}
