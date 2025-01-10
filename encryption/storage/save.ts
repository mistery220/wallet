import { setItemAsync } from "expo-secure-store";
import { encryptData } from "../aes/encrypt";
import { deriveKey } from "../key/deriveKey";
import { generateSalt } from "../salt/generate";
import { getSalt } from "../salt/retrieve";
import { saveSalt } from "../salt/save";

/**
 * Save encrypted data securely
 * @param key - The storage key
 * @param value - The encrypted value
 */
export const saveSecureData = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await setItemAsync(key, value);
    console.log(`${key} saved successfully`);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
};


