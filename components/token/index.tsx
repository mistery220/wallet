import { useChainsStore } from "@/store/chains";
import { Token } from "@/types/token";
import { formatAndTrimUnits, trimUnits } from "@/utils/general/formatter";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomImg from "../image/CustomImg";

const TokenItem = ({ token }: { token: Token & { dollarValue?: number } }) => {
  const chains = useChainsStore((state) => state.chains);
  const chain = chains[token.chainId];
  const balance = formatAndTrimUnits(token.bal, token.decimals);

  return (
    <TouchableOpacity
      key={`${token.chainId}-${token.address}`}
      style={styles.tokenItem}
      activeOpacity={0.7}
    >
      <CustomImg uri={token.logo} style={styles.tokenLogo} />
      <View style={styles.tokenInfo}>
        <View style={styles.tokenMainInfo}>
          <View style={styles.tokenTitleContainer}>
            <Text style={styles.tokenSymbol}>{token.symbol}</Text>
            <View style={styles.chainIndicator}>
              {chain?.logo && (
                <CustomImg uri={chain.logo} style={styles.chainIndicatorLogo} />
              )}
              <Text style={styles.chainIndicatorText}>
                {chain?.displayName}
              </Text>
            </View>
          </View>
          <Text style={styles.tokenBalance}>{balance}</Text>
        </View>
        <View style={styles.tokenSubInfo}>
          <Text style={styles.tokenName}>{token.name}</Text>
          <Text style={styles.tokenValue}>
            $
            {token.dollarValue
              ? trimUnits(token.dollarValue)
              : "--"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TokenItem;

const styles = StyleSheet.create({
  tokenItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  tokenLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenMainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  tokenTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  tokenSubInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tokenSymbol: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  chainIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  chainIndicatorLogo: {
    width: 30,
    height: 30,
    borderRadius: 7,
    marginRight: 4,
  },
  chainIndicatorText: {
    color: "#999",
    fontSize: 12,
  },
  tokenBalance: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  tokenName: {
    color: "#999",
    fontSize: 14,
  },
  tokenValue: {
    color: "#999",
    fontSize: 14,
  },
});
