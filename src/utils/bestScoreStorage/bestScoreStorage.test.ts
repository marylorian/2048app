import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { BEST_SCORE_STORAGE_KEY } from "../../constants";
import { loadStoredBestScore, storeBestScore } from "./bestScoreStorage";

describe("bestScoreStorage", () => {
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: originalPlatform
    });
  });

  it("loads and stores best score with AsyncStorage on native platforms", async () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "ios"
    });
    await AsyncStorage.setItem(BEST_SCORE_STORAGE_KEY, "128");

    await expect(loadStoredBestScore()).resolves.toBe(128);
    await storeBestScore(256);

    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      BEST_SCORE_STORAGE_KEY,
      "256"
    );
  });

  it("loads and stores best score with localStorage on web", async () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "web"
    });
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue("64"),
      setItem: jest.fn()
    };
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: localStorageMock
    });

    await expect(loadStoredBestScore()).resolves.toBe(64);
    await storeBestScore(512);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      BEST_SCORE_STORAGE_KEY,
      "512"
    );
  });

  it("falls back to 0 for missing or invalid stored values", async () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "android"
    });

    await expect(loadStoredBestScore()).resolves.toBe(0);
    await AsyncStorage.setItem(BEST_SCORE_STORAGE_KEY, "not-a-score");
    await expect(loadStoredBestScore()).resolves.toBe(0);
  });
});
