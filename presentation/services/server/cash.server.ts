"use server";

import { CashService } from "@/core/aplication/cash.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { CashApiRepository } from "@/infraestructure/repositories/cash.api";
import type { Cash } from "@/core/domain/entity/cash.entity";
import type { PaginatedResponse } from "@/core/domain/entity/user.entity";
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
import { revalidatePath } from "next/cache";

const cashRepository = new CashApiRepository(APIFetcher);
const cashService = new CashService(cashRepository);

export async function getAllCash(): Promise<Cash[]> {
  return await cashService.getAllCash();
}

export async function getCashByBranch(
  branchId: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Cash>> {
  return await cashService.getCashByBranch(branchId, page, limit);
}

export async function getActiveCash(branchId: string): Promise<Cash> {
  return await cashService.getActiveCash(branchId);
}

export async function getCashById(id: string): Promise<ICashResponse> {
  return await cashService.getCashById(id);
}

export async function getCashSummary(id: string): Promise<ICashSummary> {
  return await cashService.getCashSummary(id);
}

export async function getCashSales(
  id: string,
  page = 1,
  limit = 10
): Promise<ICashSalesResponse> {
  return await cashService.getCashSales(id, page, limit);
}

export async function openCash(data: OpenCashSchema): Promise<ICashResponse> {
  const response = await cashService.openCash(data);
  revalidatePath("/cashier");
  revalidatePath("/shop");
  return response;
}

export async function closeCash(
  id: string,
  data: CloseCashSchema
): Promise<ICashResponse> {
  const response = await cashService.closeCash(id, data);
  revalidatePath("/cashier");
  return response;
}

export async function updateCash(
  id: string,
  data: UpdateCashSchema
): Promise<ICashResponse> {
  const response = await cashService.updateCash(id, data);
  revalidatePath("/cashier");
  return response;
}

export async function deleteCash(id: string): Promise<{ message: string }> {
  const response = await cashService.deleteCash(id);
  revalidatePath("/cashier");
  return response;
}
