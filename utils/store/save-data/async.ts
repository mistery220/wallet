import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

export const zustandAsyncStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const data = (await AsyncStorage.getItem(name)) || null;
    return data;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (e) {
      console.log({ e });
    }
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await AsyncStorage.removeItem(name);
  },
};
