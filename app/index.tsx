import WalletKitClient from "@/clients/walletKit/WalletKit";
import { retrieveSecureData } from "@/encryption/storage/retrieve";
import { usePassStore } from "@/store/auth/password";
import { useCurrentStore } from "@/store/current";
import { useSignatureActionStore } from "@/store/signatures/sign";
import { Redirect, router } from "expo-router";
import React, { useEffect, useState } from "react";

const MainPage = () => {
  const { isAuthenticated, hasPassword } = usePassStore();
  const { activeId } = useCurrentStore();

  if (isAuthenticated) {
    if (activeId.length > 0) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/onboard" />;
    }
  } else {
    if (hasPassword) {
      return <Redirect href="/validate-password" />;
    } else {
      return <Redirect href="/set-password" />;
    }
  }
};

export default MainPage;
