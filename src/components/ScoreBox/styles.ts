import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scoreBox: {
    flex: 1,
    minHeight: 68,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#776e65",
    paddingHorizontal: 10
  },
  scoreLabel: {
    backgroundColor: "#776e65",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  scoreValue: {
    color: "#ffffff",
    backgroundColor: "#776e65",
    fontSize: 25,
    fontWeight: "900"
  }
});
