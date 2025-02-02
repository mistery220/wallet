import { Stack } from "expo-router";
import React from "react";

export default function WalletLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="twitter"
        options={{ headerTitle: "Connect Twitter" }}
      />
    </Stack>
  );
}
