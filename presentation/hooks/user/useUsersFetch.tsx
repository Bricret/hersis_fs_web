import { useState, useEffect } from "react";
import {
  User,
  PaginatedResponse,
} from "../../../core/domain/entity/user.entity";
import { getUsers } from "../../services/server/users.server";

export function useUsersFetch() {
  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Error al cargar usuarios")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, isLoading, error };
}
