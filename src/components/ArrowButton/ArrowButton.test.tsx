import { fireEvent, render } from "@testing-library/react-native";
import { ArrowButton } from "./ArrowButton";

describe("ArrowButton", () => {
  it("renders an accessible move button and handles presses", () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <ArrowButton name="chevron-up" onPress={onPress} />
    );

    fireEvent.press(getByLabelText("Move up"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
