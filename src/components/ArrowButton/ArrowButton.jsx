import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { styles } from "./styles";

export function ArrowButton({ name, onPress }) {
  return (
    <Pressable
      accessibilityLabel={name.replace("chevron-", "Move ")}
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
