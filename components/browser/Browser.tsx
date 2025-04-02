import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";

interface Tab {
  url: string;
  title: string;
}

interface BrowserTabProps {
  url: string;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
  active: boolean;
  webViewRef: React.RefObject<WebView>;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTabIndex: number;
  onTabPress: (index: number) => void;
  onTabClose: (index: number) => void;
  onAddTab: () => void;
  visible: boolean;
  onClose: () => void;
}

interface AddressBarProps {
  url: string;
  onUrlChange: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onRefresh: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  tabCount: number;
  onTabsButtonPress: () => void;
}

const BrowserTab: React.FC<BrowserTabProps> = ({
  url,
  onLoadStart,
  onLoadEnd,
  onNavigationStateChange,
  active,
  webViewRef,
}) => {
  if (!active) return null;

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: url || "https://www.google.com" }}
      style={styles.webView}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onNavigationStateChange={onNavigationStateChange}
      renderLoading={() => (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066ff" />
        </View>
      )}
    />
  );
};

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTabIndex,
  onTabPress,
  onTabClose,
  onAddTab,
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.tabSwitcherContainer}>
        <View style={styles.tabSwitcherHeader}>
          <Text style={styles.tabSwitcherTitle}>Tabs ({tabs.length})</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeTabSwitcherButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={tabs}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.tabCard,
                activeTabIndex === index ? styles.activeTabCard : null,
              ]}
            >
              <TouchableOpacity
                style={styles.tabCardContent}
                onPress={() => {
                  onTabPress(index);
                  onClose();
                }}
              >
                <Text style={styles.tabCardTitle} numberOfLines={1}>
                  {item.title || "New Tab"}
                </Text>
                <Text style={styles.tabCardUrl} numberOfLines={1}>
                  {item.url}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabCardCloseButton}
                onPress={() => onTabClose(index)}
              >
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `tab-card-${index}`}
          contentContainerStyle={styles.tabCardsList}
        />

        <TouchableOpacity
          style={styles.addTabButton}
          onPress={() => {
            onAddTab();
            onClose();
          }}
        >
          <Ionicons name="add-circle" size={24} color="#0066ff" />
          <Text style={styles.addTabButtonText}>New Tab</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const AddressBar: React.FC<AddressBarProps> = ({
  url,
  onUrlChange,
  onSubmit,
  isLoading,
  onRefresh,
  onGoBack,
  onGoForward,
  canGoBack,
  canGoForward,
  tabCount,
  onTabsButtonPress,
}) => {
  return (
    <View style={styles.addressBarContainer}>
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          onPress={onGoBack}
          disabled={!canGoBack}
          style={[styles.navButton, !canGoBack && styles.disabledButton]}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={canGoBack ? "#333" : "#ccc"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onGoForward}
          disabled={!canGoForward}
          style={[styles.navButton, !canGoForward && styles.disabledButton]}
        >
          <Ionicons
            name="arrow-forward"
            size={24}
            color={canGoForward ? "#333" : "#ccc"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.addressInputContainer}>
        <TextInput
          style={styles.addressInput}
          value={url}
          onChangeText={onUrlChange}
          placeholder="Search Google or enter URL"
          selectTextOnFocus
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={onSubmit}
        />
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="#0066ff"
            style={styles.loader}
          />
        )}
      </View>
      <View style={styles.rightButtons}>
        <TouchableOpacity onPress={onRefresh} style={styles.navButton}>
          <Ionicons
            name={isLoading ? "stop-circle" : "refresh"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onTabsButtonPress} style={styles.tabsButton}>
          <View style={styles.tabsButtonContainer}>
            <Text style={styles.tabsCount}>{tabCount}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MobileBrowser: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { url: "https://www.google.com", title: "Google" },
  ]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [currentUrl, setCurrentUrl] = useState<string>(
    "https://www.google.com"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [canGoForward, setCanGoForward] = useState<boolean>(false);
  const [showTabSwitcher, setShowTabSwitcher] = useState<boolean>(false);

  // Create an array of refs for each tab
  const webViewRefs = useRef<Array<React.RefObject<WebView>>>([]);
  
  // Initialize refs for initial tab
  if (webViewRefs.current.length < tabs.length) {
    tabs.forEach((_, index) => {
      if (!webViewRefs.current[index]) {
        webViewRefs.current[index] = React.createRef<WebView>();
      }
    });
  }

  const handleAddTab = (): void => {
    const newTabIndex = tabs.length;
    setTabs([...tabs, { url: "https://www.google.com", title: "New Tab" }]);
    setActiveTabIndex(newTabIndex);
    setCurrentUrl("https://www.google.com");
    
    // Create a new ref for the new tab
    if (!webViewRefs.current[newTabIndex]) {
      webViewRefs.current[newTabIndex] = React.createRef<WebView>();
    }
  };

  const handleTabPress = (index: number): void => {
    setActiveTabIndex(index);
    setCurrentUrl(tabs[index].url);
  };

  const handleTabClose = (index: number): void => {
    if (tabs.length === 1) {
      // Don't close the last tab, just reset it
      setTabs([{ url: "https://www.google.com", title: "Google" }]);
      setCurrentUrl("https://www.google.com");
      return;
    }

    const newTabs = [...tabs];
    newTabs.splice(index, 1);
    setTabs(newTabs);

    // Remove the ref for this tab and reindex the refs
    const newRefs = [...webViewRefs.current];
    newRefs.splice(index, 1);
    webViewRefs.current = newRefs;

    // If we closed the active tab, set a new active tab
    if (index === activeTabIndex) {
      const newIndex = index === 0 ? 0 : index - 1;
      setActiveTabIndex(newIndex);
      setCurrentUrl(newTabs[newIndex].url);
    } else if (index < activeTabIndex) {
      setActiveTabIndex(activeTabIndex - 1);
    }
  };

  const handleUrlChange = (text: string): void => {
    setCurrentUrl(text);
  };

  const isValidUrl = (text: string): boolean => {
    // Simple URL validation regex
    const urlPattern =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return urlPattern.test(text);
  };

  const handleUrlSubmit = (): void => {
    let url = currentUrl.trim();

    // If it's not a valid URL or doesn't start with http/https, treat as a search
    if (!isValidUrl(url) || !url.startsWith("http")) {
      // If it's already a valid URL but missing protocol, add https://
      if (isValidUrl(url) && !url.startsWith("http")) {
        url = "https://" + url;
      } else {
        // Encode the search query for Google search
        const searchQuery = encodeURIComponent(url);
        url = `https://www.google.com/search?q=${searchQuery}`;
      }
    }

    // Update the current tab's URL
    const newTabs = [...tabs];
    newTabs[activeTabIndex] = { ...newTabs[activeTabIndex], url };
    setTabs(newTabs);
    setCurrentUrl(url);
  };

  const handleNavigationStateChange = (navState: WebViewNavigation): void => {
    const newTabs = [...tabs];
    newTabs[activeTabIndex] = {
      ...newTabs[activeTabIndex],
      url: navState.url,
      title: navState.title,
    };
    setTabs(newTabs);
    setCurrentUrl(navState.url);
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const handleLoadStart = (): void => {
    setIsLoading(true);
  };

  const handleLoadEnd = (): void => {
    setIsLoading(false);
  };

  const handleGoBack = (): void => {
    const webViewRef = webViewRefs.current[activeTabIndex];
    if (webViewRef && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const handleGoForward = (): void => {
    const webViewRef = webViewRefs.current[activeTabIndex];
    if (webViewRef && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  const handleRefresh = (): void => {
    const webViewRef = webViewRefs.current[activeTabIndex];
    if (isLoading) {
      if (webViewRef && webViewRef.current) {
        // TypeScript workaround for stopLoading method
        (webViewRef.current as any).stopLoading();
        setIsLoading(false);
      }
    } else {
      if (webViewRef && webViewRef.current) {
        webViewRef.current.reload();
      }
    }
  };

  const toggleTabSwitcher = (): void => {
    setShowTabSwitcher(!showTabSwitcher);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.browserContainer}>
        <AddressBar
          url={currentUrl}
          onUrlChange={handleUrlChange}
          onSubmit={handleUrlSubmit}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          tabCount={tabs.length}
          onTabsButtonPress={toggleTabSwitcher}
        />

        <View style={styles.webViewContainer}>
          {tabs.map((tab, index) => (
            <BrowserTab
              key={`webview-${index}`}
              url={tab.url}
              active={index === activeTabIndex}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onNavigationStateChange={handleNavigationStateChange}
              webViewRef={webViewRefs.current[index]}
            />
          ))}
        </View>

        <TabSwitcher
          tabs={tabs}
          activeTabIndex={activeTabIndex}
          onTabPress={handleTabPress}
          onTabClose={handleTabClose}
          onAddTab={handleAddTab}
          visible={showTabSwitcher}
          onClose={() => setShowTabSwitcher(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: Constants.statusBarHeight,
  },
  browserContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  webViewContainer: {
    flex: 1,
  },
  addressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 56,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  navigationButtons: {
    flexDirection: "row",
    marginRight: 5,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  navButton: {
    padding: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addressInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  addressInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  loader: {
    marginLeft: 5,
  },
  tabsButton: {
    padding: 6,
    marginLeft: 4,
  },
  tabsButtonContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tabsCount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  menuButton: {
    padding: 6,
    marginLeft: 4,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Tab Switcher Styles
  tabSwitcherContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
  },
  tabSwitcherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabSwitcherTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeTabSwitcherButton: {
    padding: 4,
  },
  tabCardsList: {
    padding: 16,
  },
  tabCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeTabCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#0066ff",
  },
  tabCardContent: {
    flex: 1,
  },
  tabCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  tabCardUrl: {
    fontSize: 12,
    color: "#666",
  },
  tabCardCloseButton: {
    padding: 4,
  },
  addTabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addTabButtonText: {
    fontSize: 16,
    color: "#0066ff",
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default MobileBrowser;