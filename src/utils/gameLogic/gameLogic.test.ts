import {
  addRandomTile,
  createInitialBoard,
  hasAvailableMove,
  hasWon,
  moveBoard
} from "./gameLogic";
import type { Board } from "../../types";

describe("gameLogic", () => {
  const originalRandom = Math.random;

  afterEach(() => {
    Math.random = originalRandom;
  });

  it("creates a board with two starter tiles", () => {
    const board = createInitialBoard();
    const values = board.flat().filter(Boolean);

    expect(board).toHaveLength(4);
    expect(board.every((row) => row.length === 4)).toBe(true);
    expect(values).toHaveLength(2);
    expect(values.every((value) => value === 2 || value === 4)).toBe(true);
  });

  it("adds a random tile without mutating the original board", () => {
    Math.random = jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(0.95);
    const board: Board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const nextBoard = addRandomTile(board);

    expect(board[0][0]).toBe(0);
    expect(nextBoard[0][0]).toBe(4);
  });

  it("returns the same full board when no tile can be added", () => {
    const board: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2]
    ];

    expect(addRandomTile(board)).toEqual(board);
  });

  it("moves and merges tiles left", () => {
    const result = moveBoard(
      [
        [2, 2, 4, 0],
        [4, 4, 4, 4],
        [0, 2, 0, 2],
        [8, 0, 0, 0]
      ],
      "left"
    );

    expect(result.board).toEqual([
      [4, 4, 0, 0],
      [8, 8, 0, 0],
      [4, 0, 0, 0],
      [8, 0, 0, 0]
    ]);
    expect(result.gainedScore).toBe(24);
    expect(result.moved).toBe(true);
    expect(result.slideTiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fromRow: 0, fromCol: 1, toRow: 0, toCol: 0 }),
        expect.objectContaining({ fromRow: 2, fromCol: 3, toRow: 2, toCol: 0 })
      ])
    );
  });

  it("moves and merges tiles right", () => {
    const result = moveBoard(
      [
        [2, 2, 4, 0],
        [0, 0, 0, 0],
        [2, 0, 2, 2],
        [0, 4, 0, 4]
      ],
      "right"
    );

    expect(result.board).toEqual([
      [0, 0, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 2, 4],
      [0, 0, 0, 8]
    ]);
    expect(result.gainedScore).toBe(16);
  });

  it("moves and merges tiles up", () => {
    const result = moveBoard(
      [
        [2, 0, 4, 0],
        [2, 4, 4, 0],
        [0, 4, 8, 0],
        [2, 0, 8, 0]
      ],
      "up"
    );

    expect(result.board).toEqual([
      [4, 8, 8, 0],
      [2, 0, 16, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    expect(result.gainedScore).toBe(36);
  });

  it("moves and merges tiles down", () => {
    const result = moveBoard(
      [
        [2, 0, 4, 0],
        [2, 4, 4, 0],
        [0, 4, 8, 0],
        [2, 0, 8, 0]
      ],
      "down"
    );

    expect(result.board).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 8, 0],
      [4, 8, 16, 0]
    ]);
    expect(result.gainedScore).toBe(36);
  });

  it("reports unmoved boards", () => {
    const result = moveBoard(
      [
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      "left"
    );

    expect(result.moved).toBe(false);
  });

  it("detects win state", () => {
    expect(
      hasWon([
        [0, 0, 0, 0],
        [0, 2048, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ])
    ).toBe(true);
    expect(
      hasWon([
        [0, 0, 0, 0],
        [0, 1024, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ])
    ).toBe(false);
  });

  it("detects available moves", () => {
    expect(
      hasAvailableMove([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2]
      ])
    ).toBe(false);
    expect(
      hasAvailableMove([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 2, 4]
      ])
    ).toBe(true);
    expect(
      hasAvailableMove([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 0, 4],
        [4, 2, 4, 2]
      ])
    ).toBe(true);
  });
});
