import { TabData } from "@/types/browser/tabs";

export type TabsStore = {
  tabsData: Record<string, TabData>;
  currTab?: TabData;
  setCurrTab: (currTab: TabData) => void;
  addNewTabAsCurr: () => string;
  updateTab: (tab: TabData) => void;
  deleteTab: (tabId: string) => void;
};
