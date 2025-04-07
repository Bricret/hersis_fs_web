import { UserService } from "@/core/aplication/user.service";
import { APIFetcher } from "@/infraestructure/adapters/API.adapter";
import { UserApiRepository } from "@/infraestructure/repositories/user.api";
import type { User, PaginatedResponse } from "@/core/domain/entity/user.entity";

const userRepository = new UserApiRepository(APIFetcher);
const userService = new UserService(userRepository);

export async function getUsers(): Promise<PaginatedResponse<User>> {
  return await userService.getAllUsers();
}

export async function getUserById(id: string): Promise<User> {
  return await userRepository.getUserById(id);
}
