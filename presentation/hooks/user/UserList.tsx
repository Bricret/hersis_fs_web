"use client";

import { UserFilters } from "@/presentation/components/users/UserFilters";
import { UserPagination } from "@/presentation/components/users/UserPagination";
import { UserTable } from "@/presentation/components/users/UserTable";
import { useUserActions } from "./useUserActions";
import { useUsers } from "./useUsers";
import { useSearchParams } from "@/presentation/hooks/common/useSearchParams";
import { useSearchParams as useNextSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE, User } from "@/core/domain/entity/user.entity";

export const UserList = ({ Users }: { Users: User[] }) => {
  const {
    users,
    totalUsers,
    currentPage,
    setCurrentPage,
    selectedTab,
    setSelectedTab,
    selectedSucursal,
    setSelectedSucursal,
  } = useUsers({ users: Users });

  const { handleToggleStatus, handleDeleteUser, handleResetPassword } =
    useUserActions();

  const { handleParams } = useSearchParams({
    paramsName: "search",
    waitInterval: 350,
  });

  const searchParams = useNextSearchParams();

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
        totalPages={Math.ceil(totalUsers / ITEMS_PER_PAGE)}
        totalItems={totalUsers}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </main>
  );
};
