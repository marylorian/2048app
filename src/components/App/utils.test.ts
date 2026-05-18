import { Platform } from "react-native";
import type { GestureResponderEvent } from "react-native";
import {
  APP_SAFE_AREA_EDGES,
  KEY_TO_DIRECTION,
  getAnimatedTiles,
  getBoardPixelSize,
  getE2EInitialState,
  getFinePointerQuery,
  getMoveDirection,
  getTileSize,
  getTouchEndCoordinates,
  getTouchStartCoordinates,
  isWeb,
  subscribeToFinePointerQuery,
  unsubscribeFromFinePointerQuery
} from "./utils";

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

function createGestureEvent(nativeEvent: unknown) {
  return {
    nativeEvent
  } as GestureResponderEvent;
}

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

describe("App utils", () => {
  beforeEach(() => {
    setPlatformOS("web");
  });

  afterAll(() => {
    setPlatformOS(originalOS);
  });

  it("exports safe-area edges in render order", () => {
    expect(APP_SAFE_AREA_EDGES).toEqual(["top", "right", "bottom", "left"]);
  });

  it("maps supported keyboard keys to directions", () => {
    expect(KEY_TO_DIRECTION).toMatchObject({
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up"
    });
    expect(KEY_TO_DIRECTION.Enter).toBeUndefined();
  });

  it("calculates board and tile sizes", () => {
    expect(getBoardPixelSize(800)).toBe(390);
    expect(getBoardPixelSize(320)).toBe(288);
    expect(getTileSize(390)).toBe(85);
    expect(getTileSize(360, 8)).toBe(80);
  });

  it("resolves movement direction from deltas", () => {
    expect(getMoveDirection({ dx: -40, dy: 2 })).toBe("left");
    expect(getMoveDirection({ dx: 40, dy: 2 })).toBe("right");
    expect(getMoveDirection({ dx: 2, dy: -40 })).toBe("up");
    expect(getMoveDirection({ dx: 2, dy: 40 })).toBe("down");
  });

  it("reads touch coordinates from native event pages and changed touches", () => {
    expect(
      getTouchStartCoordinates(createGestureEvent({ pageX: 12, pageY: 24 }))
    ).toEqual({ x: 12, y: 24 });
    expect(
      getTouchStartCoordinates(
        createGestureEvent({ changedTouches: [{ pageX: 30, pageY: 40 }] })
      )
    ).toEqual({ x: 30, y: 40 });
    expect(getTouchStartCoordinates(createGestureEvent({}))).toEqual({
      x: 0,
      y: 0
    });
    expect(
      getTouchEndCoordinates(
        createGestureEvent({ changedTouches: [{ pageX: 50, pageY: 60 }] })
      )
    ).toEqual({ x: 50, y: 60 });
  });

  it("creates animated tiles with stable move ids", () => {
    const [animatedTile] = getAnimatedTiles(
      [
        {
          value: 2,
          fromRow: 1,
          fromCol: 2,
          toRow: 1,
          toCol: 0
        }
      ],
      7
    );

    expect(animatedTile).toMatchObject({
      id: "7-0-1-2",
      value: 2,
      fromRow: 1,
      fromCol: 2,
      toRow: 1,
      toCol: 0
    });
    expect(animatedTile.translateX).toBeDefined();
    expect(animatedTile.translateY).toBeDefined();
  });

  it("detects web support and fine pointer subscriptions", () => {
    const addEventListener = jest.fn();
    const addListener = jest.fn();
    const removeEventListener = jest.fn();
    const removeListener = jest.fn();
    const query = {
      addEventListener,
      addListener,
      matches: true,
      media: "(pointer: fine)",
      removeEventListener,
      removeListener
    };

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: jest.fn(() => query)
    });

    const handler = jest.fn();

    expect(isWeb()).toBe(true);
    expect(getFinePointerQuery()).toBe(query);

    subscribeToFinePointerQuery(handler);
    expect(addEventListener).toHaveBeenCalledWith("change", handler);
    expect(addListener).toHaveBeenCalledWith(handler);

    unsubscribeFromFinePointerQuery(handler);
    expect(removeEventListener).toHaveBeenCalledWith("change", handler);
    expect(removeListener).toHaveBeenCalledWith(handler);
  });
});
