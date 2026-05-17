import type { PropsWithChildren } from "react";
import { View } from "react-native";

export function SafeAreaProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function SafeAreaView({
  children,
  style
}: PropsWithChildren<{ style?: unknown }>) {
  return <View style={style}>{children}</View>;
}

export function useSafeAreaInsets() {
  return {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  };
}
