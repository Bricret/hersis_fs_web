import PosSection from "@/presentation/components/shop/POS-Section";
import { getActiveCash } from "@/presentation/services/server/cash.server";
import { getInventory } from "@/presentation/services/server/inventory.server";
import { CartProvider } from "@/presentation/store/cart-context";
import { LockIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import Link from "next/link";

export default async function ShopPage() {
  // Obtener datos frescos del servidor sin cache
  const inventoryData = await getInventory(1, 1000); // Aumentamos el límite para obtener todos los productos

  // Obtener caja activa
  let activeCash;
  try {
    activeCash = await getActiveCash("dcdfcc7a-b5fa-444f-b6c1-bcff84365f64");
  } catch (error) {
    activeCash = null;
  }

  // Verificar si hay caja activa
  if (!activeCash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  return (
    <CartProvider>
      <PosSection products={inventoryData.data || []} />
    </CartProvider>
  );
}
