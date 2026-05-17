import { BOARD_SIZE, WIN_TILE } from "../../constants";
import type { Board, CellPosition, Direction, SlideTile } from "../../types";

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function boardsEqual(a: Board, b: Board): boolean {
  return a.every((row, rowIndex) =>
    row.every((value, colIndex) => value === b[rowIndex][colIndex])
  );
}

function getEmptyCells(board: Board): CellPosition[] {
  const cells: CellPosition[] = [];

  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value === 0) {
        cells.push([rowIndex, colIndex]);
      }
    });
  });

  return cells;
}

export function addRandomTile(board: Board): Board {
  const nextBoard = cloneBoard(board);
  const emptyCells = getEmptyCells(nextBoard);

  if (emptyCells.length === 0) {
    return nextBoard;
  }

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  nextBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
  return nextBoard;
}

export function createInitialBoard(): Board {
  return addRandomTile(addRandomTile(createEmptyBoard()));
}

type MoveResult = {
  board: Board;
  gainedScore: number;
  moved: boolean;
  slideTiles: SlideTile[];
};

type SourceTile = {
  row: number;
  col: number;
  value: number;
};

export function moveBoard(board: Board, direction: Direction): MoveResult {
  const nextBoard = createEmptyBoard();
  let gainedScore = 0;
  const slideTiles: SlideTile[] = [];

  for (let index = 0; index < BOARD_SIZE; index += 1) {
    const positions = getTraversalPositions(index, direction);
    const sources = positions
      .map(([row, col]) => ({ row, col, value: board[row][col] }))
      .filter((tile) => tile.value > 0);

    let targetIndex = 0;

    for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex += 1) {
      const first = sources[sourceIndex];
      const second = sources[sourceIndex + 1];
      const target = positions[targetIndex];

      if (second && first.value === second.value) {
        const mergedValue = first.value * 2;
        nextBoard[target[0]][target[1]] = mergedValue;
        gainedScore += mergedValue;
        slideTiles.push(
          createSlideTile(first, target, first.value),
          createSlideTile(second, target, second.value)
        );
        sourceIndex += 1;
      } else {
        nextBoard[target[0]][target[1]] = first.value;
        slideTiles.push(createSlideTile(first, target, first.value));
      }

      targetIndex += 1;
    }
  }

  return {
    board: nextBoard,
    gainedScore,
    moved: !boardsEqual(board, nextBoard),
    slideTiles
  };
}

function getTraversalPositions(
  index: number,
  direction: Direction
): CellPosition[] {
  if (direction === "left") {
    return Array.from({ length: BOARD_SIZE }, (_, col) => [index, col]);
  }

  if (direction === "right") {
    return Array.from({ length: BOARD_SIZE }, (_, col) => [
      index,
      BOARD_SIZE - 1 - col
    ]);
  }

  if (direction === "up") {
    return Array.from({ length: BOARD_SIZE }, (_, row) => [row, index]);
  }

  return Array.from({ length: BOARD_SIZE }, (_, row) => [
    BOARD_SIZE - 1 - row,
    index
  ]);
}

function createSlideTile(
  source: SourceTile,
  target: CellPosition,
  value: number
): SlideTile {
  return {
    value,
    fromRow: source.row,
    fromCol: source.col,
    toRow: target[0],
    toCol: target[1]
  };
}

export function hasWon(board: Board): boolean {
  return board.some((row) => row.some((value) => value >= WIN_TILE));
}

export function hasAvailableMove(board: Board): boolean {
  if (getEmptyCells(board).length > 0) {
    return true;
  }

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const value = board[row][col];
      if (board[row + 1]?.[col] === value || board[row][col + 1] === value) {
        return true;
      }
    }
  }

  return false;
}
