import { useTabsStore } from "@/store/browser/tabs";
import { TabData } from "@/types/browser/tabs";
import { Ionicons } from "@expo/vector-icons";
import { routeToScreen } from "expo-router/build/useScreens";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const Tab = ({
  item,
  routeToBrowserScreen,
}: {
  item: TabData;
  routeToBrowserScreen: () => void;
}) => {
  const { setCurrTab, deleteTab } = useTabsStore();
  return (
    <TouchableOpacity
      style={styles.tabCard}
      onPress={() => {
        setCurrTab(item);
        routeToBrowserScreen();
      }}
    >
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: item.preview || "https://via.placeholder.com/300" }}
          style={styles.previewImage}
        />

        {/* Top Left Title & Favicon */}
        <View style={styles.topLeftInfo}>
          <Image
            source={{
              uri: `https://www.google.com/s2/favicons?sz=64&domain_url=${item.url}`,
            }}
            style={styles.favicon}
          />
          <Text numberOfLines={1} style={styles.tabTitle}>
            {item.title}
          </Text>
        </View>

        {/* Bottom Icons */}
        <View style={styles.bottomIcons}>
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              deleteTab(item.id);
            }}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Tab;

const styles = StyleSheet.create({
  tabCard: {
    flex: 1,
    maxWidth: 150,
    margin: 8,
    borderRadius: 12,
    backgroundColor: "#222",
    overflow: "hidden",
  },
  previewContainer: {
    position: "relative",
    height: 200,
    backgroundColor: "#444",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  topLeftInfo: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  favicon: {
    width: 16,
    height: 16,
    marginRight: 6,
    borderRadius: 2,
  },
  tabTitle: {
    fontSize: 12,
    color: "#fff",
    maxWidth: width / 2 - 60, // handle overflow on 2-column layout
  },
  bottomIcons: {
    position: "absolute",
    bottom: 8,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
