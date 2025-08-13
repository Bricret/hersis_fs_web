import PosSection from "@/presentation/components/shop/POS-Section";
import { getActiveCash } from "@/presentation/services/server/cash.server";
import { getInventory } from "@/presentation/services/server/inventory.server";
import { CartProvider } from "@/presentation/store/cart-context";
import { LockIcon } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import Link from "next/link";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { PaginatedResponse } from "@/core/domain/entity/user.entity";

export default async function ShopPage() {
  // Obtener datos del servidor
  let inventoryData: PaginatedResponse<Inventory> | null = null;
  let activeCash: any = null;

  try {
    // Obtener datos frescos del servidor sin cache
    inventoryData = await getInventory(1, 10); // 20 productos por página

    // Obtener caja activa
    try {
      activeCash = await getActiveCash("dcdfcc7a-b5fa-444f-b6c1-bcff84365f64");
    } catch (error) {
      activeCash = null;
    }
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }

  // Verificar si hay caja activa
  if (!activeCash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
          <div className="mb-4">
            <LockIcon className="h-12 w-12 text-red-500 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Caja cerrada
          </h2>
          <p className="text-gray-600 mb-6">
            No hay una caja activa. Necesitas abrir la caja para realizar
            ventas.
          </p>
          <Link href="/cashier">
            <Button className="w-full">Ir a gestión de caja</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filtrar solo productos activos
  const activeProducts =
    inventoryData?.data.filter((product) => product.is_active) || [];

  return (
    <CartProvider>
      <PosSection
        products={activeProducts}
        totalPages={inventoryData?.meta.totalPages || 1}
        currentPage={inventoryData?.meta.page || 1}
        totalItems={inventoryData?.meta.total || 0}
      />
    </CartProvider>
  );
}
