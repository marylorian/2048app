import type { Animated } from "react-native";

export type Direction = "up" | "right" | "down" | "left";
export type GameState = "playing" | "won" | "lost";
export type Board = number[][];
export type CellPosition = [row: number, col: number];

export type SlideTile = {
  value: number;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
};

export type AnimatedSlideTile = SlideTile & {
  id: string;
  translateX: Animated.Value;
  translateY: Animated.Value;
};
