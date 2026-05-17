import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { WinModal } from "./WinModal";

const meta = {
  title: "Feedback/WinModal",
  component: WinModal,
  args: {
    visible: true,
    onContinue: fn(),
    onRestart: fn()
  }
} satisfies Meta<typeof WinModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Visible: Story = {};

export const Hidden: Story = {
  args: {
    visible: false
  }
};
