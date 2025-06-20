import { Header } from "@/presentation/components/common/Header";
import { InventoryManagae } from "@/presentation/components/inventory/InventoryManagae";
import { getInventory } from "@/presentation/services/server/inventory.server";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  // Obtener parámetros de búsqueda
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);

  // Obtener datos frescos del servidor sin cache
  const inventoryData = await getInventory(page, 100, search); // Aumentamos el límite para mostrar más productos

  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header
        title="Inventario"
        subTitle="Aquí podrás ver y gestionar todos los productos que tienes en tu inventario."
      />
      <InventoryManagae
        DataProducts={inventoryData.data || []}
        initialSearch={search}
      />
    </main>
  );
}
