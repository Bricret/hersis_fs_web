import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/core/aplication/user.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { UserApiRepository } from "@/infraestructure/repositories/user.api";
import type { User } from "@/core/domain/entity/user.entity";
import { useSearchParams } from "next/navigation";
import { UserSchema } from "@/infraestructure/schema/users.schema";

const userRepository = new UserApiRepository(APIFetcher);
const userService = new UserService(userRepository);

export const useUsersFetch = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: async () => await userService.getAllUsers(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const createUserMutation = useMutation({
    mutationFn: async (user: UserSchema): Promise<User> =>
      await userService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log("Error al crear el usuario (fetch)", error);
      throw new Error("Error al crear el usuario:", error);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (user: User) => await userService.updateUser(user),
    retry: 3, // Número de intentos
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
    onError: (error, variables, context) => {
      // Mostrar notificación de error
      throw new Error("Error al actualizar usuario. Reintentando...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (user: User) => await userService.deleteUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users,
    isLoading,
    error,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
  };
};
