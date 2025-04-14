import {
  EditUserSchema,
  UserSchema,
} from "@/infraestructure/schema/users.schema";
import type { User, PaginatedResponse } from "../entity/user.entity";
import {
  IGenericResponse,
  IResetPasswordResponse,
} from "@/infraestructure/interface/users/resMethod.interface";

export interface IUserRepository {
  createUser(user: UserSchema): Promise<User>;
  updateUser(user: EditUserSchema, id: string): Promise<IGenericResponse>;
  deleteUser(id: string): Promise<void>;
  resetPassword(id: string): Promise<IResetPasswordResponse>;

  getUserById(id: string): Promise<User>;
  getAllUsers(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponse<User>>;
}
