import EncryptedStore from "@/encryption/EncryptedStore";
import { Networks } from "@/enums/network/ecosystem";
import { useCurrentStore } from "@/store/current";
import { Account } from "@/types/wallet/account";
import { Keypair } from "@solana/web3.js";
import axios from "axios";
import * as bip39 from "bip39";
import bs58 from "bs58";
import { HDKey } from "micro-ed25519-hdkey";
import { toHex } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { usePushNotifications } from "../notification/usePushNotification";

export default function useKeys() {
  const { activeId, addAndSetNewAccount, setUserId } = useCurrentStore();
  const { expoPushToken } = usePushNotifications();

  async function getAccountsAndStoreKey(
    mnemonic: string,
    index: number,
    walletId: string
  ) {
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
        await EncryptedStore.encryptAndStore(account.address, privKeyBytes);
        addresses[network] = account.address;
      } else if (network === Networks.SVM) {
        try {
          const seed = bip39.mnemonicToSeedSync(mnemonic, "");
          const hd = HDKey.fromMasterSeed(seed.toString("hex"));

          const path = `m/44'/501'/${index}'/0'`;
          const keypair = Keypair.fromSeed(hd.derive(path).privateKey);
          const privKeyBase58 = bs58.encode(keypair.secretKey);
          const publicKey = keypair.publicKey.toBase58();
          await EncryptedStore.encryptAndStore(publicKey, privKeyBase58);
          addresses[network] = publicKey;
        } catch (e) {
          console.log({ e });
          throw new Error();
        }
      }
    }
    const acc: Account = {
      address: addresses,
      name: "Account 1",
      id: accountId,
      walletId,
      isPhrase: true,
      networks: Object.values(Networks),
      isSelectedToConnect: Boolean(activeId) ? false : true,
    };
    addAndSetNewAccount(acc);
    return acc;
  }

  async function saveWalletAndProtectKeys(mnemonic: string, index: number) {
    const walletId = new Date().getTime().toString();
    const acc = await getAccountsAndStoreKey(mnemonic, index, walletId);

    const newWallet = { accounts: [acc], id: walletId, isPhrase: true };

    // @TODO add password from user
    await EncryptedStore.encryptAndStore(newWallet.id, mnemonic);
    if (expoPushToken) {
      setUserId(expoPushToken.data);
      try {
        const res = await axios.post(
          `${process.env.EXPO_PUBLIC_SERVER}/user/add`,
          {
            userId: expoPushToken.data,
            addresses: acc.address,
            expoToken: expoPushToken.data,
          }
        );
      } catch (e) {
        console.log({ e });
      }
    }
  }
  return { saveWalletAndProtectKeys };
}
