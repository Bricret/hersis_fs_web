import type { IUserRepository } from "@/core/domain/repository/user.repository";
import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { User } from "@/core/domain/entity/user.entity";

export class UserApiRepository implements IUserRepository {
  constructor(private readonly http: HttpAdapter) {}

  async getAllUsers(): Promise<User[]> {
    const response = await this.http.get<User[]>("/allUsers");
    return response;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.http.get<User>(`user/${id}`);
    return response;
  }
}
