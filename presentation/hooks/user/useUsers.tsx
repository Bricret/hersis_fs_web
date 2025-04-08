import {
  ITEMS_PER_PAGE,
  User,
  PaginatedResponse,
} from "@/core/domain/entity/user.entity";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/core/aplication/user.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { UserApiRepository } from "@/infraestructure/repositories/user.api";
import { useSearchParams } from "next/navigation";
import { UserSchema } from "@/infraestructure/schema/users.schema";

const userRepository = new UserApiRepository(APIFetcher);
const userService = new UserService(userRepository);

export function useUsers({
  initialUsers,
}: {
  initialUsers?: User[] | PaginatedResponse<User>;
} = {}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const urlSearchTerm = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);
  const [selectedTab, setSelectedTab] = useState("todos");
  const [selectedSucursal, setSelectedSucursal] = useState("todas");

  useEffect(() => {
    setSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  const {
    data: serverUsers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: async () => await userService.getAllUsers(),
    staleTime: 1000 * 60 * 5, //! ==> 5 minutos
    initialData: initialUsers,
    enabled: !initialUsers || searchTerm !== "",
  });

  const usersData = serverUsers || initialUsers;

  const users = Array.isArray(usersData) ? usersData : usersData?.data || [];
  const meta = !Array.isArray(usersData) ? usersData?.meta : null;

  // Mutaciones para crear, actualizar y desactivar usuarios
  const createUserMutation = useMutation({
    mutationFn: async (user: UserSchema): Promise<User> =>
      await userService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log("Error al crear el usuario", error);
      throw new Error("Error al crear el usuario:", error);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (user: User) => await userService.updateUser(user),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.log("Error al actualizar el usuario", error);
      throw new Error("Error al actualizar el usuario:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const disableUserMutation = useMutation({
    mutationFn: async (id: string) => await userService.disableUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error al desactivar el usuario", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error desconocido al desactivar el usuario");
    },
  });

  // Funciones de filtrado
  const filteredUsers = () => {
    if (!users) return [];

    return users.filter((user) => {
      const matchesSearch =
        searchTerm === ""
          ? true
          : user.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedTab === "todos"
          ? true
          : selectedTab === "activos"
          ? user.isActive === true
          : user.isActive === false;

      const matchesSucursal =
        selectedSucursal === "todas" ? true : user.branch === selectedSucursal;

      return matchesSearch && matchesStatus && matchesSucursal;
    });
  };

  const paginatedUsers = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers().slice(startIndex, endIndex);
  };

  // Manejadores de cambios
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const handleSucursalChange = (sucursal: string) => {
    setSelectedSucursal(sucursal);
    setCurrentPage(1);
  };

  return {
    // Datos y estado
    users: isLoading ? [] : paginatedUsers(),
    totalUsers: isLoading ? 0 : filteredUsers().length,
    isLoading,
    error,
    meta,

    // Paginación
    currentPage,
    setCurrentPage,

    // Filtros
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab: handleTabChange,
    selectedSucursal,
    setSelectedSucursal: handleSucursalChange,

    // Mutaciones
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    disableUser: disableUserMutation.mutate,
  };
}
