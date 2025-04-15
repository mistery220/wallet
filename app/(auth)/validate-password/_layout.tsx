import { Stack } from "expo-router";

export default function ValidatePasswordLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
