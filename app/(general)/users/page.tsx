"use client";

import { Header } from "@/presentation/components/common/Header";
import { useUsers } from "@/presentation/hooks/user/useUsers";
import { useUserActions } from "@/presentation/hooks/user/useUserActions";
import { UserFilters } from "@/presentation/components/users/UserFilters";
import { UserTable } from "@/presentation/components/users/UserTable";
import { UserPagination } from "@/presentation/components/users/UserPagination";
import { ITEMS_PER_PAGE } from "@/infraestructure/interface/users/user.interface";
import { useSearchParams } from "@/presentation/hooks/common/useSearchParams";
import { useEffect } from "react";
import { useSearchParams as useNextSearchParams } from "next/navigation";

export default function UsersPage() {
  const {
    users,
    totalUsers,
    currentPage,
    setCurrentPage,
    selectedTab,
    setSelectedTab,
    selectedSucursal,
    setSelectedSucursal,
  } = useUsers();

  const { handleToggleStatus, handleDeleteUser, handleResetPassword } =
    useUserActions();

  const { handleParams } = useSearchParams({
    paramsName: "search",
    waitInterval: 350,
  });

  const searchParams = useNextSearchParams();

  // Aquí deberías hacer la petición a la base de datos
  // usando los parámetros de la URL
  useEffect(() => {
    // TODO: Implementar la petición a la base de datos
    // const fetchUsers = async () => {
    //   const response = await fetchUsersFromDB({
    //     search: searchParams.get('search'),
    //     page: searchParams.get('page'),
    //     tab: searchParams.get('tab'),
    //     sucursal: searchParams.get('sucursal')
    //   });
    //   // Actualizar el estado con la respuesta
    // };
    // fetchUsers();
  }, [searchParams]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header title="Usuarios" subTitle="Gestione los usuarios del sistema" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <UserFilters
            onSearchChange={handleParams}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            selectedSucursal={selectedSucursal}
            onSucursalChange={setSelectedSucursal}
          />

          <UserTable
            users={users()}
            onDeleteUser={handleDeleteUser}
            onResetPassword={handleResetPassword}
            onToggleStatus={handleToggleStatus}
          />

          <UserPagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalUsers / ITEMS_PER_PAGE)}
            totalItems={totalUsers}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
}
