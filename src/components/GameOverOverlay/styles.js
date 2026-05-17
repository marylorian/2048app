import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(238, 228, 218, 0.82)"
  },
  overlayTitle: {
    color: "#776e65",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 16
  },
  overlayButton: {
    borderRadius: 8,
    backgroundColor: "#8f7a66",
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  overlayButtonText: {
    color: "#f9f6f2",
    fontSize: 17,
    fontWeight: "800"
  }
});
