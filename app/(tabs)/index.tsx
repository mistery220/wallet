import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { useUserTokensStore } from "@/store/user/tokens";
import { UserToken } from "@/types/token/user";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const { active } = useCurrentStore();
  const chains = useChainsStore((state) => state.chains);
  const userTokens = useUserTokensStore((state) => state.tokens);

  // Group tokens by chain
  const tokensByChain = Object.entries(userTokens).reduce(
    (acc, [key, token]) => {
      if (!acc[token.chainId]) {
        acc[token.chainId] = [];
      }
      acc[token.chainId].push(token);
      return acc;
    },
    {} as Record<number, UserToken[]>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.networksButton}
          onPress={() => router.push("/networks")}
        >
          <View style={styles.networkButtonContent}>
            <Text style={styles.networksText}>Networks</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#666" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Account Info */}
      <Text style={styles.accountName}>{active.name}</Text>
      <Text style={styles.balance}>$0.00</Text>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/actions/send")}
        >
          <MaterialIcons name="send" size={24} color="white" />
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="call-received" size={24} color="white" />
          <Text style={styles.buttonText}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="payment" size={24} color="white" />
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="add-shopping-cart" size={24} color="white" />
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
      </View>

      {/* Tokens List */}
      <ScrollView style={styles.tokensList}>
        {Object.entries(tokensByChain).map(([chainId, tokens]) => {
          const chain = chains[Number(chainId)];
          return (
            <View key={chainId} style={styles.chainSection}>
              <View style={styles.chainHeader}>
                <Image source={{ uri: chain?.logo }} style={styles.chainLogo} />
                <Text style={styles.chainName}>{chain?.displayName}</Text>
              </View>
              {tokens.map((token) => (
                <TouchableOpacity
                  key={`${token.chainId}-${token.address}`}
                  style={styles.tokenItem}
                >
                  <Image
                    source={{ uri: token.logo }}
                    style={styles.tokenLogo}
                  />
                  <View style={styles.tokenInfo}>
                    <Text style={styles.tokenBalance}>{token.bal}</Text>
                    <Text style={styles.tokenAddress}>{`${token.address.slice(
                      0,
                      6
                    )}...${token.address.slice(-4)}`}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  networksButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  networkButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  networksText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  accountName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  balance: {
    color: "white",
    fontSize: 28,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 80,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
  tokensList: {
    flex: 1,
  },
  chainSection: {
    marginBottom: 20,
  },
  chainHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chainLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  chainName: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  tokenItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  tokenLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenBalance: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  tokenAddress: {
    color: "#666",
    fontSize: 14,
    marginTop: 2,
  },
});

export default Profile;
