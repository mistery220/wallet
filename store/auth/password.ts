import { zustandAsyncStorage } from "@/utils/store/save-data/async";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const usePassStore = create<{
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  hasPassword: boolean;
  setHasPassword: (val: boolean) => void;
}>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (val: boolean) => set({ isAuthenticated: val }),
      hasPassword: false,
      setHasPassword: (val: boolean) => set({ hasPassword: val }),
    }),
    {
      name: "pass-store",
      storage: createJSONStorage(() => zustandAsyncStorage),
      partialize: (state) => ({ hasPassword: state.hasPassword }),
    }
  )
);
