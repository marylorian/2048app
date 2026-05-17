import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    width: "100%",
    maxWidth: 390,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18
  },
  title: {
    color: "#776e65",
    fontSize: 56,
    fontWeight: "900",
    lineHeight: 62
  },
  subtitle: {
    color: "#6f665f",
    fontSize: 15,
    lineHeight: 21,
    maxWidth: 250
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8f7a66"
  },
  pressedButton: {
    opacity: 0.72
  }
});
