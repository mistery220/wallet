import { TabData } from "@/types/browser/tabs";

export type TabsStore = {
  tabsData: Record<string, TabData>;
  currTab?: TabData;
  activeChainId: number;
  setCurrTab: (currTab: TabData) => void;
  removeCurrTab: () => void;
  addNewTabAsCurr: (url?: string) => string;
  updateTab: (tab: TabData) => void;
  deleteTab: (tabId: string) => void;
};
