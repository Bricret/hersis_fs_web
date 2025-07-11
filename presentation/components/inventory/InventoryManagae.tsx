"use client";

import { Inventory } from "@/core/domain/entity/inventory.entity";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/core/domain/entity/categories.entity";

export const InventoryManagae = ({
  DataProducts,
  initialSearch = "",
  categories = [],
}: {
  DataProducts: Inventory[];
  initialSearch?: string;
  categories?: Category[];
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filtrar y ordenar productos localmente
  const filteredProducts = useMemo(() => {
    let products = [...DataProducts];

    // Ordenar por fecha de creación (más nuevo primero)
    products.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime(); // Orden descendente
    });

    // Aplicar filtro de búsqueda si existe
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
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

        // Verificar que todas las partes de la búsqueda estén presentes
        return searchParts.every((part) => productValues.includes(part));
      });
    }

    return products;
  }, [DataProducts, searchTerm]);

  // Función para actualizar la búsqueda en la URL
  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    const params = new URLSearchParams(searchParams.toString());

    if (newSearchTerm.trim()) {
      params.set("search", newSearchTerm);
    } else {
      params.delete("search");
    }

    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <DataTable
        columns={getColumns(categories)}
        data={filteredProducts}
        onSearch={handleSearch}
        initialSearch={searchTerm}
        categories={categories}
      />
    </div>
  );
};
