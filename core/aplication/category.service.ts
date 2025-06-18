import type { Category } from "../domain/entity/categories.entity";
import type { ICategoryRepository } from "../domain/repository/category.repository";

export class CategoryService {
  constructor(private readonly repository: ICategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await this.repository.getAllCategories();
      return categories;
    } catch (error) {
      console.error("Error en CategoryService.getAllCategories:", error);
      if (error instanceof Error) {
        throw new Error(`Error al obtener las categorías: ${error.message}`);
      }
      throw new Error("Error desconocido al obtener las categorías");
    }
  }
}
