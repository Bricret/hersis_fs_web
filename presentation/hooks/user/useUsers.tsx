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
import {
  EditUserSchema,
  UserSchema,
} from "@/infraestructure/schema/users.schema";
import { normalizeText } from "@/infraestructure/lib/utils";

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
    setCurrentPage(1);
  }, [urlSearchTerm]);

  const {
    data: serverUsers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", searchTerm, currentPage, selectedTab, selectedSucursal],
    queryFn: async () => {
      const response = await userService.getAllUsers(
        currentPage,
        ITEMS_PER_PAGE,
        searchTerm
      );
      return response;
    },
    staleTime: 0,
    initialData: initialUsers,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: true,
  });

  // Asegurarnos de que siempre tengamos un array de usuarios
  const users = Array.isArray(serverUsers)
    ? serverUsers
    : Array.isArray(serverUsers?.data)
    ? serverUsers.data
    : [];

  const meta = !Array.isArray(serverUsers) ? serverUsers?.meta : null;

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
    mutationFn: async ({ user, id }: { user: EditUserSchema; id: string }) =>
      await userService.updateUser({ user, id }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error("Error al actualizar el usuario", error);
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
    if (!Array.isArray(users)) return [];

    return users.filter((user) => {
      const matchesSearch =
        searchTerm === ""
          ? true
          : normalizeText(user.name).includes(normalizeText(searchTerm));

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

  const resetPasswordMutation = useMutation({
    mutationFn: async (id: string) => await userService.resetPassword(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log("Error al restablecer la contraseña", error);
      throw new Error("Error al restablecer la contraseña:", error);
    },
  });

  const paginatedUsers = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers().slice(startIndex, endIndex);
  };

  // Manejadores de cambios
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    // Invalidar la query para forzar una nueva petición
    queryClient.invalidateQueries({
      queryKey: ["users", value, 1, selectedTab, selectedSucursal],
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Invalidar la query para forzar una nueva petición
    queryClient.invalidateQueries({
      queryKey: ["users", searchTerm, page, selectedTab, selectedSucursal],
    });
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setCurrentPage(1);
    // Invalidar la query para forzar una nueva petición
    queryClient.invalidateQueries({
      queryKey: ["users", searchTerm, 1, tab, selectedSucursal],
    });
  };

  const handleSucursalChange = (sucursal: string) => {
    setSelectedSucursal(sucursal);
    setCurrentPage(1);
    // Invalidar la query para forzar una nueva petición
    queryClient.invalidateQueries({
      queryKey: ["users", searchTerm, 1, selectedTab, sucursal],
    });
  };

  return {
    // Datos y estado
    users: isLoading ? [] : users,
    totalUsers: meta?.total || 0,
    isLoading,
    error,
    meta,

    // Paginación
    currentPage,
    setCurrentPage: handlePageChange,

    // Filtros
    searchTerm,
    setSearchTerm: handleSearchChange,
    selectedTab,
    setSelectedTab: handleTabChange,
    selectedSucursal,
    setSelectedSucursal: handleSucursalChange,

    // Mutaciones
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    disableUser: disableUserMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
  };
}
