import { Animated, View } from "react-native";
import { BOARD_SIZE } from "../../constants";
import { GameOverOverlay } from "../GameOverOverlay";
import { SlidingTile } from "../SlidingTile";
import { Tile } from "../Tile";
import { styles } from "./styles";

export function GameBoard({
  board,
  movingTiles,
  panHandlers,
  size,
  tileSize,
  gap,
  isGameOver,
  onRestart
}) {
  return (
    <Animated.View
      {...panHandlers}
      style={[
        styles.board,
        {
          width: size,
          height: size,
          padding: gap,
          gap
        }
      ]}
    >
      {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => (
        <View
          key={`cell-${index}`}
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
