import type { IUserRepository } from "../domain/repository/user.repository";
import type { User } from "../domain/entity/user.entity";

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async getUsers(): Promise<User[]> {
    const users = await this.repository.getAllUsers();
    return users;
  }
}
