import type { IUserAuth } from "@/core/domain/entity/userAuth.entity";
import type { IAuthRepository } from "@/core/domain/repository/auth.repository";
import type { HttpAdapter } from "../adapters/http/http.adapter";

export class AuthApiRepository implements IAuthRepository {
  constructor(private readonly http: HttpAdapter) {}

  async login(email: string, password: string): Promise<IUserAuth> {
    try {
      console.log("Iniciando petición de login a la API");
      const response = await this.http.post<IUserAuth>("/auth/login", {
        email,
        password,
      });

      if (!response || !response.accessToken) {
        throw new Error(
          "La respuesta de la API no contiene el token de acceso"
        );
      }

      console.log("Login exitoso, token recibido");
      return response;
    } catch (error: unknown) {
      console.error("Error en login:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al intentar iniciar sesión");
    }
  }

  async logout(): Promise<void> {
    try {
      await this.http.post("/auth/logout", {});
    } catch (error: unknown) {
      console.error("Error en logout:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error al intentar cerrar sesión");
    }
  }
}
