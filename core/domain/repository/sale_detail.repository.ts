import { SaleDetail } from "../entity/sale_detail.entity";
import { PaginatedResponse } from "../entity/user.entity";
import { UpdateSaleDetailSchema } from "@/infraestructure/schema/sale.schema";
import {
  ISaleDetailListResponse,
  ISaleDetailResponse,
  ISaleDetailUpdateResponse,
  ISaleDetailDeleteResponse,
} from "@/infraestructure/interface/sale_detail/sale_detail.interface";
import { IProductInfoResponse } from "@/infraestructure/interface/sale/sale.interface";

export interface ISaleDetailRepository {
  // GET /sale-detail - Listar Todos los Detalles
  getAllSaleDetails(): Promise<SaleDetail[]>;

  // GET /sale-detail/:id - Detalle Específico
  getSaleDetailById(id: string): Promise<ISaleDetailResponse>;

  // GET /sale-detail/by-sale/:saleId - Detalles por Venta
  getSaleDetailsBySale(saleId: string): Promise<SaleDetail[]>;

  // GET /sale-detail/product/:productId - Información del Producto
  getProductInfo(
    productId: string,
    type: "medicine" | "general"
  ): Promise<IProductInfoResponse>;

  // PATCH /sale-detail/:id - Actualizar Detalle
  updateSaleDetail(
    id: string,
    data: UpdateSaleDetailSchema
  ): Promise<ISaleDetailUpdateResponse>;

  // DELETE /sale-detail/:id - Eliminar Detalle
  deleteSaleDetail(id: string): Promise<ISaleDetailDeleteResponse>;
}
