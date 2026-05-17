import { Animated } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";
import { SlidingTile } from "./SlidingTile";
import type { AnimatedSlideTile } from "../../types";

const tile: AnimatedSlideTile = {
  id: "sliding-story-tile",
  value: 512,
  fromRow: 0,
  fromCol: 0,
  toRow: 0,
  toCol: 1,
  translateX: new Animated.Value(0),
  translateY: new Animated.Value(0)
};

const meta = {
  title: "Game/SlidingTile",
  component: SlidingTile,
  args: {
    tile,
    size: 84,
    gap: 10
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof SlidingTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
