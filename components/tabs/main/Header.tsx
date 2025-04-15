import { useCurrentStore } from "@/store/current";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Header = () => {
  const { activeId, accounts } = useCurrentStore();
  const active = accounts[activeId];
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {/* Left side - Network indicator */}
        <TouchableOpacity
          style={styles.networkIndicator}
          onPress={() => router.push("/(app)/networks")}
        >
          <View style={styles.networkDot} />
          <Text style={styles.networkText}>Mainnet</Text>
          <MaterialIcons name="keyboard-arrow-down" size={16} color="#999" />
        </TouchableOpacity>

        {/* Center - Account Name */}
        <TouchableOpacity
          style={styles.accountNameContainer}
          onPress={() => router.push("/(app)/accounts/active")}
        >
          <Text style={styles.accountName}>{active.name}</Text>
        </TouchableOpacity>

        {/* Right side - Wallets button */}
        <TouchableOpacity
          style={styles.walletsButton}
          onPress={() => router.push("/(app)/wallets")}
        >
          <MaterialIcons name="account-balance-wallet" size={16} color="#999" />
          <Text style={styles.walletsText}>Wallets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 12,
  },
  networkIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  networkText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  accountNameContainer: {
    flex: 2,
    alignItems: "center",
  },
  accountName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  walletsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-end",
  },
  walletsText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Header;
