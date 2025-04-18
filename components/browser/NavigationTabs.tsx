import { useTabsStore } from "@/store/browser/tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Tab from "./Tab";

const NavigationTabs = () => {
  const { tabsData, addNewTabAsCurr, removeCurrTab } = useTabsStore();
  const tabs = Object.values(tabsData);
  function routeToBrowserScreen() {
    router.push("/(app)/(tabs)/browser");
  }
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tabs}
        numColumns={2}
        contentContainerStyle={styles.tabsContainer}
        renderItem={({ item }) => (
          <Tab
            item={item}
            routeToBrowserScreen={() => {
              routeToBrowserScreen();
            }}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Fixed Bottom Bar */}
      <View style={styles.fixedFooter}>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            addNewTabAsCurr();
            routeToBrowserScreen();
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            removeCurrTab();
            routeToBrowserScreen();
          }}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavigationTabs;

const styles = StyleSheet.create({
  tabsContainer: {
    paddingBottom: 80, // leave space for fixed footer
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  fixedFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  addButton: {
    borderRadius: 24,
    padding: 8,
  },
});
