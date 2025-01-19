import { useCurrentStore } from "@/store/current";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
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

const ManageAccountsScreen = () => {
  const { accounts } = useCurrentStore();

  const handleBack = () => {
    router.back();
  };

  const handleAddWallet = () => {
    // @TODO add wallet addition handling
    // router.push("/wallets/add");
  };

  const handleAccountOptions = (accountId: string) => {
    router.push(`/accounts?accountId=${accountId}`);
  };

  const getAccountInitials = (name: string) => {
    if (name === "Rekt Key") return "R";
    const match = name.match(/Account (\d+)/);
    return match ? `A${match[1]}` : name.charAt(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Accounts</Text>
        <TouchableOpacity onPress={handleAddWallet} style={styles.headerButton}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {Object.values(accounts).map((account) => (
          <TouchableOpacity
            key={account.id}
            style={styles.accountCard}
            onPress={() => handleAccountOptions(account.id)}
          >
            <View style={styles.accountInfo}>
              <View style={styles.accountIcon}>
                <Text style={styles.accountInitials}>
                  {getAccountInitials(account.name)}
                </Text>
              </View>
              <Text style={styles.accountName}>{account.name}</Text>
            </View>
            <View style={styles.accountActions}>
              {/* // @TODO add user portfolio balance */}
              {/* {account.balance && (
                <Text style={styles.accountBalance}>
                  ${Number(account.balance).toFixed(2)}
                </Text>
              )} */}
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="more-vert" size={24} color="#999" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addWalletButton}
          onPress={handleAddWallet}
        >
          <Text style={styles.addWalletButtonText}>Add / Connect Wallet</Text>
        </TouchableOpacity>
      </View>
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
  headerButton: {
    padding: 8,
    minWidth: 40,
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#333",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accountInitials: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  accountName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  accountActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  accountBalance: {
    color: "#999",
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  addWalletButton: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  addWalletButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ManageAccountsScreen;
