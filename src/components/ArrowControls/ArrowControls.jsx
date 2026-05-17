import { View } from "react-native";
import { ArrowButton } from "../ArrowButton";
import { styles } from "./styles";

export function ArrowControls({ onMove }) {
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
