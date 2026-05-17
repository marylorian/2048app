import { render } from "@testing-library/react-native";
import { ScoreBox } from "./ScoreBox";

describe("ScoreBox", () => {
  it("renders label and numeric value", () => {
    const { getByText } = render(<ScoreBox label="Best" value={4096} />);

    expect(getByText("Best")).toBeTruthy();
    expect(getByText("4096")).toBeTruthy();
  });
});
