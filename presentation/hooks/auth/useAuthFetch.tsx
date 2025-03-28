import { signIn, type SignInResponse, signOut } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/presentation/store/auth.store";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { AuthService } from "@/core/aplication/auth.service";
import { AuthApiRepository } from "@/infraestructure/repositories/auth.api";

export const useAuthFetch = () => {
  const { setUser, setAuthenticated } = useAuthStore();

  const authRepository = new AuthApiRepository(APIFetcher);
  const authService = new AuthService(authRepository);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.data);
      setAuthenticated(true);
    } catch (error) {
      console.log(error);
      throw new Error("Error al iniciar sesion", { cause: error });
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setAuthenticated(false);
  };

  return {
    login,
    logout: handleLogout,
  };
};
