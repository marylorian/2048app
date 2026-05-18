import {
  Animated,
  Easing,
  type GestureResponderEvent,
  PanResponder,
  type PanResponderGestureState,
  Platform
} from "react-native";
import type { Edge } from "react-native-safe-area-context";
import {
  BOARD_GAP,
  BOARD_HORIZONTAL_MARGIN,
  BOARD_MAX_PIXEL_SIZE,
  BOARD_SIZE,
  SLIDE_DURATION,
  SWIPE_THRESHOLD
} from "../../constants";
import type {
  AnimatedSlideTile,
  Board,
  Direction,
  GameState,
  SlideTile
} from "../../types";

const E2E_INITIAL_STATE_KEY = "react-native-2048:e2e-initial-state";

export const APP_SAFE_AREA_EDGES: Edge[] = ["top", "right", "bottom", "left"];

export const KEY_TO_DIRECTION: Partial<Record<string, Direction>> = {
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
  ArrowLeft: "left"
};

export type E2EInitialState = {
  board: Board;
  score?: number;
  gameState?: GameState;
  hasShownWinAlert?: boolean;
  showArrowControls?: boolean;
};

export function isWeb() {
  return (
    Platform.OS === "web" ||
    (typeof window !== "undefined" &&
      (typeof window.addEventListener === "function" ||
        typeof window.removeEventListener === "function"))
  );
}

export function getFinePointerQuery() {
  if (!isWeb()) {
    return undefined;
  }

  return window.matchMedia("(pointer: fine)");
}

export function subscribeToFinePointerQuery(
  syncPointerTypeHandler: () => void
) {
  const finePointerQuery = getFinePointerQuery();

  if (finePointerQuery) {
    finePointerQuery.addEventListener?.("change", syncPointerTypeHandler);
    finePointerQuery.addListener?.(syncPointerTypeHandler);
  }
}

export function unsubscribeFromFinePointerQuery(
  syncPointerTypeHandler: () => void
) {
  const finePointerQuery = getFinePointerQuery();

  if (finePointerQuery) {
    finePointerQuery.removeEventListener?.("change", syncPointerTypeHandler);
    finePointerQuery.removeListener?.(syncPointerTypeHandler);
  }
}

export function createPanResponder(handleMove: (dir: Direction) => void) {
  return PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState: PanResponderGestureState) =>
      Math.abs(gestureState.dx) > SWIPE_THRESHOLD ||
      Math.abs(gestureState.dy) > SWIPE_THRESHOLD,
    onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
      const { dx, dy } = gestureState;

      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) {
        return;
      }

      handleMove(getMoveDirection({ dx, dy }));
    }
  });
}

export function getTouchStartCoordinates(event: GestureResponderEvent) {
  const nativeEvent =
    event.nativeEvent as GestureResponderEvent["nativeEvent"] & {
      changedTouches?: { pageX?: number; pageY?: number }[];
    };

  return {
    x: nativeEvent.pageX ?? nativeEvent.changedTouches?.[0]?.pageX ?? 0,
    y: nativeEvent.pageY ?? nativeEvent.changedTouches?.[0]?.pageY ?? 0
  };
}

export function getTouchEndCoordinates(event: GestureResponderEvent) {
  const nativeEvent =
    event.nativeEvent as GestureResponderEvent["nativeEvent"] & {
      changedTouches?: { pageX?: number; pageY?: number }[];
    };

  return {
    x: nativeEvent.pageX ?? nativeEvent.changedTouches?.[0]?.pageX,
    y: nativeEvent.pageY ?? nativeEvent.changedTouches?.[0]?.pageY
  };
}

export function getBoardPixelSize(width: number) {
  return Math.min(width - BOARD_HORIZONTAL_MARGIN, BOARD_MAX_PIXEL_SIZE);
}

export function getTileSize(boardPixelSize: number, gap: number = BOARD_GAP) {
  return (boardPixelSize - gap * (BOARD_SIZE + 1)) / BOARD_SIZE;
}

export function getAnimatedTiles(
  slideTiles: SlideTile[],
  nextMoveId: number
): AnimatedSlideTile[] {
  return slideTiles.map((tile, index) => ({
    ...tile,
    id: `${nextMoveId}-${index}-${tile.fromRow}-${tile.fromCol}`,
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0)
  }));
}

export function playMovingAnimation(
  animatedTiles: AnimatedSlideTile[],
  tileSize: number,
  gap: number = BOARD_GAP
) {
  return Animated.parallel(
    animatedTiles.map((tile) =>
      Animated.parallel([
        Animated.timing(tile.translateX, {
          toValue: (tile.toCol - tile.fromCol) * (tileSize + gap),
          duration: SLIDE_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(tile.translateY, {
          toValue: (tile.toRow - tile.fromRow) * (tileSize + gap),
          duration: SLIDE_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        })
      ])
    )
  );
}

export function getMoveDirection({
  dx,
  dy
}: {
  dx: number;
  dy: number;
}): Direction {
  return Math.abs(dx) > Math.abs(dy)
    ? dx > 0
      ? "right"
      : "left"
    : dy > 0
      ? "down"
      : "up";
}

export function getE2EInitialState(): E2EInitialState | null {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(E2E_INITIAL_STATE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<E2EInitialState>;

    if (!isValidBoard(parsedValue.board)) {
      return null;
    }

    return {
      board: parsedValue.board,
      gameState:
        parsedValue.gameState === "lost" ? parsedValue.gameState : "playing",
      hasShownWinAlert: parsedValue.hasShownWinAlert === true,
      score: isValidScore(parsedValue.score) ? parsedValue.score : 0,
      showArrowControls: parsedValue.showArrowControls === true
    };
  } catch {
    return null;
  }
}

function isValidBoard(board: unknown): board is Board {
  return (
    Array.isArray(board) &&
    board.length === BOARD_SIZE &&
    board.every(
      (row) =>
        Array.isArray(row) &&
        row.length === BOARD_SIZE &&
        row.every((value) => isValidTileValue(value))
    )
  );
}

function isValidTileValue(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    (value === 0 || Number.isInteger(Math.log2(value)))
  );
}

function isValidScore(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
