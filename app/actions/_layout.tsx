import { Stack } from "expo-router";
import React from "react";

const ActionsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="send"
        options={{
          headerTitle: "Send",
        }}
      />
      {/* <Stack.Screen name="receive" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="request" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="buy" options={{ headerShown: false }} /> */}
    </Stack>
  );
};

export default ActionsLayout;
