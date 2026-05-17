import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AppHeader } from "./AppHeader";

const meta = {
  title: "Layout/AppHeader",
  component: AppHeader,
  args: {
    onRestart: fn()
  }
} satisfies Meta<typeof AppHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
