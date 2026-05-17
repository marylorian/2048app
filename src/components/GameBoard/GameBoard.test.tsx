import { Animated } from "react-native";
import { render } from "@testing-library/react-native";
import { GameBoard } from "./GameBoard";
import type { AnimatedSlideTile, Board } from "../../types";

describe("GameBoard", () => {
  const board: Board = [
    [2, 0, 0, 0],
    [0, 4, 0, 0],
    [0, 0, 8, 0],
    [0, 0, 0, 16]
  ];

  it("renders board tiles", () => {
    const { getByLabelText, getByText } = render(
      <GameBoard
        board={board}
        movingTiles={[]}
        panHandlers={{}}
        size={320}
        tileSize={70}
        gap={10}
        isGameOver={false}
        onRestart={jest.fn()}
        onTouchEnd={jest.fn()}
        onTouchStart={jest.fn()}
      />
    );

    expect(getByLabelText("2048 game board")).toBeTruthy();
    expect(getByText("2")).toBeTruthy();
    expect(getByText("4")).toBeTruthy();
    expect(getByText("8")).toBeTruthy();
    expect(getByText("16")).toBeTruthy();
  });

  it("renders moving tiles instead of settled tiles during movement", () => {
    const movingTile: AnimatedSlideTile = {
      id: "move-1",
      value: 32,
      fromRow: 0,
      fromCol: 0,
      toRow: 0,
      toCol: 1,
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0)
    };
    const { getByText, queryByText } = render(
      <GameBoard
        board={board}
        movingTiles={[movingTile]}
        panHandlers={{}}
        size={320}
        tileSize={70}
        gap={10}
        isGameOver={false}
        onRestart={jest.fn()}
        onTouchEnd={jest.fn()}
        onTouchStart={jest.fn()}
      />
    );

    expect(getByText("32")).toBeTruthy();
    expect(queryByText("2")).toBeNull();
  });

  it("renders game over overlay", () => {
    const { getByText } = render(
      <GameBoard
        board={board}
        movingTiles={[]}
        panHandlers={{}}
        size={320}
        tileSize={70}
        gap={10}
        isGameOver
        onRestart={jest.fn()}
        onTouchEnd={jest.fn()}
        onTouchStart={jest.fn()}
      />
    );

    expect(getByText("Game over")).toBeTruthy();
  });
});
