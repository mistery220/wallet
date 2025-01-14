import { joinStrings } from "@/utils/string/join";
import { decryptData } from "./aes/decrypt";
import { encryptData } from "./aes/encrypt";
import { deriveKey } from "./key/deriveKey";
import { generateSalt } from "./salt/generate";
import { getSalt } from "./salt/retrieve";
import { saveSalt } from "./salt/save";
import { getSecureData } from "./storage/retrieve";
import { saveSecureData } from "./storage/save";
class EncryptedStorage {
  private static instance: EncryptedStorage;

  private constructor() {
    // private constructor
  }

  public static getInstance() {
    if (!EncryptedStorage.instance) {
      EncryptedStorage.instance = new EncryptedStorage();
    }
    return EncryptedStorage.instance;
  }

  async encryptAndStore(
    storeName: string,
    value: string,
    password: string
  ): Promise<void> {
    const saltKey = joinStrings(storeName, "salt");
    let salt = await getSalt(saltKey);
    if (!salt) {
      salt = await generateSalt();
      await saveSalt(saltKey, salt);
    }
    const key = await deriveKey(password, salt);
    const encryptedKey = encryptData(value, key);
    await saveSecureData(storeName, encryptedKey);
  }

  async decryptAndRetrieve(
    storeName: string,
    password: string
  ): Promise<string | null> {
    const saltKey = joinStrings(storeName, "salt");
    const salt = await getSalt(saltKey);
    if (!salt) {
      throw new Error("Salt not found. Cannot decrypt private key.");
    }
    const key = await deriveKey(password, salt);

    const encryptedKey = await getSecureData(storeName);
    if (!encryptedKey) {
      throw new Error("Encrypted private key not found.");
    }
    const decryptedKey = decryptData(encryptedKey, key);
    return decryptedKey;
  }
}

export default EncryptedStorage.getInstance();
