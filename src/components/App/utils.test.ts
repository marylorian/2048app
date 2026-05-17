import { Platform } from "react-native";
import { getE2EInitialState } from "./utils";

const e2eStateKey = "react-native-2048:e2e-initial-state";
const originalOS = Platform.OS;
const localStorageStore = new Map<string, string>();

function setPlatformOS(value: typeof Platform.OS) {
  Object.defineProperty(Platform, "OS", {
    configurable: true,
    value
  });
}

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: {
    clear: jest.fn(() => localStorageStore.clear()),
    getItem: jest.fn((key: string) => localStorageStore.get(key) ?? null),
    setItem: jest.fn((key: string, value: string) =>
      localStorageStore.set(key, value)
    )
  }
});

describe("getE2EInitialState", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setPlatformOS("web");
  });

  afterAll(() => {
    setPlatformOS(originalOS);
  });

  it("returns a valid seeded web state", () => {
    const board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    window.localStorage.setItem(
      e2eStateKey,
      JSON.stringify({
        board,
        gameState: "lost",
        hasShownWinAlert: true,
        showArrowControls: true,
        score: 12
      })
    );

    expect(getE2EInitialState()).toEqual({
      board,
      gameState: "lost",
      hasShownWinAlert: true,
      showArrowControls: true,
      score: 12
    });
  });

  it("ignores invalid board state", () => {
    window.localStorage.setItem(
      e2eStateKey,
      JSON.stringify({ board: [[3]], score: 12 })
    );

    expect(getE2EInitialState()).toBeNull();
  });

  it("is disabled outside web", () => {
    setPlatformOS("ios");
    window.localStorage.setItem(
      e2eStateKey,
      JSON.stringify({
        board: [
          [2, 2, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]
      })
    );

    expect(getE2EInitialState()).toBeNull();
  });
});
