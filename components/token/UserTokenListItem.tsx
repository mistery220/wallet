import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomImg from "../image/CustomImg";
import { useChainsStore } from "@/store/chains";
import { Token } from "@/types/token";
import { formatAndTrimUnits, trimUnits } from "@/utils/general/formatter";

const UserTokenListItem = ({ token }: { token: Token & { dollarValue?: number } }) => {
  const chains = useChainsStore((state) => state.chains);
  const chain = chains[token.chainId];
  const balance = formatAndTrimUnits(token.bal, token.decimals);
  const usdChange = parseFloat(token.usd_change_24h || "0");

  return (
    <TouchableOpacity
      key={`${token.chainId}-${token.address}`}
      style={styles.tokenItem}
      activeOpacity={0.7}
    >
      <View style={styles.innerContainer}>
        <View style={styles.leftSection}>
          <CustomImg uri={token.logo} style={styles.tokenLogo} />
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenName}>{token.name}</Text>
            <View style={styles.balanceContainer}>
              <Text style={styles.tokenBalance}>{balance}</Text>
              <Text style={styles.tokenSymbol}> {token.symbol}</Text>
              {chain?.logo && (
                <View style={styles.chainBadge}>
                  <CustomImg uri={chain.logo} style={styles.chainLogo} />
                  <Text style={styles.chainName}>{chain?.displayName}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={styles.dollarValue}>
            ${token.dollarValue ? trimUnits(token.dollarValue) : "--"}
          </Text>
          <Text
            style={[
              styles.percentChange,
              { color: usdChange >= 0 ? "#4CAF50" : "#FF4444" }
            ]}
          >
            {usdChange >= 0 ? "+" : ""}
            {usdChange.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tokenItem: {
    marginBottom: 8,
    borderRadius: 12,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    // Adding light background effect
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    borderLeftColor: "rgba(255, 255, 255, 0.08)",
    borderRightColor: "rgba(255, 255, 255, 0.04)",
    borderBottomColor: "rgba(255, 255, 255, 0.02)",
  },
  innerContainer: {
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  tokenName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  tokenBalance: {
    color: "#999999",
    fontSize: 14,
  },
  tokenSymbol: {
    color: "#999999",
    fontSize: 14,
  },
  chainBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  chainLogo: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 4,
  },
  chainName: {
    color: "#999999",
    fontSize: 12,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  dollarValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  percentChange: {
    fontSize: 14,
  },
});

export default UserTokenListItem;