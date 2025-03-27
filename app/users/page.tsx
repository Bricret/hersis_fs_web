import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getUsers } from "@/presentation/services/server/users.server";
import { UsersList } from "@/presentation/components/UsersList";

export default async function UsersPage() {
  const queryClient = new QueryClient();

  // Prefetch de datos en el servidor
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersList />
    </HydrationBoundary>
  );
}
