import EncryptedStore from "@/encryption/EncryptedStore";
import { Networks } from "@/enums/network/ecosystem";
import { useCurrentStore } from "@/store/current";
import { useWalletStore } from "@/store/wallets";
import { Account } from "@/types/wallet/account";
import { joinStrings } from "@/utils/string/join";
import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import bs58 from "bs58";
import ed25519HdKey from "ed25519-hd-key";
import { toHex } from "viem";
import { mnemonicToAccount } from "viem/accounts";
export default function useKeys() {
  const { setActiveAccount, setWallet } = useCurrentStore();
  const { addNewWallet } = useWalletStore();

  async function getAccountsAndStoreKey(mnemonic: string, index: number) {
    const accountId = new Date().getTime().toString();
    const addresses: Record<Networks, string> = {} as Record<Networks, string>;
    for (const network of Object.values(Networks)) {
      if (network === Networks.EVM) {
        const account = mnemonicToAccount(mnemonic, {
          accountIndex: 0,
          addressIndex: index,
        });
        const privKey = account.getHdKey()
          .privateKey as Uint8Array<ArrayBufferLike>;
        const privKeyBytes = toHex(privKey);
        await EncryptedStore.encryptAndStore(
          joinStrings(accountId, network),
          privKeyBytes,
          "1234"
        );
        addresses[network] = account.address;
      } else if (network === Networks.SVM) {
        const seed = mnemonicToSeedSync(mnemonic);
        const derivedPath = "m/44'/501'/" + index + "'/0'";
        const derivedSeed = ed25519HdKey.derivePath(
          derivedPath,
          seed.toString("hex")
        ).key;
        const keypair = Keypair.fromSeed(derivedSeed);
        await EncryptedStore.encryptAndStore(
          joinStrings(accountId, network),
          bs58.encode(keypair.secretKey),
          "1234"
        );
        addresses[network] = keypair.publicKey.toBase58();
      }
    }
    const acc = {
      address: addresses,
      name: "Account 1",
      id: accountId,
    };
    setActiveAccount(acc);
    return acc;
  }

  async function saveWalletAndProtectKeys(mnemonic: string) {
    const acc = await getAccountsAndStoreKey(mnemonic, 0);

    const accounts: Account[] = [acc];
    const walletId = new Date().getTime().toString();
    const newWallet = { accounts, id: walletId, isPhrase: true };
    // @TODO add password from user
    await EncryptedStore.encryptAndStore(newWallet.id, mnemonic, "1234");
    addNewWallet(newWallet);

    setWallet(newWallet);
  }
  return { getAccountsAndStoreKey, saveWalletAndProtectKeys };
}
