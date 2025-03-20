"use client";

import { Header } from "@/presentation/components/common/Header";
import { useUsers } from "@/presentation/hooks/user/useUsers";
import { useUserActions } from "@/presentation/hooks/user/useUserActions";
import { UserFilters } from "@/presentation/components/users/UserFilters";
import { UserTable } from "@/presentation/components/users/UserTable";
import { UserPagination } from "@/presentation/components/users/UserPagination";
import { ITEMS_PER_PAGE } from "@/infraestructure/interface/users/user.interface";

export default function UsersPage() {
  const {
    users,
    totalUsers,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    selectedSucursal,
    setSelectedSucursal,
  } = useUsers();

  const { handleToggleStatus, handleDeleteUser, handleResetPassword } =
    useUserActions();

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header title="Usuarios" subTitle="Gestione los usuarios del sistema" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
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
