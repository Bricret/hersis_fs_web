"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Pill,
  Heart,
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
  const isMobile = useIsMobile();

  // Estados locales simples
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalItems, setTotalItems] = useState(initialTotalItems);

  // Referencias
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Referencias para manejo de escáner de código de barras
  const scannerBuffer = useRef<string>("");
  const scannerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastInputTimeRef = useRef<number>(0);
  const isFromScannerRef = useRef<boolean>(false);

  // Función para buscar productos
  const searchProducts = useCallback(
    async (searchTerm: string, page: number = 1) => {
      // Cancelar solicitud anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo AbortController para esta solicitud
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", "20");
        if (searchTerm.trim()) {
          params.set("search", searchTerm.trim());
        }

        const response = await fetch(
          `/api/inventory/search?${params.toString()}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Error en la búsqueda");

        const result = await response.json();
        const activeProducts = result.data.filter(
          (product: Inventory) => product.is_active,
        );

        setProducts(activeProducts);
        setCurrentPage(result.meta.page);
        setTotalPages(result.meta.totalPages);
        setTotalItems(result.meta.total);
      } catch (error) {
        // No mostrar error si la solicitud fue cancelada
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("Error al buscar productos");
        }
      } finally {
        // Solo desactivar el loading si esta petición sigue siendo la activa
        if (abortControllerRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [],
  );

  // Función para procesar código de barras escaneado
  const processBarcodeFromScanner = useCallback(
    async (barcode: string) => {
      // Buscar producto por código de barras en los productos actuales
      let product = products.find((p) => p.barCode === barcode);

      // Si se encuentra en los productos actuales, agregarlo inmediatamente
      if (product) {
        onProductSelect(product);
        setSearchValue("");
        searchInputRef.current?.focus();
        toast.success("Producto escaneado agregado al carrito", {
          description: product.name,
          duration: 2000,
        });
        return;
      }

      // Si no se encuentra, buscar en la API
      if (barcode.length >= 6) {
        try {
          await searchProducts(barcode, 1);

          // Buscar nuevamente después de la búsqueda
          setTimeout(() => {
            const foundProduct = products.find((p) => p.barCode === barcode);
            if (foundProduct) {
              onProductSelect(foundProduct);
              setSearchValue("");
              searchInputRef.current?.focus();
              toast.success("Producto escaneado agregado al carrito", {
                description: foundProduct.name,
                duration: 2000,
              });
            } else {
              toast.error("Producto no encontrado", {
                description: `Código: ${barcode}`,
                duration: 3000,
              });
              setSearchValue("");
            }
          }, 100);
        } catch (error) {
          toast.error("Error al buscar producto", {
            description: `Código: ${barcode}`,
            duration: 3000,
          });
          setSearchValue("");
        }
      } else {
        toast.error("Código de barras inválido", {
          description: `Código: ${barcode}`,
          duration: 3000,
        });
        setSearchValue("");
      }
    },
    [products, onProductSelect, searchProducts],
  );

  // Detectar entrada desde escáner de código de barras
  const detectScannerInput = useCallback(
    (inputValue: string, inputSpeed: number) => {
      // Criterios MUY estrictos para detectar un escáner:
      // 1. Entrada extremadamente rápida (menos de 20ms entre caracteres)
      // 2. SOLO números (códigos de barras son típicamente numéricos)
      // 3. Longitud mínima de 8 caracteres (códigos de barras reales)
      // 4. Longitud completa aparece de una vez (entrada instantánea)

      const isVeryFastInput = inputSpeed < 20;
      const isOnlyNumbers = /^\d+$/.test(inputValue);
      const isMinLength = inputValue.length >= 8;

      // Solo detectar como escáner si cumple TODOS los criterios estrictos
      return isVeryFastInput && isOnlyNumbers && isMinLength;
    },
    [],
  );

  // Manejar eventos de tecla para detectar escáner
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastInputTimeRef.current;

      // Si es Enter y tenemos un buffer del escáner, procesarlo
      if (e.key === "Enter" && scannerBuffer.current) {
        e.preventDefault();
        const barcode = scannerBuffer.current;
        scannerBuffer.current = "";

        if (barcode.length >= 8 && /^\d+$/.test(barcode)) {
          processBarcodeFromScanner(barcode);
        }
        return;
      }

      // Solo detectar entrada de escáner si es EXTREMADAMENTE rápida y es un número
      if (timeDiff < 15 && e.key.length === 1 && /^\d$/.test(e.key)) {
        isFromScannerRef.current = true;
        // Resetear el flag después de poco tiempo para evitar falsos positivos
        setTimeout(() => {
          isFromScannerRef.current = false;
        }, 50);
      }

      lastInputTimeRef.current = currentTime;
    },
    [processBarcodeFromScanner],
  );

  // Función para procesar búsqueda manual (texto)
  const handleManualSearch = useCallback(
    (value: string) => {
      // Limpiar timeout anterior
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Búsqueda con debounce para texto normal
      searchTimeoutRef.current = setTimeout(() => {
        if (value.length >= 2 || value.length === 0) {
          searchProducts(value, 1);
        }
      }, 300);
    },
    [searchProducts],
  );

  // Función para procesar códigos de barras manuales
  const handleManualBarcode = useCallback(
    (value: string) => {
      // Detectar código de barras ingresado manualmente (solo números, 8+ caracteres)
      if (/^\d{8,}$/.test(value)) {
        const product = products.find((p) => p.barCode === value);
        if (product) {
          onProductSelect(product);
          setSearchValue("");
          searchInputRef.current?.focus();
          toast.success("Producto agregado al carrito");
          return true;
        }
      }
      return false;
    },
    [products, onProductSelect],
  );

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const currentTime = Date.now();
    const timeDiff = currentTime - lastInputTimeRef.current;

    // Actualizar el valor inmediatamente
    setSearchValue(value);

    // Limpiar timeouts de escáner anteriores
    if (scannerTimeoutRef.current) {
      clearTimeout(scannerTimeoutRef.current);
    }

    // Solo detectar escáner si cumple criterios MUY estrictos
    const isPotentialScanner = detectScannerInput(value, timeDiff);

    if (isPotentialScanner && isFromScannerRef.current) {
      // Agregar al buffer del escáner solo si realmente parece ser un escáner
      scannerBuffer.current = value;

      // Resetear el flag después de un tiempo
      scannerTimeoutRef.current = setTimeout(() => {
        isFromScannerRef.current = false;

        // Si el buffer tiene contenido y es solo números, procesarlo como código de barras
        if (scannerBuffer.current && /^\d{8,}$/.test(scannerBuffer.current)) {
          processBarcodeFromScanner(scannerBuffer.current);
          scannerBuffer.current = "";
        }
      }, 100);
      return;
    }

    // Resetear flag de escáner si no cumple criterios
    isFromScannerRef.current = false;

    // Manejo para entrada manual normal
    // Primero verificar si es un código de barras manual (solo números largos)
    if (!handleManualBarcode(value)) {
      // Si no es código de barras, procesar como búsqueda de texto
      handleManualSearch(value);
    }
  };

  // Cambiar página
  const handlePageChange = async (newPage: number) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === currentPage ||
      loading
    )
      return;

    await searchProducts(searchValue, newPage);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Listener global para códigos de barras escaneados
  useEffect(() => {
    let globalScannerBuffer = "";
    let globalScannerTimeout: NodeJS.Timeout | null = null;
    let lastGlobalInputTime = 0;

    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastGlobalInputTime;

      // Solo procesar si no estamos en un input o textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }

      // Si es Enter, procesar el buffer global
      if (e.key === "Enter" && globalScannerBuffer.length >= 6) {
        e.preventDefault();
        processBarcodeFromScanner(globalScannerBuffer);
        globalScannerBuffer = "";
        searchInputRef.current?.focus();
        return;
      }

      // Acumular caracteres si son de tipo código de barras
      if (e.key.length === 1 && /[0-9A-Za-z\-\_\.]/.test(e.key)) {
        // Si la entrada es muy rápida, probablemente es un escáner
        if (timeDiff < 50 || globalScannerBuffer.length === 0) {
          globalScannerBuffer += e.key;

          // Limpiar timeout anterior
          if (globalScannerTimeout) {
            clearTimeout(globalScannerTimeout);
          }

          // Establecer timeout para procesar automáticamente
          globalScannerTimeout = setTimeout(() => {
            if (globalScannerBuffer.length >= 6) {
              processBarcodeFromScanner(globalScannerBuffer);
              searchInputRef.current?.focus();
            }
            globalScannerBuffer = "";
          }, 150);
        } else {
          // Si la entrada es lenta, resetear buffer (entrada manual)
          globalScannerBuffer = "";
        }
      } else if (e.key !== "Enter") {
        // Resetear buffer para otras teclas
        globalScannerBuffer = "";
      }

      lastGlobalInputTime = currentTime;
    };

    // Agregar listener global
    document.addEventListener("keydown", handleGlobalKeyPress);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyPress);
      if (globalScannerTimeout) {
        clearTimeout(globalScannerTimeout);
      }
    };
  }, [processBarcodeFromScanner]);

  // Focus automático en el input
  useEffect(() => {
    const focusInput = () => searchInputRef.current?.focus();
    focusInput();
    window.addEventListener("saleCompleted", focusInput);
    return () => window.removeEventListener("saleCompleted", focusInput);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      // Limpiar timeouts
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (scannerTimeoutRef.current) {
        clearTimeout(scannerTimeoutRef.current);
      }
      // Cancelar solicitudes pendientes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Categories with icons
  const categories = [
    { id: "all", name: "Todos", icon: <Pill className="h-4 w-4" /> },
    { id: "medicine", name: "Medicinas", icon: <Heart className="h-4 w-4" /> },
    { id: "general", name: "General", icon: <Leaf className="h-4 w-4" /> },
  ];

  // Filter products based on category
  const filteredProducts = products.filter((product) => {
    if (activeCategory === "all") return true;
    return product.type === activeCategory;
  });

  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
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
            {loading && filteredProducts.length === 0 ? (
              // Skeleton loading
              Array.from({ length: 12 }).map((_, index) => (
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
