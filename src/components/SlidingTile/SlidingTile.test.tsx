import { Animated } from "react-native";
import { render } from "@testing-library/react-native";
import { SlidingTile } from "./SlidingTile";
import type { AnimatedSlideTile } from "../../types";

describe("SlidingTile", () => {
  it("renders the moving tile value", () => {
    const tile: AnimatedSlideTile = {
      id: "tile-1",
      value: 16,
      fromRow: 0,
      fromCol: 0,
      toRow: 0,
      toCol: 1,
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0)
    };
    const { getByText } = render(
      <SlidingTile tile={tile} size={72} gap={10} />
    );

    expect(getByText("16")).toBeTruthy();
  });
});
