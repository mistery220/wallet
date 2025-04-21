import { ChainIds } from "@/enums/network/chains";
import { Networks } from "@/enums/network/ecosystem";
import { useTabsStore } from "@/store/browser/tabs";
import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { HexString } from "@/types/address/evm";
import { Account } from "@/types/wallet/account";
import { useRef } from "react";
import type { WebView as WebViewType } from "react-native-webview";
import { createPublicClient, fallback, http } from "viem";

export default function useInjectedScriptHandler() {
  const webViewRef = useRef<WebViewType>(null);
  const { activeId, accounts } = useCurrentStore();
  const { currTab, activeChainId } = useTabsStore();
  const { chains } = useChainsStore();

  const getPermissionsResponse = (acc: Account, origin: string) => [
    {
      id: `eth-accounts-${Date.now()}`,
      date: Date.now(),
      invoker: origin,
      parentCapability: "eth_accounts",
      caveats: [
        {
          type: "restrictReturnedAccounts",
          value: [acc.address[Networks.EVM]],
          name: acc.name,
        },
      ],
    },
    // {
    //   id: `chains-${Date.now()}`,
    //   date: Date.now(),
    //   invoker: origin,
    //   parentCapability: "endowment:permitted-chains",
    //   caveats: [
    //     {
    //       type: "restrictNetworkSwitching",
    //       value: ["0xa4b1"],
    //     },
    //   ],
    // },
  ];

  const sendResultToWeb = (result: any, requestId: string) => {
    if (!webViewRef.current) return;

    try {
      const responseScript = `
if (window.wallet && window.wallet.ethereum && window.wallet.ethereum._resolveResponse) {
  window.wallet.ethereum._resolveResponse(${JSON.stringify(
    requestId
  )}, ${JSON.stringify(result)});
}
  true;
`;
      webViewRef.current.injectJavaScript(responseScript);
    } catch (e) {
      console.error("Inject script failed:", e);
    }
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      const { method, requestId, type, params } = message;
      console.log({ method, params });
      if (type === "ETHEREUM_REQUEST") {
        switch (method) {
          case "eth_requestAccounts":
            sendResultToWeb(
              [accounts[activeId].address[Networks.EVM]],
              requestId
            );
            break;
          case "eth_chainId":
            sendResultToWeb(
              "0x" + ChainIds.ArbitrumOne.toString(16),
              requestId
            );
            break;
          case "eth_accounts":
            sendResultToWeb(
              [accounts[activeId].address[Networks.EVM]],
              requestId
            );
            break;

          case "eth_sendTransaction":
            break;
          case "eth_blockNumber": {
            const urls = chains[activeChainId].rpcUrls;
            const publicClient = createPublicClient({
              transport: fallback(urls.map((url) => http(url))),
            });
            const blockNumber = await publicClient.getBlockNumber();
            console.log("0x" + blockNumber.toString(16));
            sendResultToWeb("0x" + blockNumber.toString(16), requestId);
            break;
          }
          case "eth_estimateGas": {
            const urls = chains[activeChainId].rpcUrls;
            const publicClient = createPublicClient({
              transport: fallback(urls.map((url) => http(url))),
            });
            const gasEstimation = await publicClient.estimateGas({
              account: accounts[activeChainId].address[
                Networks.EVM
              ] as HexString,
            });
            console.log("0x" + gasEstimation.toString(16));
            sendResultToWeb("0x" + gasEstimation.toString(16), requestId);
            break;
          }
          case "wallet_requestPermissions":
            const permissions = getPermissionsResponse(
              accounts[activeId],
              currTab?.url || ""
            );
            sendResultToWeb(permissions, requestId);
            break;

          case "wallet_revokePermissions":
            sendResultToWeb(null, requestId);
            break;
          default:
            console.warn("Unhandled method", message.method);
        }
      }
    } catch (e) {
      console.error("Invalid message from WebView", e);
    }
  };
  return {
    handleWebViewMessage,
    webViewRef,
  };
}
