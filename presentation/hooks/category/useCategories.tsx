"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/presentation/services/server/category.server";
import type { Category } from "@/core/domain/entity/categories.entity";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}
