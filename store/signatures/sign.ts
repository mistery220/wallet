import { SignatureActionStore } from "@/types/store/signAction";
import { create } from "zustand";

export const useSignatureActionStore = create<SignatureActionStore>()(
  (set) => ({
    signData: [],
    addSignData: (newSignData: any) =>
      set((state) => {
        const signData = state.signData;
        signData.push(newSignData);
        return {
          signData,
        };
      }),
    removeSignDataFromFront: () =>
      set((state) => {
        const signData = state.signData;
        if (signData.length > 0) {
          signData.shift();
        }
        return {
          signData,
        };
      }),
  })
);
