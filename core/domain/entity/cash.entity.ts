import { Branch } from "./branch.entity";
import { Sale } from "./sale.entity";
import { User } from "./user.entity";

export interface Cash {
  id: string;
  fecha_apertura: Date;
  fecha_cierre?: Date;
  monto_inicial: number;
  ventas_totales: number;
  monto_esperado: number;
  monto_final?: number;
  diferencia: number;
  estado: CashStatus;
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
  branch: Branch;
  user_apertura: User;
  user_cierre?: User;
  sales: Sale[];
}

export enum CashStatus {
  ABIERTA = "abierta",
  CERRADA = "cerrada",
}
