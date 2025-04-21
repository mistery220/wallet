import { getUUID } from "@/utils/browser/wallet";
export const INJECTED_ETH_SCRIPT = `
(function () {
  if (window.wallet?.ethereum) return;

  const resolvers = {};

  const provider = {
    isMetaMask: true,
    isMyWallet: true,
    isConnected: () => true,
    _requestResolvers: resolvers,

    request: async function ({ method, params }) {
      const requestId = Math.random().toString(36).substring(2);

      return new Promise((resolve, reject) => {
        resolvers[requestId] = { resolve, reject };

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "ETHEREUM_REQUEST",
          method,
          params,
          requestId
        }));
      });
    },

    _resolveResponse: function (requestId, result) {
      if (resolvers[requestId]) {
        resolvers[requestId].resolve(result);
        delete resolvers[requestId];
      }
    },

    _rejectResponse: function (requestId, error) {
      if (resolvers[requestId]) {
        resolvers[requestId].reject(error);
        delete resolvers[requestId];
      }
    }
  };

  window.wallet = window.wallet || {};
  window.wallet.ethereum = provider;

  window.dispatchEvent(
    new CustomEvent("eip6963:announceProvider", {
      detail: {
        info: {
          uuid: '${getUUID()}',
          name: 'My Wallet',
          icon: 'https://yourdomain.com/icon.png',
          rdns: 'com.mywallet',
        },
        provider: provider,
      },
    })
  );
})();
true;
`;
