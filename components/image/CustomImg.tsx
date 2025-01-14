import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { SvgUri } from "react-native-svg";

type CustomImgProps = {
  uri: string;
  style?: StyleProp<ImageStyle>;
  width?: number;
  height?: number;
};

const CustomImg: React.FC<CustomImgProps> = ({
  uri,
  style,
  width = 44,
  height = 44,
}) => {
  const [hasError, setHasError] = useState(false);
  const isSvg = uri.toLowerCase().endsWith(".svg");

  if (hasError) {
    const iconStyle = style as StyleProp<TextStyle>;

    return (
      <MaterialIcons
        name="error"
        size={width < 20 ? width : 20}
        color="#999"
        style={iconStyle}
      />
    );
  }

  if (isSvg) {
    // Convert ImageStyle to ViewStyle for SvgUri
    const svgStyle: StyleProp<ViewStyle> = style as StyleProp<ViewStyle>;

    return (
      <SvgUri
        width={width}
        height={height}
        uri={uri}
        style={svgStyle}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[{ width, height }, style]}
      onError={() => setHasError(true)}
    />
  );
};

export default CustomImg;
