"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import {
  CreditCard,
  Package,
  Search,
  ShoppingCart,
  Trash2,
  Barcode,
  Clock,
  Star,
  X,
  BoxIcon,
} from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Separator } from "@/presentation/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui/tooltip";
import { toast } from "sonner";
import { Header } from "@/presentation/components/common/Header";
import PlusMinusInput from "@/presentation/components/common/PlusMinusInput";
import ModalToAddProduct from "@/presentation/components/store/ModalToAddProduct";
import ModalPayment from "@/presentation/components/store/ModalPayment";
import ModalToRecentSales from "@/presentation/components/store/ModalToRecentSales";
import {
  CartItem,
  categories,
  productsData,
  ProductType,
  recentSales,
} from "@/core/data/sales/DataSales";
import TabFavoriteProducts from "@/presentation/components/store/TabFavoriteProducts";
import { TabAllProducts } from "@/presentation/components/store/TabAllProducts";

export default function VentasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<ProductType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [recentSalesDialogOpen, setRecentSalesDialogOpen] = useState(false);
  const [barcodeMode, setBarcodeMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Manejar teclas para navegación y atajos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Atajo para modo código de barras
      if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setBarcodeMode((prev) => !prev);
        if (!barcodeMode && searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }

      // Atajo para procesar pago
      if (e.key === "p" && (e.ctrlKey || e.metaKey) && cart.length > 0) {
        e.preventDefault();
        setPaymentDialogOpen(true);
      }

      // Atajo para limpiar carrito
      if (e.key === "q" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        setCart([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [barcodeMode, cart.length]);

  // Función para agregar producto al carrito
  const addToCart = (
    product: ProductType,
    sellByUnit = false,
    quantity = 1
  ) => {
    const price = sellByUnit ? product.pricePerUnit : product.price;

    const existingItem = cart.find(
      (item) => item.id === product.id && item.sellByUnit === sellByUnit
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.sellByUnit === sellByUnit
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price,
          pricePerUnit: product.pricePerUnit,
          quantity,
          unit: product.unit,
          unitsPerBox: product.unitsPerBox,
          sellByUnit,
        },
      ]);
    }

    toast("Producto agregado", {
      description: `${product.name} agregado al carrito`,
      duration: 2000,
    });
  };

  // Función para mostrar diálogo de selección de producto
  const showProductDialog = (product: ProductType) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
  };

  // Función para agregar producto desde código de barras
  const addProductByBarcode = (code: string) => {
    const product = productsData.find(
      (p) => p.code.toLowerCase() === code.toLowerCase()
    );

    if (product) {
      // Si el producto tiene opción de unidad/caja, mostrar diálogo
      if (product.unitsPerBox > 1) {
        showProductDialog(product);
      } else {
        // Si no tiene opciones, agregar directamente
        addToCart(product);
      }
      setSearchTerm("");
    } else {
      toast("Producto no encontrado", {
        description: `No se encontró ningún producto con el código ${code}`,
        duration: 1500,
      });
    }
  };

  // Manejar envío del formulario de búsqueda
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (barcodeMode && searchTerm) {
      addProductByBarcode(searchTerm);
    } else if (searchSuggestions.length > 0) {
      showProductDialog(searchSuggestions[0]);
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Actualizar cantidad de un producto en el carrito
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCart(
      cart.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  // Calcular total del carrito
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Completar venta
  const completeTransaction = (paymentMethod: string, amountPaid: number) => {
    toast("Venta completada", {
      description: `Venta por $${calculateTotal().toFixed(
        2
      )} procesada correctamente`,
      duration: 1500,
    });

    // Aquí se podría guardar la venta en la base de datos

    // Limpiar carrito
    setCart([]);
    setPaymentDialogOpen(false);
  };

  // Repetir venta desde historial
  const repeatSale = (items: any[]) => {
    const newCart: CartItem[] = [];

    items.forEach((item) => {
      const product = productsData.find((p) => p.id === item.id);
      if (product) {
        newCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          pricePerUnit: product.pricePerUnit,
          quantity: item.quantity,
          unit: product.unit,
          unitsPerBox: product.unitsPerBox,
          sellByUnit: false,
        });
      }
    });

    setCart(newCart);

    toast("Venta cargada", {
      description:
        "Los productos de la venta anterior han sido cargados al carrito",
      duration: 1500,
    });
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-muted">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          title="Ventas"
          subTitle="Maneje las ventas de productos farmacéuticos"
        >
          <div className="flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={barcodeMode ? "default" : "outline"}
                    onClick={() => {
                      setBarcodeMode(!barcodeMode);
                      if (!barcodeMode && searchInputRef.current) {
                        searchInputRef.current.focus();
                      }
                    }}
                  >
                    <Barcode className="h-4 w-4" />
                    Codigo de barras
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modo código de barras (Ctrl+B)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setRecentSalesDialogOpen(true)}
                  >
                    <Clock className="h-4 w-4" />
                    Historial de ventas
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ventas recientes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-6">
              {/* Buscador inteligente con sugerencias */}
              <div className="relative">
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        ref={searchInputRef}
                        type="search"
                        placeholder={
                          barcodeMode
                            ? "Escanee o ingrese el código de barras..."
                            : "Buscar por nombre, código o categoría..."
                        }
                        className="pl-10 py-6 text-lg peer ps-9 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() =>
                          setShowSuggestions(searchSuggestions.length > 0)
                        }
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 200)
                        }
                      />
                      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <Search className="absolute left-2.5 top-3.5 h-5 w-5 text-muted-foreground" />
                      </div>
                      {barcodeMode && (
                        <Button
                          type="submit"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          Buscar
                        </Button>
                      )}
                    </div>
                    {!barcodeMode && (
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
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

                {/* Sugerencias de búsqueda */}
                {showSuggestions && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                        onClick={() => {
                          showProductDialog(product);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.code} - {product.category}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${product.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Stock: {product.stock}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!barcodeMode && (
                <Tabs defaultValue="tabSection-1">
                  <TabsList className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                    <TabsTrigger
                      value="tabSection-1"
                      className="bg-main-background-color/75 border border-main-background-color overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none flex items-center"
                    >
                      <Star className="ml-2 h-4 w-4 text-yellow-500 mr-1" />
                      Productos populares
                    </TabsTrigger>
                    <TabsTrigger
                      value="tabSection-2"
                      className="bg-main-background-color/75 border border-main-background-color overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                      <BoxIcon
                        className="-ms-0.5 me-1.5"
                        size={16}
                        aria-hidden="true"
                      />
                      Todos los productos
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="tabSection-1">
                    <TabFavoriteProducts
                      searchTerm={searchTerm}
                      setSearchSuggestions={setSearchSuggestions}
                      setShowSuggestions={setShowSuggestions}
                      showProductDialog={showProductDialog}
                    />
                  </TabsContent>
                  <TabsContent value="tabSection-2">
                    <TabAllProducts
                      searchTerm={searchTerm}
                      selectedCategory={selectedCategory}
                      showProductDialog={showProductDialog}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>

            {/* Carrito de compra */}
            <div>
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-5 w-5" />
                    Carrito de Compra
                    {cart.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {cart.reduce((total, item) => total + item.quantity, 0)}{" "}
                        items
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-0">
                  <ScrollArea className="h-[400px] pr-4">
                    {cart.length === 0 ? (
                      <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <div className="text-sm font-medium">
                          El carrito está vacío
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Agregue productos para comenzar una venta
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item, index) => (
                          <div
                            key={`${item.id}-${item.sellByUnit}-${index}`}
                            className="rounded-lg border p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{item.name}</div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => removeFromCart(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {item.sellByUnit
                                ? `Unidad - $${item.price.toFixed(2)}`
                                : `Caja (${
                                    item.unitsPerBox
                                  } unidades) - $${item.price.toFixed(2)}`}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <PlusMinusInput
                                quantity={item.quantity}
                                setQuantity={(quantity: number) =>
                                  updateQuantity(index, quantity)
                                }
                              />
                              <div className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Subtotal</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">IVA (16%)</span>
                      <span>${(calculateTotal() * 0.16).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span className="text-xl">
                        ${(calculateTotal() * 1.16).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="w-1/2 gap-1"
                    onClick={() => setCart([])}
                    disabled={cart.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    Limpiar
                  </Button>
                  <Button
                    className="w-1/2 gap-1"
                    disabled={cart.length === 0}
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Procesar Pago
                  </Button>
                </CardFooter>
              </Card>

              {/* Atajos de teclado */}
              <div className="mt-4 rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Atajos de teclado</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      Ctrl+B
                    </Badge>
                    <span>Modo código de barras</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      Ctrl+P
                    </Badge>
                    <span>Procesar pago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      Ctrl+Shift+C
                    </Badge>
                    <span>Limpiar carrito</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Diálogos */}
      <ModalToAddProduct
        product={selectedProduct}
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
        onAdd={addToCart}
      />

      <ModalPayment
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        total={calculateTotal() * 1.16}
        onComplete={completeTransaction}
      />

      <ModalToRecentSales
        open={recentSalesDialogOpen}
        onClose={() => setRecentSalesDialogOpen(false)}
        sales={recentSales}
        onRepeatSale={repeatSale}
      />
    </div>
  );
}
