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
import { useSignatureActionStore } from "@/store/signatures/sign";
import { AppState } from "react-native";

import WalletKitClient from "@/clients/walletKit/WalletKit";
import { usePassStore } from "@/store/auth/password";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const appState = AppState;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { setIsAuthenticated, isAuthenticated } = usePassStore();
  const { addSignData } = useSignatureActionStore();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Effect to hide splash screen once appIsReady and fonts are loaded
  useEffect(() => {
    if (loaded) {
      // After everything is set up, hide the splash screen
      SplashScreen.hideAsync().catch(console.error);
      async function prepare() {
        try {
          // Initialize WalletConnect client
          const walletKit = await WalletKitClient.init();
          walletKit.on("session_request", async (event) => {
            addSignData(event);
            router.push("/actions/user-sign");
          });
        } catch (error) {
          console.error("Error during app initialization:", error);
        }
      }
      prepare();
    }
  }, [loaded]);

  useEffect(() => {
    const subscription = appState.addEventListener("change", (nextAppState) => {
      console.log({ nextAppState });
      if (nextAppState === "background" || nextAppState === "inactive") {
        console.log("setting ");
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // // If the app is not ready or fonts not loaded, don't render anything
  // if (!loaded) {
  //   return null;
  // }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboard" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="actions" />
        <Stack.Screen name="transaction" />
        <Stack.Screen name="networks" />
        <Stack.Screen name="tokens" />
        <Stack.Screen name="wallets" />
        <Stack.Screen name="accounts" />
        <Stack.Screen name="auth/twitter" />
        {/* <Stack.Screen name="set-password" />
        <Stack.Screen name="validate-password" /> */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
