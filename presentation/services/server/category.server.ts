"use server";

import { CategoryService } from "@/core/aplication/category.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { CategoryApiRepository } from "@/infraestructure/repositories/category.api";
import type { Category } from "@/core/domain/entity/categories.entity";

const categoryRepository = new CategoryApiRepository(APIFetcher);
const categoryService = new CategoryService(categoryRepository);

export async function getCategories(): Promise<Category[]> {
  return await categoryService.getAllCategories();
}
