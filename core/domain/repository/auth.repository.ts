import type { IUserAuth } from "../entity/userAuth.entity";

export interface IAuthRepository {
  login(email: string, password: string): Promise<IUserAuth>;
  logout(): Promise<void>;
}
