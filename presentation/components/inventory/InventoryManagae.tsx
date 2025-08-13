"use client";

import { Inventory } from "@/core/domain/entity/inventory.entity";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useMemo, useCallback } from "react";
import type { Category } from "@/core/domain/entity/categories.entity";
import { normalizeText } from "@/infraestructure/lib/utils";
import { useUrlSearch } from "@/presentation/hooks/common/useUrlSearch";
import { revalidateInventoryCache } from "@/infraestructure/utils/revalidateCache";

export const InventoryManagae = ({
  DataProducts,
  initialSearch = "",
  categories = [],
}: {
  DataProducts: Inventory[];
  initialSearch?: string;
  categories?: Category[];
}) => {
  // Callback para manejar búsquedas que requieren solicitud al servidor
  const handleServerSearch = useCallback(async (searchTerm: string) => {
    try {
      // Revalidar el cache para obtener nuevos datos del servidor
      await revalidateInventoryCache();
    } catch (error) {
      console.error("Error al revalidar el cache del inventario:", error);
    }
  }, []);

  // Hook para manejar búsquedas con debounce y sincronización con URL
  const { searchTerm, debouncedSearchTerm, setSearch, isSearching } =
    useUrlSearch({
      paramName: "search",
      debounceDelay: 500,
      initialValue: initialSearch,
      onSearchChange: handleServerSearch,
      updateUrl: true,
    });

  // Filtrar y ordenar productos localmente usando el término de búsqueda con debounce
  const filteredProducts = useMemo(() => {
    let products = [...DataProducts];

    // Ordenar por fecha de creación (más nuevo primero)
    products.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime(); // Orden descendente
    });

    // Aplicar filtro de búsqueda si existe (usar debouncedSearchTerm para evitar filtros excesivos)
    if (debouncedSearchTerm.trim()) {
      const searchLower = normalizeText(debouncedSearchTerm.trim());
      const searchParts = searchLower
        .split(" ")
        .filter((part) => part.length > 0);

      products = products.filter((product) => {
        // Crear un string con todos los valores del producto para buscar
        const productValues = [
          product.name || "",
          product.barCode || "",
          product.type || "",
          String(product.initial_quantity || ""),
          product.expiration_date || "",
          // Incluir categoría si existe
          "category" in product && product.category ? product.category : "",
        ]
          .join(" ")
          .toLowerCase();

        // Normalizar los valores del producto
        const normalizedProductValues = normalizeText(productValues);

        // Verificar que todas las partes de la búsqueda estén presentes
        return searchParts.every((part) =>
          normalizedProductValues.includes(part)
        );
      });
    }

    return products;
  }, [DataProducts, debouncedSearchTerm]);

  // Función para actualizar la búsqueda (ahora delegada al hook)
  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setSearch(newSearchTerm);
    },
    [setSearch]
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <DataTable
        columns={getColumns(categories)}
        data={filteredProducts}
        onSearch={handleSearch}
        initialSearch={searchTerm}
        categories={categories}
        isSearching={isSearching}
      />
    </div>
  );
};
