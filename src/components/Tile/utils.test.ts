import { getTileFontSize } from "./utils";

describe("getTileFontSize", () => {
  it("returns the largest font size for small tiles", () => {
    expect(getTileFontSize(2)).toBe(38);
    expect(getTileFontSize(64)).toBe(38);
  });

  it("returns a medium font size for three digit tiles", () => {
    expect(getTileFontSize(128)).toBe(32);
    expect(getTileFontSize(512)).toBe(32);
  });

  it("returns the smallest font size for four digit tiles", () => {
    expect(getTileFontSize(1024)).toBe(28);
    expect(getTileFontSize(2048)).toBe(28);
  });
});
