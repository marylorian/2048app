import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable } from "react-native";
import { styles } from "./styles";

type ArrowButtonProps = {
  name: ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
};

const accessibilityLabels: Partial<
  Record<ComponentProps<typeof Ionicons>["name"], string>
> = {
  "chevron-back": "Move left",
  "chevron-down": "Move down",
  "chevron-forward": "Move right",
  "chevron-up": "Move up"
};

export function ArrowButton({ name, onPress }: ArrowButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabels[name] ?? "Move tile"}
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
