import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type GestureResponderEvent,
  Platform,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BOARD_GAP, SWIPE_THRESHOLD } from "../../constants";
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
import type {
  AnimatedSlideTile,
  Board,
  Direction,
  GameState
} from "../../types";
import { AppHeader } from "../AppHeader";
import { ArrowControls } from "../ArrowControls";
import { GameBoard } from "../GameBoard";
import { ScoreBox } from "../ScoreBox";
import { WinModal } from "../WinModal";
import { styles } from "./styles";
import {
  APP_SAFE_AREA_EDGES,
  KEY_TO_DIRECTION,
  createPanResponder,
  getAnimatedTiles,
  getBoardPixelSize,
  getE2EInitialState,
  getFinePointerQuery,
  getMoveDirection,
  getTileSize,
  getTouchEndCoordinates,
  getTouchStartCoordinates,
  isWeb,
  playMovingAnimation,
  subscribeToFinePointerQuery,
  unsubscribeFromFinePointerQuery
} from "./utils";

export function App() {
  const initialE2EState = useRef(getE2EInitialState());
  const [board, setBoard] = useState<Board>(
    initialE2EState.current?.board ?? createInitialBoard
  );
  const [score, setScore] = useState(initialE2EState.current?.score ?? 0);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>(
    initialE2EState.current?.gameState ?? "playing"
  );
  const [isWinModalVisible, setIsWinModalVisible] = useState(false);
  const [movingTiles, setMovingTiles] = useState<AnimatedSlideTile[]>([]);
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const hasShownWinAlert = useRef(
    initialE2EState.current?.hasShownWinAlert ?? false
  );
  const isAnimating = useRef(false);
  const moveId = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { width } = useWindowDimensions();

  const boardPixelSize = getBoardPixelSize(width);
  const gap = BOARD_GAP;
  const tileSize = getTileSize(boardPixelSize);
  const shouldShowArrowControls =
    Platform.OS === "web" &&
    (hasFinePointer || initialE2EState.current?.showArrowControls === true);

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
    function syncPointerType() {
      const finePointerQuery = getFinePointerQuery();
      const hasTouchScreen = window.navigator.maxTouchPoints > 0;
      setHasFinePointer(!!finePointerQuery?.matches && !hasTouchScreen);
    }

    syncPointerType();
    subscribeToFinePointerQuery(syncPointerType);

    return () => {
      unsubscribeFromFinePointerQuery(syncPointerType);
    };
  }, []);

  const finishMove = useCallback((nextBoard: Board) => {
    if (hasWon(nextBoard) && !hasShownWinAlert.current) {
      hasShownWinAlert.current = true;
      setIsWinModalVisible(true);
    }

    if (!hasAvailableMove(nextBoard)) {
      setGameState("lost");
    }
  }, []);

  const handleMove = useCallback(
    (direction: Direction) => {
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
      const animatedTiles = getAnimatedTiles(slideTiles, nextMoveId);

      moveId.current = nextMoveId;
      isAnimating.current = true;
      setMovingTiles(animatedTiles);
      setScore(nextScore);
      setBestScore(nextBestScore);

      if (nextBestScore > bestScore) {
        storeBestScore(nextBestScore);
      }

      playMovingAnimation(animatedTiles, tileSize).start(() => {
        if (moveId.current !== nextMoveId) {
          return;
        }

        setMovingTiles([]);
        setBoard(nextBoard);
        isAnimating.current = false;
        finishMove(nextBoard);
      });
    },
    [bestScore, board, finishMove, gameState, score, tileSize]
  );

  const panResponder = useMemo(
    () => createPanResponder(handleMove),
    [handleMove]
  );

  const handleTouchStart = useCallback((event: GestureResponderEvent) => {
    const { x, y } = getTouchStartCoordinates(event);

    touchStart.current = {
      x,
      y
    };
  }, []);

  const handleTouchEnd = useCallback(
    (event: GestureResponderEvent) => {
      const start = touchStart.current;
      touchStart.current = null;

      if (!start) {
        return;
      }

      const { x: endX, y: endY } = getTouchEndCoordinates(event);

      if (endX === undefined || endY === undefined) {
        return;
      }

      const dx = endX - start.x;
      const dy = endY - start.y;

      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) {
        return;
      }

      handleMove(getMoveDirection({ dx, dy }));
    },
    [handleMove]
  );

  useEffect(() => {
    if (!isWeb()) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      const direction = KEY_TO_DIRECTION[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();
      handleMove(direction);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove]);

  useEffect(() => {
    if (!initialE2EState.current || !isWeb()) {
      return undefined;
    }

    function handleE2ESwipeLeft() {
      handleMove("left");
    }

    window.addEventListener(
      "react-native-2048:e2e-swipe-left",
      handleE2ESwipeLeft
    );
    return () =>
      window.removeEventListener(
        "react-native-2048:e2e-swipe-left",
        handleE2ESwipeLeft
      );
  }, [handleMove]);

  const startNewGame = useCallback(() => {
    moveId.current += 1;
    isAnimating.current = false;
    setMovingTiles([]);
    setBoard(createInitialBoard());
    setScore(0);
    setGameState("playing");
    setIsWinModalVisible(false);
    hasShownWinAlert.current = false;
  }, []);

  const continueAfterWin = useCallback(() => {
    setIsWinModalVisible(false);

    if (!hasAvailableMove(board)) {
      setGameState("lost");
    }
  }, [board]);

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={APP_SAFE_AREA_EDGES} style={styles.screen}>
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
            onTouchEnd={handleTouchEnd}
            onTouchStart={handleTouchStart}
          />

          {shouldShowArrowControls && <ArrowControls onMove={handleMove} />}

          <WinModal
            visible={isWinModalVisible}
            onContinue={continueAfterWin}
            onRestart={startNewGame}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
