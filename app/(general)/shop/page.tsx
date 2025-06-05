import PosSection from "@/presentation/components/shop/POS-Section";
import { getActiveCash } from "@/presentation/services/server/cash.server";
import { getInventory } from "@/presentation/services/server/inventory.server";
import { CartProvider } from "@/presentation/store/cart-context";
import { LockIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import Link from "next/link";

export default async function POSPage() {
  let products, activeCash;

  try {
    // Cargar productos e información de caja en paralelo
    [products, activeCash] = await Promise.all([
      getInventory(),
      getActiveCash("dcdfcc7a-b5fa-444f-b6c1-bcff84365f64"),
    ]);
  } catch (error) {
    console.error("Error loading POS data:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-background mx-auto">
        <div className="p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-6 rounded-full bg-red-100">
              <AlertTriangle className="h-16 w-16 text-red-600" />
            </div>
            <h3 className="text-4xl font-semibold tracking-tight">
              Error de Conexión
            </h3>
            <p className="text-center text-xl text-muted-foreground leading-relaxed">
              No se pudo conectar con el servidor. Por favor, verifica tu
              conexión e intenta nuevamente.
            </p>
            <Button asChild>
              <Link href="/dashboard">Volver al Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeCash) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background mx-auto">
        <div className="p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-6 rounded-full bg-yellow-100">
              <LockIcon className="h-16 w-16 text-yellow-600" />
            </div>
            <h3 className="text-4xl font-semibold tracking-tight">
              Caja Cerrada
            </h3>
            <p className="text-center text-xl text-muted-foreground leading-relaxed">
              La caja está cerrada. Solicite al administrador que abra la caja
              para iniciar las operaciones de venta.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/">Volver al Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/cashier">Gestionar Cajas</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <PosSection products={products.data} />
    </CartProvider>
  );
}
