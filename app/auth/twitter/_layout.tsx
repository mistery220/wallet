import { Stack } from "expo-router";
import React from "react";

export default function WalletLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Connect Twitter" }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}
