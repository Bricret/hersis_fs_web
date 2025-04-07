import type { IUserRepository } from "@/core/domain/repository/user.repository";
import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { User, PaginatedResponse } from "@/core/domain/entity/user.entity";
import { UserSchema } from "../schema/users.schema";

export class UserApiRepository implements IUserRepository {
  constructor(private readonly http: HttpAdapter) {}

  private userRecord: Record<string, unknown> = {};

  async getAllUsers(): Promise<PaginatedResponse<User>> {
    const response = await this.http.get<PaginatedResponse<User>>(
      "/users/allUsers"
    );
    return response;
  }
  async createUser(user: UserSchema): Promise<User> {
    this.userRecord = { ...user };
    console.log(this.userRecord);
    const response = await this.http.post<User>("/users", this.userRecord);
    return response;
  }

  async updateUser(user: User): Promise<User> {
    this.userRecord = { ...user };
    const response = await this.http.patch<User>(
      `/users/${user.id}`,
      this.userRecord
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
