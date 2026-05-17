import { render, waitFor } from "@testing-library/react-native";
import { App } from "./App";

describe("App", () => {
  it("renders the game shell", async () => {
    const { getByText } = render(<App />);

    expect(getByText("2048")).toBeTruthy();
    expect(getByText("Score")).toBeTruthy();
    await waitFor(() => expect(getByText("Best")).toBeTruthy());
  });
});
