import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your Wallet</Text>
      <Text style={styles.balance}>Balance: 0 ETH</Text>
      <Button title="Send" onPress={() => {}} />
      <Button title="Receive" onPress={() => {}} />
      <Button title="Other" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  balance: { fontSize: 18, marginBottom: 20 },
});

export default HomeScreen;
