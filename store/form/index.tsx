import { FormStore } from "@/types/store/form";
import { Token } from "@/types/token";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      from: undefined,
      to: undefined,
      setFromToken: (token: Token) => set({ from: token }),
      setToToken: (token: Token) => set({ to: token }),
    }),
    {
      name: "form-data-storage",
    }
  )
);
