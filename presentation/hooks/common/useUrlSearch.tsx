"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "./useDebounce";

interface UseUrlSearchProps {
  /**
   * Nombre del parámetro en la URL (por defecto 'search')
   */
  paramName?: string;
  /**
   * Tiempo de debounce en milisegundos (por defecto 500ms)
   */
  debounceDelay?: number;
  /**
   * Valor inicial del search
   */
  initialValue?: string;
  /**
   * Callback que se ejecuta cuando el search cambia (después del debounce)
   * Se ejecuta con el valor debounceed
   */
  onSearchChange?: (searchTerm: string) => void;
  /**
   * Si true, actualiza la URL automáticamente cuando cambia el search
   */
  updateUrl?: boolean;
}

/**
 * Hook reutilizable para manejar búsquedas con debounce y sincronización con URL
 * @param props - Configuración del hook
 * @returns Objeto con estado y funciones para manejar la búsqueda
 */
export function useUrlSearch({
  paramName = "search",
  debounceDelay = 500,
  initialValue = "",
  onSearchChange,
  updateUrl = true,
}: UseUrlSearchProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local del input de búsqueda
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Valor con debounce
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Inicializar el estado con el valor de la URL si existe
  useEffect(() => {
    const urlSearchTerm = searchParams.get(paramName) || "";
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams, paramName]);

  // Efecto para manejar cambios en el término de búsqueda con debounce
  useEffect(() => {
    // Solo ejecutar si hay un cambio real en el término debounced
    if (debouncedSearchTerm !== (searchParams.get(paramName) || "")) {
      // Ejecutar callback si está definido
      if (onSearchChange) {
        onSearchChange(debouncedSearchTerm);
      }

      // Actualizar URL si está habilitado
      if (updateUrl) {
        updateUrlParams(debouncedSearchTerm);
      }
    }
  }, [debouncedSearchTerm, onSearchChange, updateUrl, paramName, searchParams]);

  // Función para actualizar los parámetros de la URL
  const updateUrlParams = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (term.trim()) {
        params.set(paramName, term);
      } else {
        params.delete(paramName);
      }

      // Resetear la página a 1 cuando se hace una nueva búsqueda
      params.set("page", "1");

      router.push(`${window.location.pathname}?${params.toString()}`);
    },
    [searchParams, paramName, router]
  );

  // Función para limpiar la búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Función para establecer un nuevo término de búsqueda
  const setSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    searchTerm, // Valor actual del input (sin debounce)
    debouncedSearchTerm, // Valor con debounce
    setSearch, // Función para cambiar el término de búsqueda
    clearSearch, // Función para limpiar la búsqueda
    isSearching: searchTerm !== debouncedSearchTerm, // Indica si está en proceso de debounce
  };
}
