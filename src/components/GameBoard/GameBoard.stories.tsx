import { Animated } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { GameBoard } from "./GameBoard";
import type { AnimatedSlideTile, Board } from "../../types";

const board: Board = [
  [2, 4, 8, 16],
  [0, 32, 0, 64],
  [128, 0, 256, 0],
  [0, 512, 0, 1024]
];

const movingTile: AnimatedSlideTile = {
  id: "storybook-moving-tile",
  value: 32,
  fromRow: 1,
  fromCol: 1,
  toRow: 1,
  toCol: 0,
  translateX: new Animated.Value(-82),
  translateY: new Animated.Value(0)
};

const meta = {
  title: "Game/GameBoard",
  component: GameBoard,
  args: {
    board,
    movingTiles: [],
    panHandlers: {},
    size: 360,
    tileSize: 77.5,
    gap: 10,
    isGameOver: false,
    onRestart: fn(),
    onTouchEnd: fn(),
    onTouchStart: fn()
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof GameBoard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Moving: Story = {
  args: {
    movingTiles: [movingTile]
  }
};

export const GameOver: Story = {
  args: {
    isGameOver: true
  }
};
