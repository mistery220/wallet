import { saveSecureData } from "../storage/save";

/**
 * Save the user's salt securely
 * @param salt - The salt to store
 */
export const saveSalt = async (storeName: string, salt: string): Promise<void> => {
  await saveSecureData(storeName, salt);
};
