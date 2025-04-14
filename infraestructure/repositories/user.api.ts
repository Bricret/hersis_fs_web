import type { IUserRepository } from "@/core/domain/repository/user.repository";
import type { HttpAdapter } from "../adapters/http/http.adapter";
import type { User, PaginatedResponse } from "@/core/domain/entity/user.entity";
import { EditUserSchema, UserSchema } from "../schema/users.schema";
import Cookies from "js-cookie";
import {
  IGenericResponse,
  IResetPasswordResponse,
} from "../interface/users/resMethod.interface";

export class UserApiRepository implements IUserRepository {
  constructor(private readonly http: HttpAdapter) {}

  private userRecord: Record<string, unknown> = {};

  private getToken(): string {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    return token;
  }

  //TODO: Agregar el manejo correcto de la busqueda y del paginado al 100%
  async getAllUsers(
    page = 1,
    limit = 5,
    search = ""
  ): Promise<PaginatedResponse<User>> {
    const response = await this.http.get<PaginatedResponse<User>>(
      `/users/allUsers?page=${page}&limit=${limit}&search=${search}`
    );
    return response;
  }
  async createUser(user: UserSchema): Promise<User> {
    this.userRecord = { ...user };
    const response = await this.http.post<User>("/users", this.userRecord);
    return response;
  }

  async updateUser(
    user: EditUserSchema,
    id: string
  ): Promise<IGenericResponse> {
    try {
      const token = this.getToken();
      // Filtrar las propiedades que no deben enviarse al backend
      const {
        id: _,
        isActive: __,
        lastLogin: ___,
        ...filteredUser
      } = user as any;
      const data = (this.userRecord = { ...filteredUser });
      const response = await this.http.patch<IGenericResponse>(
        `/users/${id}`,
        data,
        undefined,
        token
      );
      return response;
    } catch (error) {
      console.error("Error en UserApiRepository.updateUser:", error);
      if (error instanceof Error) {
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
      }
      throw new Error("Error desconocido al actualizar el usuario");
    }
  }

  async deleteUser(id: string): Promise<void> {
    const token = this.getToken();
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

  async resetPassword(id: string): Promise<IResetPasswordResponse> {
    const token = this.getToken();
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    const response = await this.http.patch<IResetPasswordResponse>(
      `/users/resetPassword/${id}`,
      {},
      undefined,
      token
    );
    return response;
  }
}
