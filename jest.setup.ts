// @ts-nocheck
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    Ionicons: ({ name }) => React.createElement(Text, null, name)
  };
});

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement(View, null, children),
    SafeAreaView: ({ children, style }) =>
      React.createElement(View, { style }, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
  };
});

const { Animated } = require("react-native");

function createImmediateAnimation(value, config = {}) {
  return {
    start: (callback) => {
      if (
        value?.setValue &&
        Object.prototype.hasOwnProperty.call(config, "toValue")
      ) {
        value.setValue(config.toValue);
      }
      callback?.({ finished: true });
    },
    stop: jest.fn(),
    reset: jest.fn()
  };
}

jest.spyOn(Animated, "timing").mockImplementation(createImmediateAnimation);
jest.spyOn(Animated, "spring").mockImplementation(createImmediateAnimation);
