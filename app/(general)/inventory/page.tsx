import { Header } from "@/presentation/components/common/Header";
import { InventoryManagae } from "@/presentation/components/inventory/InventoryManagae";

export default function InventoryPage() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header
        title="Inventario"
        subTitle="
      Aquí podrás ver y gestionar todos los productos que tienes en tu inventario."
      />
      <InventoryManagae />
    </main>
  );
}
