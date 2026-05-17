import { Text, View } from "react-native";
import { styles } from "./styles";

type ScoreBoxProps = {
  label: string;
  value: number;
};

export function ScoreBox({ label, value }: ScoreBoxProps) {
  return (
    <View style={styles.scoreBox}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={styles.scoreValue}>{value}</Text>
    </View>
  );
}
