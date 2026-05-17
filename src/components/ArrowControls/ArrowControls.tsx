import { View } from "react-native";
import type { Direction } from "../../types";
import { ArrowButton } from "../ArrowButton";
import { styles } from "./styles";

type ArrowControlsProps = {
  onMove: (direction: Direction) => void;
};

export function ArrowControls({ onMove }: ArrowControlsProps) {
  return (
    <View style={styles.controls}>
      <ArrowButton name="chevron-up" onPress={() => onMove("up")} />
      <View style={styles.horizontalControls}>
        <ArrowButton name="chevron-back" onPress={() => onMove("left")} />
        <ArrowButton name="chevron-down" onPress={() => onMove("down")} />
        <ArrowButton name="chevron-forward" onPress={() => onMove("right")} />
      </View>
    </View>
  );
}
