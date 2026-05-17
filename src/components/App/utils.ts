import { Platform } from "react-native";
import { BOARD_SIZE } from "../../constants";
import type { Board, GameState } from "../../types";

const E2E_INITIAL_STATE_KEY = "react-native-2048:e2e-initial-state";

export type E2EInitialState = {
  board: Board;
  score?: number;
  gameState?: GameState;
  hasShownWinAlert?: boolean;
  showArrowControls?: boolean;
};

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
