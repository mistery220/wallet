import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@walletconnect/react-native-compat";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import "../polyfills";

import WalletKitClient from "@/clients/walletKit/WalletKit";
import { useSignatureActionStore } from "@/store/signatures/sign";

// Prevent the splash screen from auto-hiding before asset loading is complete.

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { addSignData } = useSignatureActionStore();

  useEffect(() => {
    // Hide splash screen once assets are loaded
    if (loaded) {
      SplashScreen.hideAsync();

      async function initalizeWalletConnectClient() {
        const walletKit = await WalletKitClient.init();
        walletKit.on("session_request", async (event) => {
          addSignData(event);
          router.push("/actions/user-sign");

          // // sign the message
          // const signedMessage = await wallet.signMessage(message);

          // const response = { id, result: signedMessage, jsonrpc: "2.0" };

          // await walletKit.respondSessionRequest({ topic, response });
        });
      }
      initalizeWalletConnectClient();
    }
  }, [loaded]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboard" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="actions" options={{ headerShown: false }} />
        <Stack.Screen name="transaction" options={{ headerShown: false }} />
        <Stack.Screen name="networks" options={{ headerShown: false }} />
        <Stack.Screen name="tokens" options={{ headerShown: false }} />
        <Stack.Screen name="wallets" options={{ headerShown: false }} />
        <Stack.Screen name="accounts" options={{ headerShown: false }} />
        <Stack.Screen name="auth/twitter" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
