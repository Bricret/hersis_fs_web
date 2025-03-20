import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { NewUserDialog } from "./NewUserDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTab: string;
  onTabChange: (tab: string) => void;
  selectedSucursal: string;
  onSucursalChange: (sucursal: string) => void;
}

const sucursales = [
  "todas",
  "Sucursal Principal",
  "Sucursal Norte",
  "Sucursal Sur",
];

export function UserFilters({
  searchTerm,
  onSearchChange,
  selectedTab,
  onTabChange,
  selectedSucursal,
  onSucursalChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuarios..."
              className="pl-8 md:w-[300px]"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Select value={selectedSucursal} onValueChange={onSucursalChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar sucursal" />
            </SelectTrigger>
            <SelectContent>
              {sucursales.map((sucursal) => (
                <SelectItem key={sucursal} value={sucursal}>
                  {sucursal === "todas" ? "Todas las sucursales" : sucursal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <NewUserDialog />
      </div>

      <div className="flex gap-2">
        <Button
          variant={selectedTab === "todos" ? "default" : "outline"}
          onClick={() => onTabChange("todos")}
        >
          Todos
        </Button>
        <Button
          variant={selectedTab === "activos" ? "default" : "outline"}
          onClick={() => onTabChange("activos")}
        >
          Activos
        </Button>
        <Button
          variant={selectedTab === "inactivos" ? "default" : "outline"}
          onClick={() => onTabChange("inactivos")}
        >
          Inactivos
        </Button>
      </div>
    </div>
  );
}
