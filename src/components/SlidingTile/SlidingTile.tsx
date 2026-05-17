import { Animated, Text } from "react-native";
import { TILE_COLORS } from "../../constants";
import type { AnimatedSlideTile } from "../../types";
import { getTileFontSize } from "../Tile/utils";
import { styles } from "./styles";

type SlidingTileProps = {
  tile: AnimatedSlideTile;
  size: number;
  gap: number;
};

export function SlidingTile({ tile, size, gap }: SlidingTileProps) {
  const color = TILE_COLORS[tile.value] ?? {
    background: "#3c3a32",
    text: "#f9f6f2"
  };
  const fontSize = getTileFontSize(tile.value);

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          left: gap + tile.fromCol * (size + gap),
          top: gap + tile.fromRow * (size + gap),
          backgroundColor: color.background,
          transform: [
            { translateX: tile.translateX },
            { translateY: tile.translateY }
          ]
        }
      ]}
    >
      <Text style={[styles.tileText, { color: color.text, fontSize }]}>
        {tile.value}
      </Text>
    </Animated.View>
  );
}
