"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Pill,
  Heart,
  Thermometer,
  Droplet,
  Leaf,
  Filter,
  ChevronLeft,
  ChevronRight,
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
import { normalizeText } from "@/infraestructure/lib/utils";
import { useUrlParams } from "@/presentation/hooks/common/useUrlParams";
import { useInventory } from "@/presentation/hooks/inventory/useInventory";

interface ProductCatalogProps {
  mode: "cashier" | "pharmacist";
  onProductSelect: (product: Inventory) => void;
  products: Inventory[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  initialSearch?: string;
}

export default function ProductCatalog({
  mode,
  onProductSelect,
  products: initialProducts,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  totalItems: initialTotalItems,
  initialSearch = "",
}: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const barcodeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Hook para manejar parámetros de URL
  const { params, setPage, setSearch, page, search } = useUrlParams({
    initialParams: {
      page: initialCurrentPage,
      search: initialSearch,
      limit: 20,
    },
    updateUrl: true,
  });

  // Hook de inventario
  const {
    products,
    totalPages,
    currentPage,
    totalItems,
    loading,
    searchProducts,
    searchWithDebounce,
    changePage,
    clearSearch,
  } = useInventory({
    initialProducts,
    initialTotalPages,
    initialCurrentPage,
    initialTotalItems,
  });

  // Función para manejar cambios en la búsqueda
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value); // Esto actualiza la URL automáticamente

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
          setSearch("");
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
          toast.success("Producto agregado al carrito", {
            description: `${product.name} ha sido añadido al carrito`,
            position: "top-right",
          });
        } else {
          toast.error("Producto no encontrado");
          setSearch("");
        }
      } else {
        // Si no es un código de barras, hacer búsqueda con debounce
        searchWithDebounce(value, 1);
      }
    }, 100); // Short timeout to detect barcode scanning or pasting
  };

  // Estado para controlar si ya se inicializó con datos del servidor
  const [isServerDataLoaded, setIsServerDataLoaded] = useState(false);

  // Efecto para marcar que los datos del servidor ya están cargados
  useEffect(() => {
    if (initialProducts.length > 0 || initialTotalItems > 0) {
      setIsServerDataLoaded(true);
      console.log(
        `[ProductCatalog] Datos del servidor cargados - Productos: ${initialProducts.length}, Total: ${initialTotalItems}`
      );
    }
  }, [initialProducts, initialTotalItems]);

  // Efecto para sincronizar cambios en URL con búsquedas (solo después de la carga inicial)
  useEffect(() => {
    // No ejecutar si no se han cargado los datos del servidor
    if (!isServerDataLoaded) {
      console.log(`[ProductCatalog] Esperando datos del servidor...`);
      return;
    }

    // Verificar si realmente necesitamos hacer una nueva búsqueda
    const needsNewSearch =
      (page !== currentPage && page !== initialCurrentPage) ||
      (search !== (initialSearch || "") && search.trim() !== "");

    if (needsNewSearch) {
      console.log(
        `[ProductCatalog] URL cambió - Página: ${page}, Búsqueda: "${search}"`
      );
      console.log(
        `[ProductCatalog] Estado actual - Página: ${currentPage}, Búsqueda inicial: "${initialSearch}"`
      );

      if (search.trim()) {
        searchProducts(search, page);
      } else if (page !== currentPage) {
        changePage(page, "");
      }
    } else {
      console.log(
        `[ProductCatalog] No se necesita nueva búsqueda - usando datos del servidor`
      );
    }
  }, [
    page,
    search,
    isServerDataLoaded,
    currentPage,
    initialCurrentPage,
    initialSearch,
  ]);

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

  // Función para cambiar de página
  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    try {
      console.log(
        `[ProductCatalog] Cambiando a página ${newPage} con búsqueda: "${search}"`
      );

      // Actualizar la URL con la nueva página
      setPage(newPage);

      // Hacer la búsqueda con la nueva página
      await changePage(newPage, search);

      // Scroll hacia arriba
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Error al cambiar de página:", error);
      // El error ya se maneja en el hook
    }
  };

  // Categories with icons
  const categories = [
    { id: "all", name: "Todos", icon: <Pill className="h-4 w-4" /> },
    { id: "medicine", name: "Medicinas", icon: <Heart className="h-4 w-4" /> },
    { id: "general", name: "General", icon: <Leaf className="h-4 w-4" /> },
  ];

  // Filter products based on category (la búsqueda ya se maneja con la API)
  const filteredProducts = products.filter((product) => {
    if (activeCategory === "all") return true;
    return product.type === activeCategory;
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
      {/* Header de búsqueda y filtros - FIJO */}
      <div className="flex-shrink-0 p-4 bg-white border-b sticky top-0 z-10 space-y-3">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar productos o escanear código de barras..."
              value={search}
              onChange={handleSearchInputChange}
              className="pl-9"
              autoFocus
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              </div>
            )}
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

        {/* Información de paginación */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Mostrando {products.length} de {totalItems} productos
          </span>
          <span>
            Página {currentPage} de {totalPages}
          </span>
        </div>
      </div>

      {/* Área de productos con scroll */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full" ref={scrollContainerRef}>
          <div
            className={`p-4 grid grid-cols-1 ${
              isMobile ? "" : "sm:grid-cols-2 lg:grid-cols-3"
            } gap-3`}
          >
            {loading && products.length === 0 ? (
              // Skeleton loading
              Array.from({ length: 20 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center p-3">
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredProducts.length > 0 ? (
              <>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onProductSelect}
                    mode={mode}
                  />
                ))}
                {/* Indicador de carga para paginación */}
                {loading && (
                  <div className="col-span-full flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      <span className="text-sm">Cargando más productos...</span>
                    </div>
                  </div>
                )}
              </>
            ) : !isServerDataLoaded ? (
              <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                <p>Cargando productos...</p>
                <p className="text-sm">Obteniendo datos del servidor</p>
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
                <Search className="h-10 w-10 mb-2 text-gray-300" />
                <p>No se encontraron productos</p>
                <p className="text-sm">Intenta con otra búsqueda</p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
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
            <div className="font-bold text-lg">C$ {product.sales_price}</div>
            {mode === "pharmacist" && (
              <div className="text-xs text-blue-600">Ver detalles</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
