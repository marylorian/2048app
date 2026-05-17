import { fireEvent, render } from "@testing-library/react-native";
import { GameOverOverlay } from "./GameOverOverlay";

describe("GameOverOverlay", () => {
  it("renders game over state and restart action", () => {
    const onRestart = jest.fn();
    const { getByText } = render(<GameOverOverlay onRestart={onRestart} />);

    expect(getByText("Game over")).toBeTruthy();
    fireEvent.press(getByText("Try again"));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
