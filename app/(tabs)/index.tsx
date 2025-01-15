import useBalance from "@/hooks/balance/useBalance";
import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { useUserTokensStore } from "@/store/user/tokens";
import { Token } from "@/types/token";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatUnits } from "viem";

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
  const [refreshing, setRefreshing] = useState(false);
  const { fetchTokenBalance } = useBalance();

  useEffect(() => {
    fetchTokenBalance({ address: active.address });
  }, []);

  // Calculate total balance
  const totalBalance = useMemo(() => {
    let total = 0;
    Object.values(userTokens).forEach((chainTokens) => {
      Object.values(chainTokens).forEach((token) => {
        if (token.usd) {
          const balance = parseFloat(token.bal) / Math.pow(10, token.decimals);
          total += balance * parseFloat(token.usd);
        }
      });
    });
    return total;
  }, [userTokens]);

  // Create sorted array of all tokens
  const sortedTokens = useMemo(() => {
    const allTokens: (Token & { dollarValue?: number })[] = [];
    Object.entries(userTokens).forEach(([chainId, tokensMap]) => {
      Object.values(tokensMap).forEach((token) => {
        const balance = Number(formatUnits(BigInt(token.bal), token.decimals));
        const dollarValue = token.usd
          ? balance * parseFloat(token.usd)
          : undefined;
        allTokens.push({
          ...token,
          dollarValue,
          chainId: Number(chainId),
        });
      });
    });

    return allTokens.sort((a, b) => {
      // If both tokens have dollar values, sort by value
      if (a.dollarValue !== undefined && b.dollarValue !== undefined) {
        return b.dollarValue - a.dollarValue;
      }
      // If only one token has a dollar value, prioritize it
      if (a.dollarValue !== undefined) return -1;
      if (b.dollarValue !== undefined) return 1;
      // If neither has a dollar value, sort by balance
      return (
        parseFloat(b.bal) / Math.pow(10, b.decimals) -
        parseFloat(a.bal) / Math.pow(10, a.decimals)
      );
    });
  }, [userTokens]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // @TODO add refresh logic
      await fetchTokenBalance({ address: active.address });
    } finally {
      setRefreshing(false);
    }
  }, []);

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
            <MaterialIcons
              name="account-balance-wallet"
              size={16}
              color="#999"
            />
            <Text style={styles.walletsText}>Wallets</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            titleColor="#fff"
            colors={["#fff"]}
          />
        }
      >
        <View style={styles.accountSection}>
          <Text style={styles.accountName}>{active.name}</Text>
          <Text style={styles.balance}>
            $
            {totalBalance.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Text>
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
          {sortedTokens.map((token) => {
            const chain = chains[token.chainId];
            const balance = formatUnits(BigInt(token.bal), token.decimals);

            return (
              <TouchableOpacity
                key={`${token.chainId}-${token.address}`}
                style={styles.tokenItem}
                activeOpacity={0.7}
              >
                <Image source={{ uri: token.logo }} style={styles.tokenLogo} />
                <View style={styles.tokenInfo}>
                  <View style={styles.tokenMainInfo}>
                    <View style={styles.tokenTitleContainer}>
                      <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                      <View style={styles.chainIndicator}>
                        {chain?.logo && (
                          <Image
                            source={{ uri: chain.logo }}
                            style={styles.chainIndicatorLogo}
                          />
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
                    <Text style={styles.tokenValue}>${token.dollarValue}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  walletsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  walletsText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
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
    width: 14,
    height: 14,
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

export default Profile;
