import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const UserLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="send" options={{ headerTitle: "Send" }} />
      <Stack.Screen name="receive" options={{ headerShown: false }} />
      <Stack.Screen name="request" options={{ headerShown: false }} />
      <Stack.Screen name="buy" options={{ headerShown: false }} />
    </Stack>
  );
};

export default UserLayout;

const styles = StyleSheet.create({});
