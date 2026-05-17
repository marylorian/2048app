import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scoreBox: {
    flex: 1,
    minHeight: 68,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#bbada0",
    paddingHorizontal: 10
  },
  scoreLabel: {
    color: "#eee4da",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  scoreValue: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "900"
  }
});
