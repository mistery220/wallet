import { Networks } from "@/enums/network/ecosystem";
import { useTabsStore } from "@/store/browser/tabs";
import { useCurrentStore } from "@/store/current";
import { Account } from "@/types/wallet/account";
import { useRef } from "react";
import type { WebView as WebViewType } from "react-native-webview";

export default function useInjectedScriptHandler() {
  const webViewRef = useRef<WebViewType>(null);
  const { activeId, accounts } = useCurrentStore();
  const { currTab } = useTabsStore();

  const template = `[
  {
    "caveats": [
      {
        "type": "snapIds",
        "value": {
          "npm:@metamask/message-signing-snap": {}
        }
      }
    ],
    "date": 1738098450852,
    "id": "627tlTTxF9Xk7tJ17h99G",
    "invoker": "https://docs.metamask.io",
    "parentCapability": "wallet_snap"
  },
  {
    "id": "2Q8SlamF9tizOCduhHakc",
    "parentCapability": "eth_accounts",
    "invoker": "https://docs.metamask.io",
    "caveats": [
      {
        "type": "restrictReturnedAccounts",
        "value": [
          "0x62414d44aae1aa532630eda14df7f449c475759c"
        ]
      }
    ],
    "date": 1744973796206
  },
  {
    "id": "2Q8SlamF9tizOCduhHakc",
    "parentCapability": "endowment:permitted-chains",
    "invoker": "https://docs.metamask.io",
    "caveats": [
      {
        "type": "restrictNetworkSwitching",
        "value": [
          "0x1",
          "0x13fb",
          "0x144",
          "0x14a34",
          "0x1e",
          "0x1f",
          "0x2105",
          "0x2b74",
          "0x46f",
          "0x56b26",
          "0x56b29",
          "0x64",
          "0x66eee",
          "0x89",
          "0x90f7",
          "0x99c0a0f",
          "0xa",
          "0xa045c",
          "0xa4b1",
          "0xc576d",
          "0xe708"
        ]
      }
    ],
    "date": 1744973796206
  }
]`;

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
      const { method, requestId, type } = message;
      if (type === "ETHEREUM_REQUEST") {
        switch (method) {
          case "eth_requestAccounts":
            sendResultToWeb(
              [accounts[activeId].address[Networks.EVM]],
              requestId
            );
            break;
          case "eth_chainId":
            sendResultToWeb("0x1", requestId);
            break;
          case "eth_accounts":
            sendResultToWeb(
              [accounts[activeId].address[Networks.EVM]],
              requestId
            );
            break;

          case "eth_sendTransaction":
            // Add your custom signing + sending logic here
            break;

          case "wallet_requestPermissions":
            const permissions =
              template ||
              getPermissionsResponse(accounts[activeId], currTab?.url || "");
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
