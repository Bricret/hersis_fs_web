import { DataProducts } from "@/core/data/DataProducts";
import { Header } from "@/presentation/components/common/Header";
import { columns } from "@/presentation/components/inventory/columns";
import { DataTable } from "@/presentation/components/inventory/data-table";

export default function InventoryPage() {
  return (
    <main className="h-full w-full bg-muted">
      <Header
        title="Inventario"
        subTitle="
      Aquí podrás ver y gestionar todos los productos que tienes en tu inventario."
      />
      <div className="container mx-auto px-6 pt-4">
        <DataTable columns={columns} data={DataProducts} />
      </div>
    </main>
  );
}
