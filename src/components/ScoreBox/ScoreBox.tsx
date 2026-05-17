import { Text, View } from "react-native";
import { styles } from "./styles";

type ScoreBoxProps = {
  label: string;
  value: number;
};

export function ScoreBox({ label, value }: ScoreBoxProps) {
  return (
    <View
      accessibilityLabel={`${label}: ${value}`}
      style={styles.scoreBox}
      testID={`score-${label.toLowerCase()}`}
    >
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={styles.scoreValue}>{value}</Text>
    </View>
  );
}
