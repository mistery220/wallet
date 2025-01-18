import { InputSrc } from "@/enums/form/input";
import { FormStore } from "@/types/store/form";
import { FormToken } from "@/types/token/form";
import { create } from "zustand";

export const useFormStore = create<FormStore>()((set) => ({
  from: { amount: "" },
  to: { amount: "" },
  inputSrc: InputSrc.From,
  setFromToken: (token: FormToken) => set({ from: token }),
  setToToken: (token: FormToken) => set({ to: token }),
  setInputSrc: (val: InputSrc) => set({ inputSrc: val }),
}));
