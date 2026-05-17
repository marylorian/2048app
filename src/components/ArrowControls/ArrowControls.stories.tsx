import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ArrowControls } from "./ArrowControls";

const meta = {
  title: "Controls/ArrowControls",
  component: ArrowControls,
  args: {
    onMove: fn()
  }
} satisfies Meta<typeof ArrowControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
