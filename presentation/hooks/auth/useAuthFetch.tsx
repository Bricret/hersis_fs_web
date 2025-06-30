import { useAuthStore } from "@/presentation/store/auth.store";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { AuthService } from "@/core/aplication/auth.service";
import { AuthApiRepository } from "@/infraestructure/repositories/auth.api";
import Cookies from "js-cookie";
import { IUserAuthData } from "@/core/domain/entity/userAuth.entity";
import { Roles } from "@/infraestructure/interface/users/rols.interface";

// Definir las rutas permitidas por rol
const ROUTE_PERMISSIONS = {
  [Roles.ADMIN]: [
    "/",
    "/cashier",
    "/shop",
    "/inventory",
    "/inventory/registerProduct",
    "/users",
    "/reports",
    "/transactions",
    "/stats",
    "/notifications",
    "/branches",
    "/settings",
  ],
  [Roles.PHARMACIST]: [
    "/",
    "/cashier",
    "/shop",
    "/inventory",
    "/inventory/registerProduct",
  ],
};

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

  // Función para verificar si el usuario tiene acceso a una ruta específica
  const hasRouteAccess = (route: string): boolean => {
    const currentUser = getUserAuth();
    if (!currentUser) return false;

    const userRole = currentUser.role as Roles;
    const allowedRoutes = ROUTE_PERMISSIONS[userRole] || [];

    return allowedRoutes.includes(route);
  };

  // Función para obtener las rutas permitidas según el rol del usuario
  const getAllowedRoutes = (): string[] => {
    const currentUser = getUserAuth();
    if (!currentUser) return [];

    const userRole = currentUser.role as Roles;
    return ROUTE_PERMISSIONS[userRole] || [];
  };

  // Función para verificar si el usuario es admin
  const isAdmin = (): boolean => {
    const currentUser = getUserAuth();
    return currentUser?.role === Roles.ADMIN;
  };

  // Función para verificar si el usuario es pharmacist
  const isPharmacist = (): boolean => {
    const currentUser = getUserAuth();
    return currentUser?.role === Roles.PHARMACIST;
  };

  return {
    login,
    logout: handleLogout,
    getUserAuth,
    hasRouteAccess,
    getAllowedRoutes,
    isAdmin,
    isPharmacist,
  };
};
