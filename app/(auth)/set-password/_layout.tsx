import { Stack } from "expo-router";

export default function SetPasswordLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
