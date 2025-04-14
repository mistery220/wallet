import EncryptedStore from "@/encryption/EncryptedStore";
import { Networks } from "@/enums/network/ecosystem";
import { HexString } from "@/types/address/evm";
import { viemChainsById } from "@/utils/client/evm/chains";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export default function useWalletClient() {
  async function getWalletClientResponse({
    chainId,
    ecosystem,
    params,
  }: {
    chainId: number;
    ecosystem: Networks;
    params: any;
  }) {
    const address = params.request.params[1];
    const method = params.request.method;
    const rawMessage = params.request.params[0];
    try {
      switch (ecosystem) {
        case Networks.EVM: {
          const decodedKey = await EncryptedStore.decryptAndRetrieve(address);
          if (decodedKey) {
            const accountFromPrivKey = privateKeyToAccount(
              decodedKey as HexString
            );
            const walletClient = createWalletClient({
              transport: http(),
              chain: viemChainsById[chainId],
              account: accountFromPrivKey,
            });
            switch (method) {
              case "personal_sign": {
                const signature = await walletClient.signMessage({
                  message: { raw: rawMessage as HexString },
                });
                return signature;
              }
            }
          }
        }
      }
    } catch (e) {
      console.log({ e });
    }
  }
  return { getWalletClientResponse };
}
