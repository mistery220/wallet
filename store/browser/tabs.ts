import { create } from "zustand";
import { TabData } from "@/types/browser/tabs";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandAsyncStorage } from "@/utils/store/save-data/async";
import { TabsStore } from "@/types/store/browser/tabs";

// Store for managing browser tabs with persistence
export const useTabsStore = create<TabsStore>()(
  persist(
    (set) => ({
      tabsData: {
        ["1"]: {
          id: "1",
          title: "React Native",
          url: "https://reactnative.dev/",
        },
        ["2"]: { id: "2", title: "Odos", url: "https://odos.xyz/" },
      },
      currTab: undefined,
      addNewTabAsCurr: () => {
        const id = new Date().getTime().toString();
        set((state) => {
          const newTab: TabData = {
            id,
            title: "",
            url: "",
          };
          state.currTab = newTab;
          state.tabsData[id] = newTab;
          return state;
        });
        return id;
      },

      // Set the current tab
      setCurrTab: (currTab: TabData) =>
        set(() => ({
          currTab,
        })),

      // Update an existing tab
      updateTab: (tab: TabData) =>
        set((state) => {
          const updatedTabsData = state.tabsData;
          updatedTabsData[tab.id] = tab;
          return { tabsData: updatedTabsData };
        }),

      // Delete a specific tab by its ID
      deleteTab: (tabId: string) =>
        set((state) => {
          const updatedTabsData = state.tabsData;
          delete updatedTabsData[tabId];

          return { tabsData: updatedTabsData };
        }),
    }),
    {
      name: "browser-tab-state-storage", // Key for persistent storage
      storage: createJSONStorage(() => zustandAsyncStorage), // Use async storage
      partialize: (state) => ({ tabsData: state.tabsData }),
    }
  )
);
