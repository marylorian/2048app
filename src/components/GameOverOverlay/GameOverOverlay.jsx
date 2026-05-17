import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text } from "react-native";
import { styles } from "./styles";

export function GameOverOverlay({ onRestart }) {
  const overlayProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(overlayProgress, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: overlayProgress,
          transform: [
            {
              scale: overlayProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1]
              })
            }
          ]
        }
      ]}
    >
      <Text style={styles.overlayTitle}>Game over</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRestart}
        style={styles.overlayButton}
      >
        <Text style={styles.overlayButtonText}>Try again</Text>
      </Pressable>
    </Animated.View>
  );
}
