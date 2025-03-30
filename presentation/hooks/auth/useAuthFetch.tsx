import { useAuthStore } from "@/presentation/store/auth.store";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { AuthService } from "@/core/aplication/auth.service";
import { AuthApiRepository } from "@/infraestructure/repositories/auth.api";
import Cookies from "js-cookie";

export const useAuthFetch = () => {
  const { setUser, setAuthenticated } = useAuthStore();

  const authRepository = new AuthApiRepository(APIFetcher);
  const authService = new AuthService(authRepository);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      setUser(response.data);
      setAuthenticated(true);
      Cookies.set("token", response.accessToken);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(`${error}`);
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
