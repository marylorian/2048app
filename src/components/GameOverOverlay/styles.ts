import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f6f2"
  },
  overlayTitle: {
    backgroundColor: "#f9f6f2",
    color: "#000000",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 16
  },
  overlayButton: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  overlayButtonText: {
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: 17,
    fontWeight: "800"
  }
});
