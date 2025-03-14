import { DataProducts } from "@/core/data/DataProducts";
import { Header } from "@/presentation/components/common/Header";
import { columns } from "@/presentation/components/inventory/columns";
import { DataTable } from "@/presentation/components/inventory/data-table";

export default function InventoryPage() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-muted">
      <Header
        title="Inventario"
        subTitle="
      Aquí podrás ver y gestionar todos los productos que tienes en tu inventario."
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <DataTable columns={columns} data={DataProducts} />
      </div>
    </main>
  );
}
