import {
  ITEMS_PER_PAGE,
  User,
  PaginatedResponse,
} from "@/core/domain/entity/user.entity";
import { useState, useEffect } from "react";
import { useUsersFetch } from "./useUsersFetch";
import { useSearchParams as useNextSearchParams } from "next/navigation";

// Hook para la lógica de usuarios
export function useUsers({
  users: initialUsers,
}: {
  users: User[] | PaginatedResponse<User>;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");
  const [selectedSucursal, setSelectedSucursal] = useState("todas");

  const { users: serverUsers, isLoading, error } = useUsersFetch();
  const searchParams = useNextSearchParams();

  // Sincronizamos el término de búsqueda con los parámetros de la URL
  useEffect(() => {
    const searchParam = searchParams.get("search");
    // Si el parámetro de búsqueda es null o está vacío, establecemos searchTerm como cadena vacía
    setSearchTerm(searchParam || "");
  }, [searchParams]);

  // Usamos los datos del servidor si están disponibles, si no, usamos los datos iniciales
  const usersData = serverUsers || initialUsers;

  // Extraemos el array de usuarios y los metadatos
  const users = Array.isArray(usersData) ? usersData : usersData.data;

  const meta = !Array.isArray(usersData) ? usersData.meta : null;

  const filteredUsers = () => {
    if (!users) return [];

    return users.filter((user) => {
      // Si searchTerm está vacío, no filtramos por búsqueda
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

  // Cuando cambia el filtro, regresamos a la primera página
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const handleSucursalChange = (sucursal: string) => {
    setSelectedSucursal(sucursal);
    setCurrentPage(1);
  };

  return {
    users: isLoading ? [] : paginatedUsers(),
    totalUsers: isLoading ? 0 : filteredUsers().length,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab: handleTabChange,
    selectedSucursal,
    setSelectedSucursal: handleSucursalChange,
    isLoading,
    error,
    meta,
  };
}
