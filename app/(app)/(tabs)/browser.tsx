import BrowserLanding from "@/components/browser/BrowserLanding";
import TabScreen from "@/components/browser/TabScreen";
import { useTabsStore } from "@/store/browser/tabs";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Browser() {
  const currTab = useTabsStore((state) => state.currTab);

  function showTabsScreen() {
    router.push("/(app)/browser/tabs");
  }

  return (
    <View style={styles.container}>
      {currTab ? (
        <TabScreen showTabsScreen={showTabsScreen} currTab={currTab} />
      ) : (
        <BrowserLanding showTabsScreen={showTabsScreen} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
