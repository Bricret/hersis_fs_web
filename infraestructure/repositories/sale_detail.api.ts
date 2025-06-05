import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { ISaleDetailRepository } from "@/core/domain/repository/sale_detail.repository";
import type { SaleDetail } from "@/core/domain/entity/sale_detail.entity";
import type { UpdateSaleDetailSchema } from "../schema/sale.schema";
import type {
  ISaleDetailResponse,
  ISaleDetailUpdateResponse,
  ISaleDetailDeleteResponse,
} from "../interface/sale_detail/sale_detail.interface";
import type { IProductInfoResponse } from "../interface/sale/sale.interface";
import Cookies from "js-cookie";

export class SaleDetailApiRepository implements ISaleDetailRepository {
  constructor(private readonly http: HttpAdapter) {}

  private getToken(): string | undefined {
    return Cookies.get("authToken");
  }

  async getAllSaleDetails(): Promise<SaleDetail[]> {
    const response = await this.http.get<SaleDetail[]>("/sale-detail");
    return response;
  }

  async getSaleDetailById(id: string): Promise<ISaleDetailResponse> {
    const response = await this.http.get<ISaleDetailResponse>(
      `/sale-detail/${id}`
    );
    return response;
  }

  async getSaleDetailsBySale(saleId: string): Promise<SaleDetail[]> {
    const response = await this.http.get<SaleDetail[]>(
      `/sale-detail/by-sale/${saleId}`
    );
    return response;
  }

  async getProductInfo(
    productId: string,
    type: "medicine" | "general"
  ): Promise<IProductInfoResponse> {
    const queryParams = new URLSearchParams({
      type: type,
    });

    const response = await this.http.get<IProductInfoResponse>(
      `/sale-detail/product/${productId}?${queryParams}`
    );
    return response;
  }

  async updateSaleDetail(
    id: string,
    data: UpdateSaleDetailSchema
  ): Promise<ISaleDetailUpdateResponse> {
    const response = await this.http.patch<ISaleDetailUpdateResponse>(
      `/sale-detail/${id}`,
      data
    );
    return response;
  }

  async deleteSaleDetail(id: string): Promise<ISaleDetailDeleteResponse> {
    const response = await this.http.delete<ISaleDetailDeleteResponse>(
      `/sale-detail/${id}`
    );
    return response;
  }
}
