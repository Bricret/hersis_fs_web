import type { IUserAuthData } from "@/core/domain/entity/userAuth.entity";
import { create } from "zustand";

interface AuthState {
  user: IUserAuthData | null;
  isAuthenticated: boolean;
  setUser: (user: IUserAuthData | null) => void;
  setAuthenticated: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
