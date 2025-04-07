import type { User, PaginatedResponse } from "../entity/user.entity";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(user: User): Promise<void>;

  getUserById(id: string): Promise<User>;
  getAllUsers(): Promise<PaginatedResponse<User>>;
}
