import { Sale } from "@/core/domain/entity/sale.entity";
import { SaleDetail } from "@/core/domain/entity/sale_detail.entity";

export interface ISaleResponse {
  id: bigint;
  date: string;
  total: number;
  branch: {
    id: string;
    name: string;
  };
  cash_register?: {
    id: string;
    estado: string;
  };
  saleDetails: ISaleDetailResponse[];
  message: string;
}

export interface ISaleDetailResponse {
  id: bigint;
  quantity: number;
  unit_price: number;
  subtotal: number;
  productId: number;
  product_type: "medicine" | "general";
}

export interface ISaleListResponse {
  message: string;
  data: Sale[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ISaleSummaryResponse {
  cash_id?: string;
  branch_id?: string;
  total_sales_count: number;
  total_amount: number;
  total_items_sold: number;
  average_sale: number;
  sales: Sale[];
}

export interface ISaleReportResponse {
  report_period: {
    from: string;
    to: string;
    generated_by: number;
    generated_at: string;
  };
  summary: {
    total_sales: number;
    total_amount: number;
    total_items_sold: number;
    average_sale: number;
  };
  sales_by_branch: {
    [branchId: string]: {
      branch_name: string;
      sales_count: number;
      total_amount: number;
      sales: Sale[];
    };
  };
  top_products: Array<{
    product_id: number;
    total_quantity: number;
    total_revenue: number;
    sales_count: number;
  }>;
  daily_sales: Array<{
    date: string;
    sales_count: number;
    total_amount: number;
  }>;
  detailed_sales: Sale[];
}

export interface ISaleAnalyticsResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: ISaleSummaryResponse;
  trends: {
    daily_averages: Array<{
      date: string;
      sales_count: number;
      total_amount: number;
    }>;
    growth_rate: number;
    best_selling_products: Array<{
      product_id: number;
      total_quantity: number;
      total_revenue: number;
      growth_rate: number;
    }>;
  };
}

export interface ICancelSaleResponse {
  message: string;
  reason: string;
  cancelled_at: string;
}

export interface IProductInfoResponse {
  id: bigint;
  name: string;
  description: string;
  sales_price: number;
  purchase_price: number;
  initial_quantity: number;
  barCode: string;
  category: {
    id: number;
    name: string;
  };
  presentation: {
    id: number;
    name: string;
  };
}
