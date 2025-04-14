import "../polyfills";

import WalletKitClient from "@/clients/walletKit/WalletKit";
import { useColorScheme } from "@/hooks/useColorScheme";
import { usePassStore } from "@/store/auth/password";
import { useSignatureActionStore } from "@/store/signatures/sign";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { addSignData } = useSignatureActionStore();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(console.error);
      (async () => {
        try {
          const walletKit = await WalletKitClient.init();
          walletKit.on("session_request", async (event) => {
            addSignData(event);
          });
        } catch (error) {
          console.error("Error during app initialization:", error);
        }
      })();
    }
  }, [loaded]);

  const { setIsAuthenticated } = usePassStore();
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        console.log({ nextAppState });
        if (appState.current === "active" && nextAppState === "background") {
          setIsAuthenticated(false);
          console.log("setting");
        }
        appState.current = nextAppState;
      }
    );

    return () => subscription.remove();
  }, []);

  if (!loaded) return null;
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
    </ThemeProvider>
  );
}
