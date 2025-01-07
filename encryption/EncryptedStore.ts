import { decryptData } from "./aes/decrypt";
import { encryptData } from "./aes/encrypt";
import { deriveKey } from "./key/deriveKey";
import { generateSalt } from "./salt/generate";
import { getSalt } from "./salt/retrieve";
import { saveSalt } from "./salt/save";
import { getSecureData } from "./storage/retrieve";
import { saveSecureData } from "./storage/save";

export default class EncryptedStorage {
  async savePrivateKey(privateKey: string, password: string): Promise<void> {
    // Generate or retrieve the user's salt
    let salt = await getSalt();
    if (!salt) {
      salt = await generateSalt();
      await saveSalt(salt);
    }
    console.log("salt: ", { salt });
    const key = await deriveKey(password, salt);

    // Encrypt the private key
    const encryptedKey = encryptData(privateKey, key);

    // Save the encrypted private key and IV securely
    await saveSecureData("privateKey", encryptedKey);
  }

  async retrievePrivateKey(password: string): Promise<string | null> {
    // Retrieve the user's salt
    const salt = await getSalt();
    console.log("salt: ", { salt });
    if (!salt) {
      throw new Error("Salt not found. Cannot decrypt private key.");
    }

    const key = await deriveKey(password, salt);

    // Retrieve the encrypted private key
    const encryptedKey = await getSecureData("privateKey");
    if (!encryptedKey) {
      throw new Error("Encrypted private key not found.");
    }
    // "Decrypt" the private key (mock decryption for Expo)
    const decryptedKey = decryptData(encryptedKey, key);
    console.log({ decryptedKey });
    return decryptedKey; // In this case, the private key can't be reversed without proper AES.
  }
}
