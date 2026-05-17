import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  BOARD_GAP,
  BOARD_HORIZONTAL_MARGIN,
  BOARD_MAX_PIXEL_SIZE,
  BOARD_SIZE,
  SLIDE_DURATION,
  SWIPE_THRESHOLD
} from "../../constants";
import {
  loadStoredBestScore,
  storeBestScore
} from "../../utils/bestScoreStorage";
import {
  addRandomTile,
  createInitialBoard,
  hasAvailableMove,
  hasWon,
  moveBoard
} from "../../utils/gameLogic";
import { AppHeader } from "../AppHeader";
import { ArrowControls } from "../ArrowControls";
import { GameBoard } from "../GameBoard";
import { ScoreBox } from "../ScoreBox";
import { WinModal } from "../WinModal";
import { styles } from "./styles";

export function App() {
  const [board, setBoard] = useState(createInitialBoard);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [movingTiles, setMovingTiles] = useState([]);
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const hasShownWinAlert = useRef(false);
  const isAnimating = useRef(false);
  const moveId = useRef(0);
  const { width } = useWindowDimensions();

  const boardPixelSize = Math.min(
    width - BOARD_HORIZONTAL_MARGIN,
    BOARD_MAX_PIXEL_SIZE
  );
  const gap = BOARD_GAP;
  const tileSize = (boardPixelSize - gap * (BOARD_SIZE + 1)) / BOARD_SIZE;
  const shouldShowArrowControls = Platform.OS === "web" && hasFinePointer;

  useEffect(() => {
    let isMounted = true;

    loadStoredBestScore().then((storedBestScore) => {
      if (isMounted) {
        setBestScore(storedBestScore);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      return undefined;
    }

    const finePointerQuery = window.matchMedia("(pointer: fine)");

    function syncPointerType() {
      const hasTouchScreen = window.navigator.maxTouchPoints > 0;
      setHasFinePointer(finePointerQuery.matches && !hasTouchScreen);
    }

    syncPointerType();
    finePointerQuery.addEventListener?.("change", syncPointerType);
    finePointerQuery.addListener?.(syncPointerType);

    return () => {
      finePointerQuery.removeEventListener?.("change", syncPointerType);
      finePointerQuery.removeListener?.(syncPointerType);
    };
  }, []);

  const finishMove = useCallback((nextBoard) => {
    if (hasWon(nextBoard) && !hasShownWinAlert.current) {
      hasShownWinAlert.current = true;
      setGameState("won");
      return;
    }

    if (!hasAvailableMove(nextBoard)) {
      setGameState("lost");
    }
  }, []);

  const handleMove = useCallback(
    (direction) => {
      if (gameState !== "playing" || isAnimating.current) {
        return;
      }

      const {
        board: movedBoard,
        gainedScore,
        moved,
        slideTiles
      } = moveBoard(board, direction);

      if (!moved) {
        return;
      }

      const nextBoard = addRandomTile(movedBoard);
      const nextScore = score + gainedScore;
      const nextBestScore = Math.max(bestScore, nextScore);
      const nextMoveId = moveId.current + 1;
      const animatedTiles = slideTiles.map((tile, index) => ({
        ...tile,
        id: `${nextMoveId}-${index}-${tile.fromRow}-${tile.fromCol}`,
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0)
      }));

      moveId.current = nextMoveId;
      isAnimating.current = true;
      setMovingTiles(animatedTiles);
      setScore(nextScore);
      setBestScore(nextBestScore);

      if (nextBestScore > bestScore) {
        storeBestScore(nextBestScore);
      }

      Animated.parallel(
        animatedTiles.map((tile) =>
          Animated.parallel([
            Animated.timing(tile.translateX, {
              toValue: (tile.toCol - tile.fromCol) * (tileSize + gap),
              duration: SLIDE_DURATION,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true
            }),
            Animated.timing(tile.translateY, {
              toValue: (tile.toRow - tile.fromRow) * (tileSize + gap),
              duration: SLIDE_DURATION,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true
            })
          ])
        )
      ).start(() => {
        if (moveId.current !== nextMoveId) {
          return;
        }

        setMovingTiles([]);
        setBoard(nextBoard);
        isAnimating.current = false;
        finishMove(nextBoard);
      });
    },
    [bestScore, board, finishMove, gameState, gap, score, tileSize]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > SWIPE_THRESHOLD ||
          Math.abs(gestureState.dy) > SWIPE_THRESHOLD,
        onPanResponderRelease: (_, gestureState) => {
          const { dx, dy } = gestureState;

          if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) {
            return;
          }

          const direction =
            Math.abs(dx) > Math.abs(dy)
              ? dx > 0
                ? "right"
                : "left"
              : dy > 0
                ? "down"
                : "up";

          handleMove(direction);
        }
      }),
    [handleMove]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const keyToDirection = {
      ArrowUp: "up",
      ArrowRight: "right",
      ArrowDown: "down",
      ArrowLeft: "left"
    };

    function handleKeyDown(event) {
      const direction = keyToDirection[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();
      handleMove(direction);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove]);

  const startNewGame = useCallback(() => {
    moveId.current += 1;
    isAnimating.current = false;
    setMovingTiles([]);
    setBoard(createInitialBoard());
    setScore(0);
    setGameState("playing");
    hasShownWinAlert.current = false;
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={["top", "right", "bottom", "left"]}
        style={styles.screen}
      >
        <StatusBar style="dark" />
        <View style={styles.container}>
          <AppHeader onRestart={startNewGame} />

          <View style={styles.scoreRow}>
            <ScoreBox label="Score" value={score} />
            <ScoreBox label="Best" value={bestScore} />
          </View>

          <GameBoard
            board={board}
            movingTiles={movingTiles}
            panHandlers={panResponder.panHandlers}
            size={boardPixelSize}
            tileSize={tileSize}
            gap={gap}
            isGameOver={gameState === "lost"}
            onRestart={startNewGame}
          />

          {shouldShowArrowControls && <ArrowControls onMove={handleMove} />}

          <WinModal
            visible={gameState === "won"}
            onContinue={() => setGameState("playing")}
            onRestart={startNewGame}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
