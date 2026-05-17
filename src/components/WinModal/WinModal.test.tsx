import { fireEvent, render } from "@testing-library/react-native";
import { WinModal } from "./WinModal";

describe("WinModal", () => {
  it("renders congratulations and handles actions", () => {
    const onContinue = jest.fn();
    const onRestart = jest.fn();
    const { getByText } = render(
      <WinModal visible onContinue={onContinue} onRestart={onRestart} />
    );

    expect(getByText("2048!")).toBeTruthy();
    expect(
      getByText(
        "Congratulations, you made the 2048 tile. Keep going for 4096 and beyond."
      )
    ).toBeTruthy();

    fireEvent.press(getByText("Continue"));
    fireEvent.press(getByText("Restart"));

    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("does not render content when hidden", () => {
    const { queryByText } = render(
      <WinModal visible={false} onContinue={jest.fn()} onRestart={jest.fn()} />
    );

    expect(queryByText("2048!")).toBeNull();
  });
});
