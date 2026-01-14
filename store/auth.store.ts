import { getCurrentUser } from "@/lib/appwrite";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  setIsAuthenticated: (value: boolean) =>
    set({
      isAuthenticated: value,
    }),
  setUser: (user: User | null) =>
    set({
      user: user,
    }),
  setIsLoading: (loading: boolean) =>
    set({
      isLoading: loading,
    }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });

    try {
      const user = await getCurrentUser();

      if (user) set({ isAuthenticated: true, user: user as unknown as User });
      else set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.log("fetchAuthenticatedUser error:", error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
