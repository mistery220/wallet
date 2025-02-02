import { getItemAsync } from "expo-secure-store";

/**
 * Retrieve encrypted data securely
 * @param key - The storage key
 * @returns The encrypted value, or null if not found
 */
export const retrieveSecureData = async (key: string): Promise<string | null> => {
  try {
    const value = await getItemAsync(key);
    return value ? value : null;
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    throw error;
  }
};
