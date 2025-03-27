export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
