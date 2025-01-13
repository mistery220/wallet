import { Stack } from "expo-router";

export default function NetworksLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Networks" }} />
    </Stack>
  );
}
