import type { Meta, StoryObj } from "@storybook/react";
import { Tile } from "./Tile";

const meta = {
  title: "Game/Tile",
  component: Tile,
  args: {
    value: 128,
    size: 84,
    row: 0,
    col: 0,
    gap: 10
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof Tile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Numbered: Story = {};

export const Empty: Story = {
  args: {
    value: 0
  }
};

export const LargeNumber: Story = {
  args: {
    value: 2048
  }
};
