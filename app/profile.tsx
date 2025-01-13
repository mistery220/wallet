import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import { useCurrentStore } from "@/store/current";
import { ArrowUpRight, ArrowDownLeft, DollarSign, CreditCard } from "lucide-react-native";

const Profile = () => {
  const { active } = useCurrentStore();

  const actions = [
    {
      title: "Send",
      icon: <ArrowUpRight size={24} color="white" />,
      onPress: () => console.log("Send pressed"),
    },
    {
      title: "Receive",
      icon: <ArrowDownLeft size={24} color="white" />,
      onPress: () => console.log("Receive pressed"),
    },
    {
      title: "Request",
      icon: <DollarSign size={24} color="white" />,
      onPress: () => console.log("Request pressed"),
    },
    {
      title: "Buy",
      icon: <CreditCard size={24} color="white" />,
      onPress: () => console.log("Buy pressed"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Text style={styles.accountName}>{active.name}</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceAmount}>0.00</Text>
            <Text style={styles.balanceSymbol}>SOL</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <View style={styles.actions}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={action.title}
                style={styles.actionButton}
                onPress={action.onPress}
              >
                <View style={styles.actionIconContainer}>
                  {action.icon}
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent transactions</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    alignItems: "center",
  },
  accountName: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  balanceAmount: {
    color: "white",
    fontSize: 36,
    fontWeight: "700",
    marginRight: 8,
  },
  balanceSymbol: {
    color: "#999",
    fontSize: 20,
    fontWeight: "600",
  },
  actionsContainer: {
    marginTop: 40,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#444",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  recentActivity: {
    marginTop: 40,
    flex: 1,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  emptyStateText: {
    color: "#999",
    fontSize: 16,
  },
});

export default Profile;