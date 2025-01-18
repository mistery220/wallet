import { FormStore } from "@/types/store/form";
import { FormToken } from "@/types/token/form";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      from: { amount: "" },
      to: { amount: "" },
      setFromToken: (token: FormToken) => set({ from: token }),
      setToToken: (token: FormToken) => set({ to: token }),
    }),
    {
      name: "form-data-storage",
    }
  )
);
