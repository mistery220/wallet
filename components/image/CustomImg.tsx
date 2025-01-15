import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SvgUri } from "react-native-svg";

type CustomImgProps = {
  uri: string;
  style?: StyleProp<ViewStyle>; // Use ViewStyle for better flexibility
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
    return (
      <View
        style={[
          {
            width,
            height,
            borderRadius: width / 2, // Apply borderRadius
            overflow: "hidden", // Ensure rounded corners
          },
          style,
        ]}
      >
        <SvgUri
          width="100%"
          height="100%"
          uri={uri}
          onError={() => setHasError(true)}
        />
      </View>
    );
  }
  const imgStyle = style as StyleProp<ImageStyle>;
  return (
    <Image
      source={{ uri }}
      style={[{ width, height }, imgStyle]}
      onError={() => setHasError(true)}
    />
  );
};

export default CustomImg;
