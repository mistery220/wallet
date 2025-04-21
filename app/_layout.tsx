import "@walletconnect/react-native-compat";
import "react-native-get-random-values";
import "react-native-reanimated";
import "../polyfills";

import WalletKitClient from "@/clients/walletKit/WalletKit";
import { PERSIST_ROUTE_KEY } from "@/constants/store/keys";
import EncryptedStore from "@/encryption/EncryptedStore";
import { saveSecureData } from "@/encryption/storage/save";
import { usePassStore } from "@/store/auth/password";
import { useSignatureActionStore } from "@/store/signatures/sign";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useNavigation, useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { addSignData } = useSignatureActionStore();
  const navigation = useNavigation();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const appState = useRef(AppState.currentState);
  const navigationRef = useNavigationContainerRef();

  const { setIsAuthenticated } = usePassStore();
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        if (appState.current === "active" && nextAppState === "background") {
          EncryptedStore.resetPhrase();
          saveSecureData(
            PERSIST_ROUTE_KEY,
            navigationRef.getCurrentRoute()?.name || "/(app)/(tabs)"
          );
          setIsAuthenticated(false);
        }
        appState.current = nextAppState;
      }
    );

    return () => subscription.remove();
  }, []);

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

  if (!loaded) return null;
  return (
    <ThemeProvider value={DarkTheme}>
      <Slot />
    </ThemeProvider>
  );
}
