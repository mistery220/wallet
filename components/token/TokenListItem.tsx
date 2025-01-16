import { Token } from "@/types/token";
import { formatAndTrimUnits } from "@/utils/general/formatter";
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
              <Text style={styles.tokenSymbol}>{item.symbol}</Text>
              <Text style={styles.tokenName}>{item.name}</Text>
            </View>
          </View>
          <View style={styles.balanceContainer}>
            {item.bal && (
              <Text style={styles.balanceText}>
                {formatAndTrimUnits(item.bal, item.decimals)}
              </Text>
            )}
            <Text style={styles.networkText}>{item.network}</Text>
          </View>
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
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  tokenName: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  balanceText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
});
