import { useCurrentStore } from "@/store/current";
import { Redirect } from "expo-router";
import React from "react";

const MainPage = () => {
  const { activeId } = useCurrentStore();
  if (activeId.length > 0) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/onboard" />;
  }
};

export default MainPage;
