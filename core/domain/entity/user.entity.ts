export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: Date;
  branch: string;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export const ITEMS_PER_PAGE = 5;
