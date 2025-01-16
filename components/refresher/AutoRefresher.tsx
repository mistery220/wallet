import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

const AutoRefresher = ({
  refreshQuotes,
  isLoading,
  disableQuotesRefresh,
  showIcon = false,
  timeInterval,
}: {
  refreshQuotes: () => Promise<void>;
  isLoading: boolean;
  disableQuotesRefresh: boolean;
  showIcon?: boolean;
  timeInterval: number;
}) => {
  const inactiveTimeRef = useRef<number | null>(null);
  const [timer, setTimer] = useState(timeInterval);
  const rotation = useSharedValue(0);

  // Handle app state changes instead of document visibility
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      if (
        !disableQuotesRefresh &&
        inactiveTimeRef.current &&
        inactiveTimeRef.current + timeInterval * 1000 < Date.now()
      ) {
        setTimer(0);
      }
    } else {
      inactiveTimeRef.current = Date.now();
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    let interval: NodeJS.Timeout;

    if (AppState.currentState === "active" && !isLoading) {
      interval = setInterval(() => {
        setTimer((newTimer) => newTimer - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (
      timer <= 0 &&
      !isLoading &&
      AppState.currentState === "active" &&
      !disableQuotesRefresh
    ) {
      refreshQuotes().finally(() => setTimer(timeInterval));
    }
    if ((isLoading || disableQuotesRefresh) && timer !== timeInterval) {
      setTimer(timeInterval);
    }
  }, [timer, isLoading, refreshQuotes, disableQuotesRefresh]);

  useEffect(() => {
    if (isLoading) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [isLoading]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  if (!showIcon) {
    return null;
  }

  return isLoading ? (
    <AnimatedIcon
      name="refresh"
      size={16}
      color="#999999"
      style={animatedStyle}
    />
  ) : (
    <Pressable
      style={styles.button}
      onPress={() => {
        if (!isLoading) {
          refreshQuotes().finally(() => setTimer(timeInterval));
        }
      }}
    >
      <MaterialIcons name="refresh" size={16} color="#999999" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AutoRefresher;
