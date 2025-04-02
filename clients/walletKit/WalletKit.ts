// WalletKitClient.ts

import { onSessionProposal } from "@/utils/wallet-kit/session";
import { IWalletKit, WalletKit, WalletKitTypes } from "@reown/walletkit";
import { Core } from "@walletconnect/core";
import "@walletconnect/react-native-compat";
import { ICore } from "@walletconnect/types";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { Linking } from "react-native";

export default class WalletKitClient {
  private static instance: WalletKitClient;
  private static core: ICore;

  public static walletKit: IWalletKit;

  private constructor() {}

  public static async init(): Promise<WalletKitClient> {
    if (!WalletKitClient.instance) {
      WalletKitClient.instance = new WalletKitClient();
      WalletKitClient.core = new Core({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID!,
      });
      await WalletKitClient.instance.initialize();
    }
    return WalletKitClient.instance;
  }

  private async initialize() {
    try {
      WalletKitClient.walletKit = await WalletKit.init({
        core: WalletKitClient.core,
        metadata: {
          name: "My Expo Wallet",
          description: "Wallet built with Expo and WalletConnect",
          url: "https://mywallet.app",
          icons: ["https://mywallet.app/icon.png"],
          redirect: {
            native: "wallet://",
          },
        },
      });
    } catch (e) {
      console.log("error in init walletkit", e);
    }
  }

  public static async onSessionProposal(
    proposal: WalletKitTypes.SessionProposal
  ) {
    await onSessionProposal({ proposal, walletKit: WalletKitClient.walletKit });
  }

  public static getWalletKit(): IWalletKit {
    return this.walletKit;
  }
}
