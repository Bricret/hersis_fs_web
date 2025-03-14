import { Header } from "@/presentation/components/common/Header";
import ProductTable from "@/presentation/components/inventory/ProductTable";

export default function InventoryPage() {
  return (
    <main className="h-full w-full bg-muted">
      <Header
        title="Inventario"
        subTitle="
      Aquí podrás ver y gestionar todos los productos que tienes en tu inventario."
      />
      <div className="container mx-auto px-6 pt-4">
        <ProductTable />
      </div>
    </main>
  );
}
