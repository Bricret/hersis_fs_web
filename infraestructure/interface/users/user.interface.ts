// types/user.ts
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  sucursal: string;
  estado: "activo" | "inactivo";
  ultimoAcceso: string;
  avatar?: string;
}

// constants/users.ts
export const ITEMS_PER_PAGE = 5;
export const USER_TABS = {
  TODOS: "todos",
  ACTIVOS: "activos",
  INACTIVOS: "inactivos",
} as const;
