import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ArrowButton } from "./ArrowButton";

const meta = {
  title: "Controls/ArrowButton",
  component: ArrowButton,
  args: {
    name: "chevron-up",
    onPress: fn()
  }
} satisfies Meta<typeof ArrowButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Up: Story = {};

export const Left: Story = {
  args: {
    name: "chevron-back"
  }
};

export const Right: Story = {
  args: {
    name: "chevron-forward"
  }
};
