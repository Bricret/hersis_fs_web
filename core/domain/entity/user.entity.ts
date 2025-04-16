import { Branch } from "./branch.entity";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: Date | null;
  branch: Branch | string;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export const ITEMS_PER_PAGE = 5;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
