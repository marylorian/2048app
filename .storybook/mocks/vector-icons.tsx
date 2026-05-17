import { Text } from "react-native";

type IoniconsProps = {
  name: string;
  color?: string;
  size?: number;
};

export function Ionicons({
  name,
  color = "currentColor",
  size = 16
}: IoniconsProps) {
  return (
    <Text
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ color, fontSize: size, lineHeight: size }}
    >
      {name}
    </Text>
  );
}
