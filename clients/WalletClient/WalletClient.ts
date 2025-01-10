import { Networks } from "@/types/network/type";
import EvmWalletClient from "../evm/EvmWalletClient";

export default class WalletClient {
  private static instance: WalletClient;
  private evmWalletClient: EvmWalletClient;

  // @dev current account's priv key
  private currKey!: string;

  private constructor() {
    this.evmWalletClient = new EvmWalletClient();
  }

  public getInstance() {
    if (!WalletClient.instance) {
      WalletClient.instance = new WalletClient();
    }
    return WalletClient.instance;
  }

  private getPrivateKey() {
    return this.currKey;
  }

  public async setCurrKey(accIdentifier: string) {
    this.currKey = "";
  }

  public async getSignature(network: Networks, data: unknown, chainId: number) {
    switch (network) {
      case Networks.EVM: {
        return await this.evmWalletClient.getSignature(
          this.getPrivateKey(),
          chainId,
          data
        );
      }
    }
  }
}
