"use client";

import { useState, useRef } from "react";
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
import { PHARMACY_PRODUCTS } from "@/core/data/products";

interface ProductCatalogProps {
  mode: "cashier" | "pharmacist";
  onProductSelect: (product: any) => void;
}

export default function ProductCatalog({
  mode,
  onProductSelect,
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter products based on search query and category
  const filteredProducts = PHARMACY_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);

    if (activeCategory === "all") return matchesSearch;
    return (
      matchesSearch &&
      product.category.toLowerCase().includes(activeCategory.toLowerCase())
    );
  });

  // Categories with icons
  const categories = [
    { id: "all", name: "Todos", icon: <Pill className="h-4 w-4" /> },
    { id: "pain", name: "Analgésicos", icon: <Heart className="h-4 w-4" /> },
    {
      id: "antibiotics",
      name: "Antibióticos",
      icon: <Droplet className="h-4 w-4" />,
    },
    { id: "allergy", name: "Alergias", icon: <Leaf className="h-4 w-4" /> },
    {
      id: "vitamins",
      name: "Vitaminas",
      icon: <Thermometer className="h-4 w-4" />,
    },
  ];

  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);

    if (scrollContainerRef.current) {
      // Smooth scroll to top when changing categories
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
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
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
  product: any;
  onSelect: (product: any) => void;
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
                  product.stock > 50
                    ? "bg-green-50 text-green-700 text-xs"
                    : "bg-amber-50 text-amber-700 text-xs"
                }
              >
                {product.stock} en stock
              </Badge>
              <span className="text-xs text-gray-500 ml-2 truncate">
                {product.category}
              </span>
            </div>
          </div>
          <div className="text-right ml-2">
            <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
            {mode === "pharmacist" && (
              <div className="text-xs text-blue-600">Ver detalles</div>
            )}
          </div>
        </div>

        {mode === "pharmacist" && (
          <div className="bg-blue-50 px-3 py-2 text-xs text-blue-800">
            <div className="flex justify-between">
              <span>Requiere receta:</span>
              <span>{Math.random() > 0.5 ? "Sí" : "No"}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Interacciones:</span>
              <span>{Math.floor(Math.random() * 5)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
