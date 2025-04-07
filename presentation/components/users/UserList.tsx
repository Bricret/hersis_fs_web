"use client";

import { UserFilters } from "@/presentation/components/users/UserFilters";
import { UserPagination } from "@/presentation/components/users/UserPagination";
import { UserTable } from "@/presentation/components/users/UserTable";
import { useUserActions } from "../../hooks/user/useUserActions";
import { useUsers } from "../../hooks/user/useUsers";
import { useSearchParams } from "@/presentation/hooks/common/useSearchParams";
import {
  ITEMS_PER_PAGE,
  User,
  PaginatedResponse,
} from "@/core/domain/entity/user.entity";
import { LoadingState } from "../common/LoadingState";
import { ErrorBoundary } from "../common/ErrorBoundary";

export const UserList = ({
  Users,
}: {
  Users: User[] | PaginatedResponse<User>;
}) => {
  const { handleParams } = useSearchParams({
    paramsName: "search",
    waitInterval: 350,
  });

  const { handleToggleStatus, handleDeleteUser, handleResetPassword } =
    useUserActions();

  const {
    users,
    totalUsers,
    currentPage,
    setCurrentPage,
    selectedTab,
    setSelectedTab,
    selectedSucursal,
    setSelectedSucursal,
    isLoading,
    error,
    meta,
  } = useUsers({ users: Users });

  if (isLoading) return <LoadingState />;

  if (error)
    return (
      <ErrorBoundary>
        <h1>Error al cargar los usuarios</h1>
      </ErrorBoundary>
    );

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <UserFilters
        onSearchChange={handleParams}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        selectedSucursal={selectedSucursal}
        onSucursalChange={setSelectedSucursal}
      />

      <UserTable
        users={users}
        onDeleteUser={handleDeleteUser}
        onResetPassword={handleResetPassword}
        onToggleStatus={handleToggleStatus}
      />

      <UserPagination
        currentPage={currentPage}
        totalPages={
          meta ? meta.totalPages : Math.ceil(totalUsers / ITEMS_PER_PAGE)
        }
        totalItems={meta ? meta.total : totalUsers}
        itemsPerPage={meta ? meta.limit : ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </main>
  );
};
