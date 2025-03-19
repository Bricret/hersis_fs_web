// hooks/useUsers.ts

import { usuariosData } from "@/core/data/users/users";
import {
  ITEMS_PER_PAGE,
  Usuario,
} from "@/infraestructure/interface/users/user.interface";
import { useState } from "react";

// Hook para la lógica de usuarios
export function useUsers() {
  const [users, setUsers] = useState<Usuario[]>(usuariosData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");

  const filteredUsers = () => {
    return users.filter((user) => {
      const fullName = `${user.nombre} ${user.apellido}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const paginatedUsers = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers().slice(startIndex, endIndex);
  };

  return {
    users: paginatedUsers,
    totalUsers: filteredUsers.length,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
  };
}
