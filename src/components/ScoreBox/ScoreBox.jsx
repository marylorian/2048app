import { Text, View } from "react-native";
import { styles } from "./styles";

export function ScoreBox({ label, value }) {
  return (
    <View style={styles.scoreBox}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={styles.scoreValue}>{value}</Text>
    </View>
  );
}
