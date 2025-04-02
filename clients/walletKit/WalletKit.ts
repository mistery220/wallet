// WalletKitClient.ts

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

  public static async sessionProposal() {
    WalletKitClient.walletKit.on("session_proposal", async (proposal) => {
      const { id, params } = proposal;
      try {
        const approvedNamespaces = buildApprovedNamespaces({
          proposal: params,
          supportedNamespaces: {
            eip155: {
              chains: ["eip155:1"],
              methods: ["eth_sendTransaction", "personal_sign"],
              events: ["accountsChanged", "chainChanged"],
              accounts: ["eip155:1:0x62414d44AaE1aA532630eDa14Df7F449C475759C"],
            },
          },
        });

        const session = await WalletKitClient.walletKit.approveSession({
          id,
          namespaces: approvedNamespaces,
        });

        const redirect = session.peer.metadata.redirect?.native;
        if (redirect) Linking.openURL(redirect);
      } catch (error) {
        console.log({ error });
        await WalletKitClient.walletKit.rejectSession({
          id,
          reason: getSdkError("USER_REJECTED"),
        });
      }
    });
  }

  public static getWalletKit(): IWalletKit {
    return this.walletKit;
  }
}
