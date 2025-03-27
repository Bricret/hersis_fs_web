import type { User } from "../entity/user.entity";

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
}
