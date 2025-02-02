import { deleteItemAsync } from "expo-secure-store";

/**
 * Permanently delete secure data from storage
 * @param key - The storage key to be deleted
 * @returns Promise<void>
 * @throws Error if deletion fails
 */
export const deleteSecureData = async (key: string): Promise<void> => {
  try {
    await deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting ${key}:`, error);
    throw error;
  }
};

/**
 * Clear all secure storage data
 * @param keys - Array of storage keys to be deleted
 * @returns Promise<void>
 * @throws Error if bulk deletion fails
 */
export const clearAllSecureData = async (keys: string[]): Promise<void> => {
  try {
    await Promise.all(keys.map((key) => deleteItemAsync(key)));
  } catch (error) {
    console.error("Error clearing secure storage:", error);
    throw error;
  }
};
