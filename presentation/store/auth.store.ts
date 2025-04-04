import type { IUserAuthData } from "@/core/domain/entity/userAuth.entity";
import { create } from "zustand";

interface AuthState {
  user: IUserAuthData | null;
  setUser: (user: IUserAuthData | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
