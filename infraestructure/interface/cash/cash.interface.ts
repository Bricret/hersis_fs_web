import { Cash } from "@/core/domain/entity/cash.entity";
import { Sale } from "@/core/domain/entity/sale.entity";

export interface ICashResponse {
  cash: Cash;
}

export interface ICashListResponse {
  message: string;
  data: Cash[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ICashSummary {
  id: string;
  fecha_apertura: Date;
  fecha_cierre?: Date;
  monto_inicial: number;
  ventas_totales: number;
  monto_esperado: number;
  monto_final?: number;
  diferencia: number;
  estado: string;
  observaciones?: string;
  user_apertura: {
    id: string;
    name: string;
    username: string;
  };
  user_cierre?: {
    id: string;
    name: string;
    username: string;
  };
  branch: {
    id: string;
    name: string;
  };
  ventas_por_metodo: {
    efectivo: number;
    tarjeta: number;
    transferencia: number;
    otro: number;
  };
  cantidad_ventas: number;
  porcentaje_diferencia: number;
}

export interface ICashSummaryResponse {
  message: string;
  data: ICashSummary;
}

export interface ICashSalesResponse {
  message: string;
  data: Sale[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
