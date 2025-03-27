// hooks/useUsers.ts

import { usuariosData } from "@/core/data/users/users";
import {
  ITEMS_PER_PAGE,
  type Usuario,
} from "@/infraestructure/interface/users/user.interface";
import { useState } from "react";

// Hook para la lógica de usuarios
export function useUsers() {
  const [users, setUsers] = useState<Usuario[]>(usuariosData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");
  const [selectedSucursal, setSelectedSucursal] = useState("todas");

  const filteredUsers = () => {
    return users.filter((user) => {
      const matchesSearch = `${user.nombre} ${user.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedTab === "todos"
          ? true
          : selectedTab === "activos"
          ? user.estado === "activo"
          : user.estado === "inactivo";

      const matchesSucursal =
        selectedSucursal === "todas"
          ? true
          : user.sucursal === selectedSucursal;

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
    users: paginatedUsers,
    totalUsers: filteredUsers().length,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab: handleTabChange,
    selectedSucursal,
    setSelectedSucursal: handleSucursalChange,
  };
}
