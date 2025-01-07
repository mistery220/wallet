import { saveSecureData } from "../storage/save";

/**
 * Save the user's salt securely
 * @param salt - The salt to store
 */
export const saveSalt = async (salt: string): Promise<void> => {
  await saveSecureData("userSalt", salt);
};
