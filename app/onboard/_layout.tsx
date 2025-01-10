import { Stack } from "expo-router";

export default function OnboardLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="new" options={{ headerTitle: "New Wallet" }} />
      <Stack.Screen
        name="existing"
        options={{ headerTitle: "Existing Wallet" }}
      />
    </Stack>
  );
}
