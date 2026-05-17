import { fireEvent, render } from "@testing-library/react-native";
import { ArrowControls } from "./ArrowControls";

describe("ArrowControls", () => {
  it("calls onMove with the direction for each control", () => {
    const onMove = jest.fn();
    const { getByLabelText } = render(<ArrowControls onMove={onMove} />);

    fireEvent.press(getByLabelText("Move up"));
    fireEvent.press(getByLabelText("Move back"));
    fireEvent.press(getByLabelText("Move down"));
    fireEvent.press(getByLabelText("Move forward"));

    expect(onMove).toHaveBeenNthCalledWith(1, "up");
    expect(onMove).toHaveBeenNthCalledWith(2, "left");
    expect(onMove).toHaveBeenNthCalledWith(3, "down");
    expect(onMove).toHaveBeenNthCalledWith(4, "right");
  });
});
