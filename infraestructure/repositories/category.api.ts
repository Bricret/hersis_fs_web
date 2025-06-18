import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { Category } from "@/core/domain/entity/categories.entity";
import type { ICategoryRepository } from "@/core/domain/repository/category.repository";

export class CategoryApiRepository implements ICategoryRepository {
  constructor(private readonly http: HttpAdapter) {}

  async getAllCategories(): Promise<Category[]> {
    const response = await this.http.get<Category[]>("/category");
    return response;
  }
}
