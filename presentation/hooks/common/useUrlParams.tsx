"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UrlParams {
  page?: number;
  search?: string;
  limit?: number;
  [key: string]: string | number | undefined;
}

interface UseUrlParamsProps {
  /**
   * Valores iniciales para los parámetros
   */
  initialParams?: UrlParams;
  /**
   * Función que se ejecuta cuando los parámetros cambian
   */
  onParamsChange?: (params: UrlParams) => void;
  /**
   * Si true, actualiza la URL automáticamente cuando cambian los parámetros
   */
  updateUrl?: boolean;
  /**
   * Si true, actualiza la URL inmediatamente para la búsqueda (sin debounce)
   */
  immediateUrlUpdate?: boolean;
}

/**
 * Hook para manejar parámetros de URL de manera reactiva
 * Incluye soporte para paginación, búsqueda y otros parámetros personalizados
 */
export function useUrlParams({
  initialParams = {},
  onParamsChange,
  updateUrl = true,
}: UseUrlParamsProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado para controlar si es la carga inicial
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Estado local para los parámetros
  const [params, setParams] = useState<UrlParams>(() => {
    // Inicializar con valores de la URL o valores por defecto
    const urlParams: UrlParams = {};

    // Obtener page de la URL
    const urlPage = searchParams.get("page");
    urlParams.page = urlPage ? parseInt(urlPage, 10) : initialParams.page || 1;

    // Obtener search de la URL
    const urlSearch = searchParams.get("search");
    urlParams.search = urlSearch || initialParams.search || "";

    // Obtener limit de la URL
    const urlLimit = searchParams.get("limit");
    urlParams.limit = urlLimit
      ? parseInt(urlLimit, 10)
      : initialParams.limit || 20;

    // Obtener otros parámetros de la URL
    searchParams.forEach((value, key) => {
      if (!["page", "search", "limit"].includes(key)) {
        // Intentar convertir a número si es posible
        const numValue = parseInt(value, 10);
        urlParams[key] = isNaN(numValue) ? value : numValue;
      }
    });

    return { ...initialParams, ...urlParams };
  });

  // Función para actualizar parámetros
  const updateParams = useCallback(
    (newParams: Partial<UrlParams>, resetPage: boolean = false) => {
      setParams((prevParams) => {
        const updatedParams = { ...prevParams, ...newParams };

        // Si resetPage es true o se está actualizando la búsqueda, resetear página a 1
        if (
          resetPage ||
          (newParams.search !== undefined &&
            newParams.search !== prevParams.search)
        ) {
          updatedParams.page = 1;
        }

        return updatedParams;
      });
    },
    []
  );

  // Función para actualizar solo la página
  const setPage = useCallback(
    (page: number) => {
      updateParams({ page }, false);
    },
    [updateParams]
  );

  // Función para actualizar solo la búsqueda
  const setSearch = useCallback(
    (search: string, immediate: boolean = false) => {
      updateParams({ search }, true); // Resetear página cuando se busca

      // Si immediateUrlUpdate es true, actualizar la URL inmediatamente
      if (immediate) {
        const urlParams = new URLSearchParams();
        if (search.trim()) {
          urlParams.set("search", search.trim());
        }
        const newUrl = `${window.location.pathname}${
          urlParams.toString() ? `?${urlParams.toString()}` : ""
        }`;
        router.push(newUrl);
      }
    },
    [updateParams, router]
  );

  // Función para limpiar la búsqueda
  const clearSearch = useCallback(() => {
    updateParams({ search: "" }, true);
  }, [updateParams]);

  // Función para resetear todos los parámetros
  const resetParams = useCallback(() => {
    setParams(initialParams);
  }, [initialParams]);

  // Efecto para marcar que ya no es la carga inicial
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, []);

  // Efecto para actualizar la URL cuando cambian los parámetros
  useEffect(() => {
    // No actualizar la URL en la carga inicial para evitar conflictos con SSR
    if (updateUrl && !isInitialLoad) {
      const urlParams = new URLSearchParams();

      // Agregar parámetros que no sean valores por defecto
      if (params.page && params.page > 1) {
        urlParams.set("page", params.page.toString());
      }

      if (params.search && params.search.trim()) {
        urlParams.set("search", params.search.trim());
      }

      if (params.limit && params.limit !== 20) {
        urlParams.set("limit", params.limit.toString());
      }

      // Agregar otros parámetros personalizados
      Object.entries(params).forEach(([key, value]) => {
        if (
          !["page", "search", "limit"].includes(key) &&
          value !== undefined &&
          value !== ""
        ) {
          urlParams.set(key, value.toString());
        }
      });

      const newUrl = `${window.location.pathname}${
        urlParams.toString() ? `?${urlParams.toString()}` : ""
      }`;

      // Solo actualizar si la URL ha cambiado
      if (newUrl !== window.location.pathname + window.location.search) {
        router.push(newUrl);
      }
    }
  }, [params, updateUrl, router, isInitialLoad]);

  // Efecto para ejecutar callback cuando cambian los parámetros
  useEffect(() => {
    if (onParamsChange) {
      onParamsChange(params);
    }
  }, [params, onParamsChange]);

  // Efecto para sincronizar con cambios externos en la URL
  useEffect(() => {
    const currentUrlParams: UrlParams = {};

    const urlPage = searchParams.get("page");
    currentUrlParams.page = urlPage ? parseInt(urlPage, 10) : 1;

    const urlSearch = searchParams.get("search");
    currentUrlParams.search = urlSearch || "";

    const urlLimit = searchParams.get("limit");
    currentUrlParams.limit = urlLimit ? parseInt(urlLimit, 10) : 20;

    // Verificar si hay diferencias
    const hasChanges =
      currentUrlParams.page !== params.page ||
      currentUrlParams.search !== params.search ||
      currentUrlParams.limit !== params.limit;

    if (hasChanges) {
      setParams((prevParams) => ({ ...prevParams, ...currentUrlParams }));
    }
  }, [searchParams]);

  return {
    params,
    updateParams,
    setPage,
    setSearch,
    clearSearch,
    resetParams,
    // Valores individuales para acceso directo
    page: params.page || 1,
    search: params.search || "",
    limit: params.limit || 20,
  };
}
