import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { useUserTokensStore } from "@/store/user/tokens";
import { UserToken } from "@/types/token/user";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ActionButton: React.FC<{
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
}> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={styles.actionIconContainer}>
      <MaterialIcons name={icon} size={24} color="white" />
    </View>
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

const Profile = () => {
  const { active } = useCurrentStore();
  const chains = useChainsStore((state) => state.chains);
  const userTokens = useUserTokensStore((state) => state.tokens);

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
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.networkIndicator}
            onPress={() => router.push("/networks")}
          >
            <View style={styles.networkDot} />
            <Text style={styles.networkText}>Mainnet</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.walletsButton}
            onPress={() => router.push("/wallets")}
          >
            <MaterialIcons name="account-balance-wallet" size={16} color="#999" />
            <Text style={styles.walletsText}>Wallets</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.accountSection}>
          <Text style={styles.accountName}>{active.name}</Text>
          <Text style={styles.balance}>$0.00</Text>
          <Text style={styles.balanceSubtext}>Total Balance</Text>
        </View>

        <View style={styles.actionsContainer}>
          <ActionButton
            icon="send"
            label="Send"
            onPress={() => router.push("/actions/send")}
          />
          <ActionButton icon="call-received" label="Receive" />
          <ActionButton icon="payment" label="Request" />
          <ActionButton icon="add-shopping-cart" label="Buy" />
        </View>

        <View style={styles.assetsSection}>
          <Text style={styles.sectionTitle}>Assets</Text>
          {Object.entries(tokensByChain).map(([chainId, tokens]) => {
            const chain = chains[Number(chainId)];
            return (
              <View key={chainId} style={styles.chainSection}>
                <View style={styles.chainHeader}>
                  {chain?.logo && (
                    <Image source={{ uri: chain.logo }} style={styles.chainLogo} />
                  )}
                  <Text style={styles.chainName}>{chain?.displayName}</Text>
                </View>
                {tokens.map((token) => (
                  <TouchableOpacity
                    key={`${token.chainId}-${token.address}`}
                    style={styles.tokenItem}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: token.logo }}
                      style={styles.tokenLogo}
                    />
                    <View style={styles.tokenInfo}>
                      <View style={styles.tokenMainInfo}>
                        <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                        <Text style={styles.tokenBalance}>{token.bal}</Text>
                      </View>
                      <View style={styles.tokenSubInfo}>
                        <Text style={styles.tokenName}>{token.name}</Text>
                        <Text style={styles.tokenValue}>$0.00</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 12,
  },
  networkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50', // Green for mainnet
  },
  networkText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  walletsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  walletsText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  networksButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 12,
  },
  networksText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  accountSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  accountName: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  balance: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  balanceSubtext: {
    color: "#999",
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#333",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  assetsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  chainSection: {
    marginBottom: 24,
  },
  chainHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  chainLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  chainName: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
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
    alignItems: "center",
    marginBottom: 4,
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

export default Profile;