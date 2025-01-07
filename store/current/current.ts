import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CurrentStore } from "../types/current";

const useCurrentStore = create<CurrentStore>()(
  persist(
    (set) => ({
      wallet: { accounts: [], active: { address: "", name: "" } },
      chainId: 1,
    }),
    { name: "current-state-storage" }
  )
);
