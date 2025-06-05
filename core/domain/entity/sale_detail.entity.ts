import { Sale } from "./sale.entity";

export interface SaleDetail {
  id: bigint;
  quantity: number;
  unit_price: number;
  subtotal: number;
  sale: Sale;
  productId: number;
}
