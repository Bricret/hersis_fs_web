import { z } from "zod";

export enum ProductState {
  MEDICINE = "medicine",
  GENERAL = "general",
}

export const baseInventorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(10, "La descripción es obligatoria"),
  sales_price: z.number().min(1, "El precio de venta es obligatorio"),
  purchase_price: z.number().min(1, "El precio de compra es obligatorio"),
  initial_quantity: z.number().min(1, "La cantidad inicial es obligatoria"),
  barCode: z.string().min(1, "El código de barras es obligatorio"),
  units_per_box: z.number().min(1, "Las unidades por caja es obligatoria"),
  lot_number: z.string().min(1, "El número de lote es obligatorio"),
  expiration_date: z.string().min(1, "La fecha de expiración es obligatoria"),
  category_id: z.number().min(1, "La categoría es obligatoria"),
  branch_id: z.number().min(1, "La sucursal es obligatoria"),
  type: z.enum(Object.values(ProductState) as [string, ...string[]], {
    message: "El tipo de producto es obligatorio",
  }),
});

export const medicineInventorySchema = baseInventorySchema.extend({
  active_name: z.string().min(1, "El nombre activo es obligatorio"),
  dosage: z.string().min(1, "La dosis es obligatoria"),
  prescription: z.boolean(),
  laboratory: z.string().min(1, "La laboratorio es obligatoria"),
  registration_number: z
    .string()
    .min(1, "El número de registro es obligatorio"),
  storage_conditions: z
    .string()
    .min(1, "Las condiciones de almacenamiento es obligatoria"),
  warnings: z.string().min(1, "Los advertencias son obligatorias"),
  administration_route: z
    .string()
    .min(1, "La ruta de administración es obligatoria"),
  presentation_id: z.number().min(1, "La presentación es obligatoria"),
});

export const generalInventorySchema = baseInventorySchema.extend({
  brand: z.string().min(1, "La marca es obligatoria"),
  model: z.string().min(1, "El modelo es obligatorio"),
});

//TODO: Crear el resto de schemas para los otros contextos: Editar etc

export type MedicineInventorySchema = z.infer<typeof medicineInventorySchema>;
export type GeneralInventorySchema = z.infer<typeof generalInventorySchema>;
