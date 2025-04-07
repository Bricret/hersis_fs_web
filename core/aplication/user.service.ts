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
    console.log("en el service");
    const newUser = await this.repository.createUser(user);
    return newUser;
  }

  async updateUser(user: User): Promise<User> {
    const updatedUser = await this.repository.updateUser(user);
    return updatedUser;
  }

  async deleteUser(user: User): Promise<void> {
    await this.repository.deleteUser(user);
  }
}
