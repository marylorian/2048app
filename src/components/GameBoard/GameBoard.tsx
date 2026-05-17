import {
  Animated,
  View,
  type GestureResponderEvent,
  type GestureResponderHandlers
} from "react-native";
import { BOARD_SIZE } from "../../constants";
import type { AnimatedSlideTile, Board } from "../../types";
import { GameOverOverlay } from "../GameOverOverlay";
import { SlidingTile } from "../SlidingTile";
import { Tile } from "../Tile";
import { styles } from "./styles";

type GameBoardProps = {
  board: Board;
  movingTiles: AnimatedSlideTile[];
  panHandlers: GestureResponderHandlers;
  size: number;
  tileSize: number;
  gap: number;
  isGameOver: boolean;
  onRestart: () => void;
  onTouchEnd: (event: GestureResponderEvent) => void;
  onTouchStart: (event: GestureResponderEvent) => void;
};

export function GameBoard({
  board,
  movingTiles,
  panHandlers,
  size,
  tileSize,
  gap,
  isGameOver,
  onRestart,
  onTouchEnd,
  onTouchStart
}: GameBoardProps) {
  return (
    <Animated.View
      {...panHandlers}
      accessibilityLabel="2048 game board"
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      style={[
        styles.board,
        {
          width: size,
          height: size,
          padding: gap,
          gap
        }
      ]}
      testID="game-board"
    >
      {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => (
        <View
          key={`cell-${index}`}
          accessible={false}
          importantForAccessibility="no"
          style={[styles.boardCell, { width: tileSize, height: tileSize }]}
        />
      ))}

      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            value={value}
            size={tileSize}
            row={rowIndex}
            col={colIndex}
            gap={gap}
            hidden={movingTiles.length > 0}
          />
        ))
      )}

      {movingTiles.map((tile) => (
        <SlidingTile key={tile.id} tile={tile} size={tileSize} gap={gap} />
      ))}

      {isGameOver && <GameOverOverlay onRestart={onRestart} />}
    </Animated.View>
  );
}
