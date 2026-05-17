import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  Text,
  View
} from "react-native";
import { styles } from "./styles";

export function WinModal({ visible, onContinue, onRestart }) {
  const modalProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalBackdrop}>
        <Animated.View
          style={[
            styles.winModal,
            {
              opacity: modalProgress,
              transform: [
                {
                  scale: modalProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.winTitle}>2048!</Text>
          <Text style={styles.winText}>Congratulations, you made the 2048 tile.</Text>
          <View style={styles.winActions}>
            <Pressable onPress={onContinue} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Continue</Text>
            </Pressable>
            <Pressable onPress={onRestart} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Restart</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
