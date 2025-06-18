import type { Category } from "../entity/categories.entity";

export interface ICategoryRepository {
  getAllCategories(): Promise<Category[]>;
}
