import { z } from "zod";

export const openCashSchema = z.object({
  monto_inicial: z
    .number()
    .min(0, "El monto inicial debe ser mayor o igual a 0"),
  branch_id: z.string().min(1, "La sucursal es obligatoria"),
  observaciones: z.string().optional(),
  user_apertura_id: z.string().min(1, "El usuario es obligatorio"),
});

export const closeCashSchema = z.object({
  monto_final: z.number().min(0, "El monto final debe ser mayor o igual a 0"),
  observaciones: z.string().optional(),
});

export const updateCashSchema = z.object({
  monto_inicial: z
    .number()
    .min(0, "El monto inicial debe ser mayor o igual a 0"),
  observaciones: z.string().optional(),
});

export type OpenCashSchema = z.infer<typeof openCashSchema>;
export type CloseCashSchema = z.infer<typeof closeCashSchema>;
export type UpdateCashSchema = z.infer<typeof updateCashSchema>;
