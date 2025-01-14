import { FormStore } from "@/types/store/form";
import { TokenMap } from "@/types/token";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      to: {},
      from: {},
      setFromTokens: (tokens: TokenMap) => set({ from: tokens }),
      setToTokens: (tokens: TokenMap) => set({ to: tokens }),
    }),
    {
      name: "form-data-storage",
    }
  )
);
