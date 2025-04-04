import type { IUserRepository } from "../domain/repository/user.repository";
import type { User } from "../domain/entity/user.entity";

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.repository.getAllUsers();
    return users;
  }

  async createUser(user: User): Promise<User> {
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
