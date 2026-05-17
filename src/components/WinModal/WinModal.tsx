import { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Pressable, Text, View } from "react-native";
import { styles } from "./styles";

type WinModalProps = {
  visible: boolean;
  onContinue: () => void;
  onRestart: () => void;
};

export function WinModal({ visible, onContinue, onRestart }: WinModalProps) {
  const modalProgressRef = useRef(new Animated.Value(0));

  useEffect(() => {
    const modalProgress = modalProgressRef.current;

    if (!visible) {
      modalProgress.setValue(0);
      return;
    }

    Animated.timing(modalProgress, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onContinue}
    >
      <View style={styles.modalBackdrop}>
        <Animated.View
          style={[
            styles.winModal,
            {
              opacity: modalProgressRef.current,
              transform: [
                {
                  scale: modalProgressRef.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.winTitle}>2048!</Text>
          <Text style={styles.winText}>
            Congratulations, you made the 2048 tile. Keep going for 4096 and
            beyond.
          </Text>
          <View style={styles.winActions}>
            <Pressable
              accessibilityRole="button"
              onPress={onContinue}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Continue</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onRestart}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Restart</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
