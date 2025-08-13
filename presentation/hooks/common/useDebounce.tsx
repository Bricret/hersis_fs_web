"use client";

import { useEffect, useState } from "react";

/**
 * Hook para implementar debounce de manera reutilizable
 * @param value - Valor a debounce
 * @param delay - Tiempo de retraso en milisegundos (por defecto 500ms)
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
