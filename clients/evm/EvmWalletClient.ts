import { viemChainsById } from "@/utils/client/evm/chains";
import { stringToHexString } from "@/utils/string/hexstring";
import { createWalletClient, http, SignableMessage } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export default class EvmWalletClient {
  private static instance: EvmWalletClient;

  constructor() {}

  public async getSignature(privKey: string, chainId: number, data: unknown) {
    // @TODO update with function which converts data to signable message.
    const signableMessage = data as SignableMessage;
    const hexPrivKey = stringToHexString(privKey);
    const account = privateKeyToAccount(hexPrivKey);
    const walletClient = createWalletClient({
      account,
      chain: viemChainsById[chainId],
      transport: http(),
    });
    const signature = await walletClient.signMessage({
      message: signableMessage,
    });
    return signature;
  }
}
