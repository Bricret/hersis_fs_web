"use client";

import { useEffect, useState } from "react";
import { Header } from "@/presentation/components/common/Header";
import type { ProductType } from "@/core/data/sales/DataSales";
import { useCart } from "@/presentation/hooks/store/useCart";
import { useSearch } from "@/presentation/hooks/store/useSearch";
import { SearchActions } from "@/presentation/components/store/SearchActions";
import { CartSection } from "@/presentation/components/store/CartSection";
import { SearchSection } from "@/presentation/components/store/SearchSection";
import { DialogsSection } from "@/presentation/components/store/DialogsSectionProps";
import { ProductTabs } from "@/presentation/components/store/ProductTabs";

export default function VentasPage() {
  const cart = useCart();
  const search = useSearch();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [dialogStates, setDialogStates] = useState({
    product: false,
    payment: false,
    recentSales: false,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        search.setBarcodeMode(!search.barcodeMode);
      }

      if (e.key === "p" && (e.ctrlKey || e.metaKey) && cart.cart.length > 0) {
        e.preventDefault();
        setDialogStates((prev) => ({ ...prev, payment: true }));
      }

      if (e.key === "q" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        cart.clearCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [search.barcodeMode, cart.cart.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search.addProductByBarcode(search.searchTerm);
  };

  const handleProductSelect = (product: ProductType) => {
    setSelectedProduct(product);
    setDialogStates((prev) => ({ ...prev, product: true }));
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header
        title="Ventas"
        subTitle="Maneje las ventas de productos farmacéuticos"
      >
        <SearchActions
          barcodeMode={search.barcodeMode}
          setBarcodeMode={search.setBarcodeMode}
          setRecentSalesOpen={(value) =>
            setDialogStates((prev) => ({ ...prev, recentSales: value }))
          }
        />
      </Header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="flex flex-col gap-6">
            <SearchSection
              search={{
                searchTerm: search.searchTerm,
                setSearchTerm: search.setSearchTerm,
                searchSuggestions: search.searchSuggestions,
                searchInputRef:
                  search.searchInputRef as React.RefObject<HTMLInputElement>,
                barcodeMode: search.barcodeMode,
                showSuggestions: search.showSuggestions,
                setShowSuggestions: search.setShowSuggestions,
                selectedCategory: search.selectedCategory,
                setSelectedCategory: search.setSelectedCategory,
              }}
              onProductSelect={handleProductSelect}
              onSubmit={handleSearchSubmit}
            />

            {!search.barcodeMode && (
              <ProductTabs
                searchTerm={search.searchTerm}
                selectedCategory={search.selectedCategory}
                onProductSelect={handleProductSelect}
                showProductDialog={handleProductSelect}
                setSearchSuggestions={search.setSearchSuggestions}
                setShowSuggestions={search.setShowSuggestions}
              />
            )}
          </div>

          <CartSection
            cart={cart.cart}
            onRemove={cart.removeFromCart}
            onUpdateQuantity={cart.updateQuantity}
            onClear={cart.clearCart}
            onCheckout={() =>
              setDialogStates((prev) => ({ ...prev, payment: true }))
            }
            calculateTotal={cart.calculateTotal}
          />
        </div>
      </main>

      <DialogsSection
        dialogStates={dialogStates}
        setDialogStates={setDialogStates}
        selectedProduct={selectedProduct}
        cart={cart}
      />
    </div>
  );
}
