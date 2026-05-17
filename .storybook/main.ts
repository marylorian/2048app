import path from "node:path";
import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
    "@storybook/addon-webpack5-compiler-babel"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  docs: {
    autodocs: "tag"
  },
  webpackFinal: async (webpackConfig) => {
    webpackConfig.resolve = webpackConfig.resolve ?? {};
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias ?? {}),
      "@expo/vector-icons$": path.resolve(__dirname, "mocks/vector-icons.tsx"),
      "@react-native-async-storage/async-storage$": path.resolve(
        __dirname,
        "mocks/async-storage.ts"
      ),
      "expo-status-bar$": path.resolve(__dirname, "mocks/expo-status-bar.tsx"),
      "react-native-safe-area-context$": path.resolve(
        __dirname,
        "mocks/safe-area-context.tsx"
      ),
      "react-native$": "react-native-web"
    };
    webpackConfig.resolve.extensions = [
      ...(webpackConfig.resolve.extensions ?? []),
      ".web.tsx",
      ".web.ts",
      ".tsx",
      ".ts"
    ];
    webpackConfig.module = webpackConfig.module ?? { rules: [] };
    webpackConfig.module.rules = [
      ...(webpackConfig.module.rules ?? []),
      {
        test: /\.(ttf|otf|png|jpg|jpeg|gif)$/i,
        type: "asset/resource"
      }
    ];

    return webpackConfig;
  }
};

export default config;
