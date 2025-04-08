import { UserSchema } from "@/infraestructure/schema/users.schema";
import type { User, PaginatedResponse } from "../entity/user.entity";
import { IResetPasswordResponse } from "@/infraestructure/interface/users/resMethod.interface";

export interface IUserRepository {
  createUser(user: UserSchema): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
  resetPassword(id: string): Promise<IResetPasswordResponse>;

  getUserById(id: string): Promise<User>;
  getAllUsers(): Promise<PaginatedResponse<User>>;
}
