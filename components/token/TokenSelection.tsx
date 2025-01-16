import { Token } from "@/types/token";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomImg from "../image/CustomImg";

const TokenSelection = ({
  onPress,
  token,
}: {
  onPress: () => void;
  token?: Token;
}) => {
  return (
    <Pressable
      style={[styles.selectionButton, !token && styles.emptySelection]}
      onPress={onPress}
    >
      {token ? (
        <View style={styles.tokenContainer}>
          <CustomImg uri={token.logo} style={styles.tokenImage} />
          <Text style={styles.selectionButtonText}>{token.symbol}</Text>
          <AntDesign name="down" size={12} color="#999" />
        </View>
      ) : (
        <View style={styles.selectContainer}>
          <View style={styles.plusCircle}>
            <AntDesign name="plus" size={16} color="white" />
          </View>
          <Text style={styles.selectionButtonText}>Select</Text>
          <AntDesign name="down" size={12} color="#999" />
        </View>
      )}
    </Pressable>
  );
};

export default TokenSelection;

const styles = StyleSheet.create({
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  emptySelection: {
    backgroundColor: "#222",
  },
  tokenContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  plusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  tokenImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  selectionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 4,
  },
});