import { retrieveSecureData } from "../storage/retrieve";

export const getSalt = async (storeName: string): Promise<string | null> => {
  return await retrieveSecureData(storeName);
};
