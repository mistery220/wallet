import { useWalletStore } from "@/store/wallets";
import { Wallet } from "@/types/wallet";
import { Account } from "@/types/wallet/account";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WalletGroupProps {
  wallet: Wallet;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectAccount: (account: Account) => void;
}

const WalletGroup: React.FC<WalletGroupProps> = ({
  wallet,
  isExpanded,
  onToggle,
  onSelectAccount,
}) => (
  <View style={styles.walletContainer}>
    <TouchableOpacity onPress={onToggle} style={styles.walletHeader}>
      <View style={styles.walletInfo}>
        <MaterialIcons
          name={wallet.isPhrase ? "account-balance-wallet" : "key"}
          size={24}
          color="#999"
        />
        <Text style={styles.walletTitle}>
          {wallet.isPhrase ? "Recovery Phrase" : "Private Key"} Wallet
        </Text>
      </View>
      <MaterialIcons
        name={isExpanded ? "expand-less" : "expand-more"}
        size={24}
        color="#999"
      />
    </TouchableOpacity>

    {isExpanded && (
      <View style={styles.accountsList}>
        {wallet.accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            style={styles.accountItem}
            onPress={() => onSelectAccount(account)}
          >
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountAddress}>
                {`${account.address.slice(0, 6)}...${account.address.slice(
                  -4
                )}`}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

const WalletsScreen = () => {
  const { wallets } = useWalletStore();
  const [expandedWallets, setExpandedWallets] = useState<Set<string>>(
    new Set()
  );

  const handleWalletToggle = (walletId: string) => {
    setExpandedWallets((prev) => {
      const next = new Set(prev);
      if (next.has(walletId)) {
        next.delete(walletId);
      } else {
        next.add(walletId);
      }
      return next;
    });
  };

  const handleSelectAccount = (walletId: string) => {
    router.push(`/wallets/view-key?walletId=${walletId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {wallets.map((wallet) => (
          <WalletGroup
            key={wallet.id}
            wallet={wallet}
            isExpanded={expandedWallets.has(wallet.id)}
            onToggle={() => handleWalletToggle(wallet.id)}
            onSelectAccount={() => handleSelectAccount(wallet.id)}
          />
        ))}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  walletContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#333",
    borderRadius: 12,
    overflow: "hidden",
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  walletTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  accountsList: {
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  accountAddress: {
    color: "#999",
    fontSize: 12,
  },
});

export default WalletsScreen;
