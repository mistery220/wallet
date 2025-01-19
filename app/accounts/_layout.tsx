import { Stack } from "expo-router";
import React from "react";

const ActionsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="addresses" options={{ headerShown: false }} />
      <Stack.Screen name="edit-name" options={{ headerShown: false }} />
      <Stack.Screen name="edit-name" options={{ headerShown: false }} />
      <Stack.Screen name="edit-name" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ActionsLayout;
