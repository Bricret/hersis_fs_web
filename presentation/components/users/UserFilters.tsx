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
import { useSearchParams as useNextSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface UserFiltersProps {
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
  onSearchChange,
  selectedTab,
  onTabChange,
  selectedSucursal,
  onSucursalChange,
}: UserFiltersProps) {
  const searchParams = useNextSearchParams();
  const [localSearchTerm, setLocalSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Sincronizamos el estado local con los parámetros de la URL
  useEffect(() => {
    setLocalSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    // Siempre llamamos a onSearchChange, incluso cuando el valor está vacío
    // Esto asegura que se actualice la URL y se regrese a la lista completa
    onSearchChange(value);
  };

  return (
    <div className="flex flex-col gap-4 mb-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuarios..."
              className="pl-8 md:w-[300px]"
              value={localSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
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

          <Select value={selectedTab} onValueChange={onTabChange}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activos">Activos</SelectItem>
              <SelectItem value="inactivos">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <NewUserDialog />
      </div>
    </div>
  );
}
