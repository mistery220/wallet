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
      <Stack.Screen
        name="request"
        options={{
          headerTitle: "Request",
        }}
      />
      <Stack.Screen
        name="scan"
        options={{
          headerTitle: "QR Scanner",
        }}
      />
    </Stack>
  );
};

export default ActionsLayout;
