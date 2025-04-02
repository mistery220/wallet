// import the builder util
import { IWalletKit, WalletKitTypes } from "@reown/walletkit";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { Linking } from "react-native";
export async function onSessionProposal({
  proposal: { id, params },
  walletKit,
}: {
  proposal: WalletKitTypes.SessionProposal;
  walletKit: IWalletKit;
}) {
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

    const session = await walletKit.approveSession({
      id,
      namespaces: approvedNamespaces,
    });

    console.log({ session });

    const redirect = session.peer.metadata.redirect?.native;
    if (redirect) Linking.openURL(redirect);
  } catch (error) {
    console.log({ error });
    await walletKit.rejectSession({
      id,
      reason: getSdkError("USER_REJECTED"),
    });
  }
}
