import Header from "@/components/tabs/main/Header";
import UserTokenListItem from "@/components/token/UserTokenListItem";
import useTokenBalance from "@/hooks/balance/useBalance";
import { useCurrentStore } from "@/store/current";
import { useUserTokensStore } from "@/store/user/tokens";
import { Token } from "@/types/token";
import { trimUnits } from "@/utils/general/formatter";
import { joinStrings } from "@/utils/string/join";
import { calcDollarValue } from "@/utils/tokens/balance";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
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
  const { activeId, accounts, twitterUsername } = useCurrentStore();
  const userTokens = useUserTokensStore((state) => state.tokens);
  const [refreshing, setRefreshing] = useState(false);
  const { fetchTokenBalance } = useTokenBalance();

  useEffect(() => {
    fetchTokenBalance({ account: accounts[activeId] });
  }, []);

  // Calculate total balance
  const { totalBalance, sortedTokens } = useMemo(() => {
    let total = 0;
    const allTokens: (Token & { dollarValue?: number })[] = [];

    Object.entries(userTokens).forEach(([chainId, tokensMap]) => {
      Object.values(tokensMap).forEach((token) => {
        const dollarValue = calcDollarValue({
          balance: token.bal,
          decimals: token.decimals,
          usdPrice: token.usd,
        });

        // Add to total balance if token has USD value
        if (dollarValue) {
          total += dollarValue;
        }

        // Add to tokens array
        allTokens.push({
          ...token,
          dollarValue,
          chainId: Number(chainId),
        });
      });
    });

    // Sort tokens
    const sorted = allTokens.sort((a, b) => {
      if (a.dollarValue !== undefined && b.dollarValue !== undefined) {
        return b.dollarValue - a.dollarValue;
      }
      if (a.dollarValue !== undefined) return -1;
      if (b.dollarValue !== undefined) return 1;
      return (
        parseFloat(b.bal) / Math.pow(10, b.decimals) -
        parseFloat(a.bal) / Math.pow(10, a.decimals)
      );
    });

    return { totalBalance: total, sortedTokens: sorted };
  }, [userTokens]);

  const onRefresh = useCallback(async () => {
    try {
      if (!refreshing) {
        setRefreshing(true);
        await fetchTokenBalance({ account: accounts[activeId] });
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
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
          <Text style={styles.accountName}>{accounts[activeId].name}</Text>
          <Text style={styles.balance}>${trimUnits(totalBalance)}</Text>
          <Text style={styles.balanceSubtext}>Total Balance</Text>
        </View>

        <View style={styles.actionsContainer}>
          <ActionButton
            icon="send"
            label="Send"
            onPress={() => router.push("/actions/send")}
          />
          {/* <ActionButton
            
            icon="call-received"
            label="Receive"
          /> */}
          <ActionButton
            onPress={() => router.push("/actions/request")}
            icon="payment"
            label="Request"
          />
          <ActionButton icon="add-shopping-cart" label="Buy" />
          {!Boolean(twitterUsername) && (
            <ActionButton
              onPress={() => router.push("/auth/twitter")}
              icon="transfer-within-a-station"
              label=""
            />
          )}

          <ActionButton
            onPress={() => router.push("/accounts/selection")}
            icon="transfer-within-a-station"
            label=""
          />
        </View>

        <View style={styles.assetsSection}>
          {sortedTokens.map((token) => {
            return (
              <UserTokenListItem
                key={joinStrings(token.chainId, token.address)}
                token={token}
              />
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
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 35,
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
});

export default Profile;
