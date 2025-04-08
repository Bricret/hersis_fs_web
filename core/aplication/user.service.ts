import type { IUserRepository } from "../domain/repository/user.repository";
import type { User, PaginatedResponse } from "../domain/entity/user.entity";
import { UserSchema } from "@/infraestructure/schema/users.schema";

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

  async updateUser(user: User): Promise<User> {
    const updatedUser = await this.repository.updateUser(user);
    return updatedUser;
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
}
