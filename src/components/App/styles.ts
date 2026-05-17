import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f2e9"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  scoreRow: {
    width: "100%",
    maxWidth: 390,
    flexDirection: "row",
    gap: 10,
    marginBottom: 16
  }
});
