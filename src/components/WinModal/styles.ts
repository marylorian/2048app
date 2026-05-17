import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34, 31, 28, 0.42)",
    padding: 24
  },
  winModal: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 8,
    backgroundColor: "#f9f6f2",
    padding: 24,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8
  },
  winTitle: {
    color: "#776e65",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 48,
    marginBottom: 8
  },
  winText: {
    color: "#6f665f",
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 22
  },
  winActions: {
    width: "100%",
    flexDirection: "row",
    gap: 10
  },
  primaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8f7a66",
    paddingHorizontal: 12
  },
  primaryButtonText: {
    color: "#f9f6f2",
    fontSize: 16,
    fontWeight: "900"
  },
  secondaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e4d7c8",
    paddingHorizontal: 12
  },
  secondaryButtonText: {
    color: "#776e65",
    fontSize: 16,
    fontWeight: "900"
  }
});
