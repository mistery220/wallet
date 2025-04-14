import { Stack } from "expo-router";
import React from "react";

export default function WalletLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Wallets" }} />
      <Stack.Screen name="view-key" options={{ headerTitle: "Private Data" }} />
    </Stack>
  );
}
