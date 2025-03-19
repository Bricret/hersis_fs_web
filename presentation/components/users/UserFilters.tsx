import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { NewUserDialog } from "./NewUserDialog";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export function UserFilters({
  searchTerm,
  onSearchChange,
  selectedTab,
  onTabChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="pl-8 md:w-[300px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="flex gap-2 ml-4">
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
        <NewUserDialog />
      </div>
    </div>
  );
}
