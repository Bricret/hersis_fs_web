"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Pill,
  Heart,
  Thermometer,
  Droplet,
  Leaf,
  Filter,
} from "lucide-react";
import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/presentation/components/ui/sheet";
import { useIsMobile } from "@/presentation/hooks/use-mobile";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { toast } from "sonner";

interface ProductCatalogProps {
  mode: "cashier" | "pharmacist";
  onProductSelect: (product: Inventory) => void;
  products: Inventory[];
}

export default function ProductCatalog({
  mode,
  onProductSelect,
  products,
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const barcodeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Focus input on mount and after sale completion
  useEffect(() => {
    const focusInput = () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };

    // Focus on mount
    focusInput();

    // Listen for sale completion
    window.addEventListener("saleCompleted", focusInput);

    // Cleanup
    return () => {
      window.removeEventListener("saleCompleted", focusInput);
    };
  }, []);

  // Categories with icons
  const categories = [
    { id: "all", name: "Todos", icon: <Pill className="h-4 w-4" /> },
    { id: "medicine", name: "Medicinas", icon: <Heart className="h-4 w-4" /> },
    { id: "general", name: "General", icon: <Leaf className="h-4 w-4" /> },
  ];

  // Handle barcode scanning
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear any existing timeout
    if (barcodeTimeoutRef.current) {
      clearTimeout(barcodeTimeoutRef.current);
    }

    // Set a new timeout to detect barcode scanning or pasting
    barcodeTimeoutRef.current = setTimeout(() => {
      // If the value is a barcode (assuming barcodes are numeric and at least 8 digits)
      if (/^\d{8,}$/.test(value)) {
        const product = products.find((p) => p.barCode === value);
        if (product) {
          onProductSelect(product);
          setSearchQuery("");
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
          toast.success("Producto agregado al carrito", {
            description: `${product.name} ha sido añadido al carrito`,
          });
        } else {
          toast.error("Producto no encontrado");
          setSearchQuery("");
        }
      }
    }, 100); // Short timeout to detect barcode scanning or pasting
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barCode.includes(searchQuery);

    if (activeCategory === "all") return matchesSearch;
    return matchesSearch && product.type === activeCategory;
  });

  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white border-b sticky top-0 z-10 space-y-3">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar productos o escanear código de barras..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9"
              autoFocus
            />
          </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtros</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Categorías</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          activeCategory === category.id ? "default" : "outline"
                        }
                        className="w-full justify-start"
                        onClick={() => {
                          scrollToCategory(category.id);
                          setIsFilterOpen(false);
                        }}
                      >
                        {category.icon}
                        <span className="ml-2">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button onClick={() => setIsFilterOpen(false)}>Aplicar</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-2 pb-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`flex items-center whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }`}
                onClick={() => scrollToCategory(category.id)}
              >
                {category.icon}
                <span className="ml-1">{category.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <ScrollArea className="flex-1" ref={scrollContainerRef}>
        <div
          className={`p-4 grid grid-cols-1 ${
            isMobile ? "" : "sm:grid-cols-2 lg:grid-cols-3"
          } gap-3`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onProductSelect}
                mode={mode}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
              <Search className="h-10 w-10 mb-2 text-gray-300" />
              <p>No se encontraron productos</p>
              <p className="text-sm">Intenta con otra búsqueda</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ProductCardProps {
  product: Inventory;
  onSelect: (product: Inventory) => void;
  mode: "cashier" | "pharmacist";
}

function ProductCard({ product, onSelect, mode }: ProductCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all duration-200 active:scale-95 ${
        mode === "pharmacist" ? "border-blue-200" : ""
      }`}
      onClick={() => onSelect(product)}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{product.name}</h3>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className={
                  product.initial_quantity > 50
                    ? "bg-green-50 text-green-700 text-xs"
                    : "bg-amber-50 text-amber-700 text-xs"
                }
              >
                {product.initial_quantity} en stock
              </Badge>
              <span className="text-xs text-gray-500 ml-2 truncate">
                {product.type}
              </span>
            </div>
          </div>
          <div className="text-right ml-2">
            <div className="font-bold text-lg">
              C$ {product.sales_price.toFixed(2)}
            </div>
            {mode === "pharmacist" && (
              <div className="text-xs text-blue-600">Ver detalles</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
