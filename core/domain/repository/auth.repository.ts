import type { IUserAuth } from "../entity/userAuth.entity";

export interface IAuthRepository {
  login(username: string, password: string): Promise<IUserAuth>;
  logout(): Promise<void>;
}
