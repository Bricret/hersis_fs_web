import { Header } from "@/presentation/components/common/Header";
import { InventoryManagae } from "@/presentation/components/inventory/InventoryManagae";
import { getInventory } from "@/presentation/services/server/inventory.server";

export default async function InventoryPage() {
  const initialInventory = await getInventory();

  console.log("initialInventory", initialInventory);

  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header
        title="Inventario"
        subTitle="
      Aquí podrás ver y gestionar todos los productos que tienes en tu inventario."
      />
      <InventoryManagae DataProducts={initialInventory.data} />
    </main>
  );
}
