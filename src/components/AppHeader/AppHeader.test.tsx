import { fireEvent, render } from "@testing-library/react-native";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("renders title, subtitle, and restart action", () => {
    const onRestart = jest.fn();
    const { getByLabelText, getByText } = render(
      <AppHeader onRestart={onRestart} />
    );

    expect(getByText("2048")).toBeTruthy();
    expect(
      getByText("Swipe tiles. Match numbers. Reach 2048 and beyond.")
    ).toBeTruthy();

    fireEvent.press(getByLabelText("Start a new game"));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
