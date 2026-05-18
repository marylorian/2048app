import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable } from "react-native";
import { styles } from "./styles";
import { ACCESSIBILITY_LABELS } from "../../constants";

export type ArrowButtonName = ComponentProps<typeof Ionicons>["name"];

export type ArrowButtonProps = {
  name: ArrowButtonName;
  onPress: () => void;
};

export function ArrowButton({ name, onPress }: ArrowButtonProps) {
  return (
    <Pressable
      accessibilityLabel={ACCESSIBILITY_LABELS[name] ?? "Move tile"}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.arrowButton,
        pressed && styles.pressedButton
      ]}
    >
      <Ionicons name={name} size={28} color="#776e65" />
    </Pressable>
  );
}
