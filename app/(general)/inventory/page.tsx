import { Header } from "@/presentation/components/common/Header";
import { InventoryManagae } from "@/presentation/components/inventory/InventoryManagae";
import { getInventory } from "@/presentation/services/server/inventory.server";
import { getCategories } from "@/presentation/services/server/category.server";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const inventoryData = await getInventory(page, 5000, search);
  const categories = await getCategories();

  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header
        title="Inventario"
        subTitle="Aquí podrás ver y gestionar todos los productos que tienes en tu inventario."
      />
      <InventoryManagae
        DataProducts={inventoryData.data || []}
        initialSearch={search}
        categories={categories}
      />
    </main>
  );
}
