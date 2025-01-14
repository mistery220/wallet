import { useWalletStore } from "@/store/wallets";
import { Redirect } from "expo-router";
import React from "react";

const MainPage = () => {
  const { wallets } = useWalletStore();
  if (wallets.length) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/onboard" />;
  }
};

export default MainPage;
