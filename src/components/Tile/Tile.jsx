import { useEffect, useRef } from "react";
import { Animated, Easing, Text } from "react-native";
import { TILE_COLORS } from "../../constants";
import { styles } from "./styles";
import { getTileFontSize } from "./utils";

export function Tile({ value, size, row, col, gap, hidden = false }) {
  const tileScale = useRef(new Animated.Value(value ? 1 : 0.92)).current;
  const color = TILE_COLORS[value] ?? { background: "#3c3a32", text: "#f9f6f2" };
  const fontSize = getTileFontSize(value);

  useEffect(() => {
    if (!value) {
      tileScale.setValue(0.92);
      return;
    }

    tileScale.setValue(0.78);

    Animated.sequence([
      Animated.timing(tileScale, {
        toValue: 1.08,
        duration: 90,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.spring(tileScale, {
        toValue: 1,
        speed: 20,
        bounciness: 7,
        useNativeDriver: true
      })
    ]).start();
  }, [value]);

  if (hidden || !value) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          left: gap + col * (size + gap),
          top: gap + row * (size + gap),
          backgroundColor: color.background,
          transform: [{ scale: tileScale }]
        }
      ]}
    >
      <Text style={[styles.tileText, { color: color.text, fontSize }]}>
        {value}
      </Text>
    </Animated.View>
  );
}
