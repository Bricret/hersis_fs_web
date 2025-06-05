import { SaleDetail } from "@/core/domain/entity/sale_detail.entity";

export interface ISaleDetailListResponse {
  message: string;
  data: SaleDetail[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ISaleDetailResponse {
  id: bigint;
  quantity: number;
  unit_price: number;
  subtotal: number;
  productId: number;
  product_type: "medicine" | "general";
  sale: {
    id: bigint;
    date: string;
    total: number;
  };
}

export interface ISaleDetailUpdateResponse {
  message: string;
  updated_detail: ISaleDetailResponse;
}

export interface ISaleDetailDeleteResponse {
  message: string;
}
