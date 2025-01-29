import { InputSrc } from "@/enums/form/input";
import { FormStore } from "@/types/store/form";
import { FormToken } from "@/types/token/form";
import { create } from "zustand";

export const useFormStore = create<FormStore>()((set) => ({
  from: { amount: "" },
  to: { amount: "" },
  inputSrc: InputSrc.From,
  recipient: "",
  setFromToken: (token: FormToken) => set({ from: token }),
  setToToken: (token: FormToken) => set({ to: token }),
  interchangeFormTokens: () =>
    set((state) => ({
      to: { ...state.from, amount: "" },
      from: { ...state.to, amount: state.from.amount },
    })),
  setRecipient: (recipient: string) => set({ recipient }),
  setInputSrc: (inputSrc: InputSrc) => set({ inputSrc }),
}));
