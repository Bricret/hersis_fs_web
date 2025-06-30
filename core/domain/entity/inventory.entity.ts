import { ProductState } from "@/infraestructure/schema/inventory.schema";

interface BaseInventoryRegister {
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  sales_price: number;
  purchase_price: number;
  initial_quantity: number;
  barCode: string;
  type: ProductState;
  units_per_box: number;
  lot_number: string;
  expiration_date: string;
}

interface BaseInventory {
  id?: bigint;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  sales_price: number;
  purchase_price: number;
  initial_quantity: number;
  barCode: string;
  type: ProductState;
  units_per_box: number;
  lot_number: string;
  expiration_date: string;
}

export interface MedicineInventory extends BaseInventory {
  active_name: string;
  dosage: string;
  prescription: boolean;
  laboratory: string;
  administration_route: string;
  presentation: string;
  pharmaceutical_form: string;
  category: string;
}

export interface GeneralInventory extends BaseInventory {
  brand: string;
  model: string;
}
export type Inventory = MedicineInventory | GeneralInventory;

export interface RegisterInventoryRes {
  message: string;
}

export interface InventoryCategory {
  id: number;
  name: string;
  description: string;
}

export enum InventoryState {
  ALTO = "ALTO",
  MEDIO = "MEDIO",
  CRITICO = "CRITICO",
}
