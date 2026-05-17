import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text } from "react-native";
import { styles } from "./styles";

type GameOverOverlayProps = {
  onRestart: () => void;
};

export function GameOverOverlay({ onRestart }: GameOverOverlayProps) {
  const overlayProgressRef = useRef(new Animated.Value(0));

  useEffect(() => {
    const overlayProgress = overlayProgressRef.current;

    Animated.timing(overlayProgress, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <Animated.View
      accessibilityLabel="Game over"
      style={[
        styles.overlay,
        {
          opacity: overlayProgressRef.current,
          transform: [
            {
              scale: overlayProgressRef.current.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1]
              })
            }
          ]
        }
      ]}
      testID="game-over-overlay"
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
