import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TransactionScreen() {
  const [processing, setProcessing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate transaction processing
    const timeout = setTimeout(() => {
      setProcessing(false);
    }, 3000); // Simulate 3 seconds of processing

    return () => clearTimeout(timeout); // Cleanup timeout
  }, []);

  return (
    <View style={styles.container}>
      {processing ? (
        <>
          <Text style={styles.title}>Processing Transaction</Text>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.subtitle}>Waiting for the confirmation</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Transaction Complete</Text>
          <Text style={styles.subtitle}>Funds successfully sent</Text>
          <Button
            title="Go Back"
            onPress={() => router.push("/actions/send")}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
});
