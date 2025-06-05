import { Branch } from "./branch.entity";
import { Cash } from "./cash.entity";
import { SaleDetail } from "./sale_detail.entity";

export interface Sale {
  id: bigint;
  date: Date;
  total: number;
  branch: Branch;
  cash_register?: Cash;
  saleDetails: SaleDetail[];
}
