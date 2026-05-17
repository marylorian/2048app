import { useEffect, useRef } from "react";
import { Animated, Easing, Text } from "react-native";
import { TILE_COLORS } from "../../constants";
import { styles } from "./styles";
import { getTileFontSize } from "./utils";

type TileProps = {
  value: number;
  size: number;
  row: number;
  col: number;
  gap: number;
  hidden?: boolean;
};

export function Tile({
  value,
  size,
  row,
  col,
  gap,
  hidden = false
}: TileProps) {
  const tileScaleRef = useRef(new Animated.Value(value ? 1 : 0.92));
  const color = TILE_COLORS[value] ?? {
    background: "#3c3a32",
    text: "#f9f6f2"
  };
  const fontSize = getTileFontSize(value);

  useEffect(() => {
    const tileScale = tileScaleRef.current;

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
      accessibilityLabel={`${value} tile at row ${row + 1}, column ${col + 1}`}
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          left: gap + col * (size + gap),
          top: gap + row * (size + gap),
          backgroundColor: color.background,
          transform: [{ scale: tileScaleRef.current }]
        }
      ]}
      testID={`tile-${row}-${col}`}
    >
      <Text style={[styles.tileText, { color: color.text, fontSize }]}>
        {value}
      </Text>
    </Animated.View>
  );
}
