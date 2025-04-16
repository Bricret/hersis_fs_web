import { DataProducts } from "@/core/data/DataProducts";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const InventoryManagae = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <DataTable columns={columns} data={DataProducts} />
    </div>
  );
};
