import { FormStore } from "@/types/store/form";
import { TokenMap } from "@/types/token";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      to: {},
      from: {},
      setFromTokens: (tokens: TokenMap) =>
        set((state) => ({
          from: {
            ...state.from,
            ...tokens,
          },
        })),
      setToTokens: (tokens: TokenMap) =>
        set((state) => ({
          to: {
            ...state.to,
            ...tokens,
          },
        })),
    }),
    {
      name: "form-data-storage",
    }
  )
);
