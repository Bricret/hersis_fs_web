import type { IUserAuth } from "../domain/entity/userAuth.entity";
import type { IAuthRepository } from "../domain/repository/auth.repository";

export class AuthService {
  constructor(private readonly repository: IAuthRepository) {}

  async login(username: string, password: string): Promise<IUserAuth> {
    const users = await this.repository.login(username, password);
    return users;
  }

  async logout(): Promise<void> {
    const logout = await this.repository.logout();
    return logout;
  }
}
