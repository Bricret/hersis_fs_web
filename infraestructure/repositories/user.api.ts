import type { IUserRepository } from "@/core/domain/repository/user.repository";
import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { User, PaginatedResponse } from "@/core/domain/entity/user.entity";
import { UserSchema } from "../schema/users.schema";
import Cookies from "js-cookie";

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

  async deleteUser(id: string): Promise<void> {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    const response = await this.http.delete<void>(
      `/users/${id}`,
      undefined,
      token
    );
    console.log("deleteUser", response);
    return response;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.http.get<User>(`/users/${id}`);
    return response;
  }
}
