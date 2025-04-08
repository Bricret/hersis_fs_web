import { UserSchema } from "@/infraestructure/schema/users.schema";
import type { User, PaginatedResponse } from "../entity/user.entity";

export interface IUserRepository {
  createUser(user: UserSchema): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;

  getUserById(id: string): Promise<User>;
  getAllUsers(): Promise<PaginatedResponse<User>>;
}
