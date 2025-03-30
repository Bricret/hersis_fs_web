import { useAuthStore } from "@/presentation/store/auth.store";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { AuthService } from "@/core/aplication/auth.service";
import { AuthApiRepository } from "@/infraestructure/repositories/auth.api";
import Cookies from "js-cookie";
import { IUserAuthData } from "@/core/domain/entity/userAuth.entity";

export const useAuthFetch = () => {
  const { setUser, user } = useAuthStore();

  const authRepository = new AuthApiRepository(APIFetcher);
  const authService = new AuthService(authRepository);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      setUser(response.data);
      Cookies.set("token", response.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("userAuth", JSON.stringify(response.data));
      }
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(`${error}`);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("userAuth");
    }
  };

  const getUserAuth = (): IUserAuthData | undefined => {
    if (user) {
      return user;
    }

    if (typeof window !== "undefined") {
      const userAuth = localStorage.getItem("userAuth");
      if (userAuth) {
        const user = JSON.parse(userAuth) as IUserAuthData;
        setUser(user);
        return user;
      }
    }
  };

  return {
    login,
    logout: handleLogout,
    getUserAuth,
  };
};
