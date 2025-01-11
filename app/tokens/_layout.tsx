import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const TokensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Select" }} />
    </Stack>
  );
};

export default TokensLayout;

const styles = StyleSheet.create({});
