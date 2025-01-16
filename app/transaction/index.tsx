import { TxnStatus } from "@/enums/status/txn";
import useTxn from "@/hooks/txn/useTxn";
import { useChainsStore } from "@/store/chains";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TransactionScreen() {
  const { chains } = useChainsStore();
  const [status, setStatus] = useState<TxnStatus>(TxnStatus.Processing); // 'processing', 'success', 'failed'
  const router = useRouter();
  const { hash, chainId } = useLocalSearchParams();
  const { waitForTransaction } = useTxn();

  useEffect(() => {
    async function waitForConfirmation() {
      if (hash && chainId) {
        const id = Number(chainId);
        const txnResponse = await waitForTransaction({
          chainId: id,
          hash: hash as string,
          network: chains[id].type,
        });
        setStatus(txnResponse.status);
      } else {
        setStatus(TxnStatus.Reverted);
      }
    }
    waitForConfirmation();
  }, []);

  const renderContent = () => {
    switch (status) {
      case TxnStatus.Processing:
        return (
          <>
            <View style={styles.iconContainer}>Processing...</View>
            <Text style={styles.title}>Transacting...</Text>
            <Text style={styles.subtitle}>
              POL will be deposited into your wallet{"\n"}once the transaction
              is complete
            </Text>
          </>
        );

      case TxnStatus.Success:
        return (
          <>
            <View style={[styles.iconContainer, styles.successIcon]}>
              <Ionicons name="checkmark" size={40} color="white" />
            </View>
            <Text style={styles.title}>It's done!</Text>
            <Text style={styles.subtitle}>
              Tokens have been deposited into your{"\n"}wallet
            </Text>
          </>
        );

      case TxnStatus.Reverted:
        return (
          <>
            <View style={[styles.iconContainer, styles.failedIcon]}>
              <Ionicons name="close" size={40} color="white" />
            </View>
            <Text style={styles.title}>Swap failed</Text>
            <Text style={styles.subtitle}>
              The swap has failed, please try again
            </Text>
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
        <TouchableOpacity
          style={styles.viewTransactionButton}
          onPress={() => console.log("View transaction")}
        >
          <Text style={styles.viewTransactionText}>View Transaction</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.push("/actions/send")}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "space-between",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#2A2A2A",
  },
  successIcon: {
    backgroundColor: "#4CAF50",
  },
  failedIcon: {
    backgroundColor: "#F44336",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#9E9E9E",
    textAlign: "center",
    lineHeight: 24,
  },
  viewTransactionButton: {
    marginTop: 40,
  },
  viewTransactionText: {
    color: "#7C4DFF",
    fontSize: 16,
    fontWeight: "500",
  },
  closeButton: {
    width: "100%",
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7C4DFF",
    marginHorizontal: 4,
  },
});
