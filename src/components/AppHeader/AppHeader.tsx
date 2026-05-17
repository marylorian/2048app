import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";

type AppHeaderProps = {
  onRestart: () => void;
};

export function AppHeader({ onRestart }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>2048</Text>
        <Text style={styles.subtitle}>
          Swipe tiles. Match numbers. Reach 2048.
        </Text>
      </View>

      <Pressable
        accessibilityLabel="Start a new game"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onRestart}
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.pressedButton
        ]}
      >
        <Ionicons name="refresh" size={24} color="#f9f6f2" />
      </Pressable>
    </View>
  );
}
