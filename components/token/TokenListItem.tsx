import { Token } from "@/types/token";
import { formatAndTrimUnits, trimUnits } from "@/utils/general/formatter";
import { calcDollarValue } from "@/utils/tokens/balance";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomImg from "../image/CustomImg";

const TokenListItem = ({
  item,
  handleSelectToken,
}: {
  item: Token;
  handleSelectToken: (token: Token) => void;
}) => {
  const dollarValue = calcDollarValue({
    balance: item.bal,
    decimals: item.decimals,
    usdPrice: item.usd,
  });
  return (
    <View>
      <Pressable
        style={styles.tokenItem}
        onPress={() => handleSelectToken(item)}
      >
        <View style={styles.tokenContent}>
          <View style={styles.tokenInfo}>
            <CustomImg uri={item.logo} style={styles.tokenLogo} />
            <View style={styles.tokenDetails}>
              <Text style={styles.tokenName}>{item.name}</Text>
              <Text style={styles.tokenSymbol}>
                {" "}
                {item.bal && formatAndTrimUnits(item.bal, item.decimals)}{" "}
                {item.symbol}
              </Text>
            </View>
          </View>
          {item.usd && (
            <View style={styles.rightSection}>
              <Text style={styles.dollarValue}>
                {dollarValue && `$${trimUnits(dollarValue)}`}
              </Text>
              <Text
                style={[
                  styles.percentChange,
                  {
                    color:
                      parseFloat(item.usd_change_24h) >= 0
                        ? "#4CAF50"
                        : "#FF4444",
                  },
                ]}
              >
                {parseFloat(item.usd_change_24h) >= 0 ? "+" : ""}
                {trimUnits(item.usd_change_24h)}%
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default TokenListItem;

const styles = StyleSheet.create({
  tokenItem: {
    margin: 8,
    marginBottom: 0,
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tokenContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  tokenInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#3A3A3A",
  },
  tokenDetails: {
    justifyContent: "center",
  },
  tokenSymbol: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
  tokenName: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  networkText: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
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
