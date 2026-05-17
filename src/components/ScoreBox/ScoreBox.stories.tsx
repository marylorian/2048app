import type { Meta, StoryObj } from "@storybook/react";
import { ScoreBox } from "./ScoreBox";

const meta = {
  title: "Layout/ScoreBox",
  component: ScoreBox,
  args: {
    label: "Score",
    value: 2048
  }
} satisfies Meta<typeof ScoreBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Score: Story = {};

export const Best: Story = {
  args: {
    label: "Best",
    value: 8192
  }
};
