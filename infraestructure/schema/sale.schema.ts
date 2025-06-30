import { z } from "zod";

export const saleDetailSchema = z.object({
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
  unit_price: z.number().min(0.01, "El precio unitario debe ser mayor a 0"),
  productId: z.number().min(1, "El ID del producto es obligatorio"),
  product_type: z.enum(["medicine", "general"], {
    required_error: "El tipo de producto es obligatorio",
  }),
});

export const createSaleSchema = z.object({
  branch_id: z.string().uuid("ID de sucursal inválido"),
  user_id: z.string().uuid("ID de usuario inválido"),
  total: z.number().min(0.01, "El total debe ser mayor a 0").optional(),
  saleDetails: z
    .array(saleDetailSchema)
    .min(1, "Debe incluir al menos un detalle de venta"),
});

export const updateSaleDetailSchema = z.object({
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0").optional(),
  unit_price: z
    .number()
    .min(0.01, "El precio unitario debe ser mayor a 0")
    .optional(),
});

export const cancelSaleSchema = z.object({
  reason: z.string().min(1, "La razón de cancelación es obligatoria"),
});

export const generateReportSchema = z.object({
  date_from: z.string().datetime("Fecha de inicio inválida"),
  date_to: z.string().datetime("Fecha de fin inválida"),
  user_id: z.number().min(1, "ID de usuario obligatorio"),
});

export const analyticsSchema = z.object({
  start_date: z.string().date("Fecha de inicio inválida"),
  end_date: z.string().date("Fecha de fin inválida"),
  branch_id: z.string().uuid("ID de sucursal inválido").optional(),
  top_products_limit: z.number().min(1).max(50).default(10).optional(),
  cash_id: z.string().uuid("ID de caja inválido").optional(),
});

export type SaleDetailSchema = z.infer<typeof saleDetailSchema>;
export type CreateSaleSchema = z.infer<typeof createSaleSchema>;
export type UpdateSaleDetailSchema = z.infer<typeof updateSaleDetailSchema>;
export type CancelSaleSchema = z.infer<typeof cancelSaleSchema>;
export type GenerateReportSchema = z.infer<typeof generateReportSchema>;
export type AnalyticsSchema = z.infer<typeof analyticsSchema>;
