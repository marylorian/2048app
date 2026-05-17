import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { BEST_SCORE_STORAGE_KEY } from "../../constants";

export async function loadStoredBestScore() {
  try {
    const rawValue =
      Platform.OS === "web"
        ? window.localStorage.getItem(BEST_SCORE_STORAGE_KEY)
        : await AsyncStorage.getItem(BEST_SCORE_STORAGE_KEY);
    const parsedValue = Number(rawValue);

    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
  } catch {
    return 0;
  }
}

export async function storeBestScore(value) {
  try {
    const stringValue = String(value);

    if (Platform.OS === "web") {
      window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, stringValue);
      return;
    }

    await AsyncStorage.setItem(BEST_SCORE_STORAGE_KEY, stringValue);
  } catch {
    // Best score persistence should never interrupt gameplay.
  }
}
