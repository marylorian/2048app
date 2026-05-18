import { ArrowButtonName } from "../components/ArrowButton/ArrowButton";
import { Direction } from "../types";

export const BOARD_SIZE = 4;
export const WIN_TILE = 2048;
export const BOARD_GAP = 10;
export const BOARD_MAX_PIXEL_SIZE = 390;
export const BOARD_HORIZONTAL_MARGIN = 32;
export const SWIPE_THRESHOLD = 24;
export const SLIDE_DURATION = 120;
export const BEST_SCORE_STORAGE_KEY = "react-native-2048:best-score";

export type TileColor = {
  background: string;
  text: string;
};

export const TILE_COLORS: Record<number, TileColor> = {
  2: { background: "#eee4da", text: "#776e65" },
  4: { background: "#ede0c8", text: "#776e65" },
  8: { background: "#f2b179", text: "#f9f6f2" },
  16: { background: "#f59563", text: "#f9f6f2" },
  32: { background: "#f67c5f", text: "#f9f6f2" },
  64: { background: "#f65e3b", text: "#f9f6f2" },
  128: { background: "#edcf72", text: "#f9f6f2" },
  256: { background: "#edcc61", text: "#f9f6f2" },
  512: { background: "#edc850", text: "#f9f6f2" },
  1024: { background: "#edc53f", text: "#f9f6f2" },
  2048: { background: "#edc22e", text: "#f9f6f2" }
};

export const ACCESSIBILITY_LABELS: Partial<Record<ArrowButtonName, string>> = {
  "chevron-back": "Move left",
  "chevron-down": "Move down",
  "chevron-forward": "Move right",
  "chevron-up": "Move up"
};

export const ARROW_TO_DIRECTION: Partial<Record<ArrowButtonName, Direction>> = {
  "chevron-up": "up",
  "chevron-back": "left",
  "chevron-down": "down",
  "chevron-forward": "right"
};
