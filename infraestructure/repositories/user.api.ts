import type { IUserRepository } from "@/core/domain/repository/user.repository";
import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { User } from "@/core/domain/entity/user.entity";

export class UserApiRepository implements IUserRepository {
  constructor(private readonly http: HttpAdapter) {}

  async getAllUsers(): Promise<User[]> {
    const response = await this.http.get<User[]>("/allUsers");
    return response;
  }
  async createUser(user: User): Promise<User> {
    const userRecord: Record<string, unknown> = { ...user };
    const response = await this.http.post<User>("/users", userRecord);
    return response;
  }
  async updateUser(user: User): Promise<User> {
    const userRecord: Record<string, unknown> = { ...user };
    const response = await this.http.patch<User>(
      `/users/${user.id}`,
      userRecord
    );
    return response;
  }

  async deleteUser(user: User): Promise<void> {
    await this.http.delete(`/users/${user.id}`);
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.http.get<User>(`/users/${id}`);
    return response;
  }
}
