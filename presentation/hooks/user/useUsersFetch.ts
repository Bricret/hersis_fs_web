import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/core/aplication/user.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { UserApiRepository } from "@/infraestructure/repositories/user.api";
import type { User } from "@/core/domain/entity/user.entity";
import { toast } from "sonner";

const userRepository = new UserApiRepository(APIFetcher);
const userService = new UserService(userRepository);

// Hook para obtener los usuarios y realizar mutaciones
export const useUsersFetch = () => {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await userService.getAllUsers(),
  });

  const createUserMutation = useMutation({
    mutationFn: async (user: User) => await userService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (user: User) => await userService.updateUser(user),
    retry: 3, // Número de intentos
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
    onError: (error, variables, context) => {
      // Mostrar notificación de error
      toast.error("Error al actualizar usuario. Reintentando...");
    },
    onSuccess: () => {
      toast.success("Usuario actualizado correctamente");
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
