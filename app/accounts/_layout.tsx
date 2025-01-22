import { Stack } from "expo-router";
import React from "react";

const ActionsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="addresses" options={{ headerShown: false }} />
      <Stack.Screen name="edit-name" options={{ headerShown: false }} />
      <Stack.Screen name="show-key" options={{ headerShown: false }} />
      <Stack.Screen name="show-phrase" options={{ headerShown: false }} />
      <Stack.Screen
        name="active"
        options={{ headerTitle: "Account Addresses" }}
      />
    </Stack>
  );
};

export default ActionsLayout;
