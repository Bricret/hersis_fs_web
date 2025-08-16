export interface ReportSales {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  date: Date;
  total: string;
  branch: Branch;
  cash_register: CashRegister;
  user: User;
  saleDetails: SaleDetail[];
}

export interface Branch {
  id: string;
  name: string;
}

export interface CashRegister {
  id: string;
  fecha_apertura: Date;
  fecha_cierre: Date;
  estado: string;
}

export interface SaleDetail {
  id: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  productId: string;
  product_type: string;
  productName: string;
}

export interface User {
  id: string;
  name: string;
  is_active: boolean;
}

export interface Metadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
