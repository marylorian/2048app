import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { GameOverOverlay } from "./GameOverOverlay";

const meta = {
  title: "Feedback/GameOverOverlay",
  component: GameOverOverlay,
  args: {
    onRestart: fn()
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof GameOverOverlay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
