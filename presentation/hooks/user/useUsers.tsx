import { ITEMS_PER_PAGE, User } from "@/core/domain/entity/user.entity";
import { useState } from "react";
import { useUsersFetch } from "./useUsersFetch";

// Hook para la lógica de usuarios
export function useUsers({ users: initialUsers }: { users: User[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");
  const [selectedSucursal, setSelectedSucursal] = useState("todas");

  const { users: serverUsers, isLoading, error } = useUsersFetch();

  // Usamos los datos del servidor si están disponibles, si no, usamos los datos iniciales
  const users = serverUsers || initialUsers;

  if (!users || isLoading)
    return {
      users: [],
      totalUsers: 0,
      currentPage: 1,
      setCurrentPage: () => {},
      searchTerm: "",
      setSearchTerm: () => {},
      selectedTab: "todos",
      setSelectedTab: () => {},
      selectedSucursal: "todas",
      setSelectedSucursal: () => {},
      isLoading,
      error,
    };

  const filteredUsers = () => {
    return users.filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

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
    users: paginatedUsers(),
    totalUsers: filteredUsers().length,
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
  };
}
