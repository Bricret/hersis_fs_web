import { Inventory } from "@/core/domain/entity/inventory.entity";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const InventoryManagae = ({
  DataProducts,
}: {
  DataProducts: Inventory[]; // Cambia el tipo según la estructura de tus datos
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <DataTable columns={columns} data={DataProducts} />
    </div>
  );
};
