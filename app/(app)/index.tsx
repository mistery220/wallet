import { usePassStore } from "@/store/auth/password";
import { useCurrentStore } from "@/store/current";
import { Redirect } from "expo-router";
import React from "react";

const MainPage = () => {
  const { isAuthenticated, hasPassword } = usePassStore();
  const { activeId } = useCurrentStore();

  if (activeId.length > 0) {
    return <Redirect href="/(app)/(tabs)" />;
  } else {
    return <Redirect href="/(app)/onboard" />;
  }
};

export default MainPage;
