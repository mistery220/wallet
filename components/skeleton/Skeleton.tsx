import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

type SkeletonProps = {
  // Base styling - now with proper types
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  // Animation configuration
  animationDuration?: number;
  isReversed?: boolean;
  // Colors
  backgroundColor?: string;
  highlightColor?: string;
  // Layout options
  style?: Animated.WithAnimatedValue<ViewStyle>;
  children?: React.ReactNode;
  // Use case presets
  variant?: 'text' | 'title' | 'rectangle' | 'circle';
  lines?: number;
};

const DEFAULT_DURATION = 1000;

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  animationDuration = DEFAULT_DURATION,
  isReversed = false,
  backgroundColor = '#333',
  highlightColor = '#444',
  style,
  children,
  variant = 'rectangle',
  lines = 1,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();

    return () => {
      pulseAnim.setValue(0);
    };
  }, [animationDuration]);

  const getVariantStyle = (): Animated.WithAnimatedValue<ViewStyle> => {
    switch (variant) {
      case 'text':
        return {
          width: '70%',
          height: 20,
        };
      case 'title':
        return {
          width: '50%',
          height: 28,
        };
      case 'circle':
        return {
          width: height,
          height,
          borderRadius: height / 2,
        };
      default:
        return {};
    }
  };

  const renderLines = () => {
    if (lines <= 1) return null;

    return Array.from({ length: lines - 1 }).map((_, index) => (
      <Animated.View
        key={index}
        style={[
          styles.skeleton,
          getVariantStyle(),
          {
            width: typeof width === 'number' ? width : width,
            height,
            borderRadius,
            backgroundColor,
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: isReversed ? [1, 0.3] : [0.3, 1],
            }),
            marginTop: 8,
          } as Animated.WithAnimatedValue<ViewStyle>,
          style,
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.skeleton,
          getVariantStyle(),
          {
            width,
            height,
            borderRadius,
            backgroundColor,
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: isReversed ? [1, 0.3] : [0.3, 1],
            }),
          } as Animated.WithAnimatedValue<ViewStyle>,
          style,
        ]}
      >
        {children}
      </Animated.View>
      {renderLines()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  skeleton: {
    overflow: 'hidden',
  },
});