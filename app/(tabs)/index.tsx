import { useCurrentStore } from "@/store/current";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const { active } = useCurrentStore(); // Assuming `active` holds the current account details
  return (
    <View style={styles.container}>
      <Text style={styles.accountName}>{active.name}</Text>
      <Text style={styles.balance}>$0.00</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/actions/send")}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          // onPress={() => router.push("receive")}
        >
          <Text style={styles.buttonText}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          // onPress={() => router.push("request")}
        >
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          // onPress={() => router.push("buy")}
        >
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a", // Dark background
    padding: 20,
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
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  network: {
    color: "gray",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
