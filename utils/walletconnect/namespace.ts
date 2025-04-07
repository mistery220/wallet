import { DEFAULT_EVM_NAMESPACE } from "@/constants/walletconnect/evm";
import { DEFAULT_SVM_NAMESPACE } from "@/constants/walletconnect/svm";
import { ChainIds } from "@/enums/network/chains";
import { Networks } from "@/enums/network/ecosystem";
import { ProposalTypes } from "@walletconnect/types";

export function modifyToNamespaceChain(id: number, network: Networks): string {
  switch (network) {
    case Networks.EVM: {
      return `eip155:${id}`;
    }
    case Networks.SVM: {
      if (id === ChainIds.Solana) {
        return `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`; // Solana Mainnet
      } else if (id === ChainIds.Solana) {
        // @TODO add Solana Devnet
        return `solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ`;
      }
    }
  }
  return "";
}

// @dev this function is specifically namespaces of wallet connect connection.
export function getNamespaceAccounts({
  address,
  namespaceChainIds,
}: {
  address: string;
  namespaceChainIds: string[];
}): string[] {
  return namespaceChainIds.map((id) => {
    return `${id}:${address}`;
  });
}

export function buildSupportedNamespaces({
  chainsData,
  ecosystemWiseAddresses,
  params,
}: {
  params: ProposalTypes.Struct;
  ecosystemWiseAddresses: Record<string, string[]>;
  chainsData: Record<string, string[]>;
}) {
  const { optionalNamespaces, requiredNamespaces } = params;
  console.log({ params });
  const supportedNamespaces: Record<
    string,
    {
      chains: string[];
      methods: string[];
      events: string[];
      accounts: string[];
    }
  > = {};

  if (optionalNamespaces.solana || requiredNamespaces.solana) {
    supportedNamespaces["solana"] = {
      chains: chainsData[Networks.SVM],
      methods: DEFAULT_SVM_NAMESPACE.methods,
      events: DEFAULT_SVM_NAMESPACE.events,
      accounts: ecosystemWiseAddresses[Networks.SVM],
    };
  }

  if (optionalNamespaces.eip155 || requiredNamespaces.eip155) {
    supportedNamespaces["eip155"] = {
      chains: chainsData[Networks.EVM],
      methods: DEFAULT_EVM_NAMESPACE.methods,
      events: DEFAULT_EVM_NAMESPACE.events,
      accounts: ecosystemWiseAddresses[Networks.EVM],
    };
  }
  return supportedNamespaces;
}
