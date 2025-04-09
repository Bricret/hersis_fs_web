import type { IUserRepository } from "../domain/repository/user.repository";
import type { User, PaginatedResponse } from "../domain/entity/user.entity";
import {
  EditUserSchema,
  UserSchema,
} from "@/infraestructure/schema/users.schema";
import {
  IGenericResponse,
  IResetPasswordResponse,
} from "@/infraestructure/interface/users/resMethod.interface";

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async getAllUsers(): Promise<PaginatedResponse<User>> {
    const users = await this.repository.getAllUsers();
    return users;
  }

  async createUser(user: UserSchema): Promise<User> {
    const newUser = await this.repository.createUser(user);
    return newUser;
  }

  async updateUser({
    user,
    id,
  }: {
    user: EditUserSchema;
    id: string;
  }): Promise<IGenericResponse> {
    try {
      const updatedUser = await this.repository.updateUser(user, id);
      return updatedUser;
    } catch (error) {
      console.error("Error en UserService.updateUser:", error);
      if (error instanceof Error) {
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
      }
      throw new Error("Error desconocido al actualizar el usuario");
    }
  }

  async disableUser(id: string): Promise<void> {
    try {
      await this.repository.deleteUser(id);
    } catch (error) {
      console.error("Error en UserService.disableUser:", error);
      if (error instanceof Error) {
        throw new Error(`Error al desactivar el usuario: ${error.message}`);
      }
      throw new Error("Error desconocido al desactivar el usuario");
    }
  }

  async resetPassword(id: string): Promise<IResetPasswordResponse> {
    try {
      const response = await this.repository.resetPassword(id);
      return response;
    } catch (error) {
      console.error("Error en UserService.resetPassword:", error);
      if (error instanceof Error) {
        throw new Error(`Error al restablecer la contraseña: ${error.message}`);
      }
      throw new Error("Error desconocido al restablecer la contraseña");
    }
  }
}
