import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { categories } from "@/core/data/sales/DataSales";
import type { ProductType } from "@/core/data/sales/DataSales";

interface SearchSectionProps {
  search: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    searchSuggestions: ProductType[];
    searchInputRef: React.RefObject<HTMLInputElement>;
    barcodeMode: boolean;
    showSuggestions: boolean;
    setShowSuggestions: (value: boolean) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
  };
  onProductSelect: (product: ProductType) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchSection = ({
  search,
  onProductSelect,
  onSubmit,
}: SearchSectionProps) => {
  return (
    <div className="relative">
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              ref={search.searchInputRef}
              type="search"
              placeholder={
                search.barcodeMode
                  ? "Escanee o ingrese el código de barras..."
                  : "Buscar por nombre, código o categoría..."
              }
              className="pl-10 py-6 text-lg peer ps-9 shadow-sm"
              value={search.searchTerm}
              onChange={(e) => search.setSearchTerm(e.target.value)}
              onFocus={() =>
                search.setShowSuggestions(search.searchSuggestions.length > 0)
              }
              onBlur={() =>
                setTimeout(() => search.setShowSuggestions(false), 200)
              }
            />
            <Search className="absolute left-2.5 top-3.5 h-5 w-5 text-muted-foreground" />
            {search.barcodeMode && (
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                Buscar
              </Button>
            )}
          </div>
          {!search.barcodeMode && (
            <Select
              value={search.selectedCategory}
              onValueChange={search.setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] py-6">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </form>

      {search.showSuggestions && (
        <div className="absolute z-20 mt-1 w-full rounded-md border bg-background shadow-lg">
          {search.searchSuggestions.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
              onClick={() => onProductSelect(product)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onProductSelect(product);
                }
              }}
            >
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {product.code} - {product.category}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${product.price.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">
                  Stock: {product.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
