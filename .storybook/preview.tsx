import type { Preview } from "@storybook/react";
import { View } from "react-native";

const preview: Preview = {
  decorators: [
    (Story) => (
      <View
        style={{
          minHeight: 420,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f6f2e9",
          padding: 24
        }}
      >
        <Story />
      </View>
    )
  ],
  parameters: {
    a11y: {
      element: "#storybook-root"
    },
    controls: {
      expanded: true
    },
    options: {
      storySort: {
        order: ["App", "Layout", "Game", "Feedback", "Controls"]
      }
    }
  }
};

export default preview;
