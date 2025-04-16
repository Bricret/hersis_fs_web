interface BaseInverntory {
  id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  sales_price: number;
  purchase_price: number;
  initial_quantity: number;
  barCode: string;
  units_per_box: number;
  lot_number: string;
  expiration_date: string;
}

export interface MedicineInventory extends BaseInverntory {
  active_name: string;
  dosage: string;
  prescription: boolean;
  laboratory: string;
  registration_number: string;
  storage_conditions: string;
  warnings: string;
  administration_route: string;
  presentation: string;
  category: InventoryCategory;
}

export interface GeneralInventory extends BaseInverntory {
  brand: string;
  model: string;
}

export interface InventoryCategory {
  id: number;
  name: string;
  description: string;
}
