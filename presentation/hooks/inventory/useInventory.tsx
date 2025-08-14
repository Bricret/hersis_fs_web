"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import { PaginatedResponse } from "@/core/domain/entity/user.entity";
import { toast } from "sonner";

interface UseInventoryProps {
  initialProducts: Inventory[];
  initialTotalPages: number;
  initialCurrentPage: number;
  initialTotalItems: number;
}

export function useInventory({
  initialProducts,
  initialTotalPages,
  initialCurrentPage,
  initialTotalItems,
}: UseInventoryProps) {
  const [products, setProducts] = useState(initialProducts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [loading, setLoading] = useState(false);

  // Ref para evitar búsquedas duplicadas
  const lastSearchRef = useRef<string>("");
  const lastPageRef = useRef<number>(1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para buscar productos
  const searchProducts = useCallback(
    async (searchTerm: string, page: number = 1) => {
      // Evitar búsquedas duplicadas
      const searchKey = `${searchTerm}-${page}`;
      if (lastSearchRef.current === searchKey) {
        console.log(`[useInventory] Búsqueda duplicada ignorada: ${searchKey}`);
        return;
      }

      // Si estamos cargando, evitar nueva búsqueda
      if (loading) {
        console.log(
          `[useInventory] Búsqueda cancelada por estar cargando: ${searchKey}`
        );
        return;
      }

      console.log(
        `[useInventory] Iniciando búsqueda - Término: "${searchTerm}", Página: ${page}`
      );
      lastSearchRef.current = searchKey;
      lastPageRef.current = page;

      setLoading(true);
      try {
        // Construir la URL de búsqueda
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "20");

        if (searchTerm.trim()) {
          params.append("search", searchTerm.trim());
        }

        const url = `/api/inventory/search?${params.toString()}`;
        console.log(`[useInventory] URL de búsqueda: ${url}`);

        // Hacer la petición a la API
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Error en la búsqueda: ${response.status} ${response.statusText}`
          );
        }

        const result: PaginatedResponse<Inventory> = await response.json();

        // Verificar que la respuesta tenga datos válidos
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Respuesta inválida del servidor");
        }

        // Filtrar solo productos activos
        const activeProducts = result.data.filter(
          (product) => product.is_active
        );

        console.log(
          `[useInventory] Búsqueda completada - Productos: ${activeProducts.length}, Total: ${result.meta.total}, Páginas: ${result.meta.totalPages}`
        );

        setProducts(activeProducts);
        setTotalPages(result.meta.totalPages);
        setCurrentPage(result.meta.page);
        setTotalItems(result.meta.total);

        return result;
      } catch (error) {
        console.error(`[useInventory] Error en búsqueda:`, error);
        toast.error("Error al buscar productos");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Función para cambiar de página (navegación simple sin búsqueda)
  const changePage = useCallback(
    async (newPage: number, searchTerm: string = "") => {
      if (newPage < 1 || newPage > totalPages) {
        console.log(
          `[useInventory] No se puede cambiar a la página ${newPage} - Página actual: ${currentPage}, Total páginas: ${totalPages}`
        );
        return;
      }

      // Evitar cambio a la misma página con la misma búsqueda
      const changeKey = `${searchTerm}-${newPage}`;
      if (lastSearchRef.current === changeKey && newPage === currentPage) {
        console.log(
          `[useInventory] Cambio de página duplicado ignorado: ${changeKey}`
        );
        return;
      }

      // Si estamos cargando, evitar nuevo cambio
      if (loading) {
        console.log(
          `[useInventory] Cambio de página cancelado por estar cargando: ${changeKey}`
        );
        return;
      }

      console.log(
        `[useInventory] Cambiando a página ${newPage} con búsqueda: "${searchTerm}"`
      );
      setLoading(true);

      try {
        // Construir la URL para navegación de página
        const params = new URLSearchParams();
        params.append("page", newPage.toString());
        params.append("limit", "20");

        // Solo agregar search si hay un término de búsqueda válido
        if (searchTerm && searchTerm.trim()) {
          params.append("search", searchTerm.trim());
          console.log(
            `[useInventory] Agregando término de búsqueda: "${searchTerm.trim()}"`
          );
        } else {
          console.log(`[useInventory] Sin término de búsqueda`);
        }

        const url = `/api/inventory/search?${params.toString()}`;
        console.log(`[useInventory] URL final: ${url}`);

        // Hacer la petición a la API
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Error al cambiar de página: ${response.status} ${response.statusText}`
          );
        }

        const result: PaginatedResponse<Inventory> = await response.json();

        // Verificar que la respuesta tenga datos válidos
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Respuesta inválida del servidor");
        }

        // Filtrar solo productos activos
        const activeProducts = result.data.filter(
          (product) => product.is_active
        );

        // Verificar que haya productos después del filtro
        if (activeProducts.length === 0 && result.meta.total > 0) {
          console.warn(
            `[useInventory] No se encontraron productos activos en la página ${newPage}`
          );
        }

        console.log(
          `[useInventory] Página ${newPage} cargada - Productos: ${activeProducts.length}, Total: ${result.meta.total}, Páginas: ${result.meta.totalPages}`
        );

        setProducts(activeProducts);
        setTotalPages(result.meta.totalPages);
        setCurrentPage(result.meta.page);
        setTotalItems(result.meta.total);

        // Actualizar las referencias
        lastPageRef.current = newPage;
        if (searchTerm.trim()) {
          lastSearchRef.current = `${searchTerm.trim()}-${newPage}`;
        } else {
          lastSearchRef.current = `-${newPage}`;
        }

        return result;
      } catch (error) {
        console.error(
          `[useInventory] Error al cambiar a la página ${newPage}:`,
          error
        );
        toast.error("Error al cambiar de página");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [totalPages, currentPage]
  );

  // Función para buscar con debounce
  const searchWithDebounce = useCallback(
    (searchTerm: string, page: number = 1) => {
      // Limpiar timeout anterior
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Crear nuevo timeout
      searchTimeoutRef.current = setTimeout(() => {
        searchProducts(searchTerm, page);
      }, 500);
    },
    [searchProducts]
  );

  // Función para limpiar búsqueda y volver a la primera página
  const clearSearch = useCallback(async () => {
    await searchProducts("", 1);
  }, [searchProducts]);

  // Efecto para actualizar estado cuando cambian las props iniciales
  useEffect(() => {
    // Solo actualizar si realmente hay datos nuevos
    if (
      initialProducts.length > 0 ||
      initialTotalPages !== totalPages ||
      initialCurrentPage !== currentPage ||
      initialTotalItems !== totalItems
    ) {
      console.log(
        `[useInventory] Actualizando con datos del servidor - Productos: ${initialProducts.length}, Página: ${initialCurrentPage}, Total: ${initialTotalItems}`
      );
      setProducts(initialProducts);
      setTotalPages(initialTotalPages);
      setCurrentPage(initialCurrentPage);
      setTotalItems(initialTotalItems);

      // Actualizar las referencias para evitar búsquedas duplicadas
      lastPageRef.current = initialCurrentPage;
    }
  }, [
    initialProducts,
    initialTotalPages,
    initialCurrentPage,
    initialTotalItems,
  ]);

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    products,
    totalPages,
    currentPage,
    totalItems,
    loading,
    searchProducts,
    searchWithDebounce,
    changePage,
    clearSearch,
  };
}
