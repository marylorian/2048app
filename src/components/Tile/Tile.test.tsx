import { render } from "@testing-library/react-native";
import { Tile } from "./Tile";

describe("Tile", () => {
  it("renders a tile value", () => {
    const { getByText } = render(
      <Tile value={128} size={72} row={0} col={0} gap={10} />
    );

    expect(getByText("128")).toBeTruthy();
  });

  it("does not render empty or hidden tiles", () => {
    const emptyTile = render(
      <Tile value={0} size={72} row={0} col={0} gap={10} />
    );
    expect(emptyTile.queryByText("0")).toBeNull();

    const hiddenTile = render(
      <Tile value={2} size={72} row={0} col={0} gap={10} hidden />
    );
    expect(hiddenTile.queryByText("2")).toBeNull();
  });
});
