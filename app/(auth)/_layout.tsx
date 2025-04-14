import { usePassStore } from "@/store/auth/password";
import { Redirect, Slot } from "expo-router";
import React from "react";

export default function PassPhraseLayout() {
  const { isAuthenticated } = usePassStore();

  if (!isAuthenticated) return <Slot />;
  return <Redirect href="/(app)" />;
}
