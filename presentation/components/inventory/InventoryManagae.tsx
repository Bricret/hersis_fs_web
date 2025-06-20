"use client";

import { Inventory } from "@/core/domain/entity/inventory.entity";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const InventoryManagae = ({
  DataProducts,
  initialSearch = "",
}: {
  DataProducts: Inventory[];
  initialSearch?: string;
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
      const searchLower = searchTerm.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.barCode.toLowerCase().includes(searchLower) ||
          (product.type && product.type.toLowerCase().includes(searchLower))
      );
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
        columns={columns}
        data={filteredProducts}
        onSearch={handleSearch}
        initialSearch={searchTerm}
      />
    </div>
  );
};
